import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import { autenticacao } from '../servicos/firebase'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import {
    Botao,
    CampoBase,
    Card,
    ContainerPagina,
    GrupoCampo,
    Rotulo,
    Titulo,
    Subtitulo
} from '../estilos/componentes'

export function RecuperarSenha() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [enviando, setEnviando] = useState(false)

    async function handleRecuperar(e: React.FormEvent) {
        e.preventDefault()

        if (!email) {
            toast.warn('Por favor, informe seu e-mail.')
            return
        }

        setEnviando(true)
        try {
            await sendPasswordResetEmail(autenticacao, email)
            toast.success('Link de recuperação enviado! Verifique seu e-mail.')
            setTimeout(() => navigate('/login'), 3000)
        } catch (error: any) {
            console.error(error)
            const msg = error.code === 'auth/user-not-found'
                ? 'Usuário não encontrado.'
                : 'Erro ao enviar e-mail. Tente novamente.'
            toast.error(msg)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <ContainerPagina style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card style={{ maxWidth: 400, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img src="/favicon.svg" alt="Logo" style={{ width: 48, marginBottom: 16 }} />
                    <Titulo>Recuperar Senha</Titulo>
                    <Subtitulo>Informe seu e-mail para receber as instruções.</Subtitulo>
                </div>

                <form onSubmit={handleRecuperar} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <GrupoCampo>
                        <Rotulo>E-mail</Rotulo>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', top: 14, left: 12, color: '#94a3b8' }} />
                            <CampoBase
                                type="email"
                                placeholder="seu@email.com"
                                style={{ paddingLeft: 38 }}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </GrupoCampo>

                    <Botao
                        $variacao="primario"
                        type="submit"
                        disabled={enviando}
                        style={{ justifyContent: 'center', marginTop: 8 }}
                    >
                        {enviando ? 'Enviando...' : 'Enviar Link de Recuperação'}
                    </Botao>
                </form>

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Link to="/login" style={{ textDecoration: 'none', color: '#64748b', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <FiArrowLeft /> Voltar para o login
                    </Link>
                </div>
            </Card>
        </ContainerPagina>
    )
}
