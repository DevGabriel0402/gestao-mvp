import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../paginas/Login'
import { PainelAdministrador } from '../paginas/PainelAdministrador'
import { NaoEncontrado } from '../paginas/NaoEncontrado'
import { RotaProtegida } from './RotaProtegida'
import { CadastroAluno } from '../paginas/CadastroAluno'
import { ConfiguracoesOficinas } from '../paginas/ConfiguracoesOficinas'
import { ConfiguracoesGerais } from '../paginas/ConfiguracoesGerais'
import { PainelUsuario } from '../paginas/PainelUsuario'
import { ListaAlunos } from '../paginas/ListaAlunos'
import { ListaUsuarios } from '../paginas/admin/ListaUsuarios'
import { CriarUsuario } from '../paginas/admin/CriarUsuario'
import { EditarUsuario } from '../paginas/admin/EditarUsuario'
import { RelatorioOficinas } from '../paginas/relatorios/RelatorioOficinas'
import { RecuperarSenha } from '../paginas/RecuperarSenha'

export function Rotas() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />

            {/* 🔑 ROTA PRINCIPAL (REDIRECIONAMENTO) */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 🛡️ PAINEL ADMINISTRADOR */}
            <Route
                path="/admin"
                element={
                    <RotaProtegida papeisPermitidos={['administrador']}>
                        <PainelAdministrador />
                    </RotaProtegida>
                }
            />
            <Route
                path="/admin/usuarios"
                element={
                    <RotaProtegida papeisPermitidos={['administrador']}>
                        <ListaUsuarios />
                    </RotaProtegida>
                }
            />
            <Route
                path="/admin/usuarios/novo"
                element={
                    <RotaProtegida papeisPermitidos={['administrador']}>
                        <CriarUsuario />
                    </RotaProtegida>
                }
            />
            <Route
                path="/admin/usuarios/:uid/editar"
                element={
                    <RotaProtegida papeisPermitidos={['administrador']}>
                        <EditarUsuario />
                    </RotaProtegida>
                }
            />


            {/* 📱 PAINEL USUÁRIO (ALUNOS E OFICINAS) */}
            <Route
                path="/app"
                element={
                    <RotaProtegida papeisPermitidos={['usuario', 'administrador']}>
                        <PainelUsuario />
                    </RotaProtegida>
                }
            />

            <Route
                path="/app/alunos/novo"
                element={
                    <RotaProtegida papeisPermitidos={['usuario', 'administrador']}>
                        <CadastroAluno />
                    </RotaProtegida>
                }
            />

            <Route
                path="/app/alunos/:id/editar"
                element={
                    <RotaProtegida papeisPermitidos={['usuario', 'administrador']}>
                        <CadastroAluno />
                    </RotaProtegida>
                }
            />
            <Route
                path="/app/alunos"
                element={
                    <RotaProtegida papeisPermitidos={['usuario', 'administrador']}>
                        <ListaAlunos />
                    </RotaProtegida>
                }
            />

            <Route
                path="/app/relatorios/oficinas"
                element={
                    <RotaProtegida papeisPermitidos={['usuario', 'administrador']}>
                        <RelatorioOficinas />
                    </RotaProtegida>
                }
            />

            {/* ⚙️ CONFIGURAÇÕES */}
            <Route
                path="/app/configuracoes/geral"
                element={
                    <RotaProtegida papeisPermitidos={['usuario', 'administrador']}>
                        <ConfiguracoesGerais />
                    </RotaProtegida>
                }
            />

            <Route
                path="/app/configuracoes/oficinas"
                element={
                    <RotaProtegida papeisPermitidos={['usuario', 'administrador']}>
                        <ConfiguracoesOficinas />
                    </RotaProtegida>
                }
            />

            <Route path="*" element={<NaoEncontrado />} />
        </Routes>
    )
}
