import { useNavigate } from 'react-router-dom'
import {
    FiUsers,
    FiPlus,
} from 'react-icons/fi'
import { FaFilePdf } from 'react-icons/fa6'
import styled from 'styled-components'
import {
    Botao,
    Card,
    ContainerPagina,
    Titulo,
    Subtitulo,
    Grid
} from '../estilos/componentes'
import { listarUsuariosSistema } from '../servicos/usuarios_admin.servico'
import { gerarRelatorioProfessores } from '../servicos/relatorios.servico'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { MdOutlineSportsVolleyball } from 'react-icons/md'
import { GraficosAdmin } from '../componentes/GraficosAdmin'
import { usarAutenticacao } from '../hooks/usarAutenticacao'

const GridDeNavegacao = styled(Grid)`
    @media (max-width: 768px) {
        display: none;
    }
`

export function PainelAdministrador() {
    const navegar = useNavigate()
    const { usuarioSistema } = usarAutenticacao()
    const [gerandoRelatorio, setGerandoRelatorio] = useState(false)

    async function baixarRelatorioProfessores() {
        if (!usuarioSistema) return
        setGerandoRelatorio(true)
        try {
            const users = await listarUsuariosSistema()
            gerarRelatorioProfessores(users)
            toast.success('Relatório gerado com sucesso!')
        } catch (error) {
            console.error(error)
            toast.error('Erro ao gerar relatório.')
        } finally {
            setGerandoRelatorio(false)
        }
    }

    return (
        <ContainerPagina>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Titulo>Painel do Administrador</Titulo>
                    <Subtitulo>Gerencie professores e usuários do sistema.</Subtitulo>
                </div>
                <Botao onClick={() => navegar('/admin/usuarios/novo')} $variacao="primario">
                    <FiPlus /> Novo Professor
                </Botao>
            </div>

            <GridDeNavegacao>
                <Card style={{ cursor: 'pointer', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={() => navegar('/admin/usuarios')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            background: 'rgba(56, 189, 248, 0.1)',
                            color: '#38bdf8',
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28
                        }}>
                            <FiUsers />
                        </div>
                        <div>
                            <Titulo style={{ fontSize: 20 }}>Professores e Usuários</Titulo>
                            <Subtitulo>Gerenciar acessos ao sistema</Subtitulo>
                        </div>
                    </div>
                </Card>

                <Card style={{ cursor: 'pointer', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={() => navegar('/app')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28
                        }}>
                            <MdOutlineSportsVolleyball />
                        </div>
                        <div>
                            <Titulo style={{ fontSize: 20 }}>Visão do Aplicativo</Titulo>
                            <Subtitulo>Acessar como professor</Subtitulo>
                        </div>
                    </div>
                </Card>

                <Card style={{ cursor: 'pointer', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={!gerandoRelatorio ? baixarRelatorioProfessores : undefined}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            background: 'rgba(244, 63, 94, 0.1)',
                            color: '#f43f5e',
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28
                        }}>
                            <FaFilePdf />
                        </div>
                        <div>
                            <Titulo style={{ fontSize: 20 }}>Relatório PDF</Titulo>
                            <Subtitulo>{gerandoRelatorio ? 'Gerando...' : 'Baixar lista de professores'}</Subtitulo>
                        </div>
                    </div>
                </Card>
            </GridDeNavegacao>

            <GraficosAdmin />
        </ContainerPagina>
    )
}
