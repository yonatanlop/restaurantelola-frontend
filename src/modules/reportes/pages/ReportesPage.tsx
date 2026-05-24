import { useState } from 'react'
import { generarReporteExcel, generarReportePdf } from '@/modules/reportes/services/reportesApi'

const today = new Date().toISOString().slice(0, 10)

const ReportesPage = () => {
  const [inicio, setInicio] = useState(today)
  const [fin, setFin] = useState(today)
  const [tipo, setTipo] = useState<'VENTAS' | 'COMPRAS' | 'CAJA'>('VENTAS')
  const [descargando, setDescargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validarFechas = () => {
    if (new Date(inicio) > new Date(fin)) {
      setError('La fecha de inicio no puede ser mayor que la de fin')
      return false
    }
    return true
  }

  const descargar = async (formato: 'excel' | 'pdf') => {
    if (!validarFechas()) {
      return
    }

    setDescargando(true)
    setError(null)

    try {
      if (formato === 'excel') {
        await generarReporteExcel(tipo, inicio, fin)
      } else {
        await generarReportePdf(tipo, inicio, fin)
      }
    } catch (err: any) {
      console.error(err)
      if (err?.response?.status === 400) {
        setError('Error en los parámetros. Verifica que las fechas sean válidas.')
      } else if (err?.response?.status === 404) {
        setError('El tipo de reporte seleccionado no está disponible aún.')
      } else {
        setError('No se pudo generar el reporte. Intenta de nuevo.')
      }
    } finally {
      setDescargando(false)
    }
  }

  return (
    <div className="reportes-page">
      <div className="page-header">
        <div>
          <h2>📈 Reportes</h2>
          <p className="page-subtitle">Descarga reportes en Excel o PDF por periodo</p>
        </div>
      </div>

      <div className="reportes-form">
        <label>
          Tipo de reporte
          <select value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
            <option value="VENTAS">Ventas</option>
            <option value="COMPRAS">Compras</option>
            <option value="CAJA">Contabilidad / Caja</option>
          </select>
        </label>

        <label>
          Fecha inicio
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        </label>

        <label>
          Fecha fin
          <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
        </label>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="reportes-actions">
        <button className="btn-primary btn" onClick={() => descargar('excel')} disabled={descargando}>
          ⬇️ Descargar Excel
        </button>
        <button className="btn-secondary btn" onClick={() => descargar('pdf')} disabled={descargando}>
          🖨️ Generar PDF
        </button>
      </div>

      <div className="reportes-nota">
        <p>
          Los reportes incluyen detalle de movimientos y totales en el periodo seleccionado. La descarga puede
          tardar algunos segundos dependiendo de la cantidad de datos.
        </p>
      </div>
    </div>
  )
}

export default ReportesPage

