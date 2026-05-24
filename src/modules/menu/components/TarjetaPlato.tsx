import { formatearMoneda } from '../../../shared/utils/formatters'

interface Plato {
  id: number
  nombre: string
  descripcion: string
  precio: number
  tipoComida: string
  activo: boolean
}

interface TarjetaPlatoProps {
  plato: Plato
  onEditar: (plato: Plato) => void
  onCambiarEstado: (id: number, activo: boolean) => void
}

const TarjetaPlato = ({ plato, onEditar, onCambiarEstado }: TarjetaPlatoProps) => {
  const getIconoCategoria = (tipo: string) => {
    switch (tipo) {
      case 'DESAYUNO': return '🍳'
      case 'ALMUERZO': return '🍛'
      case 'BEBIDA': return '🥤'
      case 'POSTRE': return '🍰'
      default: return '🍽️'
    }
  }

  const getNombreCategoria = (tipo: string) => {
    switch (tipo) {
      case 'DESAYUNO': return 'Desayuno'
      case 'ALMUERZO': return 'Almuerzo'
      case 'BEBIDA': return 'Bebida'
      case 'POSTRE': return 'Postre'
      default: return 'Otro'
    }
  }

  return (
    <div className={`tarjeta-plato ${!plato.activo ? 'inactivo' : ''}`}>
      <div className="tarjeta-header">
        <span className="categoria-badge">
          {getIconoCategoria(plato.tipoComida)} {getNombreCategoria(plato.tipoComida)}
        </span>
        <span className={`estado-badge ${plato.activo ? 'activo' : 'inactivo'}`}>
          {plato.activo ? '✓ Activo' : '✕ Inactivo'}
        </span>
      </div>

      <div className="tarjeta-body">
        <h3 className="plato-nombre">{plato.nombre}</h3>
        <p className="plato-descripcion">{plato.descripcion || 'Sin descripción'}</p>
        <div className="plato-precio">{formatearMoneda(plato.precio)}</div>
      </div>

      <div className="tarjeta-actions">
        <button
          onClick={() => onEditar(plato)}
          className="btn-action btn-editar"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => onCambiarEstado(plato.id, !plato.activo)}
          className={`btn-action ${plato.activo ? 'btn-desactivar' : 'btn-activar'}`}
        >
          {plato.activo ? '🚫 Desactivar' : '✓ Activar'}
        </button>
      </div>
    </div>
  )
}

export default TarjetaPlato
