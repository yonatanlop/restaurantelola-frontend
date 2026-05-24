import { useEffect, useState } from 'react'
import { Insumo, InsumoPayload } from '@/shared/types/inventario'

interface ModalInsumoProps {
  isOpen: boolean
  insumo: Insumo | null
  onGuardar: (payload: InsumoPayload) => Promise<void> | void
  onCancelar: () => void
}

const unidadesDisponibles = ['KG', 'GR', 'L', 'ML', 'UNIDAD', 'PORCION']

const ModalInsumo = ({ isOpen, insumo, onGuardar, onCancelar }: ModalInsumoProps) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidadMedida: 'KG',
    cantidadMinima: '',
    precioUnitario: '',
    cantidadActual: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    if (insumo) {
      setForm({
        nombre: insumo.nombre,
        descripcion: insumo.descripcion ?? '',
        unidadMedida: insumo.unidadMedida,
        cantidadMinima: insumo.cantidadMinima?.toString() ?? '0',
        precioUnitario: insumo.precioUnitario?.toString() ?? '0',
        cantidadActual: insumo.cantidadActual?.toString() ?? ''
      })
    } else {
      setForm({
        nombre: '',
        descripcion: '',
        unidadMedida: 'KG',
        cantidadMinima: '0',
        precioUnitario: '0',
        cantidadActual: ''
      })
    }
    setError(null)
  }, [insumo, isOpen])

  if (!isOpen) {
    return null
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleGuardar = async () => {
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }

    const cantidadMinima = parseFloat(form.cantidadMinima || '0')
    const precioUnitario = parseFloat(form.precioUnitario || '0')
    const cantidadActual = form.cantidadActual ? parseFloat(form.cantidadActual) : undefined

    if (Number.isNaN(cantidadMinima) || cantidadMinima < 0) {
      setError('La cantidad mínima debe ser un número válido')
      return
    }

    if (Number.isNaN(precioUnitario) || precioUnitario < 0) {
      setError('El precio unitario debe ser un número válido')
      return
    }

    if (cantidadActual !== undefined && (Number.isNaN(cantidadActual) || cantidadActual < 0)) {
      setError('La cantidad actual debe ser positiva')
      return
    }

    setSubmitting(true)
    try {
      const payload: InsumoPayload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
        unidadMedida: form.unidadMedida,
        cantidadMinima,
        precioUnitario,
        cantidadActual
      }

      await onGuardar(payload)
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error al guardar el insumo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{insumo ? '✏️ Editar insumo' : '➕ Nuevo insumo'}</h2>
          <button className="modal-close" onClick={onCancelar}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="modal-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                className="input-field input-touch"
                value={form.nombre}
                onChange={(e) => updateField('nombre', e.target.value)}
                placeholder="Ej: Tomate"
              />
            </div>

            <div className="form-group">
              <label>Unidad de medida *</label>
              <select
                className="input-field input-touch"
                value={form.unidadMedida}
                onChange={(e) => updateField('unidadMedida', e.target.value)}
              >
                {unidadesDisponibles.map((unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cantidad mínima *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field input-touch"
                value={form.cantidadMinima}
                onChange={(e) => updateField('cantidadMinima', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Precio unitario (L) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field input-touch"
                value={form.precioUnitario}
                onChange={(e) => updateField('precioUnitario', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Cantidad actual</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field input-touch"
                value={form.cantidadActual}
                onChange={(e) => updateField('cantidadActual', e.target.value)}
                placeholder="Opcional"
              />
            </div>

            <div className="form-group form-group-full">
              <label>Descripción</label>
              <textarea
                className="input-field input-touch textarea-touch"
                rows={3}
                value={form.descripcion}
                onChange={(e) => updateField('descripcion', e.target.value)}
                placeholder="Notas sobre proveedor, presentación, etc."
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary btn" onClick={onCancelar} disabled={submitting}>
            Cancelar
          </button>
          <button className="btn-primary btn" onClick={handleGuardar} disabled={submitting}>
            {insumo ? 'Guardar cambios' : 'Crear insumo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalInsumo

