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
import { criarUsuarioSistema } from '../../servicos/admin_funcoes.servico'

type PapelUsuario = 'administrador' | 'usuario'

export function CriarUsuario() {
    const navegar = useNavigate()
    const [salvando, setSalvando] = useState(false)

    // Form
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [papel, setPapel] = useState<PapelUsuario>('usuario')
    const [ativo, setAtivo] = useState(true)

    async function salvar() {
        if (!nome || !email || !senha) {
            toast.warn('Preencha Nome, Email e Senha')
            return
        }

        if (senha.length < 6) {
            toast.warn('A senha deve ter pelo menos 6 caracteres')
            return
        }

        setSalvando(true)
        try {
            await criarUsuarioSistema({
                nome,
                email,
                senha,
                papel,
                ativo
            })
            toast.success('Usuário criado com sucesso!')
            navegar('/admin/usuarios')
        } catch (e: any) {
            console.error(e)
            const erroMsg = e.message || 'Erro ao criar usuário'
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
                <Titulo style={{ marginBottom: 20 }}>Novo Usuário</Titulo>

                <div style={{ background: '#e0f2fe', padding: 12, borderRadius: 8, fontSize: 13, color: '#0369a1', marginBottom: 20 }}>
                    Preencha os dados abaixo. O sistema criará o acesso de login e o perfil automaticamente.
                </div>

                <GrupoCampo style={{ marginBottom: 16 }}>
                    <Rotulo>Nome Completo</Rotulo>
                    <CampoBase
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: João da Silva"
                    />
                </GrupoCampo>

                <GrupoCampo style={{ marginBottom: 16 }}>
                    <Rotulo>E-mail (Login)</Rotulo>
                    <CampoBase
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Ex: joao@email.com"
                    />
                </GrupoCampo>

                <GrupoCampo style={{ marginBottom: 16 }}>
                    <Rotulo>Senha</Rotulo>
                    <CampoBase
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                    />
                </GrupoCampo>

                <GrupoCampo style={{ marginBottom: 16 }}>
                    <Rotulo>Papel</Rotulo>
                    <DropdownSelect
                        value={papel}
                        onChange={(v) => setPapel(v as PapelUsuario)}
                        options={[
                            { value: 'usuario', label: 'Usuário' },
                            { value: 'administrador', label: 'Administrador' }
                        ]}
                        placeholder="Selecione o papel..."
                    />
                </GrupoCampo>

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
                        <FiSave /> {salvando ? 'Criando...' : 'Criar Usuário'}
                    </Botao>
                </div>
            </Card>
        </ContainerPagina>
    )
}
