export function apenasNumeros(valor: string): string {
    return (valor || '').replace(/\D/g, '')
}

export function mascararWhatsApp(valor: string): string {
    const numeros = apenasNumeros(valor).slice(0, 11)

    // (31)98765-4321
    if (numeros.length <= 2) return numeros ? `(${numeros}` : ''
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)})${numeros.slice(2)}`
    return `(${numeros.slice(0, 2)})${numeros.slice(2, 7)}-${numeros.slice(7)}`
}

export function mascararCEP(valor: string): string {
    const numeros = apenasNumeros(valor).slice(0, 8)
    // 30.020-000
    if (numeros.length <= 2) return numeros
    if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2)}`
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}-${numeros.slice(5)}`
}
