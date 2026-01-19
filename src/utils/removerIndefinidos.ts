export function removerIndefinidos<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(removerIndefinidos) as any
    }

    if (obj && typeof obj === 'object') {
        const novo: any = {}
        for (const [chave, valor] of Object.entries(obj as any)) {
            if (valor === undefined) continue
            novo[chave] = removerIndefinidos(valor)
        }
        return novo
    }

    return obj
}
