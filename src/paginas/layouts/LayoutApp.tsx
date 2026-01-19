import { Outlet } from 'react-router-dom'
import { BarraNavegacaoMobile } from '../../componentes/BarraNavegacaoMobile'
import { FiUser, FiSettings, FiHome } from 'react-icons/fi'
import { MdOutlineSportsVolleyball } from 'react-icons/md'
import { FaFilePdf } from 'react-icons/fa6'
import { gerarRelatorioAlunos } from '../../servicos/relatorios.servico'
import { useState } from 'react'
import { listarAlunos } from '../../servicos/alunos.servico'
import { toast } from 'react-toastify'
import { usarAutenticacao } from '../../hooks/usarAutenticacao'
import type { Aluno } from '../../servicos/alunos.servico'

export function LayoutApp() {
    const { usuarioSistema } = usarAutenticacao()
    const [gerando, setGerando] = useState(false)

    async function baixarRelatorio() {
        if (gerando || !usuarioSistema?.uid) return

        const win = window.open('', '_blank')
        if (win) {
            win.document.write('Gerando relatório... aguarde.')
        }

        setGerando(true)
        try {
            const alunos = await listarAlunos(usuarioSistema.uid) as Aluno[]
            gerarRelatorioAlunos(alunos, win)
            toast.success('Relatório baixado!')
        } catch (err) {
            console.error(err)
            toast.error('Erro ao gerar relatório.')
            if (win) win.close()
        } finally {
            setGerando(false)
        }
    }

    // Nota: "Meus Alunos" é a home do app (/app) ou a lista (/app/alunos)?
    // A home (/app) tem dashboard. A lista é /app/alunos.
    // O usuário clicando em "Meus Alunos" deve ir para a lista ou dashboard? 
    // O pedido original era "Painel Usuario" -> "Meus Alunos".
    // Vamos apontar para /app/alunos (lista) ou /app (dashboard)? 
    // Geralmente num tab bar: Home, Alunos, Oficinas.
    // O item "Visão Geral" do pedido anterior era card.
    // O usuário disse: "Meus Alunos, Oficinas, Geral e Relátorio".
    // "Geral" = Configurações Gerais (/app/configuracoes/geral)
    // Vamos assumir que "Meus Alunos" leva para a lista, mas a Dashboard (/app) é onde ele cai.
    // Vou colocar um Home também? Ou Meus Alunos = Dashboard?
    // Se a dashboard tem graficos de alunos, talvez seja a Home.
    // Mas o card "Meus Alunos" levava para /app/alunos. 
    // Vou colocar "Início" (/app) e "Alunos" (/app/alunos)?
    // O pedido foi PLURAL: "Meus alunos, Oficina, geral e relatorio". 4 itens.
    // Vou manter os 4.

    return (
        <>
            <Outlet />
            <BarraNavegacaoMobile itens={[
                { label: 'Início', icone: FiHome, acao: '/app' },
                { label: 'Alunos', icone: FiUser, acao: '/app/alunos' },
                { label: 'Oficinas', icone: MdOutlineSportsVolleyball, acao: '/app/configuracoes/oficinas' },
                { label: 'Geral', icone: FiSettings, acao: '/app/configuracoes/geral' },
                { label: 'Relatório', icone: FaFilePdf, acao: baixarRelatorio }
            ]} />
        </>
    )
}
