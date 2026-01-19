import { doc, getDoc } from 'firebase/firestore'
import { banco } from './firebase'

type OficinasGerais = {
    nomes: string[]
}

export async function buscarOficinasDoUsuario(uid: string): Promise<string[]> {
    const referencia = doc(banco, 'usuarios', uid, 'oficinas', 'geral')
    const snap = await getDoc(referencia)

    if (!snap.exists()) return []

    const dados = snap.data() as OficinasGerais
    return Array.isArray(dados.nomes) ? dados.nomes : []
}
