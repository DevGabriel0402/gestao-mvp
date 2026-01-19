import { doc, getDoc } from 'firebase/firestore'
import { banco } from './firebase'
import type { UsuarioSistema } from '../tipos/Usuario'

export async function buscarUsuarioPorUid(uid: string): Promise<UsuarioSistema | null> {
    const referencia = doc(banco, 'usuarios', uid)
    const snap = await getDoc(referencia)

    if (!snap.exists()) return null

    const dados = snap.data() as Omit<UsuarioSistema, 'uid'>
    return { uid, ...dados }
}

import { setDoc, serverTimestamp } from 'firebase/firestore'

export async function criarUsuario(uid: string, dados: { nome: string; email: string; papel: 'administrador' | 'colaborador' }) {
    const referencia = doc(banco, 'usuarios', uid)
    await setDoc(referencia, {
        ...dados,
        ativo: true,
        criadoEm: serverTimestamp()
    })
}
