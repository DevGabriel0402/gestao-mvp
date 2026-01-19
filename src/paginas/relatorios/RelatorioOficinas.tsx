import { useEffect, useState } from 'react'
import { Card, ContainerPagina, Titulo, Subtitulo, CabecalhoPagina, BotaoVoltar } from '../../estilos/componentes'
import { listarAlunos } from '../../servicos/alunos.servico'
import { contarPorOficina } from '../../utils/relatorios'
import { usarAutenticacao } from '../../hooks/usarAutenticacao'
import { FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '../../componentes/Skeleton'
import { EstadoVazio } from '../../componentes/EstadoVazio'

// Note: Using TopoPainelAdmin only if this is an admin report, but user said "/app/relatorios/oficinas" which is for USERS.
// So I should probably use the User Header or just a Back button to standard User Panel.
// Using a simple Back button logic here as it is a sub-page of the App.

export function RelatorioOficinas() {
    const { usuarioSistema } = usarAutenticacao()
    const navegar = useNavigate()
    const [dados, setDados] = useState<Array<{ oficina: string; quantidade: number }>>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        if (usuarioSistema?.uid) {
            carregar()
        }
    }, [usuarioSistema?.uid])

    async function carregar() {
        setCarregando(true)
        try {
            // Using the existing service which fetches from current user's subcollection
            const alunos = await listarAlunos(usuarioSistema!.uid)
            // Fix: ensure alunos is treated as array of objects with optional oficina and status
            const processado = contarPorOficina(alunos as unknown as Array<{ oficina?: string; status?: string }>)
            setDados(processado)
        } catch (e) {
            console.error(e)
        } finally {
            setCarregando(false)
        }
    }

    const totalAlunos = dados.reduce((acc, curr) => acc + curr.quantidade, 0)

    return (
        <ContainerPagina>
            <CabecalhoPagina>
                <div style={{ width: '100%' }}>
                    <BotaoVoltar onClick={() => navegar('/app')}>
                        <FiArrowLeft /> Voltar ao Painel
                    </BotaoVoltar>
                    <Titulo>Relatório de Oficinas</Titulo>
                    <Subtitulo>Quantidade de alunos por oficina ativa.</Subtitulo>
                </div>
            </CabecalhoPagina>

            {carregando ? (
                <Card>
                    <Skeleton altura={200} />
                </Card>
            ) : dados.length === 0 ? (
                <EstadoVazio titulo="Sem dados para exibir" descricao="Adicione alunos para ver o relatório." />
            ) : (
                <Card>
                    <div style={{ display: 'grid', gap: 16 }}>
                        {dados.map((item, index) => {
                            const percentual = totalAlunos > 0 ? (item.quantidade / totalAlunos) * 100 : 0

                            return (
                                <div key={index}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                                        <div style={{ fontWeight: 500 }}>{item.oficina}</div>
                                        <div style={{ fontWeight: 600, color: '#3b82f6' }}>{item.quantidade} alunos</div>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: 8,
                                        background: '#f1f5f9',
                                        borderRadius: 4,
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${percentual}%`,
                                            height: '100%',
                                            background: '#3b82f6',
                                            borderRadius: 4
                                        }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9', fontSize: 14, color: '#64748b', textAlign: 'right' }}>
                        Total: <strong>{totalAlunos} alunos</strong>
                    </div>
                </Card>
            )}
        </ContainerPagina>
    )
}
