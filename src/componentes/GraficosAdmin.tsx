import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { Card, Subtitulo, Titulo } from '../estilos/componentes'
import { obterEstatisticasGlobais } from '../servicos/estatisticas.servico'
import type { EstatisticasGlobais } from '../servicos/estatisticas.servico'
import { FiUsers } from 'react-icons/fi'
import { MdOutlineClass } from 'react-icons/md'

const ContainerIndicadores = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`

const ContainerGraficos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const CardNumero = styled(Card)`
    display: flex;
    align-items: center;
    gap: 16px;
`

const IconeGrande = styled.div<{ $cor: string }>`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${props => props.$cor}20;
    color: ${props => props.$cor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
`

const Numero = styled.div`
    font-size: 32px;
    font-weight: bold;
    color: #334155;
`

export function GraficosAdmin() {
    const [dados, setDados] = useState<EstatisticasGlobais | null>(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        async function carregar() {
            try {
                const stats = await obterEstatisticasGlobais()
                setDados(stats)
            } catch (error) {
                console.error(error)
            } finally {
                setCarregando(false)
            }
        }
        carregar()
    }, [])

    if (carregando) return <Subtitulo>Carregando painel...</Subtitulo>
    if (!dados) return null

    return (
        <div>
            {/* 1. Indicadores Numéricos */}
            <ContainerIndicadores>
                <CardNumero>
                    <IconeGrande $cor="#3b82f6">
                        <FiUsers />
                    </IconeGrande>
                    <div>
                        <Numero>{dados.totalProfessores}</Numero>
                        <Subtitulo>Professores</Subtitulo>
                    </div>
                </CardNumero>

                <CardNumero>
                    <IconeGrande $cor="#10b981">
                        <MdOutlineClass />
                    </IconeGrande>
                    <div>
                        <Numero>{dados.totalAlunos}</Numero>
                        <Subtitulo>Total Alunos</Subtitulo>
                    </div>
                </CardNumero>
            </ContainerIndicadores>

            {/* 2. Gráficos */}
            <Titulo>Visão Geral do Sistema</Titulo>
            <ContainerGraficos>
                {/* LINHA: Evolução */}
                <Card>
                    <Titulo style={{ fontSize: 18, marginBottom: 16 }}>Novos Alunos (Últimos 6 meses)</Titulo>
                    <div style={{ height: 250, width: '100%' }}>
                        <ResponsiveContainer>
                            <LineChart data={dados.evolucaoMatriculas}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="quantidade" name="Matrículas" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* BARRA: Ranking Oficinas */}
                <Card>
                    <Titulo style={{ fontSize: 18, marginBottom: 16 }}>Top 5 Oficinas</Titulo>
                    <div style={{ height: 250, width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={dados.rankingOficinas}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="nome" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="quantidade" name="Alunos" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* PIZZA: Status Global */}
                <Card style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Titulo style={{ fontSize: 18, marginBottom: 16 }}>Status dos Alunos (Global)</Titulo>
                        <div style={{ height: 300, width: '100%', maxWidth: 500 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={dados.statusGlobal}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="quantidade"
                                    >
                                        {dados.statusGlobal.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.nome === 'Ativo' ? '#10b981' : '#f43f5e'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            </ContainerGraficos>
        </div>
    )
}
