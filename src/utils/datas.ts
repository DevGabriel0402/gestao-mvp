export function calcularIdadePorDataISO(dataNascimentoISO: string): number {
    // dataNascimentoISO: "yyyy-mm-dd"
    const [ano, mes, dia] = dataNascimentoISO.split('-').map(Number)
    const dataNascimento = new Date(ano, mes - 1, dia)
    const hoje = new Date()

    let idade = hoje.getFullYear() - dataNascimento.getFullYear()
    const m = hoje.getMonth() - dataNascimento.getMonth()

    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--
    }

    return idade
}

export function ehMenorDeIdade(idade: number): boolean {
    return idade < 18
}
