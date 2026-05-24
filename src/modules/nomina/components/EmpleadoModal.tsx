import { useEffect, useState } from 'react'
import { Empleado, EmpleadoPayload } from '@/shared/types/nomina'

interface EmpleadoModalProps {
  isOpen: boolean
  empleado: Empleado | null
  onClose: () => void
  onSubmit: (payload: EmpleadoPayload) => Promise<void> | void
}

const puestosSugeridos = [
  'Cocinero/a',
  'Ayudante de Cocina',
  'Mesero/a',
  'Cajero/a',
  'Limpieza',
  'Gerente',
  'Supervisor'
]

const EmpleadoModal = ({ isOpen, empleado, onClose, onSubmit }: EmpleadoModalProps) => {
  const hoy = new Date().toISOString().split('T')[0]

  const [formState, setFormState] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    direccion: '',
    puesto: puestosSugeridos[0],
    salarioDiario: '',
    fechaIngreso: hoy
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (empleado) {
      setFormState({
        nombre: empleado.nombre || '',
        apellido: empleado.apellido || '',
        documento: empleado.documento || '',
        telefono: empleado.telefono || '',
        direccion: empleado.direccion || '',
        puesto: empleado.puesto || puestosSugeridos[0],
        salarioDiario: empleado.salarioDiario?.toString() ?? '',
        fechaIngreso: empleado.fechaIngreso ?? hoy
      })
    } else {
      setFormState({
        nombre: '',
        apellido: '',
        documento: '',
        telefono: '',
        direccion: '',
        puesto: puestosSugeridos[0],
        salarioDiario: '',
        fechaIngreso: hoy
      })
    }
    setError(null)
  }, [empleado, hoy, isOpen])

  if (!isOpen) {
    return null
  }

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formState.nombre.trim() || !formState.apellido.trim()) {
      setError('Nombre y apellido son obligatorios')
      return
    }

    const salario = parseFloat(formState.salarioDiario)
    if (Number.isNaN(salario) || salario <= 0) {
      setError('El salario diario debe ser mayor a 0')
      return
    }

    if (!formState.fechaIngreso) {
      setError('La fecha de ingreso es obligatoria')
      return
    }

    setSubmitting(true)
    try {
      const payload: EmpleadoPayload = {
        nombre: formState.nombre.trim(),
        apellido: formState.apellido.trim(),
        documento: formState.documento.trim() || undefined,
        telefono: formState.telefono.trim() || undefined,
        direccion: formState.direccion.trim() || undefined,
        puesto: formState.puesto.trim() || undefined,
        salarioDiario: salario,
        fechaIngreso: formState.fechaIngreso
      }

      await onSubmit(payload)
      onClose()
    } catch (err) {
      console.error(err)
      setError('No fue posible guardar el empleado. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{empleado ? '✏️ Editar empleado' : '➕ Nuevo empleado'}</h2>
          <button className="modal-close" onClick={onClose}>
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
                type="text"
                value={formState.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Nombre"
              />
            </div>

            <div className="form-group">
              <label>Apellido *</label>
              <input
                className="input-field input-touch"
                type="text"
                value={formState.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
                placeholder="Apellido"
              />
            </div>

            <div className="form-group">
              <label>Documento</label>
              <input
                className="input-field input-touch"
                type="text"
                value={formState.documento}
                onChange={(e) => handleChange('documento', e.target.value)}
                placeholder="001-000000-0000"
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                className="input-field input-touch"
                type="tel"
                value={formState.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="9999-9999"
              />
            </div>

            <div className="form-group form-group-full">
              <label>Dirección</label>
              <textarea
                className="input-field input-touch textarea-touch"
                value={formState.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                rows={3}
                placeholder="Ej: Barrio Centro, Calle Principal"
              />
            </div>

            <div className="form-group">
              <label>Puesto</label>
              <select
                className="input-field input-touch"
                value={formState.puesto}
                onChange={(e) => handleChange('puesto', e.target.value)}
              >
                {puestosSugeridos.map((puesto) => (
                  <option key={puesto} value={puesto}>
                    {puesto}
                  </option>
                ))}
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Salario diario (L) *</label>
              <input
                className="input-field input-touch"
                type="number"
                min="0"
                step="0.01"
                value={formState.salarioDiario}
                onChange={(e) => handleChange('salarioDiario', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Fecha de ingreso *</label>
              <input
                className="input-field input-touch"
                type="date"
                value={formState.fechaIngreso}
                onChange={(e) => handleChange('fechaIngreso', e.target.value)}
                max={hoy}
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary btn" onClick={onClose} disabled={submitting}>
            Cancelar
          </button>
          <button className="btn-primary btn" onClick={handleSubmit} disabled={submitting}>
            {empleado ? 'Guardar cambios' : 'Crear empleado'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmpleadoModal

