import { getFunctions, httpsCallable } from 'firebase/functions'
import { app as appFirebase } from './firebase'

export async function criarUsuarioSistema(dados: {
    email: string
    senha: string
    nome: string
    papel: 'administrador' | 'usuario'
    ativo?: boolean
}) {
    const funcoes = getFunctions(appFirebase)
    const call = httpsCallable(funcoes, 'criarUsuarioSistema')
    const res: any = await call(dados)
    return res.data as { uid: string }
}

export async function atualizarUsuarioSistema(dados: {
    uid: string
    nome?: string
    email?: string
    papel?: 'administrador' | 'usuario'
    ativo?: boolean
}) {
    const funcoes = getFunctions(appFirebase)
    const call = httpsCallable(funcoes, 'atualizarUsuarioSistema')
    const res: any = await call(dados)
    return res.data as { ok: true }
}
