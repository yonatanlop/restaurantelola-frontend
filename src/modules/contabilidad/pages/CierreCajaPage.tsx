import { useEffect, useMemo, useState } from 'react'
import Card from '@/shared/components/Card'
import Button from '@/shared/components/Button'
import { useAuth } from '@/app/providers/AuthProvider'
import {
  obtenerEstadoCierre,
  obtenerHistorial,
  iniciarCierre,
  cerrarCierre,
  type CierreCajaDetalle,
  type CierreCajaEstado,
} from '../services/cierreCajaApi'
import { formatearMoneda } from '@/shared/utils/formatters'

const DENOMINACIONES = ['100000', '50000', '20000', '10000', '5000', '2000', '1000', '500', '200', '100', '50']

const buildArqueoInicial = () =>
  DENOMINACIONES.reduce<Record<string, number>>((acc, denom) => {
    acc[denom] = 0
    return acc
  }, {})

const hoyISO = () => new Date().toISOString().split('T')[0]

const CierreCajaPage = () => {
  const { usuario } = useAuth()
  const [estado, setEstado] = useState<CierreCajaEstado | null>(null)
  const [historial, setHistorial] = useState<CierreCajaDetalle[]>([])
  const [arqueoDetalle, setArqueoDetalle] = useState<Record<string, number>>(buildArqueoInicial)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formApertura, setFormApertura] = useState({
    fecha: hoyISO(),
    saldoInicial: 0,
  })
  const [formCierre, setFormCierre] = useState({
    efectivoContado: 0,
    tarjetas: 0,
    transferencias: 0,
    otrosMedios: 0,
    observaciones: '',
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [estadoResp, historialResp] = await Promise.all([
        obtenerEstadoCierre(),
        obtenerHistorial(getRangoInicio(), hoyISO()),
      ])
      setEstado(estadoResp)
      setHistorial(historialResp)
      if (estadoResp?.cierreActual) {
        setFormCierre({
          efectivoContado: Number(estadoResp.cierreActual.efectivoContado ?? 0),
          tarjetas: Number(estadoResp.cierreActual.tarjetas ?? 0),
          transferencias: Number(estadoResp.cierreActual.transferencias ?? 0),
          otrosMedios: Number(estadoResp.cierreActual.otrosMedios ?? 0),
          observaciones: '',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const getRangoInicio = () => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split('T')[0]
  }

  const handleApertura = async () => {
    if (!usuario) return
    setSaving(true)
    try {
      await iniciarCierre({
        fecha: formApertura.fecha || undefined,
        saldoInicial: Number(formApertura.saldoInicial ?? 0),
        usuarioId: usuario.id,
        usuarioNombre: usuario.nombre,
      })
      await cargarDatos()
      alert('Cierre de caja iniciado correctamente')
    } catch (error: any) {
      console.error('Error al iniciar cierre:', error)
      const mensaje = error?.response?.data?.message || error?.message || 'Error al iniciar el cierre de caja'
      alert(mensaje)
    } finally {
      setSaving(false)
    }
  }

  const handleCerrar = async () => {
    if (!usuario || !estado?.cierreActual) return
    setSaving(true)
    try {
      const arqueoLimpio = Object.fromEntries(
        Object.entries(arqueoDetalle).filter(([, cantidad]) => cantidad > 0)
      )
      await cerrarCierre(estado.cierreActual.id, {
        usuarioId: usuario.id,
        usuarioNombre: usuario.nombre,
        efectivoContado: Number(formCierre.efectivoContado ?? 0),
        tarjetas: Number(formCierre.tarjetas ?? 0),
        transferencias: Number(formCierre.transferencias ?? 0),
        otrosMedios: Number(formCierre.otrosMedios ?? 0),
        observaciones: formCierre.observaciones,
        arqueoDetalle: arqueoLimpio,
      })
      await cargarDatos()
    } finally {
      setSaving(false)
    }
  }

  const actualizarArqueo = (denom: string, valor: number) => {
    setArqueoDetalle((prev) => ({
      ...prev,
      [denom]: Number.isNaN(valor) ? 0 : valor,
    }))
  }

  const totalArqueo = useMemo(
    () =>
      Object.entries(arqueoDetalle).reduce((acc, [denom, cantidad]) => {
        const monto = parseFloat(denom) * (cantidad ?? 0)
        return acc + (Number.isNaN(monto) ? 0 : monto)
      }, 0),
    [arqueoDetalle]
  )

  const puedeAbrir = !estado?.cierreAbierto
  const puedeCerrar = Boolean(estado?.cierreAbierto && estado?.cierreActual)

  return (
    <div className="cierre-page">
      <div>
        <h2>📮 Cierre de Caja Diario</h2>
        <p>Solo el dueño puede abrir o finalizar el cierre del día. Revisa los indicadores y alertas.</p>
      </div>

      <div className="cierre-grid">
        <Card title="Estado del día" className="cierre-card">
          {loading && <p>Cargando información...</p>}
          {!loading && estado?.cierreActual && (
            <div className="cierre-stats">
              <div className="cierre-stat">
                <span>Saldo esperado</span>
                <strong>{formatearMoneda(estado.cierreActual.saldoEsperado ?? 0)}</strong>
              </div>
              <div className="cierre-stat">
                <span>Total contado</span>
                <strong>{formatearMoneda(estado.cierreActual.totalContado ?? 0)}</strong>
              </div>
              <div className="cierre-stat">
                <span>Diferencia</span>
                <strong
                  style={{ color: (estado.cierreActual.diferencia ?? 0) === 0 ? '#10b981' : '#ef4444' }}
                >
                  {formatearMoneda(estado.cierreActual.diferencia ?? 0)}
                </strong>
              </div>
            </div>
          )}
          {!loading && !estado?.cierreActual && (
            <p>No hay cierre abierto para hoy. Puedes iniciar uno nuevo.</p>
          )}
        </Card>

        <Card title="Alertas">
          <div className="alerta-lista">
            {estado?.alertas?.length
              ? estado.alertas.map((alerta) => (
                  <div
                    key={alerta.codigo + alerta.mensaje}
                    className="alerta-item"
                    data-severidad={alerta.severidad}
                  >
                    <strong>{alerta.mensaje}</strong>
                    {alerta.fechaReferencia && (
                      <span>Referencia: {new Date(alerta.fechaReferencia).toLocaleDateString()}</span>
                    )}
                    {alerta.fechaVenta && (
                      <span>Última venta: {new Date(alerta.fechaVenta).toLocaleString()}</span>
                    )}
                  </div>
                ))
              : (
                <p>Sin alertas pendientes 🎉</p>
                )}
          </div>
        </Card>
      </div>

      {puedeAbrir && (
        <Card title="Iniciar cierre del día">
          <div className="form-grid">
            <div className="form-field">
              <label>Fecha</label>
              <input
                type="date"
                value={formApertura.fecha}
                onChange={(e) => setFormApertura((prev) => ({ ...prev, fecha: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>Saldo inicial (efectivo en caja)</label>
              <input
                type="number"
                step="0.01"
                value={formApertura.saldoInicial}
                onChange={(e) =>
                  setFormApertura((prev) => ({ ...prev, saldoInicial: Number(e.target.value) }))
                }
              />
            </div>
          </div>
          <Button onClick={handleApertura} disabled={saving || !usuario}>
            {saving ? 'Guardando...' : 'Abrir cierre'}
          </Button>
        </Card>
      )}

      {puedeCerrar && estado?.cierreActual && (
        <>
          <Card title="Registrar conteo físico">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                Los valores de crédito, transferencias y efectivo se actualizan automáticamente con las ventas del día
              </p>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={cargarDatos}
                disabled={loading}
              >
                🔄 Actualizar
              </Button>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label>Efectivo contado</label>
                <input
                  type="number"
                  step="0.01"
                  value={formCierre.efectivoContado}
                  onChange={(e) =>
                    setFormCierre((prev) => ({ ...prev, efectivoContado: Number(e.target.value) }))
                  }
                />
              </div>
              <div className="form-field">
                <label>Crédito (del día)</label>
                <input
                  type="text"
                  value={formatearMoneda(formCierre.tarjetas)}
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-field">
                <label>Transferencias (del día)</label>
                <input
                  type="text"
                  value={formatearMoneda(formCierre.transferencias)}
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-field">
                <label>Efectivo (ventas del día)</label>
                <input
                  type="text"
                  value={formatearMoneda(formCierre.otrosMedios)}
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Observaciones</label>
                <textarea
                  rows={3}
                  value={formCierre.observaciones}
                  onChange={(e) =>
                    setFormCierre((prev) => ({ ...prev, observaciones: e.target.value }))
                  }
                />
              </div>
            </div>
          </Card>

          <Card title={`Detalle de arqueo (Total: ${formatearMoneda(totalArqueo)})`}>
            <div className="arqueo-grid">
              {DENOMINACIONES.map((denom) => (
                <div key={denom} className="arqueo-field">
                  <span>{formatearMoneda(Number(denom))}</span>
                  <input
                    type="number"
                    min={0}
                    value={arqueoDetalle[denom]}
                    onChange={(e) => actualizarArqueo(denom, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Button onClick={handleCerrar} disabled={saving}>
                {saving ? 'Guardando...' : 'Cerrar caja'}
              </Button>
            </div>
          </Card>
        </>
      )}

      <Card title="Historial de cierres (últimos 7 días)">
        {historial.length === 0 ? (
          <p>No hay cierres registrados en el rango.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Saldo esperado</th>
                  <th>Total contado</th>
                  <th>Diferencia</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.fecha).toLocaleDateString()}</td>
                    <td>{item.estado}</td>
                    <td>{formatearMoneda(item.saldoEsperado ?? 0)}</td>
                    <td>{formatearMoneda(item.totalContado ?? 0)}</td>
                    <td>{formatearMoneda(item.diferencia ?? 0)}</td>
                    <td>{item.usuarioNombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default CierreCajaPage

