import { apenasNumeros } from '../utils/mascaras'

export type EnderecoViaCEP = {
    cep: string
    logradouro: string
    bairro: string
    localidade: string
    uf: string
    erro?: boolean
}

export async function buscarEnderecoPorCEP(cepDigitado: string) {
    const cep = apenasNumeros(cepDigitado)

    if (cep.length !== 8) return null

    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const dados = (await resposta.json()) as EnderecoViaCEP

    if ((dados as any).erro) return null

    return dados
}
