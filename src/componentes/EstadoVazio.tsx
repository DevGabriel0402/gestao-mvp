import type { ReactNode } from 'react'
import { Card, Subtitulo, Titulo } from '../estilos/componentes'

export function EstadoVazio({
    titulo,
    descricao,
    acao
}: {
    titulo: string
    descricao?: string
    acao?: ReactNode
}) {
    return (
        <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Titulo style={{ fontSize: 18 }}>{titulo}</Titulo>
            {descricao ? <Subtitulo>{descricao}</Subtitulo> : null}
            {acao ? <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>{acao}</div> : null}
        </Card>
    )
}
