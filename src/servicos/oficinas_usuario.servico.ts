import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { banco } from './firebase'
import { removerIndefinidos } from '../utils/removerIndefinidos'

type OficinasGerais = {
    nomes: string[]
    atualizadoEm?: any
}

export async function buscarOficinasDoUsuario(uid: string): Promise<string[]> {
    const referencia = doc(banco, 'usuarios', uid, 'oficinas', 'geral')
    const snap = await getDoc(referencia)

    if (!snap.exists()) return []

    const dados = snap.data() as OficinasGerais
    return Array.isArray(dados.nomes) ? dados.nomes : []
}

export async function salvarOficinasDoUsuario(uid: string, nomes: string[]) {
    const referencia = doc(banco, 'usuarios', uid, 'oficinas', 'geral')

    const payload = removerIndefinidos({
        nomes,
        atualizadoEm: serverTimestamp()
    })

    await setDoc(referencia, payload, { merge: true })
}
