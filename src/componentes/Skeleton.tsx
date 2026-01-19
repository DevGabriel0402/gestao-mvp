import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`

const Bloco = styled.div<{ $h?: number }>`
  height: ${({ $h }) => ($h ? `${$h}px` : '14px')};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.06) 0%,
    rgba(255,255,255,0.12) 50%,
    rgba(255,255,255,0.06) 100%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.2s infinite linear;
`

export function Skeleton({ altura = 14 }: { altura?: number }) {
    return <Bloco $h={altura} />
}
