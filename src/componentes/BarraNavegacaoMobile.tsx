import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import type { IconType } from 'react-icons'

const ContainerBarra = styled.div`
  display: none; // Default hidden
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: calc(20px + env(safe-area-inset-bottom));
    left: 20px;
    right: 20px;
    
    // Glassmorphism
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    
    // Shape
    border-radius: 24px;
    height: 84px;
    z-index: 1000;
    
    // Layout
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
