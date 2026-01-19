import { BrowserRouter } from 'react-router-dom'
import { Rotas } from './rotas/Rotas'
import { Favicon } from './componentes/Favicon'

export function App() {
  return (
    <BrowserRouter>
      <Favicon />
      <Rotas />
    </BrowserRouter>
  )
}
