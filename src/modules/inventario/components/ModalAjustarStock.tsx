import { useState } from 'react'
import { Insumo } from '@/shared/types/inventario'

interface ModalAjustarStockProps {
  isOpen: boolean
  insumo: Insumo
  onGuardar: (cantidad: number, motivo: string) => Promise<void> | void
  onCancelar: () => void
}

const numberFormatter = new Intl.NumberFormat('es-HN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3
})

const ModalAjustarStock = ({ isOpen, insumo, onGuardar, onCancelar }: ModalAjustarStockProps) => {
  const [tipoMovimiento, setTipoMovimiento] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA')
  const [cantidad, setCantidad] = useState('')
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) {
    return null
  }

  const handleGuardar = async () => {
    const cantidadNumero = parseFloat(cantidad)
    if (Number.isNaN(cantidadNumero) || cantidadNumero <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }
    if (!motivo.trim()) {
      setError('El motivo es obligatorio')
      return
    }

    setSubmitting(true)
    try {
      const cantidadFinal = tipoMovimiento === 'SALIDA' ? -cantidadNumero : cantidadNumero
      await onGuardar(cantidadFinal, motivo.trim())
    } catch (err) {
      console.error(err)
      setError('No fue posible registrar el ajuste')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>⚖️ Ajustar stock</h2>
            <p className="modal-subtitle">{insumo.nombre}</p>
          </div>
          <button className="modal-close" onClick={onCancelar}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="ajuste-resumen">
            <div>
              <p className="label">Cantidad actual</p>
              <strong>{numberFormatter.format(insumo.cantidadActual)} {insumo.unidadMedida}</strong>
            </div>
            <div>
              <p className="label">Mínimo</p>
              <strong>{numberFormatter.format(insumo.cantidadMinima)} {insumo.unidadMedida}</strong>
            </div>
          </div>

          <div className="form-group">
            <label>Tipo de movimiento</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${tipoMovimiento === 'ENTRADA' ? 'active' : ''}`}
                onClick={() => setTipoMovimiento('ENTRADA')}
              >
                ➕ Entrada
              </button>
              <button
                type="button"
                className={`toggle-btn ${tipoMovimiento === 'SALIDA' ? 'active' : ''}`}
                onClick={() => setTipoMovimiento('SALIDA')}
              >
                ➖ Salida
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Cantidad ({insumo.unidadMedida})</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field input-touch"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Motivo</label>
            <textarea
              className="input-field input-touch textarea-touch"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: ajuste inicial, merma, inventario físico..."
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary btn" onClick={onCancelar} disabled={submitting}>
            Cancelar
          </button>
          <button className="btn-primary btn" onClick={handleGuardar} disabled={submitting}>
            Registrar ajuste
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalAjustarStock

