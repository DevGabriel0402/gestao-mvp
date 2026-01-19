import { createGlobalStyle } from 'styled-components';
import { tema } from './tema';

type TipoTema = typeof tema;

export const GlobalStyle = createGlobalStyle<{ theme: TipoTema }>`
  * { box-sizing: border-box; }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    background: ${({ theme }) => theme.cores.fundo};
    color: ${({ theme }) => theme.cores.texto};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, select, textarea {
    font: inherit;
  }

  ::selection {
    background: rgba(34, 197, 94, 0.35);
  }

  /* Customizando Toastify */
  :root {
    --toastify-color-success: ${({ theme }) => theme.cores.primaria};
    --toastify-color-error: #f87171; /* Red 400 (Soft Red) */
    --toastify-font-family: inherit;
    --toastify-text-color-light: ${({ theme }) => theme.cores.texto};
  }

  .Toastify__toast {
    border-radius: ${({ theme }) => theme.raio.md};
    box-shadow: ${({ theme }) => theme.sombras.card};
    border: 1px solid ${({ theme }) => theme.cores.borda};
  }

  .Toastify__toast--success {
    background: ${({ theme }) => theme.cores.fundo};
    color: ${({ theme }) => theme.cores.primaria};
    border-left: 6px solid ${({ theme }) => theme.cores.primaria};
  }

  .Toastify__toast--error {
    background: ${({ theme }) => theme.cores.fundo};
    color: #f87171;
    border-left: 6px solid #f87171;
  }
`
