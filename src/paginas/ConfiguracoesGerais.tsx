import { useEffect, useMemo, useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,

    type DragEndEvent,
    MeasuringStrategy
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    defaultAnimateLayoutChanges,
    type AnimateLayoutChanges
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiPlus, FiSave, FiX, FiArrowLeft } from 'react-icons/fi'
import { MdDragIndicator } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import { usarAutenticacao } from '../hooks/usarAutenticacao'
import { buscarConfiguracoesGerais, salvarConfiguracoesGerais } from '../servicos/configuracoes_usuario.servico'

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
    BarraAcoes,
    BotaoVoltar
} from '../estilos/componentes'

import { MaskedTextBox } from 'smart-webcomponents-react/maskedtextbox'

function normalizarTexto(texto: string) {
    return (texto || '').trim().replace(/\s+/g, ' ')
}

export function ConfiguracoesGerais() {
    const { usuarioSistema } = usarAutenticacao()
    const uid = usuarioSistema?.uid
    const navegar = useNavigate()

    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)

    const [projetoNome, setProjetoNome] = useState('')
    const [contatoSuporte, setContatoSuporte] = useState('')
    const [niveis, setNiveis] = useState<string[]>([])
    const [novoNivel, setNovoNivel] = useState('')

    useEffect(() => {
        async function carregar() {
            if (!uid) return
            setCarregando(true)

            try {
                const dados = await buscarConfiguracoesGerais(uid)

                setProjetoNome(dados?.projetoNome || '')
                setContatoSuporte(dados?.contatoSuporte || '')
                setNiveis(dados?.niveis || ['Iniciante', 'Básico', 'Intermediário', 'Avançado', 'Competitivo'])
            } catch (e) {
                console.error(e)
                toast.error('Não foi possível carregar as configurações.')
                setNiveis(['Iniciante', 'Básico', 'Intermediário', 'Avançado', 'Competitivo'])
            } finally {
                setCarregando(false)
            }
        }

        carregar()
    }, [uid])

    const niveisUnicos = useMemo(() => {
        const visto = new Set<string>()
        const saida: string[] = []
        for (const n of niveis) {
            const nome = normalizarTexto(n)
            if (!nome) continue
            const chave = nome.toLowerCase()
            if (visto.has(chave)) continue
            visto.add(chave)
            saida.push(nome)
        }
        return saida
    }, [niveis])

    function adicionarNivel() {
        const nome = normalizarTexto(novoNivel)
        if (!nome) return

        if (niveisUnicos.some((x) => x.toLowerCase() === nome.toLowerCase())) {
            toast.info('Esse nível já existe.')
            return
        }

        setNiveis((prev) => [...prev, nome])
        setNovoNivel('')
    }

    function removerNivel(indice: number) {
        setNiveis((prev) => prev.filter((_, i) => i !== indice))
    }

    // Drag and Drop Logic
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setNiveis((items) => {
                const oldIndex = items.indexOf(active.id as string)
                const newIndex = items.indexOf(over.id as string)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    async function salvar() {
        if (!uid) return
        setSalvando(true)

        try {
            await salvarConfiguracoesGerais(uid, {
                projetoNome: normalizarTexto(projetoNome),
                contatoSuporte: normalizarTexto(contatoSuporte),
                niveis: niveisUnicos
            })

            toast.success('Configurações salvas com sucesso!')
            setNiveis(niveisUnicos)
            navegar('/')
        } catch (e) {
            console.error(e)
            toast.error('Não foi possível salvar as configurações.')
        } finally {
            setSalvando(false)
        }
    }

    return (
        <ContainerPagina>
            <CabecalhoPagina>
                <div style={{ width: '100%' }}>
                    <BotaoVoltar onClick={() => navegar('/')}>
                        <FiArrowLeft /> Voltar ao início
                    </BotaoVoltar>
                    <Titulo>Configurações gerais</Titulo>
                    <Subtitulo>Personalize o nome do projeto, contato de suporte e níveis.</Subtitulo>
                </div>
            </CabecalhoPagina>

            <Card>
                <Linha>
                    <GrupoCampo>
                        <Rotulo>Nome do projeto</Rotulo>
                        <CampoBase value={projetoNome} onChange={(e) => setProjetoNome(e.target.value)} disabled={carregando} />
                    </GrupoCampo>

                    <GrupoCampo>
                        <Rotulo>Contato de suporte</Rotulo>
                        <MaskedTextBox
                            key={contatoSuporte}
                            value={contatoSuporte}
                            mask="(00)00000-0000"
                            placeholder="(31)98765-4321"
                            onChange={(e: any) => setContatoSuporte(e.detail?.value || '')}
                            disabled={carregando}
                            style={{
                                width: '100%',
                                height: '42px',
                                border: '1px solid #e2e8f0',
                                borderRadius: 8,
                                padding: '0 12px',
                                background: 'transparent'
                            }}
                        />
                    </GrupoCampo>
                </Linha>

                <div style={{ marginTop: 16 }}>
                    <Titulo style={{ fontSize: 16, margin: 0 }}>Níveis</Titulo>
                    <Subtitulo>Adicione, remova e ordene os níveis do seu projeto.</Subtitulo>

                    <Linha style={{ marginTop: 10 }}>
                        <GrupoCampo>
                            <Rotulo>Novo nível</Rotulo>
                            <CampoBase
                                value={novoNivel}
                                onChange={(e) => setNovoNivel(e.target.value)}
                                placeholder="Ex: Sub-15"
                                disabled={carregando}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        adicionarNivel()
                                    }
                                }}
                            />
                        </GrupoCampo>

                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Botao $variacao="primario" type="button" onClick={adicionarNivel} disabled={carregando}>
                                <FiPlus />
                                Adicionar
                            </Botao>
                        </div>
                    </Linha>

                    <div style={{ marginTop: 14 }}>
                        {carregando && <Subtitulo>Carregando...</Subtitulo>}

                        {!carregando && niveisUnicos.length === 0 && (
                            <Subtitulo>Nenhum nível cadastrado.</Subtitulo>
                        )}

                        {!carregando && niveisUnicos.length > 0 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
                            >
                                <SortableContext items={niveisUnicos} strategy={verticalListSortingStrategy}>
                                    {niveisUnicos.map((nome, i) => (
                                        <ItemNivel
                                            key={nome}
                                            id={nome}
                                            nome={nome}
                                            index={i}
                                            onRemover={removerNivel}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </div>

                <BarraAcoes>
                    <Botao $variacao="primario" type="button" onClick={salvar} disabled={salvando || carregando}>
                        <FiSave />
                        {salvando ? 'Salvando...' : 'Salvar configurações'}
                    </Botao>
                </BarraAcoes>
            </Card>
        </ContainerPagina>
    )
}

function ItemNivel({
    id,
    nome,
    index,
    onRemover
}: {
    id: string
    nome: string
    index: number
    onRemover: (i: number) => void
}) {
    const animateLayoutChanges: AnimateLayoutChanges = (args) =>
        defaultAnimateLayoutChanges({ ...args, wasDragging: true })

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id,
        animateLayoutChanges
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative' as const,
        zIndex: isDragging ? 999 : 1,
        touchAction: 'none'
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    marginTop: 10,
                    border: '1px solid rgba(0, 123, 255, 0.1)',
                    borderRadius: 12,
                    background: isDragging ? 'rgba(0, 123, 255, 0.15)' : 'rgba(0, 123, 255, 0.05)',
                    transition: 'all 0.2s ease',
                    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
            >
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                    <div
                        {...attributes}
                        {...listeners}
                        style={{
                            cursor: 'grab',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 12,
                            borderRadius: 4,
                            color: '#6c757d',
                            touchAction: 'none',
                            marginRight: 4
                        }}
                    >
                        <MdDragIndicator size={20} />
                    </div>
                    <div style={{
                        color: 'var(--cor-texto)',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        userSelect: 'none'
                    }}>
                        <span style={{ opacity: 0.5, marginRight: 8, fontSize: '0.9em' }}>{index + 1}.</span>
                        {nome}
                    </div>
                </div>

                <Botao type="button"
                    $variacao="neutro"
                    style={{ padding: 8, color: '#ef4444' }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => onRemover(index)}>
                    <FiX size={18} />
                </Botao>
            </div>
        </div>
    )
}
