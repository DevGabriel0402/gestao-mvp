export type PapelUsuario = 'administrador' | 'professor'

export type UsuarioSistema = {
    uid: string
    nome: string
    email: string
    papel: PapelUsuario
    ativo: boolean
}
