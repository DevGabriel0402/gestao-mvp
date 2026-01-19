import { useEffect, useState } from 'react'
import { buscarConfiguracoesGeraisDoUsuario } from '../servicos/configuracoes.servico'
import { buscarOficinasDoUsuario } from '../servicos/oficinas.servico'
import { usarAutenticacao } from './usarAutenticacao'

export function usarDadosCadastroAluno() {
    const { usuarioSistema } = usarAutenticacao()

    const [carregando, setCarregando] = useState(true)
    const [oficinas, setOficinas] = useState<string[]>([])
    const [niveis, setNiveis] = useState<string[]>([])
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        async function carregar() {
            if (!usuarioSistema?.uid) return

            setCarregando(true)
            setErro(null)

            try {
                const [nomesOficinas, config] = await Promise.all([
                    buscarOficinasDoUsuario(usuarioSistema.uid),
                    buscarConfiguracoesGeraisDoUsuario(usuarioSistema.uid)
                ])

                setOficinas(nomesOficinas.length > 0 ? nomesOficinas : ['Matriz'])
                setNiveis(config?.niveis || ['Iniciante', 'Básico', 'Intermediário', 'Avançado', 'Competitivo'])
            } catch (e) {
                console.error(e)
                setErro('Não foi possível carregar oficinas e níveis.')
                setNiveis(['Iniciante', 'Básico', 'Intermediário', 'Avançado', 'Competitivo'])
            } finally {
                setCarregando(false)
            }
        }

        carregar()
    }, [usuarioSistema?.uid])

    return { carregando, oficinas, niveis, erro }
}
