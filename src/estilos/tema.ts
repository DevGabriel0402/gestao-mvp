export const tema = {
    cores: {
        fundo: '#f8fafc', // Slate 50 (Light soft background)
        superficie: '#ffffff', // White
        superficie2: '#f1f5f9', // Slate 100
        texto: '#334155', // Slate 700 (Dark text for readability)
        textoFraco: '#94a3b8', // Slate 400
        borda: '#e2e8f0', // Slate 200 (Light border)

        primaria: '#38bdf8', // Sky 400 (Soft Blue)
        primariaHover: '#0ea5e9', // Sky 500

        perigo: '#ef4444',
        perigoHover: '#dc2626',

        aviso: '#f59e0b',
        info: '#3b82f6'
    },
    sombras: {
        card: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
    },

    raio: {
        md: '12px',
        lg: '16px'
    },
    espacamento: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '18px',
        xl: '24px'
    }
} as const
