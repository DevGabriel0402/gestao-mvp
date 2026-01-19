import { FiPlus, FiUsers, FiLayout } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Botao, Card, ContainerPagina } from '../estilos/componentes'
import { TopoPainelAdmin } from './admin/TopoPainelAdmin'

export function PainelAdministrador() {

    return (
        <ContainerPagina>
            <TopoPainelAdmin />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
                {/* Card de Usuários */}
                <Card style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#3b82f6',
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            flexShrink: 0
                        }}>
                            <FiUsers />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>Gestão de Usuários</div>
                            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                                Gerencie acessos, crie novos usuários e edite permissões.
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}></div>

                    <Link to="/admin/usuarios">
                        <Botao $variacao="primario" style={{ width: '100%', justifyContent: 'center' }}>
                            <FiPlus /> Gerenciar Usuários
                        </Botao>
                    </Link>
                </Card>

                {/* Atalho para o App (Visão de Usuário) */}
                <Card style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            flexShrink: 0
                        }}>
                            <FiLayout />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>Acessar como Usuário</div>
                            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                                Vá para o painel do aplicativo para gerenciar seus próprios alunos.
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}></div>

                    <Link to="/app">
                        <Botao $variacao="secundario" style={{ width: '100%', justifyContent: 'center' }}>
                            Ir para o App
                        </Botao>
                    </Link>
                </Card>
            </div>
        </ContainerPagina>
    )
}
