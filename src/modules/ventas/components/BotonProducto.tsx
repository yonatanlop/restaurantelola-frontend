import { formatearMoneda } from '../../../shared/utils/formatters'
import { useState } from 'react'

interface BotonProductoProps {
  nombre: string
  precio: number
  onClick: (nombre: string, precio: number) => void
}

const BotonProducto = ({ nombre, precio, onClick }: BotonProductoProps) => {
  const [procesando, setProcesando] = useState(false)

  const handleClick = async () => {
    // Prevenir doble clic
    if (procesando) return
    
    setProcesando(true)
    onClick(nombre, precio)
    
    // Desbloquear después de 300ms
    setTimeout(() => {
      setProcesando(false)
    }, 300)
  }

  return (
    <button
      className="btn-producto"
      onClick={handleClick}
      disabled={procesando}
      style={{ opacity: procesando ? 0.6 : 1 }}
    >
      <div className="producto-nombre">{nombre}</div>
      <div className="producto-precio">{formatearMoneda(precio)}</div>
    </button>
  )
}

export default BotonProducto
