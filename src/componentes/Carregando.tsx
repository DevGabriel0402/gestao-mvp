import styled, { keyframes } from 'styled-components'
import { FaUserCog } from 'react-icons/fa'
import { tema } from '../estilos/tema'

const fillAnimation = keyframes`
  0% { height: 0%; }
  50% { height: 100%; }
  100% { height: 0%; }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  items-align: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: ${tema.cores.fundo};
  /* Centraliza horizontal e vertical */
  align-items: center; 
`

const IconContainer = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  /* Icone base (fundo cinza) */
  color: ${tema.cores.borda};
  
  svg {
    width: 64px;
    height: 64px;
  }
`

const BaseIconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`

const FilledIconWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0%; // Começa vazio
  overflow: hidden;
  animation: ${fillAnimation} 2s infinite ease-in-out;
  color: ${tema.cores.primaria};
  z-index: 2;
  
  /* Garante que o ícone interno fique 'fixo' em relação ao container, 
     apenas sendo cortado pelo overflow do wrapper */
  display: flex;
  align-items: flex-end; 
`

// Wrapper interno para manter o ícone posicionado corretamente durante o corte
const FilledIconInner = styled.div`
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
        width: 64px;
        height: 64px;
    }
`

export function Carregando() {
  return (
    <Container>
      <IconContainer>
        {/* Ícone de fundo (cinza) */}
        <BaseIconWrapper>
          <FaUserCog />
        </BaseIconWrapper>

        {/* Ícone colorido preenchendo */}
        <FilledIconWrapper>
          <FilledIconInner>
            <FaUserCog />
          </FilledIconInner>
        </FilledIconWrapper>
      </IconContainer>
    </Container>
  )
}
