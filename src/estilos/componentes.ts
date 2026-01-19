import styled from 'styled-components'
import { tema } from './tema';


type TipoTema = typeof tema;

export const ContainerPagina = styled.div<{ theme: TipoTema }>`
  max-width: 980px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.espacamento.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.espacamento.md};
  }
`

export const CabecalhoPagina = styled.div<{ theme: TipoTema }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espacamento.lg};
  margin-bottom: ${({ theme }) => theme.espacamento.lg};

  @media (max-width: 768px) {
    flex-wrap: wrap;
    align-items: center;
    gap: ${({ theme }) => theme.espacamento.md};
  }
`

export const Titulo = styled.h1`
  margin: 0;
  font-size: 24px;
  letter-spacing: 0.2px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

export const Subtitulo = styled.p<{ theme: TipoTema }>`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.cores.textoFraco};
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`

export const Card = styled.div<{ theme: TipoTema }>`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.raio.lg};
  box-shadow: ${({ theme }) => theme.sombras.card};
  padding: ${({ theme }) => theme.espacamento.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.espacamento.md};
  }
`

export const Linha = styled.div<{ theme: TipoTema }>`
  display: flex;
  gap: ${({ theme }) => theme.espacamento.md};
  flex-wrap: wrap;
`

export const GrupoCampo = styled.div<{ theme: TipoTema }>`
  display: grid;
  gap: 6px;
  flex: 1;
  min-width: 240px;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`

export const Grid = styled.div<{ theme: TipoTema }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.espacamento.lg};
  margin-top: ${({ theme }) => theme.espacamento.lg};
`

export const Rotulo = styled.label <{ theme: TipoTema }>`
  color: ${({ theme }) => theme.cores.textoFraco};
  font-size: 13px;
`

export const CampoBase = styled.input<{ theme: TipoTema }>`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  color: ${({ theme }) => theme.cores.texto};
  border-radius: ${({ theme }) => theme.raio.md};
  padding: 12px 14px;
  outline: none;
  width: 100%;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.cores.primaria};
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15); // Azul soft com opacidade baixa
    background: ${({ theme }) => theme.cores.superficie2};
  }

  &::placeholder {
    color: ${({ theme }) => theme.cores.textoFraco};
    opacity: 0.5;
  }
`

export const SelectBase = styled.select<{ theme: TipoTema }>`
  background: ${({ theme }) => theme.cores.superficie2};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  color: ${({ theme }) => theme.cores.texto};
  border-radius: ${({ theme }) => theme.raio.md};
  padding: 12px 12px;
  outline: none;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.cores.primaria};
     box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15); // Azul soft com opacidade baixa
  }
`

export const AreaTexto = styled.textarea<{ theme: TipoTema }>`
  background: ${({ theme }) => theme.cores.superficie2};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  color: ${({ theme }) => theme.cores.texto};
  border-radius: ${({ theme }) => theme.raio.md};
  padding: 12px 12px;
  outline: none;
  resize: vertical;
  min-height: 90px;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.cores.primaria};
     box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15); // Azul soft com opacidade baixa
  }
`

export const TextoErro = styled.small<{ theme: TipoTema }>`
  color: ${({ theme }) => theme.cores.perigo};
`

export const BarraAcoes = styled.div<{ theme: TipoTema }>`
  display: flex;
  gap: ${({ theme }) => theme.espacamento.sm};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.espacamento.lg};
  flex-wrap: wrap;
`

export const BotaoVoltar = styled.button<{ theme: TipoTema }>`
  background: none;
  border: none;
  color: ${({ theme }) => theme.cores.textoFraco};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.cores.primaria};
  }
`

type VariacaoBotao = 'primario' | 'secundario' | 'perigo' | 'neutro'

export const Botao = styled.button<{ $variacao?: VariacaoBotao, theme: TipoTema }>`
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.raio.md};
  padding: 10px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  background: ${({ theme, $variacao }) => {
    if ($variacao === 'primario') return theme.cores.primaria
    if ($variacao === 'perigo') return theme.cores.perigo
    return theme.cores.superficie2
  }};

  color: ${({ theme, $variacao }) => {
    if ($variacao === 'primario' || $variacao === 'perigo') return '#ffffff'
    return theme.cores.texto
  }};

  &:hover {
    background: ${({ theme, $variacao }) => {
    if ($variacao === 'primario') return theme.cores.primariaHover
    if ($variacao === 'perigo') return theme.cores.perigoHover
    return theme.cores.superficie
  }};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
