import { useCallback, useEffect, useState } from 'react'
import { obtenerVentasDelDia } from '../services/ventasApi'
import { formatearMoneda } from '@/shared/utils/formatters'

interface VentaDetalle {
  id: number
  platoId: number
  nombre?: string
  cantidad: number
  precioUnitario: number
  subtotal: number
  notas?: string
}

interface Venta {
  id: number
  fecha: string
  total: number
  metodoPago: string
  cajero: string
  detalles?: VentaDetalle[]
}

const INTERVALO_REFRESCO_MS = 30_000

const VentasDiaPage = () => {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null)

  const cargarVentas = useCallback(async () => {
    setLoading(true)
    try {
      const data = await obtenerVentasDelDia()
      setVentas(data)
      setUltimaActualizacion(new Date())
    } catch (error) {
      console.error('Error al cargar ventas:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarVentas()
    const intervalo = setInterval(cargarVentas, INTERVALO_REFRESCO_MS)
    return () => clearInterval(intervalo)
  }, [cargarVentas])

  const totalDia = ventas.reduce((sum, v) => sum + (v.total || 0), 0)

  const obtenerProductosVendidos = (venta: Venta): string => {
    if (!venta.detalles || venta.detalles.length === 0) {
      return 'Sin productos'
    }
    return venta.detalles
      .map((detalle) => {
        const nombre = detalle.nombre || `Plato #${detalle.platoId}`
        const cantidad = detalle.cantidad > 1 ? ` (${detalle.cantidad}x)` : ''
        return `${nombre}${cantidad}`
      })
      .join(', ')
  }

  return (
    <div className="ventas-dia-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>Ventas del Día</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {ultimaActualizacion && (
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Actualizado: {ultimaActualizacion.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={cargarVentas}
            disabled={loading}
            style={{ padding: '0.4rem 0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </div>
      <div className="total-dia">
        <h3>Total: {formatearMoneda(totalDia)}</h3>
      </div>
      
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="ventas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hora</th>
                <th>Productos Vendidos</th>
                <th>Total</th>
                <th>Método Pago</th>
                <th>Cajero</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay ventas registradas para hoy
                  </td>
                </tr>
              ) : (
                ventas.map((venta) => (
                  <tr key={venta.id}>
                    <td>{venta.id}</td>
                    <td>{new Date(venta.fecha).toLocaleTimeString()}</td>
                    <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                      {obtenerProductosVendidos(venta)}
                    </td>
                    <td>{formatearMoneda(Number(venta.total || 0))}</td>
                    <td>{venta.metodoPago}</td>
                    <td>{venta.cajero}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default VentasDiaPage
