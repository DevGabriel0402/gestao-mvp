import { Outlet } from 'react-router-dom'
import { BarraNavegacaoMobile } from '../../componentes/BarraNavegacaoMobile'
import { FiUsers } from 'react-icons/fi'
import { MdOutlineSportsVolleyball } from 'react-icons/md'
import { FaFilePdf } from 'react-icons/fa6'
import { gerarRelatorioProfessores } from '../../servicos/relatorios.servico'
import { useState } from 'react'
import { listarUsuariosSistema } from '../../servicos/usuarios_admin.servico'
import { toast } from 'react-toastify'

export function LayoutAdmin() {
    const [gerando, setGerando] = useState(false)

    async function baixarRelatorio() {
        if (gerando) return
        setGerando(true)
        try {
            const users = await listarUsuariosSistema()
            gerarRelatorioProfessores(users)
            toast.success('Relatório baixado!')
        } catch (err) {
            console.error(err)
            toast.error('Erro ao gerar relatório.')
        } finally {
            setGerando(false)
        }
    }

    return (
        <>
            <Outlet />
            <BarraNavegacaoMobile itens={[
                { label: 'Professores', icone: FiUsers, acao: '/admin/usuarios', caminhoAtivo: '/admin' }, // '/admin' tbm ativa este? Talvez
                { label: 'Visão App', icone: MdOutlineSportsVolleyball, acao: '/app' },
                { label: 'Relatório', icone: FaFilePdf, acao: baixarRelatorio }
            ]} />
        </>
    )
}
