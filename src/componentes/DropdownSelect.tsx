import { useState, useRef, useEffect } from 'react'
import { FiChevronDown } from 'react-icons/fi'

type Opcao = {
    label: React.ReactNode
    value: string
}

type Props = {
    value: string
    onChange: (valor: string) => void
    options: Opcao[]
    placeholder?: string
}

export function DropdownSelect({ value, onChange, options, placeholder }: Props) {
    const [aberto, setAberto] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const opcaoSelecionada = options.find((o) => o.value === value)

    useEffect(() => {
        function clicouFora(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setAberto(false)
            }
        }
        document.addEventListener('mousedown', clicouFora)
        return () => document.removeEventListener('mousedown', clicouFora)
    }, [])

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <button
                type="button"
                onClick={() => setAberto(!aberto)}
                style={{
                    width: '100%',
                    background: 'transparent',
                    border: '1px solid #e2e8f0', // theme.cores.borda
                    color: value ? '#334155' : '#94a3b8', // Texto escuro se selecionado, placeholder se vazio
                    borderRadius: 8,
                    padding: '11px 12px',
                    paddingRight: '32px',
                    outline: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '42px' // Altura para alinhar com inputs
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: value ? '#334155' : '#94a3b8' }}>
                    {opcaoSelecionada?.label || placeholder || 'Selecione...'}
                </div>
                <FiChevronDown style={{ opacity: 0.5 }} />
            </button>

            {aberto && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 4,
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {options.map((opcao) => (
                        <div
                            key={opcao.value}
                            onClick={() => {
                                onChange(opcao.value)
                                setAberto(false)
                            }}
                            style={{
                                padding: '10px 12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: value === opcao.value ? '#38bdf8' : '#334155',
                                background: value === opcao.value ? '#f0f9ff' : 'transparent',
                                transition: 'background 0.2s',
                                borderBottom: '1px solid #f8fafc'
                            }}
                            onMouseEnter={(e) => {
                                if (value !== opcao.value) e.currentTarget.style.background = '#f8fafc'
                            }}
                            onMouseLeave={(e) => {
                                if (value !== opcao.value) e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            {opcao.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
