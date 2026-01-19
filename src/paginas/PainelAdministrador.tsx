import { useNavigate } from 'react-router-dom'
import {
    FiUsers,
    FiLogOut,

} from 'react-icons/fi'
import { FaFilePdf } from 'react-icons/fa6'
import {
    Botao,
    Card,
    ContainerPagina,
    Titulo,
    Subtitulo,
    Grid
} from '../estilos/componentes'
import { sair } from '../servicos/autenticacao.servico'
import { listarUsuariosSistema } from '../servicos/usuarios_admin.servico'
import { gerarRelatorioProfessores } from '../servicos/relatorios.servico'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { MdOutlineSportsVolleyball } from 'react-icons/md'

export function PainelAdministrador() {
    const navegar = useNavigate()
    const [gerandoRelatorio, setGerandoRelatorio] = useState(false)

    async function fazerLogout() {
        await sair()
        navegar('/login', { replace: true })
    }

    async function baixarRelatorioProfessores() {
        setGerandoRelatorio(true)
        try {
            const usuarios = await listarUsuariosSistema()
            gerarRelatorioProfessores(usuarios)
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
                    <Titulo style={{ margin: 0 }}>Painel Administrativo</Titulo>
                    <Subtitulo style={{ marginTop: 4 }}>Gerencie professores e acessos</Subtitulo>
                </div>
                <Botao onClick={fazerLogout} style={{ padding: '6px 12px', fontSize: 13 }}>
                    <FiLogOut /> Sair
                </Botao>
            </div>

            <Grid>
                <Card style={{ cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center' }} onClick={() => navegar('/admin/usuarios')}>
                    <div style={{
                        width: 50, height: 50, borderRadius: 12,
                        background: '#e0f2fe', color: '#0284c7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                    }}>
                        <FiUsers />
                    </div>
                    <div>
                        <Titulo style={{ fontSize: 18 }}>Professores</Titulo>
                        <Subtitulo>Gerenciar acessos e perfis</Subtitulo>
                    </div>
                </Card>

                <Card style={{ cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center' }} onClick={() => navegar('/app')}>
                    <div style={{
                        width: 50, height: 50, borderRadius: 12,
                        background: '#f1f5f9', color: '#64748b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                    }}>
                        <MdOutlineSportsVolleyball />
                    </div>
                    <div>
                        <Titulo style={{ fontSize: 18 }}>Visão do Professor</Titulo>
                        <Subtitulo>Acessar painel do app</Subtitulo>
                    </div>
                </Card>

                <Card
                    style={{ cursor: gerandoRelatorio ? 'wait' : 'pointer', display: 'flex', gap: 16, alignItems: 'center' }}
                    onClick={!gerandoRelatorio ? baixarRelatorioProfessores : undefined}
                >
                    <div style={{
                        width: 50, height: 50, borderRadius: 12,
                        background: '#fee2e2', color: '#dc2626',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                    }}>
                        <FaFilePdf />
                    </div>
                    <div>
                        <Titulo style={{ fontSize: 18 }}>Relatório PDF</Titulo>
                        <Subtitulo>{gerandoRelatorio ? 'Gerando...' : 'Baixar lista de professores'}</Subtitulo>
                    </div>
                </Card>
            </Grid>
        </ContainerPagina>
    )
}
