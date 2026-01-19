import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEdit, FiPlus, FiSearch, FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'

import { usarAutenticacao } from '../hooks/usarAutenticacao'
import { listarAlunos, recuperarAlunosCache } from '../servicos/alunos.servico'
import { DropdownSelect } from '../componentes/DropdownSelect'

import {
    Botao,
    Card,
    CampoBase,
    CabecalhoPagina,
    ContainerPagina,
    GrupoCampo,
    Linha,
    Rotulo,
    Subtitulo,
    Titulo,
    BotaoVoltar
} from '../estilos/componentes'

type AlunoLista = {
    id: string
    nomeCompleto?: string
    idade?: number
    oficina?: string
    nivel?: string
    status?: 'ativo' | 'inativo'
}

export function ListaAlunos() {
    const { usuarioSistema } = usarAutenticacao()
    const navegar = useNavigate()
    const uid = usuarioSistema?.uid

    const [carregando, setCarregando] = useState(true)
    const [alunos, setAlunos] = useState<AlunoLista[]>([])

    const [busca, setBusca] = useState('')
    const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos')

    const opcoesStatus = [
        { value: 'todos', label: 'Todos' },
        { value: 'ativo', label: 'Ativos' },
        { value: 'inativo', label: 'Inativos' }
    ]

    useEffect(() => {
        async function carregar() {
            if (!uid) return

            // 1. Tenta carregar do cache para exibição imediata (Stale-while-revalidate)
            const cache = recuperarAlunosCache(uid)
            if (cache && cache.length > 0) {
                setAlunos(cache)
                setCarregando(false) // Mostra o cache enquanto busca atualizações
            } else {
                setCarregando(true) // Se não tem cache, mostra loading
            }

            // 2. Busca dados atualizados do servidor
            try {
                const lista = (await listarAlunos(uid)) as any[]
                // Verifica se mudou algo antes de setar para evitar render desnecessário (opcional, mas o React lida bem)
                setAlunos(lista)
            } catch (e) {
                console.error(e)
                if (!cache || cache.length === 0) {
                    toast.error('Não foi possível carregar os alunos.')
                }
                // Se deu erro mas tem cache, o usuário continua vendo o cache silenciosamente (ou com aviso discreto)
            } finally {
                setCarregando(false)
            }
        }

        carregar()
    }, [uid])

    const alunosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase()

        return alunos
            .filter((a) => {
                const nome = (a.nomeCompleto || '').toLowerCase()
                const bateNome = termo ? nome.includes(termo) : true
                const bateStatus = filtroStatus === 'todos' ? true : a.status === filtroStatus
                return bateNome && bateStatus
            })
    }, [alunos, busca, filtroStatus])

    return (
        <ContainerPagina>
            <CabecalhoPagina>
                <div>
                    <BotaoVoltar onClick={() => navegar('/app')}>
                        <FiArrowLeft /> Voltar ao painel
                    </BotaoVoltar>
                    <Titulo>Alunos</Titulo>
                    <Subtitulo style={{ marginTop: 0 }}>Gerencie os alunos do seu projeto.</Subtitulo>
                </div>

                <Link to="/app/alunos/novo">
                    <Botao $variacao="primario">
                        <FiPlus />
                        Novo aluno
                    </Botao>
                </Link>
            </CabecalhoPagina>

            <Card>
                <Linha>
                    <GrupoCampo>
                        <Rotulo>Buscar por nome</Rotulo>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 12, top: 12, opacity: 0.7 }}>
                                <FiSearch />
                            </div>
                            <CampoBase
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Ex: Maria, João..."
                                style={{ paddingLeft: 36 }}
                            />
                        </div>
                    </GrupoCampo>

                    <GrupoCampo style={{ maxWidth: 220 }}>
                        <Rotulo>Status</Rotulo>
                        <DropdownSelect
                            value={filtroStatus}
                            onChange={(v) => setFiltroStatus(v as any)}
                            options={opcoesStatus}
                            placeholder="Selecione..."
                        />
                    </GrupoCampo>
                </Linha>

                <div style={{ marginTop: 14 }}>
                    {carregando && <Subtitulo>Carregando...</Subtitulo>}

                    {!carregando && alunosFiltrados.length === 0 && (
                        <Subtitulo>Nenhum aluno encontrado.</Subtitulo>
                    )}

                    {!carregando && alunosFiltrados.length > 0 && (
                        <div style={{ display: 'grid', gap: 10 }}>
                            {alunosFiltrados.map((a) => (
                                <div
                                    key={a.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                        padding: 12,
                                        border: '1px solid rgba(59, 130, 246, 0.2)', // Borda azulada suave
                                        borderRadius: 12,
                                        background: 'rgba(59, 130, 246, 0.08)' // Azul soft com baixa opacidade
                                    }}
                                >
                                    <div style={{ display: 'grid', gap: 4 }}>
                                        <div style={{ fontWeight: 700 }}>{a.nomeCompleto || 'Sem nome'}</div>
                                        <div style={{ opacity: 0.8, fontSize: 13 }}>
                                            {a.oficina ? `Oficina: ${a.oficina}` : 'Oficina: -'} •{' '}
                                            {a.nivel ? `Nível: ${a.nivel}` : 'Nível: -'} •{' '}
                                            {typeof a.idade === 'number' ? `Idade: ${a.idade}` : 'Idade: -'}
                                        </div>
                                        <div style={{ opacity: 0.8, fontSize: 13 }}>
                                            Status: <strong>{a.status || 'ativo'}</strong>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Link to={`/app/alunos/${a.id}/editar`}>
                                            <Botao
                                                type="button"
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#60a5fa',
                                                    padding: '8px',
                                                    minHeight: 'unset',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <FiEdit />
                                                Editar
                                            </Botao>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </ContainerPagina>
    )
}
