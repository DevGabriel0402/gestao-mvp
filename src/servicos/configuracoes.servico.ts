import { doc, getDoc } from 'firebase/firestore'
import { banco } from './firebase'

export type ConfiguracoesGerais = {
    niveis: string[]
    projetoNome?: string
    contatoSuporte?: string
}

export async function buscarConfiguracoesGeraisDoUsuario(uid: string): Promise<ConfiguracoesGerais | null> {
    const referencia = doc(banco, 'usuarios', uid, 'configurações', 'geral')
    const snap = await getDoc(referencia)

    if (!snap.exists()) return null
    return snap.data() as ConfiguracoesGerais
}
