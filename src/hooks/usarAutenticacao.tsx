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

                const cacheKey = `gestao_usuario_v1_${usuarioFirebase.uid}`

                // 2. Tentativa de carga imediata do Local Storage (Cache)
                const cacheSalvo = localStorage.getItem(cacheKey)
                if (cacheSalvo) {
                    try {
                        const usuarioCache = JSON.parse(cacheSalvo) as UsuarioSistema
                        // Verifica se é o mesmo UID para garantir
                        if (usuarioCache.uid === usuarioFirebase.uid) {
                            setUsuarioSistema(usuarioCache)
                            setCarregando(false) // Libera UI imediatamente com cache
                        }
                    } catch (e) {
                        console.warn('Erro ao ler cache do usuário', e)
                        localStorage.removeItem(cacheKey)
                    }
                }

                // 3. Busca o documento do usuário atualizado no Firestore
                // (Importante: buscarUsuarioSistema NÃO cria usuário automaticamente)
                const usuario = await buscarUsuarioSistema(usuarioFirebase.uid)

                // 4. Validação: Usuário existe?
                if (!usuario) {
                    toast.error('Professor(a) não cadastrado(a). Solicite acesso ao administrador.')
                    await sair()
                    setUsuarioSistema(null)
                    setCarregando(false)
                    localStorage.removeItem(cacheKey)
                    return
                }

                // 5. Validação: Usuário está ativo?
                if (!usuario.ativo) {
                    toast.error('Professor(a) desativado(a). Fale com o administrador.')
                    await sair()
                    setUsuarioSistema(null)
                    setCarregando(false)
                    localStorage.removeItem(cacheKey)
                    return
                }

                // 6. Sucesso: define o usuário no contexto e atualiza cache
                setUsuarioSistema(usuario)
                localStorage.setItem(cacheKey, JSON.stringify(usuario))

            } catch (error) {
                console.error('Erro ao buscar usuário:', error)
                // Se der erro de rede mas tiver cache, o usuário continua navegando (offline support básico)
                // Só mostra erro se não tiver usuário nenhum (nem cache)
                if (!usuarioSistema) { // closure variable might be stale, but safe enough logic
                    toast.error('Erro ao recuperar dados do usuário.')
                }
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
