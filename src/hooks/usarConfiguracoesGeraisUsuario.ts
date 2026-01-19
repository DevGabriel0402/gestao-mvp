import { useEffect, useState } from 'react'
import { buscarConfiguracoesGerais, recuperarCacheConfiguracoes, salvarCacheConfiguracoes } from '../servicos/configuracoes_usuario.servico'

export function usarConfiguracoesGeraisUsuario(uid?: string) {
    const [carregando, setCarregando] = useState(true)
    const [projetoNome, setProjetoNome] = useState<string>('')
    const [contatoSuporte, setContatoSuporte] = useState<string>('')
    const [niveis, setNiveis] = useState<string[]>([])

    useEffect(() => {
        async function carregar() {
            if (!uid) return
            // 1. Cache First (Instantâneo)
            const cache = recuperarCacheConfiguracoes(uid)
            if (cache) {
                setProjetoNome(cache.projetoNome || '')
                setContatoSuporte(cache.contatoSuporte || '')
                setNiveis(cache.niveis || [])
                setCarregando(false)
            } else {
                setCarregando(true)
            }

            try {
                // 2. Network (Atualização em background)
                const dados = await buscarConfiguracoesGerais(uid)
                if (dados) {
                    setProjetoNome(dados.projetoNome || '')
                    setContatoSuporte(dados.contatoSuporte || '')
                    setNiveis(dados.niveis || [])
                    // Atualiza cache
                    salvarCacheConfiguracoes(uid, dados)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setCarregando(false)
            }
        }

        carregar()
    }, [uid])

    return { carregando, projetoNome, contatoSuporte, niveis }
}
