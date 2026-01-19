import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { onAuthStateChanged } from 'firebase/auth'
import { autenticacao } from '../servicos/firebase'
import { buscarUsuarioSistema } from '../servicos/usuarios_admin.servico'
import { sair } from '../servicos/autenticacao.servico'
import type { UsuarioSistema } from '../tipos/Usuario'

type EstadoAutenticacao = {
    carregando: boolean
    usuarioSistema: UsuarioSistema | null
}

const ContextoAutenticacao = createContext<EstadoAutenticacao>({
    carregando: true,
    usuarioSistema: null
})

export function ProvedorAutenticacao({ children }: { children: React.ReactNode }) {
    const [carregando, setCarregando] = useState(true)
    const [usuarioSistema, setUsuarioSistema] = useState<UsuarioSistema | null>(null)

    useEffect(() => {
        // Observer do Auth
        const cancelar = onAuthStateChanged(autenticacao, async (usuarioFirebase) => {
            try {
                // 1. Sem usuário no Auth? Limpa estado e termina.
                if (!usuarioFirebase) {
                    setUsuarioSistema(null)
                    setCarregando(false)
                    return
                }

                // 2. Busca o documento do usuário no Firestore
                // (Importante: buscarUsuarioSistema NÃO cria usuário automaticamente)
                const usuario = await buscarUsuarioSistema(usuarioFirebase.uid)

                // 3. Validação: Usuário existe?
                if (!usuario) {
                    toast.error('Professor(a) não cadastrado(a). Solicite acesso ao administrador.')
                    await sair()
                    setUsuarioSistema(null)
                    setCarregando(false)
                    return
                }

                // 4. Validação: Usuário está ativo?
                if (!usuario.ativo) {
                    toast.error('Professor(a) desativado(a). Fale com o administrador.')
                    await sair()
                    setUsuarioSistema(null)
                    setCarregando(false)
                    return
                }

                // 5. Sucesso: define o usuário no contexto
                setUsuarioSistema(usuario)

            } catch (error) {
                console.error('Erro ao buscar usuário:', error)
                toast.error('Erro ao autenticar no sistema.')
                setUsuarioSistema(null)
            } finally {
                setCarregando(false)
            }
        })

        return () => cancelar()
    }, [])

    const valor = useMemo(() => ({ carregando, usuarioSistema }), [carregando, usuarioSistema])

    return (
        <ContextoAutenticacao.Provider value={valor}>
            {children}
        </ContextoAutenticacao.Provider>
    )
}

export function usarAutenticacao() {
    return useContext(ContextoAutenticacao)
}
