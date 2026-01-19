import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiSave, FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { TopoPainelAdmin } from './TopoPainelAdmin'
import {
    Botao,
    Card,
    ContainerPagina,
    GrupoCampo,
    CampoBase,
    Rotulo,
    SelectBase,
    BotaoVoltar,
    Titulo
} from '../../estilos/componentes'
import { DropdownSelect } from '../../componentes/DropdownSelect'
import { Carregando } from '../../componentes/Carregando'
import { buscarUsuarioSistema, atualizarUsuarioSistema } from '../../servicos/usuarios_admin.servico'
import type { PapelUsuario } from '../../servicos/usuarios_admin.servico'

export function EditarUsuario() {
    const { uid } = useParams()
    const navegar = useNavigate()

    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)

    // Form
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [papel, setPapel] = useState<PapelUsuario>('usuario')
    const [ativo, setAtivo] = useState(true)

    useEffect(() => {
        if (uid) carregar(uid)
    }, [uid])

    async function carregar(id: string) {
        setCarregando(true)
        try {
            const u = await buscarUsuarioSistema(id)
            if (u) {
                setNome(u.nome)
                setEmail(u.email)
                setPapel(u.papel)
                setAtivo(u.ativo)
            } else {
                toast.error('Usuário não encontrado')
                navegar('/admin/usuarios')
            }
        } catch (e) {
            console.error(e)
            toast.error('Erro ao carregar usuário')
        } finally {
            setCarregando(false)
        }
    }

    async function salvar() {
        if (!uid) return
        if (!nome || !email) {
            toast.warn('Preencha Nome e Email')
            return
        }

        setSalvando(true)
        try {
            await atualizarUsuarioSistema(uid, {
                nome,
                email,
                papel,
                ativo
            })
            toast.success('Usuário atualizado com sucesso!')
            navegar('/admin/usuarios')
        } catch (e) {
            console.error(e)
            toast.error('Erro ao atualizar usuário')
        } finally {
            setSalvando(false)
        }
    }

    if (carregando) {
        return <Carregando />
    }

    return (
        <ContainerPagina>
            <TopoPainelAdmin />

            <BotaoVoltar onClick={() => navegar('/admin/usuarios')} style={{ marginTop: 20 }}>
                <FiArrowLeft /> Voltar
            </BotaoVoltar>

            <Card style={{ marginTop: 10 }}>
                <Titulo style={{ marginBottom: 20 }}>Editar Usuário</Titulo>

                <div style={{ marginBottom: 20, fontSize: 13, color: '#64748b' }}>
                    UID: <strong>{uid}</strong>
                </div>

                <GrupoCampo>
                    <Rotulo>Nome Completo</Rotulo>
                    <CampoBase
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </GrupoCampo>

                <GrupoCampo>
                    <Rotulo>E-mail</Rotulo>
                    <CampoBase
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />
                </GrupoCampo>

                <GrupoCampo>
                    <Rotulo>Papel</Rotulo>
                    <DropdownSelect
                        value={papel}
                        onChange={(v) => setPapel(v as PapelUsuario)}
                        options={[
                            { value: 'usuario', label: 'Usuário' },
                            { value: 'administrador', label: 'Administrador' }
                        ]}
                    />
                </GrupoCampo>

                <GrupoCampo>
                    <Rotulo>Status</Rotulo>
                    <DropdownSelect
                        value={ativo ? 'true' : 'false'}
                        onChange={(v) => setAtivo(v === 'true')}
                        options={[
                            { value: 'true', label: 'Ativo' },
                            { value: 'false', label: 'Inativo (Bloqueado)' }
                        ]}
                    />
                </GrupoCampo>

                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                    <Botao $variacao="primario" onClick={salvar} disabled={salvando}>
                        <FiSave /> {salvando ? 'Salvando...' : 'Salvar Alterações'}
                    </Botao>
                </div>
            </Card>
        </ContainerPagina>
    )
}
