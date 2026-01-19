import { Navigate } from 'react-router-dom'
import { usarAutenticacao } from '../hooks/usarAutenticacao'
import type { PapelUsuario } from '../tipos/Usuario'
import { Carregando } from '../componentes/Carregando'

export function RotaProtegida({
    children,
    papeisPermitidos
}: {
    children: React.ReactNode
    papeisPermitidos?: PapelUsuario[]
}) {
    const { carregando, usuarioSistema } = usarAutenticacao()

    if (carregando) return <Carregando />

    if (!usuarioSistema) return <Navigate to="/login" replace />

    if (papeisPermitidos && !papeisPermitidos.includes(usuarioSistema.papel)) {
        // Redirecionamento inteligente:
        // Se for admin tentando acessar rota de outro papel não permitido -> Admin
        // Se for professor/outro -> App
        const destino = usuarioSistema.papel === 'administrador'
            ? '/admin'
            : '/app'

        return <Navigate to={destino} replace />
    }

    return <>{children}</>
}
