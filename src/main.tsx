import React from 'react'
import ReactDOM from 'react-dom/client'
import 'smart-webcomponents-react/source/styles/smart.default.css'
import { ThemeProvider } from 'styled-components'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { App } from './App'
import { ProvedorAutenticacao } from './hooks/usarAutenticacao'
import { GlobalStyle } from './estilos/GlobalStyles'
import { tema } from './estilos/tema'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={tema}>
      <GlobalStyle theme={tema} />

      <ProvedorAutenticacao>
        <App />
      </ProvedorAutenticacao>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        closeOnClick
        pauseOnHover
        newestOnTop
      />
    </ThemeProvider>
  </React.StrictMode>
)
