import { apenasNumeros } from './mascaras'

export function normalizarTelefone(telefoneFormatado: string | undefined) {
    const numeros = apenasNumeros(telefoneFormatado || '')
    return numeros.length ? numeros : ''
}

export function normalizarCEP(cepFormatado: string | undefined) {
    const numeros = apenasNumeros(cepFormatado || '')
    return numeros.length === 8 ? numeros : ''
}
