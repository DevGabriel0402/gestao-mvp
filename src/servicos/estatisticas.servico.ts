import { collection, collectionGroup, getCountFromServer, getDocs, query } from 'firebase/firestore'
import { banco } from './firebase'
import { listarAlunos } from './alunos.servico'
import type { Aluno } from './alunos.servico'


export type EstatisticasGlobais = {
    totalProfessores: number
    totalAlunos: number
    rankingOficinas: { nome: string; quantidade: number }[]
    evolucaoMatriculas: { mes: string; quantidade: number }[]
    statusGlobal: { nome: string; quantidade: number }[]
}

export type EstatisticasProfessor = {
    totalAlunos: number
    alunosPorOficina: { nome: string; quantidade: number }[]
    alunosPorStatus: { nome: string; quantidade: number }[]
    alunosPorIdade: { nome: string; quantidade: number }[]
}

export async function obterEstatisticasGlobais(): Promise<EstatisticasGlobais> {
    // 1. Total Professores
    const snapProfessores = await getCountFromServer(collection(banco, 'usuarios'))
    const totalProfessores = snapProfessores.data().count

    // 2. Buscar Todos Alunos (Global)
    let alunos: any[] = []

    try {
        // Tentativa Otimizada: Collection Group
        // Se falhar (falta de índice), cai no catch
        const alunosQuery = query(collectionGroup(banco, 'alunos'))
        const snapAlunos = await getDocs(alunosQuery)
        alunos = snapAlunos.docs.map(d => ({ ...d.data(), criadoEm: d.data().criadoEm }))
    } catch (error) {
        console.warn('CollectionGroup falhou (provavelmente falta índice), usando fallback iterativo:', error)

        // Fallback: Iterar Usuários -> Alunos
        // Como tempos o snapProfessores, podemos iterar
        const snapUsuarios = await getDocs(collection(banco, 'usuarios'))
        const promises = snapUsuarios.docs.map(async (uDoc) => {
            const subRef = collection(banco, 'usuarios', uDoc.id, 'alunos')
            const subSnap = await getDocs(subRef)
            return subSnap.docs.map(d => ({ ...d.data(), criadoEm: d.data().criadoEm }))
        })
        const resultados = await Promise.all(promises)
        alunos = resultados.flat()
    }

    // 3. Ranking de Oficinas (Barra)
    const oficinasMap: Record<string, number> = {}
    alunos.forEach(aluno => {
        const oficina = (aluno.oficina || 'Não definida').trim()
        oficinasMap[oficina] = (oficinasMap[oficina] || 0) + 1
    })
    const rankingOficinas = Object.entries(oficinasMap)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5)

    // 4. Evolução de Matrículas (Linha) - Últimos 6 meses
    const evolucaoMap: Record<string, number> = {}
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    alunos.forEach(aluno => {
        if (aluno.criadoEm) {
            // Se for Timestamp do Firestore tem .toDate(), se for string/iso usa new Date
            const data = aluno.criadoEm.toDate ? aluno.criadoEm.toDate() : new Date(aluno.criadoEm)
            const chave = `${meses[data.getMonth()]}` // Agrupando por mês (simples)
            evolucaoMap[chave] = (evolucaoMap[chave] || 0) + 1
        }
    })
    // Mockar ordem cronológica correta seria o ideal, mas para MVP vamos exibir os que tem dados
    // Ou melhor: Pegar os ultimos 6 meses fixos e preencher.
    const hoje = new Date()
    const ultimosMeses = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
        const nomeMes = meses[d.getMonth()]
        ultimosMeses.push({
            mes: nomeMes,
            quantidade: evolucaoMap[nomeMes] || 0
        })
    }

    // 5. Status Global (Pizza)
    const statusMap: Record<string, number> = { 'Ativo': 0, 'Inativo': 0 }
    alunos.forEach(aluno => {
        const s = aluno.status === 'ativo' ? 'Ativo' : 'Inativo'
        statusMap[s] = (statusMap[s] || 0) + 1
    })
    const statusGlobal = Object.entries(statusMap).map(([nome, quantidade]) => ({ nome, quantidade }))

    return {
        totalProfessores,
        totalAlunos: alunos.length,
        rankingOficinas,
        evolucaoMatriculas: ultimosMeses,
        statusGlobal
    }
}

export async function obterEstatisticasProfessor(uid: string): Promise<EstatisticasProfessor> {
    const alunos = await listarAlunos(uid) as Aluno[]

    // Por Oficina
    const oficinasMap: Record<string, number> = {}
    alunos.forEach(aluno => {
        const oficina = (aluno.oficina || 'Sem oficina').trim()
        oficinasMap[oficina] = (oficinasMap[oficina] || 0) + 1
    })
    const alunosPorOficina = Object.entries(oficinasMap)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade)

    // Por Status
    const statusMap: Record<string, number> = { 'Ativo': 0, 'Inativo': 0 }
    alunos.forEach(aluno => {
        const s = aluno.status === 'ativo' ? 'Ativo' : 'Inativo'
        statusMap[s] = (statusMap[s] || 0) + 1
    })
    const alunosPorStatus = Object.entries(statusMap).map(([nome, quantidade]) => ({ nome, quantidade }))

    // Por Idade
    // Faixas: 0-10, 11-14, 15-17, 18+
    const faixas = { 'Até 10 anos': 0, '11 a 14 anos': 0, '15 a 17 anos': 0, '18+ anos': 0 }

    alunos.forEach(aluno => {
        let idade = aluno.idade

        // Se idade não salva, tenta calcular
        if (!idade && aluno.dataNascimento) {
            const hoje = new Date()
            const nasc = new Date(aluno.dataNascimento)
            idade = hoje.getFullYear() - nasc.getFullYear()
            const m = hoje.getMonth() - nasc.getMonth()
            if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
                idade--
            }
        }

        if (idade === undefined || isNaN(idade)) return

        if (idade <= 10) faixas['Até 10 anos']++
        else if (idade <= 14) faixas['11 a 14 anos']++
        else if (idade <= 17) faixas['15 a 17 anos']++
        else faixas['18+ anos']++
    })

    const alunosPorIdade = Object.entries(faixas).map(([nome, quantidade]) => ({ nome, quantidade }))

    return {
        totalAlunos: alunos.length,
        alunosPorOficina,
        alunosPorStatus,
        alunosPorIdade
    }
}
