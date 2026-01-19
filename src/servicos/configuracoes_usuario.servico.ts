import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { banco } from './firebase'
import { removerIndefinidos } from '../utils/removerIndefinidos'

export type ConfiguracoesGeraisUsuario = {
    projetoNome?: string
    contatoSuporte?: string
    niveis?: string[]
}

export async function buscarConfiguracoesGerais(uid: string): Promise<ConfiguracoesGeraisUsuario | null> {
    const referencia = doc(banco, 'usuarios', uid, 'configuracoes', 'geral')
    const snap = await getDoc(referencia)

    if (!snap.exists()) return null
    return snap.data() as ConfiguracoesGeraisUsuario
}

export async function salvarConfiguracoesGerais(uid: string, dados: ConfiguracoesGeraisUsuario) {
    const referencia = doc(banco, 'usuarios', uid, 'configuracoes', 'geral')

    const payload = removerIndefinidos({
        ...dados,
        atualizadoEm: serverTimestamp()
    })

    await setDoc(referencia, payload, { merge: true })
    salvarCacheConfiguracoes(uid, payload as ConfiguracoesGeraisUsuario)
}

const CHAVE_CACHE_CONFIG = 'gestao_mvp_config_geral_'

export function salvarCacheConfiguracoes(uid: string, dados: ConfiguracoesGeraisUsuario) {
    try {
        localStorage.setItem(CHAVE_CACHE_CONFIG + uid, JSON.stringify(dados))
    } catch (e) {
        console.error('Erro ao salvar cache de configurações:', e)
    }
}

export function recuperarCacheConfiguracoes(uid: string): ConfiguracoesGeraisUsuario | null {
    try {
        const salvo = localStorage.getItem(CHAVE_CACHE_CONFIG + uid)
        return salvo ? JSON.parse(salvo) : null
    } catch (e) {
        return null
    }
}
