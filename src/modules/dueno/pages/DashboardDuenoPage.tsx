import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '@/shared/components/Card'
import { obtenerBajoStock } from '@/modules/inventario/services/inventarioApi'
import { obtenerVentasDelDia } from '@/modules/ventas/services/ventasApi'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { Insumo } from '@/shared/types/inventario'

interface Indicador {
  titulo: string
  valor: string
  icono: string
  color: string
}

const DashboardDuenoPage = () => {
  const [indicadores, setIndicadores] = useState<Indicador[]>([
    { titulo: 'Ventas Hoy', valor: '$0.00', icono: '💰', color: '#10b981' },
    { titulo: 'Ventas del Mes', valor: '$0.00', icono: '📊', color: '#667eea' },
    { titulo: 'Productos Bajo Stock', valor: '0', icono: '⚠️', color: '#f59e0b' },
    { titulo: 'Empleados Activos', valor: '0', icono: '👥', color: '#764ba2' },
  ])

  const [insumosBajoStock, setInsumosBajoStock] = useState<Insumo[]>([])
  const [cargandoAlertas, setCargandoAlertas] = useState(false)

  useEffect(() => {
    const cargarBajoStock = async () => {
      setCargandoAlertas(true)
      try {
        const datos = await obtenerBajoStock()
        setInsumosBajoStock(datos)
        setIndicadores((prev) =>
          prev.map((indicador) =>
            indicador.titulo === 'Productos Bajo Stock'
              ? { ...indicador, valor: String(datos.length) }
              : indicador
          )
        )
      } catch (error) {
        console.error('No se pudieron cargar los productos con bajo stock', error)
      } finally {
        setCargandoAlertas(false)
      }
    }

    cargarBajoStock()

    const cargarVentas = async () => {
      try {
        const ventas = await obtenerVentasDelDia()
        const total = ventas.reduce((sum: number, venta: any) => sum + Number(venta.total ?? 0), 0)
        setIndicadores((prev) =>
          prev.map((indicador) =>
            indicador.titulo === 'Ventas Hoy'
              ? { ...indicador, valor: formatCurrency(total) }
              : indicador
          )
        )
      } catch (error) {
        console.error('No se pudieron cargar las ventas del día', error)
      }
    }

    cargarVentas()
  }, [])

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Panel de Control</h2>
        <p className="dashboard-subtitle">Vista rápida de tu restaurante</p>
      </div>

      <div className="indicadores-grid">
        {indicadores.map((indicador, index) => (
          <Card key={index} className="indicador-card">
            <div className="indicador-content">
              <div className="indicador-icon" style={{ backgroundColor: indicador.color }}>
                {indicador.icono}
              </div>
              <div className="indicador-info">
                <h3 className="indicador-titulo">{indicador.titulo}</h3>
                <p className="indicador-valor">{indicador.valor}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="accesos-rapidos">
        <h3>Accesos Rápidos</h3>
        <div className="accesos-grid">
          <Link to="/dueno/ventas-dia" className="acceso-card">
            <span className="acceso-icon">💰</span>
            <span className="acceso-titulo">Ver Ventas del Día</span>
          </Link>
          
          <Link to="/dueno/avanzado" className="acceso-card acceso-card-advanced">
            <span className="acceso-icon">⚙️</span>
            <span className="acceso-titulo">Menú Avanzado</span>
          </Link>
          
          <Link to="/dueno/avanzado/menu" className="acceso-card">
            <span className="acceso-icon">🍽️</span>
            <span className="acceso-titulo">Gestión de Menú</span>
          </Link>
          
          <Link to="/dueno/avanzado/inventario" className="acceso-card">
            <span className="acceso-icon">📦</span>
            <span className="acceso-titulo">Inventario</span>
          </Link>
          
          <Link to="/dueno/avanzado/nomina" className="acceso-card">
            <span className="acceso-icon">👥</span>
            <span className="acceso-titulo">Nómina</span>
          </Link>
          
          <Link to="/dueno/avanzado/reportes" className="acceso-card">
            <span className="acceso-icon">📈</span>
            <span className="acceso-titulo">Reportes</span>
          </Link>
          
          <Link to="/dueno/avanzado/configuracion" className="acceso-card">
            <span className="acceso-icon">🔧</span>
            <span className="acceso-titulo">Configuración</span>
          </Link>
        </div>
      </div>

      <div className="alertas-section">
        <h3>Alertas y Notificaciones</h3>
        <Card className="alerta-card alerta-warning">
          <div className="alerta-content">
            <span className="alerta-icon">⚠️</span>
            <div>
              <h4>Productos con bajo stock</h4>
              {cargandoAlertas ? (
                <p>Cargando alertas...</p>
              ) : insumosBajoStock.length === 0 ? (
                <p>Todo en orden. No hay insumos críticos.</p>
              ) : (
                <>
                  <p>{insumosBajoStock.length} productos necesitan reabastecimiento</p>
                  <ul className="alerta-lista">
                    {insumosBajoStock.slice(0, 4).map((insumo) => (
                      <li key={insumo.id}>
                        <strong>{insumo.nombre}</strong> · {insumo.cantidadActual} {insumo.unidadMedida}
                      </li>
                    ))}
                    {insumosBajoStock.length > 4 && (
                      <li>+{insumosBajoStock.length - 4} insumos adicionales</li>
                    )}
                  </ul>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardDuenoPage
