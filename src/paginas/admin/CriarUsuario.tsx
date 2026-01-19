import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { criarOuAtualizarUsuarioSistema } from '../../servicos/usuarios_admin.servico'
import type { PapelUsuario } from '../../servicos/usuarios_admin.servico'

import { MdSportsVolleyball } from 'react-icons/md'
import { IoIosFootball } from 'react-icons/io'
import { FaBasketballBall, FaSwimmer, FaPaintBrush, FaLaptop } from 'react-icons/fa'
import { GiHand, GiMusicalNotes } from 'react-icons/gi'

export function CriarUsuario() {
    const navegar = useNavigate()
    const [salvando, setSalvando] = useState(false)

    // Form
    const [uid, setUid] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [papel, setPapel] = useState<PapelUsuario>('professor')
    const [projeto, setProjeto] = useState('')
    const [ativo, setAtivo] = useState(true)

    async function salvar() {
        if (!uid || !nome || !email) {
            toast.warn('Preencha UID, Nome e Email')
            return
        }

        setSalvando(true)
        try {
            await criarOuAtualizarUsuarioSistema(uid, {
                nome,
                email,
                papel,
                projeto: papel === 'professor' ? projeto : undefined,
                ativo
            })
            toast.success('Professor(a) criado com sucesso!')
            navegar('/admin/usuarios')
        } catch (e: any) {
            console.error(e)
            const erroMsg = e.message || 'Erro ao criar professor(a)'
            toast.error(`Erro: ${erroMsg}`)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <ContainerPagina>
            <TopoPainelAdmin />

            <BotaoVoltar onClick={() => navegar('/admin/usuarios')} style={{ marginTop: 20 }}>
                <FiArrowLeft /> Voltar
            </BotaoVoltar>

            <Card style={{ marginTop: 10 }}>
                <Titulo style={{ marginBottom: 20 }}>Novo Professor(a)</Titulo>

                <div style={{ background: '#e0f2fe', padding: 12, borderRadius: 8, fontSize: 13, color: '#0369a1', marginBottom: 20 }}>
                    <strong>Atenção:</strong> O login deve ser criado manualmente no <strong>Firebase Authentication</strong>.
                    Copie o <strong>UID</strong> gerado lá e cole abaixo para criar o perfil no sistema.
                </div>

                <GrupoCampo style={{ marginBottom: 16 }}>
                    <Rotulo>UID (do Firebase Auth)</Rotulo>
                    <CampoBase
                        value={uid}
                        onChange={(e) => setUid(e.target.value)}
                        placeholder="Ex: 5XyZw..."
                    />
                </GrupoCampo>

                <GrupoCampo style={{ marginBottom: 16 }}>
                    <Rotulo>Nome Completo</Rotulo>
                    <CampoBase
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: João da Silva"
                    />
                </GrupoCampo>

                <GrupoCampo style={{ marginBottom: 16 }}>
                    <Rotulo>E-mail (Apenas referência)</Rotulo>
                    <CampoBase
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Ex: joao@email.com"
                    />
                </GrupoCampo>

                <GrupoCampo style={{ marginBottom: 16 }}>
                    <Rotulo>Papel</Rotulo>
                    <DropdownSelect
                        value={papel}
                        onChange={(v) => setPapel(v as PapelUsuario)}
                        options={[
                            { value: 'professor', label: 'Professor(a)' },
                            { value: 'administrador', label: 'Administrador' }
                        ]}
                        placeholder="Selecione o papel..."
                    />
                </GrupoCampo>

                {papel === 'professor' && (
                    <GrupoCampo style={{ marginBottom: 16 }}>
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
                                { value: 'Dança', label: <><GiMusicalNotes size={18} /> Dança</> },
                                { value: 'Artesanato', label: <><FaPaintBrush size={18} /> Artesanato</> },
                                { value: 'Informática', label: <><FaLaptop size={18} /> Informática</> },
                                { value: 'Outro', label: 'Outro' }
                            ]}
                            placeholder="Selecione a modalidade..."
                        />
                    </GrupoCampo>
                )}

                <GrupoCampo style={{ marginBottom: 16 }}>
                    <Rotulo>Status</Rotulo>
                    <DropdownSelect
                        value={ativo ? 'true' : 'false'}
                        onChange={(v) => setAtivo(v === 'true')}
                        options={[
                            { value: 'true', label: 'Ativo (Pode logar)' },
                            { value: 'false', label: 'Inativo (Bloqueado)' }
                        ]}
                    />
                </GrupoCampo>

                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                    <Botao $variacao="primario" onClick={salvar} disabled={salvando}>
                        <FiSave /> {salvando ? 'Criando...' : 'Criar Professor(a)'}
                    </Botao>
                </div>
            </Card>
        </ContainerPagina>
    )
}
