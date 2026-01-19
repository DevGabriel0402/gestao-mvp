import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { UsuarioSistema } from './usuarios_admin.servico'
import type { Aluno } from './alunos.servico'

// Define a extensão do jsPDF para incluir o autoTable
interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable: { finalY: number }
}

export function gerarRelatorioProfessores(usuarios: UsuarioSistema[]) {
    const doc = new jsPDF() as jsPDFWithAutoTable

    // Título
    doc.setFontSize(18)
    doc.text('Relatório de Professores / Usuários', 14, 22)
    doc.setFontSize(11)
    doc.text(`Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 14, 30)

    // Dados da Tabela
    const dados = usuarios.map(u => [
        u.nome,
        u.email,
        u.papel.toUpperCase(),
        u.projeto || '-',
        u.ativo ? 'Ativo' : 'Inativo'
    ])

    // Gerar Tabela
    autoTable(doc, {
        head: [['Nome', 'Email', 'Papel', 'Projeto/Oficina', 'Status']],
        body: dados,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }, // Azul
        alternateRowStyles: { fillColor: [241, 245, 249] } // Cinza claro
    })

    // Salvar
    doc.save(`relatorio_professores_${new Date().toISOString().split('T')[0]}.pdf`)
}

export function gerarRelatorioAlunos(alunos: Aluno[]) {
    const doc = new jsPDF() as jsPDFWithAutoTable

    // Título
    doc.setFontSize(18)
    doc.text('Relatório de Alunos', 14, 22)
    doc.setFontSize(11)
    doc.text(`Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 14, 30)
    doc.text(`Total de alunos: ${alunos.length}`, 14, 36)

    // Dados da Tabela
    // Colunas: Nome, Idade (calc), Responsável, Oficina(s), Contato
    const dados = alunos.map(aluno => {
        const oficina = aluno.oficina ? `${aluno.oficina} (${aluno.nivel})` : '-'

        // Calcular Idade simples ou mostrar Data Nasc
        let idade = '-'
        if (aluno.dataNascimento) {
            const hoje = new Date()
            const nasc = new Date(aluno.dataNascimento)
            let anos = hoje.getFullYear() - nasc.getFullYear()
            const m = hoje.getMonth() - nasc.getMonth()
            if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
                anos--
            }
            idade = `${anos} anos`
        }

        return [
            aluno.nomeCompleto,
            idade,
            aluno.responsavel?.nomeCompleto || '-',
            aluno.responsavel?.telefoneWhatsApp || '-',
            oficina
        ]
    })

    // Gerar Tabela
    autoTable(doc, {
        head: [['Nome', 'Idade/Nasc', 'Responsável', 'Telefone', 'Oficinas']],
        body: dados,
        startY: 42,
        theme: 'striped',
        headStyles: { fillColor: [34, 197, 94] }, // Verde
    })

    // Salvar
    doc.save(`relatorio_alunos_${new Date().toISOString().split('T')[0]}.pdf`)
}
