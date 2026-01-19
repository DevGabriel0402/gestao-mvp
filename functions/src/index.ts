import * as functions from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'

admin.initializeApp()

type PapelUsuario = 'administrador' | 'usuario'

function exigirAutenticacao(context: functions.CallableRequest<any>) {
    if (!context.auth) {
        throw new functions.HttpsError('unauthenticated', 'Você precisa estar logado.')
    }
}

async function exigirAdmin(uid: string) {
    // Preferência 1: custom claim
    const userRecord = await admin.auth().getUser(uid)
    const papelClaim = (userRecord.customClaims?.papel as PapelUsuario | undefined) || null

    if (papelClaim === 'administrador') return

    // Fallback: Firestore (caso claims ainda não existam)
    const doc = await admin.firestore().doc(`usuarios/${uid}`).get()
    const papel = doc.exists ? (doc.data()?.papel as PapelUsuario | undefined) : undefined
    const ativo = doc.exists ? Boolean(doc.data()?.ativo) : false

    if (!ativo) throw new functions.HttpsError('permission-denied', 'Usuário inativo.')
    if (papel !== 'administrador') {
        throw new functions.HttpsError('permission-denied', 'Sem permissão.')
    }
}

function validarEmail(email: string) {
    if (!email || !email.includes('@')) {
        throw new functions.HttpsError('invalid-argument', 'E-mail inválido.')
    }
}

function validarPapel(papel: string): asserts papel is PapelUsuario {
    const ok = papel === 'administrador' || papel === 'usuario'
    if (!ok) throw new functions.HttpsError('invalid-argument', 'Papel inválido.')
}

/**
 * cria usuário no Firebase Auth + cria doc no Firestore
 * opcionalmente cria configuracoes/oficinas padrão
 */
export const criarUsuarioSistema = functions.onCall({ cors: true }, async (request) => {
    exigirAutenticacao(request)
    await exigirAdmin(request.auth!.uid)

    const { email, senha, nome, papel, ativo } = request.data || {}
    validarEmail(email)
    if (!senha || String(senha).length < 6) {
        throw new functions.HttpsError('invalid-argument', 'Senha deve ter no mínimo 6 caracteres.')
    }
    if (!nome || String(nome).trim().length < 3) {
        throw new functions.HttpsError('invalid-argument', 'Nome inválido.')
    }
    validarPapel(papel)

    const ativoFinal = ativo === undefined ? true : Boolean(ativo)

    // 1) cria no Auth
    const user = await admin.auth().createUser({
        email,
        password: senha,
        displayName: String(nome).trim(),
        disabled: !ativoFinal
    })

    // 2) seta claim
    await admin.auth().setCustomUserClaims(user.uid, { papel })

    // 3) cria doc no Firestore
    const agora = admin.firestore.FieldValue.serverTimestamp()
    await admin.firestore().doc(`usuarios/${user.uid}`).set(
        {
            nome: String(nome).trim(),
            email: String(email).toLowerCase().trim(),
            papel,
            ativo: ativoFinal,
            criadoEm: agora,
            atualizadoEm: agora
        },
        { merge: true }
    )

    // 4) cria defaults (opcional, mas ajuda o MVP)
    await admin.firestore().doc(`usuarios/${user.uid}/oficinas/geral`).set(
        { nomes: ['Vôlei'], atualizadoEm: agora },
        { merge: true }
    )
    await admin.firestore().doc(`usuarios/${user.uid}/configuracoes/geral`).set(
        {
            projetoNome: 'Meu Projeto',
            contatoSuporte: '',
            niveis: ['Iniciante', 'Intermediário', 'Avançado'],
            atualizadoEm: agora
        },
        { merge: true }
    )

    return { uid: user.uid }
})

/**
 * atualiza doc do usuário + claim + status ativo/inativo
 * (não muda senha aqui; podemos adicionar depois)
 */
export const atualizarUsuarioSistema = functions.onCall({ cors: true }, async (request) => {
    exigirAutenticacao(request)
    await exigirAdmin(request.auth!.uid)

    const { uid, nome, email, papel, ativo } = request.data || {}
    if (!uid) throw new functions.HttpsError('invalid-argument', 'UID é obrigatório.')

    const updatesAuth: admin.auth.UpdateRequest = {}
    const updatesDb: any = {
        atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    }

    if (nome !== undefined) {
        const n = String(nome).trim()
        if (n.length < 3) throw new functions.HttpsError('invalid-argument', 'Nome inválido.')
        updatesAuth.displayName = n
        updatesDb.nome = n
    }

    if (email !== undefined) {
        validarEmail(email)
        const e = String(email).toLowerCase().trim()
        updatesAuth.email = e
        updatesDb.email = e
    }

    if (ativo !== undefined) {
        const a = Boolean(ativo)
        updatesAuth.disabled = !a
        updatesDb.ativo = a
    }

    if (papel !== undefined) {
        validarPapel(papel)
        updatesDb.papel = papel
        await admin.auth().setCustomUserClaims(uid, { papel })
    }

    // atualiza auth (se tiver algo)
    if (Object.keys(updatesAuth).length > 0) {
        await admin.auth().updateUser(uid, updatesAuth)
    }

    // atualiza firestore
    await admin.firestore().doc(`usuarios/${uid}`).set(updatesDb, { merge: true })

    return { ok: true }
})
