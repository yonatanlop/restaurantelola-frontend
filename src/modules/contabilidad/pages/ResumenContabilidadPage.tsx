import { useEffect, useState } from 'react'
import { obtenerResumenCaja } from '@/modules/contabilidad/services/contabilidadApi'
import { ResumenCaja } from '@/shared/types/contabilidad'
import { formatCurrency } from '@/shared/utils/formatCurrency'

const defaultInicio = () => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

const defaultFin = () => new Date().toISOString()

const ResumenContabilidadPage = () => {
  const [inicio, setInicio] = useState(defaultInicio())
  const [fin, setFin] = useState(defaultFin())
  const [resumen, setResumen] = useState<ResumenCaja | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarResumen = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await obtenerResumenCaja(inicio, fin)
      setResumen(data)
    } catch (err) {
      console.error(err)
      setError('No se pudo obtener el resumen de caja')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarResumen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    cargarResumen()
  }

  return (
    <div className="resumen-contabilidad-page">
      <div className="page-header">
        <div>
          <h2>📊 Resumen de caja</h2>
          <p className="page-subtitle">Consulta ingresos y egresos en un periodo</p>
        </div>
      </div>

      <form className="filtros-periodo" onSubmit={handleSubmit}>
        <label>
          Inicio
          <input
            type="datetime-local"
            value={inicio.slice(0, 16)}
            onChange={(e) => {
              const value = e.target.value
              setInicio(value ? new Date(value).toISOString() : defaultInicio())
            }}
          />
        </label>
        <label>
          Fin
          <input
            type="datetime-local"
            value={fin.slice(0, 16)}
            onChange={(e) => {
              const value = e.target.value
              setFin(value ? new Date(value).toISOString() : defaultFin())
            }}
          />
        </label>
        <button className="btn-primary btn" type="submit" disabled={loading}>
          Consultar
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Calculando resumen...</div>
      ) : resumen ? (
        <>
          <div className="resumen-grid">
            <div className="resumen-card">
              <p>Total ingresos</p>
              <strong>{formatCurrency(resumen.totalIngresos)}</strong>
            </div>
            <div className="resumen-card">
              <p>Total egresos</p>
              <strong>{formatCurrency(resumen.totalEgresos)}</strong>
            </div>
            <div className="resumen-card">
              <p>Saldo periodo</p>
              <strong>{formatCurrency(resumen.saldo)}</strong>
            </div>
            <div className="resumen-card">
              <p>Movimientos</p>
              <strong>{resumen.cantidadMovimientos}</strong>
            </div>
          </div>

          <div className="desglose-grid">
            <div className="section-card">
              <h3>Ingresos</h3>
              <div className="detalle-linea">
                <span>Ventas</span>
                <strong>{formatCurrency(resumen.ingresosVentas)}</strong>
              </div>
            </div>
            <div className="section-card">
              <h3>Egresos</h3>
              <div className="detalle-linea">
                <span>Compras</span>
                <strong>{formatCurrency(resumen.egresosCompras)}</strong>
              </div>
              <div className="detalle-linea">
                <span>Nómina</span>
                <strong>{formatCurrency(resumen.egresosNomina)}</strong>
              </div>
              <div className="detalle-linea">
                <span>Otros</span>
                <strong>{formatCurrency(resumen.egresosOtros)}</strong>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Sin datos para el periodo</h3>
          <p>Ajusta las fechas y vuelve a intentar</p>
        </div>
      )}
    </div>
  )
}

export default ResumenContabilidadPage

