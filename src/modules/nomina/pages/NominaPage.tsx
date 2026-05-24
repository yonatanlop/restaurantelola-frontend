import { useEffect, useMemo, useState } from 'react'
import {
  actualizarEmpleado,
  cambiarEstadoEmpleado,
  crearEmpleado,
  eliminarEmpleado,
  obtenerEmpleados
} from '@/modules/nomina/services/nominaApi'
import {
  calcularTotalDia,
  eliminarRegistroNomina,
  marcarComoPagado,
  marcarMultiplesComoPagado,
  obtenerNominaPorFecha,
  registrarAsistencia
} from '@/modules/nomina/services/nominaDiariaApi'
import { useAuth } from '@/app/providers/AuthProvider'
import { Empleado, EmpleadoPayload, RegistroNomina } from '@/shared/types/nomina'
import EmpleadoModal from '@/modules/nomina/components/EmpleadoModal'
import RegistrarAsistenciaModal from '@/modules/nomina/components/RegistrarAsistenciaModal'
import { formatCurrency } from '@/shared/utils/formatCurrency'

type FiltroEmpleados = 'TODOS' | 'ACTIVOS' | 'INACTIVOS'

const NominaPage = () => {
  const { usuario } = useAuth()
  const fechaHoy = new Date().toISOString().split('T')[0]

  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loadingEmpleados, setLoadingEmpleados] = useState(false)
  const [filtroEmpleados, setFiltroEmpleados] = useState<FiltroEmpleados>('ACTIVOS')
  const [mostrarEmpleadoModal, setMostrarEmpleadoModal] = useState(false)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)
  const [accionEmpleadoId, setAccionEmpleadoId] = useState<number | null>(null)

  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaHoy)
  const [nominaDia, setNominaDia] = useState<RegistroNomina[]>([])
  const [loadingNomina, setLoadingNomina] = useState(false)
  const [totalProgramado, setTotalProgramado] = useState(0)
  const [seleccionNomina, setSeleccionNomina] = useState<Set<number>>(new Set())
  const [mostrarAsistenciaModal, setMostrarAsistenciaModal] = useState(false)

  const [alerta, setAlerta] = useState<{ tipo: 'success' | 'error'; mensaje: string } | null>(null)

  useEffect(() => {
    cargarEmpleados()
  }, [])

  useEffect(() => {
    cargarNomina()
  }, [fechaSeleccionada])

  useEffect(() => {
    if (!alerta) return
    const timeout = setTimeout(() => setAlerta(null), 4000)
    return () => clearTimeout(timeout)
  }, [alerta])

  useEffect(() => {
    setSeleccionNomina(new Set())
  }, [nominaDia])

  const empleadosActivos = useMemo(
    () => empleados.filter((empleado) => empleado.activo),
    [empleados]
  )

  const empleadosFiltrados = useMemo(() => {
    switch (filtroEmpleados) {
      case 'ACTIVOS':
        return empleados.filter((empleado) => empleado.activo)
      case 'INACTIVOS':
        return empleados.filter((empleado) => !empleado.activo)
      default:
        return empleados
    }
  }, [empleados, filtroEmpleados])

  const totalPagado = useMemo(
    () =>
      nominaDia
        .filter((registro) => registro.estado === 'PAGADO')
        .reduce((acc, registro) => acc + Number(registro.monto ?? 0), 0),
    [nominaDia]
  )

  const totalPendiente = Math.max(totalProgramado - totalPagado, 0)

  const mostrarMensaje = (tipo: 'success' | 'error', mensaje: string) => {
    setAlerta({ tipo, mensaje })
  }

  const cargarEmpleados = async () => {
    setLoadingEmpleados(true)
    try {
      const data = await obtenerEmpleados()
      setEmpleados(data)
    } catch (error) {
      console.error(error)
      mostrarMensaje('error', 'No se pudieron cargar los empleados')
    } finally {
      setLoadingEmpleados(false)
    }
  }

  const cargarNomina = async () => {
    setLoadingNomina(true)
    try {
      const [registros, total] = await Promise.all([
        obtenerNominaPorFecha(fechaSeleccionada),
        calcularTotalDia(fechaSeleccionada)
      ])
      setNominaDia(registros)
      setTotalProgramado(total)
    } catch (error) {
      console.error(error)
      mostrarMensaje('error', 'No se pudo obtener la nómina del día')
    } finally {
      setLoadingNomina(false)
    }
  }

  const abrirModalEmpleado = (empleado?: Empleado) => {
    setEmpleadoSeleccionado(empleado ?? null)
    setMostrarEmpleadoModal(true)
  }

  const cerrarModalEmpleado = () => {
    setMostrarEmpleadoModal(false)
    setEmpleadoSeleccionado(null)
  }

  const handleGuardarEmpleado = async (payload: EmpleadoPayload) => {
    try {
      if (empleadoSeleccionado) {
        await actualizarEmpleado(empleadoSeleccionado.id, payload)
        mostrarMensaje('success', 'Empleado actualizado correctamente')
      } else {
        await crearEmpleado(payload)
        mostrarMensaje('success', 'Empleado creado correctamente')
      }
      await cargarEmpleados()
    } catch (error: unknown) {
      console.error(error)
      mostrarMensaje('error', 'No fue posible guardar el empleado')
      throw error
    }
  }

  const handleCambiarEstado = async (empleado: Empleado) => {
    const confirmar = window.confirm(
      `¿Deseas ${empleado.activo ? 'desactivar' : 'activar'} a ${empleado.nombre}?`
    )
    if (!confirmar) return

    setAccionEmpleadoId(empleado.id)
    try {
      await cambiarEstadoEmpleado(empleado.id, !empleado.activo)
      await cargarEmpleados()
      mostrarMensaje(
        'success',
        `Empleado ${empleado.activo ? 'desactivado' : 'activado'} correctamente`
      )
    } catch (error) {
      console.error(error)
      mostrarMensaje('error', 'No se pudo actualizar el estado del empleado')
    } finally {
      setAccionEmpleadoId(null)
    }
  }

  const handleEliminarEmpleado = async (empleado: Empleado) => {
    const confirmar = window.confirm(`¿Eliminar a ${empleado.nombre}? Esta acción no se puede deshacer.`)
    if (!confirmar) return

    setAccionEmpleadoId(empleado.id)
    try {
      await eliminarEmpleado(empleado.id)
      await cargarEmpleados()
      mostrarMensaje('success', 'Empleado eliminado')
    } catch (error) {
      console.error(error)
      mostrarMensaje('error', 'No se pudo eliminar el empleado')
    } finally {
      setAccionEmpleadoId(null)
    }
  }

  const handleRegistrarAsistencia = async (empleadosIds: number[], notas: string, pagarInmediatamente: boolean) => {
    if (!usuario?.id) {
      mostrarMensaje('error', 'No se pudo identificar al usuario actual')
      return
    }

    try {
      const registros = await registrarAsistencia({
        fecha: fechaSeleccionada,
        empleadosIds,
        notas,
        registradoPor: usuario.id
      })

      if (pagarInmediatamente) {
        const pendientes = registros
          .filter((registro) => registro.estado !== 'PAGADO')
          .map((registro) => registro.id)

        if (pendientes.length > 0) {
          await marcarMultiplesComoPagado(pendientes, usuario.id)
          mostrarMensaje('success', 'Asistencia registrada y pagos aplicados')
        } else {
          mostrarMensaje('success', 'Asistencia registrada (ya estaba pagada)')
        }
      } else {
        mostrarMensaje('success', 'Asistencia registrada correctamente')
      }

      await cargarNomina()
    } catch (error) {
      console.error(error)
      mostrarMensaje('error', 'No se pudo registrar la asistencia')
    }
  }

  const toggleSeleccionNomina = (id: number, deshabilitado: boolean) => {
    if (deshabilitado) return
    setSeleccionNomina((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handlePagoIndividual = async (registro: RegistroNomina) => {
    if (registro.estado === 'PAGADO') return
    if (!usuario?.id) {
      mostrarMensaje('error', 'No se pudo identificar al usuario actual')
      return
    }

    try {
      await marcarComoPagado(registro.id, usuario.id)
      mostrarMensaje('success', 'Pago registrado correctamente')
      await cargarNomina()
    } catch (error) {
      console.error(error)
      mostrarMensaje('error', 'No se pudo registrar el pago')
    }
  }

  const handlePagoSeleccionados = async () => {
    if (seleccionNomina.size === 0) {
      mostrarMensaje('error', 'Selecciona al menos un registro pendiente')
      return
    }

    if (!usuario?.id) {
      mostrarMensaje('error', 'No se pudo identificar al usuario actual')
      return
    }

    try {
      await marcarMultiplesComoPagado(Array.from(seleccionNomina), usuario.id)
      mostrarMensaje('success', 'Pagos registrados correctamente')
      await cargarNomina()
    } catch (error) {
      console.error(error)
      mostrarMensaje('error', 'No se pudieron registrar los pagos seleccionados')
    }
  }

  const handleEliminarRegistro = async (registro: RegistroNomina) => {
    const confirmar = window.confirm(
      `¿Eliminar el registro de ${registro.empleadoNombre ?? 'empleado'} del ${registro.fecha}?`
    )
    if (!confirmar) return

    try {
      await eliminarRegistroNomina(registro.id)
      mostrarMensaje('success', 'Registro eliminado')
      await cargarNomina()
    } catch (error) {
      console.error(error)
      mostrarMensaje('error', 'No se pudo eliminar el registro')
    }
  }

  return (
    <div className="nomina-page">
      <div className="page-header">
        <div>
          <h2>👥 Gestión de nómina diaria</h2>
          <p className="page-subtitle">
            Administra tu personal y registra los pagos diarios de forma táctil
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-primary btn" onClick={() => abrirModalEmpleado()}>
            ➕ Nuevo empleado
          </button>
          <button
            className="btn-secondary btn"
            onClick={() => setMostrarAsistenciaModal(true)}
            disabled={empleadosActivos.length === 0}
          >
            🗓️ Registrar asistencia
          </button>
        </div>
      </div>

      {alerta && (
        <div className={`alert ${alerta.tipo === 'success' ? 'alert-success' : 'alert-error'}`}>
          {alerta.mensaje}
        </div>
      )}

      <div className="nomina-grid">
        <section className="section-card">
          <div className="section-header">
            <div>
              <h3>Personal</h3>
              <p>Registra, actualiza o desactiva empleados</p>
            </div>
            <div className="filtros">
              <button
                className={`filtro-btn ${filtroEmpleados === 'TODOS' ? 'active' : ''}`}
                onClick={() => setFiltroEmpleados('TODOS')}
              >
                Todos ({empleados.length})
              </button>
              <button
                className={`filtro-btn ${filtroEmpleados === 'ACTIVOS' ? 'active' : ''}`}
                onClick={() => setFiltroEmpleados('ACTIVOS')}
              >
                Activos ({empleadosActivos.length})
              </button>
              <button
                className={`filtro-btn ${filtroEmpleados === 'INACTIVOS' ? 'active' : ''}`}
                onClick={() => setFiltroEmpleados('INACTIVOS')}
              >
                Inactivos ({empleados.length - empleadosActivos.length})
              </button>
            </div>
          </div>

          {loadingEmpleados ? (
            <div className="loading-state">Cargando empleados...</div>
          ) : empleadosFiltrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No hay registros</h3>
              <p>Agrega tu primer empleado para comenzar</p>
              <button className="btn-primary btn" onClick={() => abrirModalEmpleado()}>
                ➕ Crear empleado
              </button>
            </div>
          ) : (
            <div className="empleados-grid">
              {empleadosFiltrados.map((empleado) => (
                <div
                  key={empleado.id}
                  className={`empleado-card ${empleado.activo ? '' : 'inactivo'}`}
                >
                  <div className="empleado-card-header">
                    <div>
                      <h4>{empleado.nombreCompleto ?? `${empleado.nombre} ${empleado.apellido}`}</h4>
                      <p>{empleado.puesto ?? 'Sin puesto asignado'}</p>
                    </div>
                    <span className={`badge ${empleado.activo ? 'badge-success' : 'badge-danger'}`}>
                      {empleado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="empleado-info">
                    <p>
                      💰 Salario diario:{' '}
                      <strong>{formatCurrency(Number(empleado.salarioDiario ?? 0))}</strong>
                    </p>
                    <p>📅 Ingreso: {empleado.fechaIngreso}</p>
                    {empleado.telefono && <p>📞 {empleado.telefono}</p>}
                  </div>

                  <div className="empleado-actions">
                    <button className="btn btn-light" onClick={() => abrirModalEmpleado(empleado)}>
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleCambiarEstado(empleado)}
                      disabled={accionEmpleadoId === empleado.id}
                    >
                      {empleado.activo ? '🚫 Desactivar' : '✅ Activar'}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleEliminarEmpleado(empleado)}
                      disabled={accionEmpleadoId === empleado.id}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <h3>Pago diario</h3>
              <p>Registra asistencia, marca pagos y consulta el resumen del día</p>
            </div>
            <div className="filtros fecha-filtro">
              <label>Fecha</label>
              <input
                type="date"
                className="input-field"
                value={fechaSeleccionada}
                max={fechaHoy}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
              />
            </div>
          </div>

          <div className="resumen-nomina">
            <div className="resumen-card">
              <p>Total programado</p>
              <strong>{formatCurrency(totalProgramado)}</strong>
            </div>
            <div className="resumen-card">
              <p>Pagado</p>
              <strong>{formatCurrency(totalPagado)}</strong>
            </div>
            <div className="resumen-card">
              <p>Pendiente</p>
              <strong>{formatCurrency(totalPendiente)}</strong>
            </div>
          </div>

          <div className="acciones-nomina">
            <button
              className="btn-primary btn"
              onClick={() => handlePagoSeleccionados()}
              disabled={seleccionNomina.size === 0}
            >
              💸 Pagar seleccionados ({seleccionNomina.size})
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setMostrarAsistenciaModal(true)}
              disabled={empleadosActivos.length === 0}
            >
              ➕ Registrar asistencia
            </button>
          </div>

          {loadingNomina ? (
            <div className="loading-state">Cargando nómina...</div>
          ) : nominaDia.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗓️</div>
              <h3>Sin registros en esta fecha</h3>
              <p>Registra asistencia para generar los pagos</p>
              <button
                className="btn-primary btn"
                onClick={() => setMostrarAsistenciaModal(true)}
                disabled={empleadosActivos.length === 0}
              >
                Registrar asistencia
              </button>
            </div>
          ) : (
            <div className="tabla-responsive">
              <table className="table nomina-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Empleado</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Notas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {nominaDia.map((registro) => {
                    const esPagado = registro.estado === 'PAGADO'
                    const seleccionado = seleccionNomina.has(registro.id)
                    return (
                      <tr key={registro.id} className={esPagado ? 'pagado' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={seleccionado}
                            disabled={esPagado}
                            onChange={() => toggleSeleccionNomina(registro.id, esPagado)}
                          />
                        </td>
                        <td>
                          <div className="empleado-info-tabla">
                            <strong>{registro.empleadoNombre}</strong>
                            <p>{registro.empleadoPuesto ?? ''}</p>
                          </div>
                        </td>
                        <td>{formatCurrency(Number(registro.monto ?? 0))}</td>
                        <td>
                          <span className={`badge ${esPagado ? 'badge-success' : 'badge-warning'}`}>
                            {registro.estado}
                          </span>
                        </td>
                        <td>{registro.notas ?? '—'}</td>
                        <td className="acciones-tabla">
                          <button
                            className="btn btn-light"
                            onClick={() => handlePagoIndividual(registro)}
                            disabled={esPagado}
                          >
                            💵 Pagar
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleEliminarRegistro(registro)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <EmpleadoModal
        isOpen={mostrarEmpleadoModal}
        empleado={empleadoSeleccionado}
        onClose={cerrarModalEmpleado}
        onSubmit={handleGuardarEmpleado}
      />

      <RegistrarAsistenciaModal
        isOpen={mostrarAsistenciaModal}
        empleados={empleadosActivos}
        fecha={fechaSeleccionada}
        onClose={() => setMostrarAsistenciaModal(false)}
        onSubmit={handleRegistrarAsistencia}
      />
    </div>
  )
}

export default NominaPage

