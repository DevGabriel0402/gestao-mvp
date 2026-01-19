import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import {
    Card,
    ContainerPagina,
    Titulo,
    Subtitulo,
    Botao,
    Linha,
} from '../estilos/componentes'
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import { MdOutlineSportsVolleyball } from 'react-icons/md'
import { usarAutenticacao } from '../hooks/usarAutenticacao'
import { usarConfiguracoesGeraisUsuario } from '../hooks/usarConfiguracoesGeraisUsuario'
import { sair } from '../servicos/autenticacao.servico'

const DesktopOnly = styled.div`
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`

const MobileOnly = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`

export function PainelUsuario() {
    const navegar = useNavigate()
    const { usuarioSistema } = usarAutenticacao()
    const { projetoNome, contatoSuporte } = usarConfiguracoesGeraisUsuario(usuarioSistema?.uid)

    async function fazerLogout() {
        await sair()
        navegar('/login', { replace: true })
    }

    return (
        <ContainerPagina>
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <Titulo style={{ margin: 0 }}>Bem-vindo, {usuarioSistema?.nome?.split(' ')[0]}</Titulo>

                        <Subtitulo style={{ marginTop: 4 }}>
                            {projetoNome ? (
                                <>
                                    <strong>{projetoNome}</strong>
                                    {contatoSuporte ? <span style={{ opacity: 0.7 }}> • {contatoSuporte}</span> : null}
                                </>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Projeto não configurado.</span>

                                    <Link to="/app/configuracoes/geral" style={{ textDecoration: 'none' }}>
                                        <DesktopOnly>
                                            <Botao $variacao="primario" style={{ fontSize: 12, padding: '4px 10px', minHeight: 28 }}>
                                                Configurar agora
                                            </Botao>
                                        </DesktopOnly>
                                        <MobileOnly>
                                            <div style={{ color: '#3b82f6', display: 'flex', padding: 4 }}>
                                                <FiSettings size={20} />
                                            </div>
                                        </MobileOnly>
                                    </Link>
                                </div>
                            )}
                        </Subtitulo>
                    </div>

                    <Botao onClick={fazerLogout} style={{ padding: '6px 12px', fontSize: 13, whiteSpace: 'nowrap' }}>
                        <FiLogOut /> Sair
                    </Botao>
                </div>
            </div>

            <Linha>
                <Card style={{ flex: 1, minWidth: 280, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={() => navegar('/app/alunos')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28
                        }}>
                            <FiUser />
                        </div>
                        <div>
                            <Titulo style={{ fontSize: 18 }}>Meus Alunos</Titulo>
                            <Subtitulo>Adicione e gerencie alunos</Subtitulo>
                        </div>
                    </div>
                </Card>

                <Card style={{ flex: 1, minWidth: 280, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={() => navegar('/app/configuracoes/oficinas')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#3b82f6',
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28
                        }}>
                            <MdOutlineSportsVolleyball style={{ transform: 'rotate(-20deg)' }} />
                        </div>
                        <div>
                            <Titulo style={{ fontSize: 18 }}>Oficinas</Titulo>
                            <Subtitulo>Gerencie as oficinas</Subtitulo>
                        </div>
                    </div>
                </Card>

                <Card style={{ flex: 1, minWidth: 280, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={() => navegar('/app/configuracoes/geral')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            background: 'rgba(234, 88, 12, 0.1)', // Laranja suave
                            color: '#ea580c',
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28
                        }}>
                            <FiSettings />
                        </div>
                        <div>
                            <Titulo style={{ fontSize: 18 }}>Geral</Titulo>
                            <Subtitulo>Níveis e dados do projeto</Subtitulo>
                        </div>
                    </div>
                </Card>
            </Linha>
        </ContainerPagina>
    )
}
