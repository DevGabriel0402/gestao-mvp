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
        criadoEm: serverTimestamp()
    })
    await setDoc(ref, payload, { merge: true })
}

export async function atualizarUsuarioSistema(uid: string, dados: Partial<Omit<UsuarioSistema, 'uid'>>) {
    const ref = doc(banco, 'usuarios', uid)
    const payload = removerIndefinidos({
        ...dados,
        atualizadoEm: serverTimestamp()
    })
    await updateDoc(ref, payload)
}
