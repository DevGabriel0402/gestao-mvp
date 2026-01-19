export type Responsavel = {
    nomeCompleto: string
    parentesco: 'Pai' | 'Mãe' | 'Tutor' | 'Outro'
    telefoneWhatsApp: string
    telefoneNumeros: string
}

export type ContatosAluno = {
    telefoneAlunoWhatsApp: string
    telefoneAlunoNumeros: string
    telefonePaiWhatsApp?: string
    telefonePaiNumeros?: string
    email?: string
}

export type EnderecoAluno = {
    naoSabeCEP: boolean
    cep?: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
}

export type Aluno = {
    id?: string

    nomeCompleto: string
    dataNascimento: string // vamos usar yyyy-mm-dd no form; no Firestore vira timestamp
    idade: number
    ehMenorDeIdade: boolean

    fotoUrl?: string
    fotoPublicId?: string

    responsavel?: Responsavel

    contatos: ContatosAluno
    endereco: EnderecoAluno

    oficina: string
    nivel: string

    status: 'ativo' | 'inativo'
    observacoes?: string

    criadoEm?: any
    atualizadoEm?: any
    criadoPorUid?: string
    atualizadoPorUid?: string
}
