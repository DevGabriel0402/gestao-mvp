import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { entrarComEmailESenha } from '../servicos/autenticacao.servico'
import { Botao, CampoBase, Card, Subtitulo, Titulo } from '../estilos/componentes'
import styled from 'styled-components'

import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { usarAutenticacao } from '../hooks/usarAutenticacao'

const WrapperLogin = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(circle at top, ${({ theme }) => theme.cores.superficie} 0%, ${({ theme }) => theme.cores.fundo} 100%);
`

const CardLogin = styled(Card)`
  width: 100%;
  max-width: 340px;
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
   box-shadow: ${({ theme }) => theme.sombras.card};
`

const HeaderLogin = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.cores.primaria};
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 20px;
  box-shadow: ${({ theme }) => theme.sombras.card};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const LinkEsqueci = styled.a`
  font-size: 13px;
  color: ${({ theme }) => theme.cores.textoFraco};
  text-align: right;
  margin-top: 4px;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.cores.primaria};
  }
`

export function Login() {
    const navegar = useNavigate()
    const { usuarioSistema, carregando: carregandoAuth } = usarAutenticacao()

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [verSenha, setVerSenha] = useState(false)
    const [carregando, setCarregando] = useState(false)

    useEffect(() => {
        // Se temos usuário, redireciona
        if (usuarioSistema) {
            // Toast de boas-vindas removido para evitar duplicação em redirects
            const destino = usuarioSistema.papel === 'administrador'
                ? '/admin'
                : '/app'
            navegar(destino, { replace: true })
        }
        // Se terminou de carregar o auth global, não tem usuário, mas estavamos tentando logar
        else if (!carregandoAuth && !usuarioSistema && carregando) {
            setCarregando(false)
            // O hook usarAutenticacao já exibe o toast de erro específico (inativo, não encontrado, etc)
        }
    }, [usuarioSistema, carregandoAuth, navegar, carregando])

    async function aoEntrar(e: React.FormEvent) {
        e.preventDefault()
        setCarregando(true)

        try {
            await entrarComEmailESenha(email, senha)
            // Não fazemos nada aqui, esperamos o useEffect reagir à mudança de usuarioSistema
        } catch (err: any) {
            console.error(err)
            toast.error('Credenciais inválidas. Tente novamente.')
            setCarregando(false)
        }
    }

    return (
        <WrapperLogin>
            <CardLogin>
                <HeaderLogin>
                    <LogoIcon>
                        <FiLock />
                    </LogoIcon>
                    <Titulo style={{ fontSize: 22 }}>Acessar conta</Titulo>
                    <Subtitulo>Gerencie seus alunos com facilidade</Subtitulo>
                </HeaderLogin>

                <Form onSubmit={aoEntrar}>
                    <div>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', left: 14, top: 14, color: '#71717a' }} />
                            <CampoBase
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="seu@email.com"
                                style={{ paddingLeft: 40 }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', left: 14, top: 14, color: '#71717a' }} />
                            <CampoBase
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                type={verSenha ? 'text' : 'password'}
                                placeholder="Sua senha secreta"
                                style={{ paddingLeft: 40, paddingRight: 40 }}
                                required
                            />
                            <div
                                onClick={() => setVerSenha(!verSenha)}
                                style={{
                                    position: 'absolute',
                                    right: 14,
                                    top: 14,
                                    cursor: 'pointer',
                                    color: '#71717a'
                                }}
                            >
                                {verSenha ? <FiEyeOff /> : <FiEye />}
                            </div>
                        </div>
                        <Link to="/recuperar-senha" style={{ textAlign: 'right', display: 'block', width: '100%' }}>
                            <LinkEsqueci as="span">Esqueceu a senha?</LinkEsqueci>
                        </Link>
                    </div>

                    <Botao
                        $variacao="primario"
                        type="submit"
                        disabled={carregando}
                        style={{ justifyContent: 'center', marginTop: 8, height: 44, fontSize: 15 }}
                    >
                        {carregando ? 'Entrando...' : 'Entrar na plataforma'}
                    </Botao>
                </Form>
            </CardLogin>
        </WrapperLogin>
    )
}
