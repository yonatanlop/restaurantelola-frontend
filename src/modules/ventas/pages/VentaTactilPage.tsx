import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import BotonProducto from '../components/BotonProducto'
import CarritoVenta from '../components/CarritoVenta'
import ModalMetodoPago from '../components/ModalMetodoPago'
import ModalTicket from '../components/ModalTicket'
import useVentaTactil from '../hooks/useVentaTactil'
import { obtenerPlatosActivos } from '../services/ventasApi'
import { BotonAbrirCaja } from '@/shared/components/BotonAbrirCaja'

interface Plato {
  id: number
  nombre: string
  precio: number
  categoria: string
  tipoComida: string
}

interface ItemCarrito {
  platoId: number
  nombre: string
  precio: number
  cantidad: number
  subtotal: number
}

const VentaTactilPage = () => {
  const { usuario } = useAuth()
  const { crearVenta, loading } = useVentaTactil()
  const [platos, setPlatos] = useState<Plato[]>([])
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODOS')
  const [mostrarModalPago, setMostrarModalPago] = useState(false)
  const [mostrarTicket, setMostrarTicket] = useState(false)
  const [ventaCompletada, setVentaCompletada] = useState<any>(null)

  useEffect(() => {
    cargarPlatos()
  }, [])

  const cargarPlatos = async () => {
    try {
      const data = await obtenerPlatosActivos()
      setPlatos(data)
    } catch (error) {
      console.error('Error al cargar platos:', error)
    }
  }

  const agregarAlCarrito = (plato: Plato) => {
    const itemExistente = carrito.find(item => item.platoId === plato.id)
    
    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.platoId === plato.id
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio }
          : item
      ))
    } else {
      setCarrito([...carrito, {
        platoId: plato.id,
        nombre: plato.nombre,
        precio: plato.precio,
        cantidad: 1,
        subtotal: plato.precio
      }])
    }
  }

  const actualizarCantidad = (platoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(platoId)
    } else {
      setCarrito(carrito.map(item =>
        item.platoId === platoId
          ? { ...item, cantidad, subtotal: cantidad * item.precio }
          : item
      ))
    }
  }

  const eliminarDelCarrito = (platoId: number) => {
    setCarrito(carrito.filter(item => item.platoId !== platoId))
  }

  const calcularTotal = () => {
    return carrito.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const handleProcesarVenta = () => {
    if (carrito.length === 0) return
    setMostrarModalPago(true)
  }

  const handleConfirmarVenta = async (metodoPago: string, clienteId?: number) => {
    try {
      const ventaData = {
        usuarioId: usuario?.id,
        subtotal: calcularTotal(),
        impuestos: 0,
        propina: 0,
        total: calcularTotal(),
        metodoPago,
        detalles: carrito.map(item => ({
          platoId: item.platoId,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.subtotal
        }))
      }

      const venta = await crearVenta(ventaData)
      
      // Si es venta a crédito, registrar el crédito
      if (metodoPago === 'CREDITO' && clienteId) {
        await registrarCredito(venta.id, clienteId, calcularTotal())
      }
      
      setVentaCompletada(venta)
      setMostrarModalPago(false)
      setMostrarTicket(true)
      setCarrito([])
    } catch (error) {
      console.error('Error al procesar venta:', error)
      alert('Error al procesar la venta. Intente nuevamente.')
    }
  }

  const registrarCredito = async (ventaId: number, clienteId: number, valorPedido: number) => {
    try {
      const { creditosApi } = await import('@/modules/creditos/services/creditosApi')
      await creditosApi.registrarCredito({
        clienteId,
        ventaId,
        valorPedido,
        descripcion: `Venta #${ventaId} - ${carrito.length} producto(s)`,
        notas: carrito.map(item => `${item.cantidad}x ${item.nombre}`).join(', '),
        usuarioRegistroId: usuario?.id || 1
      })
    } catch (error) {
      console.error('Error al registrar crédito:', error)
      // No bloqueamos la venta si falla el registro del crédito
      alert('Venta registrada, pero hubo un error al registrar el crédito. Verifique en el módulo de créditos.')
    }
  }

  const platosFiltrados = categoriaFiltro === 'TODOS'
    ? platos
    : platos.filter(p => p.tipoComida === categoriaFiltro)

  const categorias = ['TODOS', 'DESAYUNO', 'ALMUERZO', 'BEBIDA', 'POSTRE']

  return (
    <div className="venta-tactil-page">
      <div className="productos-section">
        <div className="categorias-tabs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`categoria-tab ${categoriaFiltro === cat ? 'active' : ''}`}
              >
                {cat === 'TODOS' ? '🍽️ Todos' : 
                 cat === 'DESAYUNO' ? '🍳 Desayunos' :
                 cat === 'ALMUERZO' ? '🍛 Almuerzos' :
                 cat === 'BEBIDA' ? '🥤 Bebidas' : '🍰 Postres'}
              </button>
            ))}
          </div>
          <div style={{ flexShrink: 0, marginLeft: '1rem' }}>
            <BotonAbrirCaja size="small" variant="secondary" />
          </div>
        </div>

        <div className="productos-grid">
          {platosFiltrados.length === 0 ? (
            <div className="no-productos">
              <p>No hay productos disponibles</p>
              <p className="text-muted">Contacte al administrador</p>
            </div>
          ) : (
            platosFiltrados.map(plato => (
              <BotonProducto
                key={plato.id}
                nombre={plato.nombre}
                precio={plato.precio}
                onClick={() => agregarAlCarrito(plato)}
              />
            ))
          )}
        </div>
      </div>

      <CarritoVenta
        items={carrito}
        total={calcularTotal()}
        onActualizarCantidad={actualizarCantidad}
        onEliminar={eliminarDelCarrito}
        onProcesarVenta={handleProcesarVenta}
        loading={loading}
      />

      <ModalMetodoPago
        total={calcularTotal()}
        onConfirmar={handleConfirmarVenta}
        onCancelar={() => setMostrarModalPago(false)}
        mostrarModal={mostrarModalPago}
        carrito={carrito}
        loading={loading}
      />

      {mostrarTicket && ventaCompletada && (
        <ModalTicket
          venta={ventaCompletada}
          onCerrar={() => setMostrarTicket(false)}
        />
      )}
    </div>
  )
}

export default VentaTactilPage
