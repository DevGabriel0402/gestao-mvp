import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts'
import { Card, Subtitulo, Titulo } from '../estilos/componentes'
import { obterEstatisticasProfessor } from '../servicos/estatisticas.servico'
import type { EstatisticasProfessor } from '../servicos/estatisticas.servico'
import { usarAutenticacao } from '../hooks/usarAutenticacao'

const ContainerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export function GraficosProfessor() {
    const { usuarioSistema } = usarAutenticacao()
    const [dados, setDados] = useState<EstatisticasProfessor | null>(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        if (!usuarioSistema?.uid) return
        async function carregar() {
            try {
                const stats = await obterEstatisticasProfessor(usuarioSistema!.uid)
                setDados(stats)
            } catch (error) {
                console.error(error)
            } finally {
                setCarregando(false)
            }
        }
        carregar()
    }, [usuarioSistema])

    if (carregando) return <Subtitulo>Carregando dados...</Subtitulo>
    if (!dados || dados.totalAlunos === 0) return null

    return (
        <div>
            <Titulo style={{ marginTop: 32 }}>Visão Geral dos Alunos</Titulo>
            <ContainerGrid>
                {/* STATUS */}
                <Card>
                    <Titulo style={{ fontSize: 18, marginBottom: 16 }}>Status (Ativos vs Inativos)</Titulo>
                    <div style={{ height: 250, width: '100%' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={dados.alunosPorStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="quantidade"
                                >
                                    {dados.alunosPorStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.nome === 'Ativo' ? '#10b981' : '#f43f5e'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* IDADE */}
                <Card>
                    <Titulo style={{ fontSize: 18, marginBottom: 16 }}>Faixa Etária</Titulo>
                    <div style={{ height: 250, width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={dados.alunosPorIdade}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="quantidade" name="Alunos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* OFICINAS */}
                <Card style={{ gridColumn: '1 / -1' }}>
                    <Titulo style={{ fontSize: 18, marginBottom: 16 }}>Alunos por Oficina</Titulo>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={dados.alunosPorOficina} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="nome" width={120} />
                                <Tooltip />
                                <Bar dataKey="quantidade" name="Alunos" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </ContainerGrid>
        </div>
    )
}
