import { formatearMoneda } from '../../../shared/utils/formatters'

interface ModalTicketProps {
  venta: any
  onCerrar: () => void
}

const ModalTicket = ({ venta, onCerrar }: ModalTicketProps) => {
  const handleImprimir = () => {
    window.print()
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-HN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content modal-ticket" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✅ Venta Completada</h2>
          <button onClick={onCerrar} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          <div className="ticket" id="ticket-print">
            <div className="ticket-header">
              <h3>🍽️ Restaurante Doña Lola</h3>
              <p>Sistema de Punto de Venta</p>
              <p className="ticket-divider">═══════════════════</p>
            </div>

            <div className="ticket-info">
              <p><strong>Ticket #:</strong> {venta.id}</p>
              <p><strong>Fecha:</strong> {formatFecha(venta.fecha)}</p>
              <p><strong>Cajero:</strong> {venta.cajero || 'N/A'}</p>
              <p className="ticket-divider">───────────────────</p>
            </div>

            <div className="ticket-items">
              {venta.detalles?.map((item: any, idx: number) => (
                <div key={idx} className="ticket-item">
                  <div className="item-descripcion">
                    <span>{item.cantidad}x {item.nombre || `Producto ${item.platoId}`}</span>
                  </div>
                  <div className="item-precio">
                    <span>{formatearMoneda(item.subtotal)}</span>
                  </div>
                </div>
              ))}
              <p className="ticket-divider">───────────────────</p>
            </div>

            <div className="ticket-totales">
              <div className="ticket-total">
                <span>Subtotal:</span>
                <span>{formatearMoneda(venta.subtotal)}</span>
              </div>
              {venta.impuestos > 0 && (
                <div className="ticket-total">
                  <span>Impuestos:</span>
                  <span>{formatearMoneda(venta.impuestos)}</span>
                </div>
              )}
              {venta.propina > 0 && (
                <div className="ticket-total">
                  <span>Propina:</span>
                  <span>{formatearMoneda(venta.propina)}</span>
                </div>
              )}
              <p className="ticket-divider">═══════════════════</p>
              <div className="ticket-total ticket-total-final">
                <span>TOTAL:</span>
                <span>{formatearMoneda(venta.total)}</span>
              </div>
            </div>

            <div className="ticket-footer">
              <p><strong>Método de Pago:</strong> {venta.metodoPago}</p>
              <p className="ticket-divider">═══════════════════</p>
              <p className="ticket-gracias">¡Gracias por su compra!</p>
              <p className="ticket-gracias">Vuelva pronto</p>
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={handleImprimir} className="btn-secondary btn-large">
              🖨️ Imprimir
            </button>
            <button onClick={onCerrar} className="btn-primary btn-large">
              Nueva Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalTicket
