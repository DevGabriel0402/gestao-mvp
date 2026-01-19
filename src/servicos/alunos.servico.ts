import { removerIndefinidos } from '../utils/removerIndefinidos'

import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
    getDocs,
    orderBy,
    query
} from 'firebase/firestore'
import { banco } from './firebase'

export type DadosAlunoSalvar = {
    nomeCompleto: string
    dataNascimento: string // yyyy-mm-dd

    idade: number
    ehMenorDeIdade: boolean

    // fotoUrl?: string
    // fotoPublicId?: string

    responsavel?: {
        nomeCompleto: string
        parentesco: 'Pai' | 'Mãe' | 'Tutor' | 'Outro'
        telefoneWhatsApp: string
        telefoneNumeros: string
    }

    contatos: {
        telefoneAlunoWhatsApp: string
        telefoneAlunoNumeros: string
        telefonePaiWhatsApp?: string
        telefonePaiNumeros?: string
        email?: string
    }

    endereco: {
        naoSabeCEP: boolean
        cep?: string
        cepNumeros?: string
        logradouro: string
        numero: string
        complemento?: string
        bairro: string
        cidade: string
        uf: string
    }

    oficina: string
    nivel: string
    status: 'ativo' | 'inativo'
    observacoes?: string
}

export type Aluno = DadosAlunoSalvar & { id: string }

function caminhoAlunos(uid: string) {
    return collection(banco, 'usuarios', uid, 'alunos')
}

export async function criarAluno(uid: string, dados: DadosAlunoSalvar) {
    const dadosLimpos = removerIndefinidos({
        ...dados,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
        criadoPorUid: uid,
        atualizadoPorUid: uid
    })

    const ref = await addDoc(caminhoAlunos(uid), dadosLimpos)

    // Atualiza o cache local otimisticamente ou invalida (aqui vamos adicionar na lista existente)
    // Para simplificar e garantir ordem correta (criadoEm desc), vamos apenas recarregar ou adicionar no topo
    const cacheAtual = recuperarAlunosCache(uid)
    const novoItem = { id: ref.id, ...dadosLimpos, criadoEm: new Date().toISOString() } // Simula criadoEm para cache
    salvarAlunosCache(uid, [novoItem, ...cacheAtual])

    return ref.id
}


export async function atualizarAluno(uid: string, alunoId: string, dados: Partial<DadosAlunoSalvar>) {
    const referencia = doc(banco, 'usuarios', uid, 'alunos', alunoId)

    const dadosLimpos = removerIndefinidos({
        ...dados,
        atualizadoEm: serverTimestamp(),
        atualizadoPorUid: uid
    })

    await updateDoc(referencia, dadosLimpos)

    // Atualiza cache local
    const cacheAtual = recuperarAlunosCache(uid)
    const novoCache = cacheAtual.map(a => a.id === alunoId ? { ...a, ...dadosLimpos } : a)
    salvarAlunosCache(uid, novoCache)
}


export async function buscarAluno(uid: string, alunoId: string): Promise<(DadosAlunoSalvar & { id: string }) | null> {
    const referencia = doc(banco, 'usuarios', uid, 'alunos', alunoId)
    const snap = await getDoc(referencia)
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() } as DadosAlunoSalvar & { id: string }
}

const CHAVE_CACHE = (uid: string) => `mvp_alunos_${uid}`

export function salvarAlunosCache(uid: string, alunos: any[]) {
    try {
        localStorage.setItem(CHAVE_CACHE(uid), JSON.stringify(alunos))
    } catch (e) {
        console.error('Erro ao salvar cache de alunos', e)
    }
}

export function recuperarAlunosCache(uid: string): any[] {
    try {
        const cache = localStorage.getItem(CHAVE_CACHE(uid))
        return cache ? JSON.parse(cache) : []
    } catch (e) {
        console.error('Erro ao recuperar cache de alunos', e)
        return []
    }
}

export async function listarAlunos(uid: string) {
    const referencia = collection(banco, 'usuarios', uid, 'alunos')
    const consulta = query(referencia, orderBy('criadoEm', 'desc'))

    const snap = await getDocs(consulta)

    const lista = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }))

    // Atualiza o cache ao buscar com sucesso
    salvarAlunosCache(uid, lista)

    return lista
}
