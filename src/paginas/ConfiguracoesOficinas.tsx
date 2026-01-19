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
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { usarAutenticacao } from '../hooks/usarAutenticacao'
import { buscarOficinasDoUsuario, salvarOficinasDoUsuario } from '../servicos/oficinas_usuario.servico'

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

function normalizarNomeOficina(texto: string) {
    return (texto || '').trim().replace(/\s+/g, ' ')
}

export function ConfiguracoesOficinas() {
    const { usuarioSistema } = usarAutenticacao()
    const navegar = useNavigate()

    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)

    const [novoNome, setNovoNome] = useState('')
    const [oficinas, setOficinas] = useState<string[]>([])

    const uid = usuarioSistema?.uid

    useEffect(() => {
        async function carregar() {
            if (!uid) return
            setCarregando(true)
            try {
                const lista = await buscarOficinasDoUsuario(uid)
                setOficinas(lista)
            } catch (e) {
                console.error(e)
                toast.error('Não foi possível carregar as oficinas.')
            } finally {
                setCarregando(false)
            }
        }

        carregar()
    }, [uid])

    const oficinasUnicas = useMemo(() => {
        // garante unicidade sem perder a ordem
        const visto = new Set<string>()
        const saida: string[] = []
        for (const nome of oficinas) {
            const n = normalizarNomeOficina(nome)
            if (!n) continue
            if (visto.has(n.toLowerCase())) continue
            visto.add(n.toLowerCase())
            saida.push(n)
        }
        return saida
    }, [oficinas])

    function adicionar() {
        const nome = normalizarNomeOficina(novoNome)
        if (!nome) return

        if (oficinasUnicas.some((x) => x.toLowerCase() === nome.toLowerCase())) {
            toast.info('Essa oficina já existe.')
            return
        }

        setOficinas((prev) => [...prev, nome])
        setNovoNome('')
    }

    function remover(indice: number) {
        setOficinas((prev) => prev.filter((_, i) => i !== indice))
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setOficinas((items) => {
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
            await salvarOficinasDoUsuario(uid, oficinasUnicas)
            toast.success('Oficinas salvas com sucesso!')
            setOficinas(oficinasUnicas)
            navegar('/')
        } catch (e) {
            console.error(e)
            toast.error('Não foi possível salvar as oficinas.')
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
                    <Titulo>Configurações • Oficinas</Titulo>
                    <Subtitulo>Adicione, remova e ordene as oficinas do seu projeto.</Subtitulo>
                </div>
            </CabecalhoPagina>

            <Card>
                <Linha>
                    <GrupoCampo>
                        <Rotulo>Nova oficina</Rotulo>
                        <CampoBase
                            value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)}
                            placeholder="Ex: Vôlei - Iniciante"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    adicionar()
                                }
                            }}
                            disabled={carregando}
                        />
                    </GrupoCampo>

                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Botao $variacao="primario" type="button" onClick={adicionar} disabled={carregando}>
                            <FiPlus />
                            Adicionar
                        </Botao>
                    </div>
                </Linha>

                <div style={{ marginTop: 14 }}>
                    {carregando && <Subtitulo>Carregando...</Subtitulo>}

                    {!carregando && oficinasUnicas.length === 0 && (
                        <Subtitulo>Nenhuma oficina cadastrada ainda. Adicione a primeira acima.</Subtitulo>
                    )}

                    {!carregando && oficinasUnicas.length > 0 && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
                        >
                            <SortableContext items={oficinasUnicas} strategy={verticalListSortingStrategy}>
                                {oficinasUnicas.map((nome, i) => (
                                    <ItemOficina
                                        key={nome}
                                        id={nome}
                                        nome={nome}
                                        index={i}
                                        onRemover={remover}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                <BarraAcoes>
                    <Botao $variacao="primario" type="button" onClick={salvar} disabled={salvando || carregando}>
                        <FiSave />
                        {salvando ? 'Salvando...' : 'Salvar oficinas'}
                    </Botao>
                </BarraAcoes>
            </Card>
        </ContainerPagina>
    )
}

function ItemOficina({
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
                            padding: 12, // Increased for mobile touch target
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

                <Botao
                    type="button"
                    $variacao="neutro" // Using neutral/transparent style if available or default to secondary but cleaner
                    style={{
                        padding: 8,
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => onRemover(index)}
                    title="Remover oficina"
                >
                    <FiX size={18} />
                </Botao>
            </div>
        </div>
    )
}
