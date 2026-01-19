export type PapelUsuario = 'administrador' | 'usuario'

export type UsuarioSistema = {
    uid: string
    nome: string
    email: string
    papel: PapelUsuario
    ativo: boolean
}
