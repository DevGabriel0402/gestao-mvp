import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEdit2, FiPlus, FiSearch, FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { TopoPainelAdmin } from './TopoPainelAdmin'
import {
    Botao,
    Card,
    ContainerPagina,
    CampoBase,
    Linha,
    BotaoVoltar
} from '../../estilos/componentes'
import { DropdownSelect } from '../../componentes/DropdownSelect'
import { listarUsuariosSistema } from '../../servicos/usuarios_admin.servico'
import type { UsuarioSistema } from '../../servicos/usuarios_admin.servico'
import { Skeleton } from '../../componentes/Skeleton'
import { Carregando } from '../../componentes/Carregando'
import { EstadoVazio } from '../../componentes/EstadoVazio'

export function ListaUsuarios() {
    const navegar = useNavigate()
    const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([])
    const [carregando, setCarregando] = useState(true)

    // Filtros
    const [busca, setBusca] = useState('')
    const [filtroPapel, setFiltroPapel] = useState('todos')

    useEffect(() => {
        carregar()
    }, [])

    async function carregar() {
        setCarregando(true)
        try {
            const lista = await listarUsuariosSistema()
            setUsuarios(lista)
        } catch (e) {
            console.error(e)
            toast.error('Erro ao carregar usuários')
        } finally {
            setCarregando(false)
        }
    }

    const usuariosFiltrados = usuarios.filter((u) => {
        const matchBusca = u.nome.toLowerCase().includes(busca.toLowerCase()) ||
            u.email.toLowerCase().includes(busca.toLowerCase())
        const matchPapel = filtroPapel === 'todos' || u.papel === filtroPapel
        return matchBusca && matchPapel
    })

    return (
        <ContainerPagina>
            <TopoPainelAdmin />

            <BotaoVoltar onClick={() => navegar('/admin')} style={{ marginTop: 20 }}>
                <FiArrowLeft /> Voltar ao painel
            </BotaoVoltar>

            <Linha style={{ marginTop: 10, marginBottom: 20 }}>
                <div style={{ flex: 1, display: 'flex', gap: 10 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <FiSearch style={{ position: 'absolute', left: 12, top: 14, color: '#94a3b8' }} />
                        <CampoBase
                            placeholder="Buscar por nome ou email..."
                            style={{ paddingLeft: 38 }}
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                    <div style={{ width: 180 }}>
                        <DropdownSelect
                            value={filtroPapel}
                            onChange={(v) => setFiltroPapel(v)}
                            options={[
                                { value: 'todos', label: 'Todos papéis' },
                                { value: 'usuario', label: 'Usuário' },
                                { value: 'administrador', label: 'Administrador' }
                            ]}
                            placeholder="Papel..."
                        />
                    </div>
                </div>
                <Link to="/admin/usuarios/novo">
                    <Botao $variacao="primario">
                        <FiPlus /> Novo Usuário
                    </Botao>
                </Link>
            </Linha>

            {carregando ? (
                <div style={{ marginTop: 40 }}>
                    <Carregando />
                </div>
            ) : usuariosFiltrados.length === 0 ? (
                <EstadoVazio
                    titulo="Nenhum usuário encontrado"
                    descricao="Tente ajustar os filtros de busca."
                />
            ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                    {usuariosFiltrados.map((u) => (
                        <Card key={u.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
                                    {u.nome}
                                    {!u.ativo && <span style={{ marginLeft: 8, fontSize: 12, color: '#ef4444', background: '#fee2e2', padding: '2px 6px', borderRadius: 4 }}>Inativo</span>}
                                </div>
                                <div style={{ fontSize: 13, color: '#64748b' }}>
                                    {u.email} • <strong style={{ textTransform: 'capitalize' }}>{u.papel}</strong>
                                </div>
                            </div>
                            <Botao $variacao="neutro" onClick={() => navegar(`/admin/usuarios/${u.uid}/editar`)}>
                                <FiEdit2 /> Editar
                            </Botao>
                        </Card>
                    ))}
                </div>
            )}
        </ContainerPagina>
    )
}
