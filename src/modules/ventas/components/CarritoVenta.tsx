import { formatearMoneda } from '../../../shared/utils/formatters'
import { useState } from 'react'

interface ItemCarrito {
  platoId: number
  nombre: string
  precio: number
  cantidad: number
  subtotal: number
}

interface CarritoVentaProps {
  items: ItemCarrito[]
  total: number
  onActualizarCantidad: (platoId: number, cantidad: number) => void
  onEliminar: (platoId: number) => void
  onProcesarVenta: () => void
  loading: boolean
}

const CarritoVenta = ({
  items,
  total,
  onActualizarCantidad,
  onEliminar,
  onProcesarVenta,
  loading
}: CarritoVentaProps) => {
  const [procesandoVenta, setProcesandoVenta] = useState(false)

  const handleProcesarVenta = () => {
    // Prevenir doble clic
    if (procesandoVenta || loading) return
    
    setProcesandoVenta(true)
    onProcesarVenta()
    
    // Desbloquear después de 500ms
    setTimeout(() => {
      setProcesandoVenta(false)
    }, 500)
  }

  return (
    <div className="carrito-venta">
      <div className="carrito-header">
        <h2>🛒 Carrito</h2>
        <span className="items-count">{items.length} items</span>
      </div>

      <div className="carrito-items">
        {items.length === 0 ? (
          <div className="carrito-vacio">
            <p>🛒</p>
            <p>Carrito vacío</p>
            <p className="text-muted">Selecciona productos para comenzar</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.platoId} className="carrito-item">
              <div className="item-info">
                <div>
                  <h4>{item.nombre}</h4>
                  <p className="item-precio">{formatearMoneda(item.precio)}</p>
                </div>
              </div>
              
              <div className="item-controls">
                <div className="item-cantidad">
                  <button
                    onClick={() => onActualizarCantidad(item.platoId, item.cantidad - 1)}
                    className="btn-cantidad"
                  >
                    −
                  </button>
                  <span className="cantidad-valor">{item.cantidad}</span>
                  <button
                    onClick={() => onActualizarCantidad(item.platoId, item.cantidad + 1)}
                    className="btn-cantidad"
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  <p>{formatearMoneda(item.subtotal)}</p>
                  <button
                    onClick={() => onEliminar(item.platoId)}
                    className="btn-eliminar"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="carrito-footer">
        <div className="total-section">
          <span className="total-label">TOTAL:</span>
          <span className="total-valor">{formatearMoneda(total)}</span>
        </div>
        
        <button
          onClick={handleProcesarVenta}
          disabled={loading || items.length === 0 || procesandoVenta}
          className="btn-procesar-venta"
        >
          {loading || procesandoVenta ? 'Procesando...' : '💳 Procesar Venta'}
        </button>
        
        <button
          onClick={() => {
            import('../../../shared/services/cajaRegistradoraApi').then(api => {
              api.abrirCajon().then(resultado => {
                if (!resultado.exito) {
                  alert(`No se pudo abrir el cajón:\n${resultado.mensaje}`)
                }
              }).catch(() => {
                alert('Error al comunicarse con la caja registradora')
              })
            })
          }}
          className="btn-abrir-caja"
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
          title="Abrir cajón de caja registradora"
        >
          🔓 Abrir Caja
        </button>
      </div>
    </div>
  )
}

export default CarritoVenta
