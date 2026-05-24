export interface Venta {
  id?: number
  fecha: string
  total: number
  metodoPago: string
  cajero: string
  detalles?: string
}

export interface VentaDetalle {
  productoId: number
  cantidad: number
  precioUnitario: number
  subtotal: number
}
