import { useState, useEffect } from 'react'
import { creditosApi } from '@/modules/creditos/services/creditosApi'
import { Cliente } from '@/modules/creditos/types/creditos.types'
import { ModalNuevoClienteRapido } from './ModalNuevoClienteRapido'
import { formatearMoneda } from '../../../shared/utils/formatters'

interface ModalMetodoPagoProps {
  total: number
  onConfirmar: (metodoPago: string, clienteId?: number) => void
  onCancelar: () => void
  mostrarModal: boolean
  carrito: any[]
  loading?: boolean
}

const ModalMetodoPago = ({ total, onConfirmar, onCancelar, mostrarModal, carrito, loading }: ModalMetodoPagoProps) => {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string>('EFECTIVO')
  const [montoRecibido, setMontoRecibido] = useState<string>('')
  const [mostrarTeclado, setMostrarTeclado] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null)
  const [cargandoClientes, setCargandoClientes] = useState(false)
  const [busquedaCliente, setBusquedaCliente] = useState('')
  const [mostrarModalNuevoCliente, setMostrarModalNuevoCliente] = useState(false)
  const [procesandoConfirmacion, setProcesandoConfirmacion] = useState(false)

  const metodosPago = [
    { id: 'EFECTIVO', nombre: 'Efectivo', icono: '💵' },
    { id: 'CREDITO', nombre: 'Crédito', icono: '💳' },
    { id: 'TRANSFERENCIA', nombre: 'Transferencia', icono: '📱' }
  ]

  const montoRecibidoNum = montoRecibido ? parseFloat(montoRecibido) : 0
  const cambio = metodoSeleccionado === 'EFECTIVO' && montoRecibidoNum > 0
    ? montoRecibidoNum - total
    : 0

  const puedeConfirmar = 
    (metodoSeleccionado === 'EFECTIVO' && montoRecibidoNum > 0 && montoRecibidoNum >= total) ||
    (metodoSeleccionado === 'CREDITO' && clienteSeleccionado !== null) ||
    (metodoSeleccionado === 'TRANSFERENCIA')

  useEffect(() => {
    if (metodoSeleccionado === 'EFECTIVO') {
      setMontoRecibido('')
      setMostrarTeclado(true)
      setClienteSeleccionado(null)
    } else if (metodoSeleccionado === 'CREDITO') {
      setMontoRecibido('')
      setMostrarTeclado(false)
      cargarClientes()
    } else {
      setMontoRecibido('')
      setMostrarTeclado(false)
      setClienteSeleccionado(null)
    }
  }, [metodoSeleccionado])

  const cargarClientes = async () => {
    try {
      setCargandoClientes(true)
      const data = await creditosApi.obtenerClientes()
      setClientes(data)
    } catch (error) {
      console.error('Error al cargar clientes:', error)
      alert('Error al cargar la lista de clientes')
    } finally {
      setCargandoClientes(false)
    }
  }

  const agregarDigito = (digito: string) => {
    if (montoRecibido === '0' && digito !== '.') {
      setMontoRecibido(digito)
    } else if (digito === '.' && montoRecibido.includes('.')) {
      return
    } else {
      setMontoRecibido(montoRecibido + digito)
    }
  }

  const borrarUltimo = () => {
    setMontoRecibido(montoRecibido.slice(0, -1))
  }

  const borrarTodo = () => {
    setMontoRecibido('')
  }

  const establecerMontoExacto = () => {
    setMontoRecibido(total.toFixed(2))
  }

  const numeros = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', '⌫']
  ]

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    (cliente.telefono && cliente.telefono.includes(busquedaCliente))
  )

  const handleConfirmar = () => {
    // Prevenir doble clic
    if (procesandoConfirmacion) return
    
    setProcesandoConfirmacion(true)
    
    if (metodoSeleccionado === 'CREDITO' && clienteSeleccionado) {
      onConfirmar(metodoSeleccionado, clienteSeleccionado)
    } else {
      onConfirmar(metodoSeleccionado)
    }
    
    // Desbloquear después de 1 segundo
    setTimeout(() => {
      setProcesandoConfirmacion(false)
    }, 1000)
  }

  return (
    <>
      <div className="panel-pago">
        <div className="panel-pago-header">
          <h2>💳 Procesar Venta</h2>
        </div>

        {!mostrarModal || carrito.length === 0 ? (
          <div className="panel-pago-vacio">
            <p>💳</p>
            <p>Esperando venta</p>
            <p className="text-muted">Haz clic en "Procesar Venta" para continuar</p>
          </div>
        ) : (
          <>
            <div className="panel-pago-body">
              <div className="total-pago">
                <span>Total a pagar:</span>
                <span className="total-valor">{formatearMoneda(total)}</span>
              </div>

              <div className="metodos-pago-grid">
                {metodosPago.map(metodo => (
                  <button
                    key={metodo.id}
                    onClick={() => setMetodoSeleccionado(metodo.id)}
                    className={`metodo-pago-btn ${metodoSeleccionado === metodo.id ? 'selected' : ''}`}
                  >
                    <span className="metodo-icono">{metodo.icono}</span>
                    <span className="metodo-nombre">{metodo.nombre}</span>
                    {metodoSeleccionado === metodo.id && <span className="check-icon">✓</span>}
                  </button>
                ))}
              </div>

              {metodoSeleccionado === 'EFECTIVO' && (
                <div className="pago-efectivo-section">
                  <div className="monto-recibido-group">
                    <label>Monto recibido:</label>
                    <div className="monto-input-container">
                      <input
                        type="text"
                        className="monto-input"
                        value={montoRecibido ? formatearMoneda(parseFloat(montoRecibido)) : '$0'}
                        readOnly
                        placeholder="$0"
                        onClick={() => setMostrarTeclado(true)}
                      />
                      <button
                        type="button"
                        className="btn-teclado-toggle"
                        onClick={() => setMostrarTeclado(!mostrarTeclado)}
                      >
                        ⌨️
                      </button>
                    </div>
                  </div>

                  {cambio > 0 && (
                    <div className="cambio-display">
                      <span>Cambio a dar:</span>
                      <span className="cambio-valor">{formatearMoneda(cambio)}</span>
                    </div>
                  )}

                  {cambio < 0 && (
                    <div className="error-cambio">
                      ⚠️ El monto recibido es menor al total
                    </div>
                  )}

                  {mostrarTeclado && (
                    <div className="teclado-numerico">
                      <div className="teclado-numeros">
                        {numeros.flat().map((num, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`btn-teclado ${num === '⌫' ? 'btn-borrar' : ''}`}
                            onClick={() => num === '⌫' ? borrarUltimo() : agregarDigito(num)}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-teclado btn-borrar"
                        onClick={borrarTodo}
                        style={{ marginTop: '0.5rem' }}
                      >
                        Limpiar
                      </button>
                      <button
                        type="button"
                        className="btn-teclado btn-total"
                        onClick={establecerMontoExacto}
                      >
                        Total: {formatearMoneda(total)}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {metodoSeleccionado === 'CREDITO' && (
                <div className="pago-credito-section">
                  <div className="header-clientes">
                    <h3>Seleccionar Cliente</h3>
                    <button 
                      type="button"
                      onClick={() => setMostrarModalNuevoCliente(true)}
                      className="btn-nuevo-cliente-rapido"
                    >
                      + Nuevo
                    </button>
                  </div>
                  
                  <div className="busqueda-cliente">
                    <input
                      type="text"
                      placeholder="🔍 Buscar cliente..."
                      value={busquedaCliente}
                      onChange={(e) => setBusquedaCliente(e.target.value)}
                      className="input-busqueda"
                    />
                  </div>

                  {cargandoClientes ? (
                    <div className="loading-clientes">Cargando clientes...</div>
                  ) : (
                    <div className="lista-clientes-credito">
                      {clientesFiltrados.length === 0 ? (
                        <div className="no-clientes">
                          {busquedaCliente ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                        </div>
                      ) : (
                        clientesFiltrados.map(cliente => (
                          <div
                            key={cliente.id}
                            className={`cliente-item ${clienteSeleccionado === cliente.id ? 'selected' : ''}`}
                            onClick={() => setClienteSeleccionado(cliente.id)}
                          >
                            <div className="cliente-info">
                              <div className="cliente-nombre">{cliente.nombre}</div>
                              {cliente.telefono && (
                                <div className="cliente-telefono">📞 {cliente.telefono}</div>
                              )}
                              <div className="cliente-deuda-info">
                                Deuda: <strong>{formatearMoneda(cliente.deudaTotal)}</strong>
                                {cliente.creditosPendientes > 0 && (
                                  <span className="badge-pendientes">
                                    {cliente.creditosPendientes} pend.
                                  </span>
                                )}
                              </div>
                            </div>
                            {clienteSeleccionado === cliente.id && (
                              <span className="check-icon-cliente">✓</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  <div className="info-credito-nuevo">
                    <p>💳 Nueva deuda: <strong>{formatearMoneda(total)}</strong></p>
                    {clienteSeleccionado && (
                      <p>
                        Total después: 
                        <strong> {formatearMoneda((clientes.find(c => c.id === clienteSeleccionado)?.deudaTotal || 0) + total)}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="panel-actions">
              <button onClick={onCancelar} className="btn-secondary">
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                className="btn-primary"
                disabled={!puedeConfirmar || procesandoConfirmacion || loading}
              >
                {procesandoConfirmacion ? 'Procesando...' : (metodoSeleccionado === 'CREDITO' ? 'Registrar' : 'Confirmar')}
              </button>
            </div>
          </>
        )}
      </div>

      {mostrarModalNuevoCliente && (
        <ModalNuevoClienteRapido
          onClose={() => setMostrarModalNuevoCliente(false)}
          onClienteCreado={(clienteId) => {
            setMostrarModalNuevoCliente(false)
            cargarClientes()
            setClienteSeleccionado(clienteId)
          }}
        />
      )}
    </>
  )
}

export default ModalMetodoPago
