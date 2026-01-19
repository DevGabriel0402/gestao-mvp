export function contarPorOficina(alunos: Array<{ oficina?: string; status?: string }>) {
    const mapa = new Map<string, number>()

    for (const a of alunos) {
        const nome = (a.oficina || 'Sem oficina').trim() || 'Sem oficina'
        mapa.set(nome, (mapa.get(nome) || 0) + 1)
    }

    return Array.from(mapa.entries())
        .map(([oficina, quantidade]) => ({ oficina, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade)
}
