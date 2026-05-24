import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/app/guards/ProtectedRoute'
import LoginPage from '@/modules/auth/pages/LoginPage'
import UnauthorizedPage from '@/modules/auth/pages/UnauthorizedPage'
import VentaTactilPage from '@/modules/ventas/pages/VentaTactilPage'
import VentasDiaPage from '@/modules/ventas/pages/VentasDiaPage'
// import DashboardDuenoPage from '@/modules/dueno/pages/DashboardDuenoPage'
import GestionMenuPage from '@/modules/menu/pages/GestionMenuPage'
import GestionInventarioPage from '@/modules/inventario/pages/GestionInventarioPage'
import CierreCajaPage from '@/modules/contabilidad/pages/CierreCajaPage'
import ResumenContabilidadPage from '@/modules/contabilidad/pages/ResumenContabilidadPage'
import DuenoLayout from '@/app/layouts/DuenoLayout'
import DuenoAvanzadoLayout from '@/app/layouts/DuenoAvanzadoLayout'
import CajeroLayout from '@/app/layouts/CajeroLayout'
import NominaPage from '@/modules/nomina/pages/NominaPage'
import ReportesPage from '@/modules/reportes/pages/ReportesPage'
import { AuditoriaPage } from '@/modules/auditoria'
import { DashboardPage } from '@/modules/dashboard'
import { MesasPage } from '@/modules/mesas'
import { CreditosPage } from '@/modules/creditos/pages/CreditosPage'
import { ComprasPage } from '@/modules/compras'
import { ConfiguracionPage } from '@/modules/configuracion'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Rutas del Cajero */}
      <Route path="/cajero" element={
        <ProtectedRoute allowedRoles={['CAJERO', 'ADMIN']}>
          <CajeroLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="venta" replace />} />
        <Route path="venta" element={<VentaTactilPage />} />
      </Route>
      
      {/* Rutas del Dueño - Menú Rápido */}
      <Route path="/dueno" element={
        <ProtectedRoute allowedRoles={['DUENO', 'ADMIN']}>
          <DuenoLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="ventas-dia" element={<VentasDiaPage />} />
      </Route>
      
      {/* Rutas del Dueño - Menú Avanzado */}
      <Route path="/dueno/avanzado" element={
        <ProtectedRoute allowedRoles={['DUENO', 'ADMIN']}>
          <DuenoAvanzadoLayout />
        </ProtectedRoute>
      }>
        <Route index element={<div className="page-placeholder">Menú Avanzado</div>} />
        <Route path="menu" element={<GestionMenuPage />} />
        <Route path="inventario" element={<GestionInventarioPage />} />
        <Route path="compras" element={<ComprasPage />} />
        <Route path="nomina" element={<NominaPage />} />
        <Route path="contabilidad" element={<ResumenContabilidadPage />} />
        <Route path="cierre-caja" element={<CierreCajaPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        <Route path="mesas" element={<MesasPage />} />
        <Route path="creditos" element={<CreditosPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
        <Route path="auditoria" element={<AuditoriaPage />} />
      </Route>
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter
