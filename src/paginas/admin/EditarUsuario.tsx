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
    BotaoVoltar,
    Titulo
} from '../../estilos/componentes'
import { DropdownSelect } from '../../componentes/DropdownSelect'
import { Carregando } from '../../componentes/Carregando'
import { buscarUsuarioSistema, atualizarUsuarioSistema } from '../../servicos/usuarios_admin.servico'
import type { PapelUsuario } from '../../servicos/usuarios_admin.servico'

import { MdSportsVolleyball } from 'react-icons/md'
import { IoIosFootball } from 'react-icons/io'
import { FaBasketballBall, FaSwimmer, FaPaintBrush, FaLaptop } from 'react-icons/fa'
import { GiHand, GiMusicalNotes, GiBoxingGlove } from 'react-icons/gi'

export function EditarUsuario() {
    const { uid } = useParams()
    const navegar = useNavigate()

    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)

    // Form
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [papel, setPapel] = useState<PapelUsuario>('professor')
    const [projeto, setProjeto] = useState('')
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
                setProjeto(u.projeto || '')
                setAtivo(u.ativo)
            } else {
                toast.error('Professor(a) não encontrado')
                navegar('/admin/usuarios')
            }
        } catch (e) {
            console.error(e)
            toast.error('Erro ao carregar professor(a)')
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
                projeto: papel === 'professor' ? projeto : undefined,
                ativo
            })
            toast.success('Professor(a) atualizado com sucesso!')
            navegar('/admin/usuarios')
        } catch (e) {
            console.error(e)
            toast.error('Erro ao atualizar professor(a)')
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
                <Titulo style={{ marginBottom: 20 }}>Editar Professor(a)</Titulo>

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
                            { value: 'professor', label: 'Professor(a)' },
                            { value: 'administrador', label: 'Administrador' }
                        ]}
                    />
                </GrupoCampo>

                {papel === 'professor' && (
                    <GrupoCampo>
                        <Rotulo>Projeto / Oficina Principal</Rotulo>
                        <DropdownSelect
                            value={projeto}
                            onChange={(v) => setProjeto(v)}
                            options={[
                                { value: 'Vôlei', label: <><MdSportsVolleyball size={18} /> Vôlei</> },
                                { value: 'Futsal', label: <><IoIosFootball size={18} /> Futsal</> },
                                { value: 'Basquete', label: <><FaBasketballBall size={18} /> Basquete</> },
                                { value: 'Handebol', label: <><GiHand size={18} /> Handebol</> },
                                { value: 'Natação', label: <><FaSwimmer size={18} /> Natação</> },
                                { value: 'Música', label: <><GiMusicalNotes size={18} /> Música</> },
                                { value: 'Luta', label: <><GiBoxingGlove size={18} /> Luta</> },
                                { value: 'Artesanato', label: <><FaPaintBrush size={18} /> Artesanato</> },
                                { value: 'Informática', label: <><FaLaptop size={18} /> Informática</> },
                                { value: 'Outro', label: 'Outro' }
                            ]}
                            placeholder="Selecione a modalidade..."
                        />
                    </GrupoCampo>
                )}

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
