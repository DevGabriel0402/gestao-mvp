import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { autenticacao } from './firebase'

export async function entrarComEmailESenha(email: string, senha: string) {
    const credencial = await signInWithEmailAndPassword(autenticacao, email, senha)
    return credencial.user
}

export async function sair() {
    await signOut(autenticacao)
}

export async function atualizarToken() {
    const usuario = autenticacao.currentUser
    if (usuario) {
        await usuario.getIdToken(true) // Força o refresh do token para pegar novas claims
    }
}
