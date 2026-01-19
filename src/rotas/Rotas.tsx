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
import { LayoutAdmin } from '../paginas/layouts/LayoutAdmin'
import { LayoutApp } from '../paginas/layouts/LayoutApp'

export function Rotas() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />

            {/* 🔑 ROTA PRINCIPAL (REDIRECIONAMENTO) */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 🛡️ PAINEL ADMINISTRADOR (LAYOUT COM BOTTOM BAR) */}
            <Route element={
                <RotaProtegida papeisPermitidos={['administrador']}>
                    <LayoutAdmin />
                </RotaProtegida>
            }>
                <Route path="/admin" element={<PainelAdministrador />} />
                <Route path="/admin/usuarios" element={<ListaUsuarios />} />
                <Route path="/admin/usuarios/novo" element={<CriarUsuario />} />
                <Route path="/admin/usuarios/:uid/editar" element={<EditarUsuario />} />
            </Route>

            {/* 📱 PAINEL USUÁRIO (LAYOUT COM BOTTOM BAR) */}
            <Route element={
                <RotaProtegida papeisPermitidos={['professor', 'administrador']}>
                    <LayoutApp />
                </RotaProtegida>
            }>
                <Route path="/app" element={<PainelUsuario />} />
                <Route path="/app/alunos/novo" element={<CadastroAluno />} />
                <Route path="/app/alunos/:id/editar" element={<CadastroAluno />} />
                <Route path="/app/alunos" element={<ListaAlunos />} />
                <Route path="/app/relatorios/oficinas" element={<RelatorioOficinas />} />
                <Route path="/app/configuracoes/geral" element={<ConfiguracoesGerais />} />
                <Route path="/app/configuracoes/oficinas" element={<ConfiguracoesOficinas />} />
            </Route>

            <Route path="*" element={<NaoEncontrado />} />
        </Routes>
    )
}
