import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthProvider'
import AppRouter from './app/routes/AppRouter'
import './styles/globals.css'
import './styles/theme.css'
import './styles/dashboard.css'
import './styles/pos.css'
import './styles/menu.css'
import './styles/nomina.css'
import './styles/inventario.css'
import './styles/contabilidad.css'
import './styles/reportes.css'
import './styles/responsive.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
