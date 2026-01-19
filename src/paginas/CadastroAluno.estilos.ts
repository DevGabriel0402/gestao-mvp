import styled from 'styled-components'
import { Botao } from '../estilos/componentes'

export const BarraEtapas = styled.div<{ $etapa: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 10px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.cores.borda};
    z-index: 0;
    transform: translateY(-50%);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.cores.primaria};
    z-index: 0;
    transform: translateY(-50%);
    transition: width 0.3s ease;
    width: ${({ $etapa }) => {
        if ($etapa === 1) return '0%'
        if ($etapa === 2) return '50%'
        return '100%'
    }};
  }
`

export const BadgeMenor = styled.span`
  background-color: #e0f2fe; /* Azul soft */
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
`



export const EtapaPill = styled.button<{ $ativa?: boolean }>`
  position: relative;
  z-index: 1;
  border: 2px solid ${({ theme, $ativa }) => ($ativa ? theme.cores.primaria : theme.cores.borda)};
  background: ${({ theme, $ativa }) => ($ativa ? theme.cores.primaria : theme.cores.superficie)};
  color: ${({ theme, $ativa }) => ($ativa ? '#fff' : theme.cores.textoFraco)};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;

  /* Label text below the circle */
  &::after {
    content: attr(data-label);
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    white-space: nowrap;
    color: ${({ theme, $ativa }) => ($ativa ? theme.cores.primaria : theme.cores.textoFraco)};
    font-weight: ${({ $ativa }) => ($ativa ? '600' : '400')};
  }

  &:hover {
    border-color: ${({ theme }) => theme.cores.primaria};
    color: ${({ theme, $ativa }) => ($ativa ? '#fff' : theme.cores.primaria)};
  }
`

export const Aviso = styled.div`
  margin-top: 10px;
  color: ${({ theme }) => theme.cores.textoFraco};
  font-size: 13px;
`

export const Separador = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.cores.borda};
  margin: 16px 0;
`

export const BotaoEtapa = styled(Botao)`
  min-width: 140px;
`
