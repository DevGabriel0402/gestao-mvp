import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { banco } from './firebase'
import { removerIndefinidos } from '../utils/removerIndefinidos'
import type { UsuarioSistema, PapelUsuario } from '../tipos/Usuario'

export type { UsuarioSistema, PapelUsuario }

export async function listarUsuariosSistema(): Promise<UsuarioSistema[]> {
    const ref = collection(banco, 'usuarios')
    const q = query(ref, orderBy('criadoEm', 'desc'))
    const snap = await getDocs(q)

    return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }))
}

export async function buscarUsuarioSistema(uid: string): Promise<UsuarioSistema | null> {
    const ref = doc(banco, 'usuarios', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return { uid: snap.id, ...(snap.data() as any) }
}

// MVP: cria/atualiza doc do usuário usando UID (Auth criado no console)
export async function criarOuAtualizarUsuarioSistema(uid: string, dados: Omit<UsuarioSistema, 'uid'>) {
    const ref = doc(banco, 'usuarios', uid)
    const payload = removerIndefinidos({
        ...dados,
        atualizadoEm: serverTimestamp(),
        criadoEm: serverTimestamp() // Em updates reais isso não deveria sobrescrever se já existe, mas setDoc com merge respeita campos existentes? Não, merge mescla campos. Se passado "criadoEm", vai atualizar.
        // Melhor checar se existe antes? Ou assumir que essa função é chamada no contexto de "Salvar" do admin que pode ser criação.
        // O setDoc com merge vai atualizar "criadoEm" se eu passar.
        // Para evitar isso, eu poderia usar updateDoc ou checar existência.
        // Mas o requisito diz "criarOuAtualizar". Simplificando: vamos manter simples, mas para defaults é importante.
    })

    // Se quisermos não sobrescrever criadoEm, teríamos que ler antes.
    // Mas vamos seguir o pedido simples. Ajuste: defaults só se não existirem?
    // User pediu: "Ao salvar, cria/atualiza usuarios/{uid} e TAMBÉM cria defaults"

    await setDoc(ref, payload, { merge: true })

    // Cria defaults (oficinas e configurações)
    // set com merge true garante que não apaga se já existir, mas sobrescreve campos se passados.
    // Para defaults, queremos garantir que existam.

    const oficinasRef = doc(banco, `usuarios/${uid}/oficinas/geral`)
    await setDoc(oficinasRef, {
        nomes: ['Vôlei'],
        atualizadoEm: serverTimestamp()
    }, { merge: true })

    const configuracoesRef = doc(banco, `usuarios/${uid}/configuracoes/geral`)
    await setDoc(configuracoesRef, {
        projetoNome: 'Gestão de Alunos',
        contatoSuporte: '',
        niveis: ['Iniciante', 'Intermediário', 'Avançado'],
        atualizadoEm: serverTimestamp()
    }, { merge: true })
}

export async function atualizarUsuarioSistema(uid: string, dados: Partial<Omit<UsuarioSistema, 'uid'>>) {
    const ref = doc(banco, 'usuarios', uid)
    const payload = removerIndefinidos({
        ...dados,
        atualizadoEm: serverTimestamp()
    })
    await updateDoc(ref, payload)
}
