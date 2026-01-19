import { useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { sair } from '../../servicos/autenticacao.servico'
import {
    Botao,
    Titulo,
} from '../../estilos/componentes'
import { usarAutenticacao } from '../../hooks/usarAutenticacao'

export function TopoPainelAdmin() {
    const navegar = useNavigate()
    const { usuarioSistema } = usarAutenticacao()

    async function fazerLogout() {
        await sair()
        navegar('/login', { replace: true })
    }

    return (
        <div style={{ marginBottom: 32, borderBottom: '1px solid #e2e8f0', paddingBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Titulo style={{ margin: 0 }}>Painel Admin</Titulo>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                        {usuarioSistema?.nome} <span style={{ opacity: 0.6 }}>({usuarioSistema?.papel})</span>
                    </div>
                </div>

                <Botao onClick={fazerLogout} $variacao="secundario" style={{ padding: '6px 12px', fontSize: 13, whiteSpace: 'nowrap' }}>
                    <FiLogOut /> Sair
                </Botao>
            </div>


        </div>
    )
}
