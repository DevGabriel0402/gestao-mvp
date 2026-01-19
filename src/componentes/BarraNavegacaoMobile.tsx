import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import type { IconType } from 'react-icons'

const ContainerBarra = styled.div`
  display: none; // Default hidden
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    height: 84px;
    z-index: 1000;
    justify-content: space-around;
    padding-bottom: env(safe-area-inset-bottom); // iOS safe area
    box-shadow: 0 -1px 3px rgba(0,0,0,0.05);
  }
`

const Spacer = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    height: 105px; // 84 + padding
  }
`

const ItemNavegacao = styled.button<{ $ativo?: boolean }>`
  flex: 1;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 0;
  color: ${props => props.$ativo ? '#38bdf8' : '#64748b'};
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
  }

  svg {
    font-size: 36px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`

export type ItemBarra = {
  label: string
  icone: IconType
  acao: string | (() => void)
  caminhoAtivo?: string // Para marcar ativo se for rota
}

interface Props {
  itens: ItemBarra[]
}

export function BarraNavegacaoMobile({ itens }: Props) {
  const navegar = useNavigate()
  const location = useLocation()

  function handleClick(item: ItemBarra) {
    if (typeof item.acao === 'string') {
      navegar(item.acao)
    } else {
      item.acao()
    }
  }

  return (
    <>
      <Spacer />

      <ContainerBarra>
        {itens.map((item, index) => {
          // Verifica se está ativo
          const ehAtivo = typeof item.acao === 'string'
            ? location.pathname === item.acao || location.pathname === item.caminhoAtivo
            : false

          return (
            <ItemNavegacao
              key={index}
              onClick={() => handleClick(item)}
              $ativo={ehAtivo}
            >
              <item.icone />
              <span>{item.label}</span>
            </ItemNavegacao>
          )
        })}
      </ContainerBarra>
    </>
  )
}
