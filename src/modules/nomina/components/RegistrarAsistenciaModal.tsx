import { useEffect, useMemo, useState } from 'react'
import { Empleado } from '@/shared/types/nomina'
import { formatCurrency } from '@/shared/utils/formatCurrency'

interface RegistrarAsistenciaModalProps {
  isOpen: boolean
  empleados: Empleado[]
  fecha: string
  onClose: () => void
  onSubmit: (empleadosIds: number[], notas: string, pagarInmediatamente: boolean) => Promise<void> | void
}

const RegistrarAsistenciaModal = ({
  isOpen,
  empleados = [],
  fecha,
  onClose,
  onSubmit
}: RegistrarAsistenciaModalProps) => {
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set())
  const [notas, setNotas] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [pagarInmediatamente, setPagarInmediatamente] = useState(true)
  const listaEmpleados = Array.isArray(empleados) ? empleados : []
  const totalSeleccionados = useMemo(() => seleccionados.size, [seleccionados])

  useEffect(() => {
    if (isOpen) {
      const ids = listaEmpleados.map((empleado) => empleado.id)
      setSeleccionados(new Set(ids))
      setNotas('')
      setError(null)
      setPagarInmediatamente(true)
    }
  }, [listaEmpleados, isOpen])

  if (!isOpen) {
    return null
  }

  const toggleEmpleado = (id: number) => {
    setSeleccionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const seleccionarTodos = () => {
    setSeleccionados(new Set(listaEmpleados.map((empleado) => empleado.id)))
  }

  const limpiarSeleccion = () => {
    setSeleccionados(new Set())
  }

  const handleSubmit = async () => {
    if (seleccionados.size === 0) {
      setError('Selecciona al menos un empleado')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(Array.from(seleccionados), notas.trim(), pagarInmediatamente)
      onClose()
    } catch (err) {
      console.error(err)
      setError('No fue posible registrar la asistencia. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>🗓️ Registrar asistencia</h2>
            <p className="modal-subtitle">Fecha seleccionada: {fecha}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="asistencia-actions">
            <button className="btn-secondary btn" onClick={seleccionarTodos} type="button">
              Seleccionar todos ({listaEmpleados.length})
            </button>
            <button className="btn btn-light" onClick={limpiarSeleccion} type="button">
              Limpiar
            </button>
            <span className="seleccionados-resumen">Seleccionados: {totalSeleccionados}</span>
          </div>

          <div className="asistencia-lista">
            {listaEmpleados.length === 0 ? (
              <p>No hay empleados activos disponibles.</p>
            ) : (
              listaEmpleados.map((empleado) => (
                <label key={empleado.id} className="asistencia-item">
                  <input
                    type="checkbox"
                    checked={seleccionados.has(empleado.id)}
                    onChange={() => toggleEmpleado(empleado.id)}
                  />
                  <div>
                    <strong>{empleado.nombreCompleto ?? `${empleado.nombre} ${empleado.apellido}`}</strong>
                    <p>{empleado.puesto ?? 'Sin puesto asignado'}</p>
                  </div>
                  <span className="badge badge-info">
                    {formatCurrency(Number(empleado.salarioDiario ?? 0))}
                  </span>
                </label>
              ))
            )}
          </div>

          <div className="form-group">
            <label>Notas (opcional)</label>
            <textarea
              className="input-field input-touch textarea-touch"
              rows={3}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: turnos adicionales, apoyo en evento, etc."
            />
          </div>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={pagarInmediatamente}
              onChange={(e) => setPagarInmediatamente(e.target.checked)}
            />
            <div>
              <strong>Marcar como pagado inmediatamente</strong>
              <p>Se registrará el egreso de nómina en cuanto guardes la asistencia.</p>
            </div>
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary btn" onClick={onClose} disabled={submitting}>
            Cancelar
          </button>
          <button className="btn-primary btn" onClick={handleSubmit} disabled={submitting || listaEmpleados.length === 0}>
            Registrar asistencia
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegistrarAsistenciaModal

