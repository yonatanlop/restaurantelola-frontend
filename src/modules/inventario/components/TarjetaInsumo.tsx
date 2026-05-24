import { Insumo } from '@/shared/types/inventario'
import { formatCurrency } from '@/shared/utils/formatCurrency'

interface TarjetaInsumoProps {
  insumo: Insumo
  onEditar: (insumo: Insumo) => void
  onAjustar: (insumo: Insumo) => void
  onEliminar: (insumo: Insumo) => void
}

const numberFormatter = new Intl.NumberFormat('es-HN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3
})

const TarjetaInsumo = ({ insumo, onEditar, onAjustar, onEliminar }: TarjetaInsumoProps) => {
  return (
    <div className={`insumo-card ${insumo.bajoStock ? 'insumo-card-warning' : ''}`}>
      <div className="insumo-card-header">
        <div>
          <h4>{insumo.nombre}</h4>
          <p className="insumo-descripcion">{insumo.descripcion || 'Sin descripción'}</p>
        </div>
        <span className={`badge ${insumo.bajoStock ? 'badge-danger' : 'badge-success'}`}>
          {insumo.bajoStock ? 'Bajo stock' : 'Suficiente'}
        </span>
      </div>

      <div className="insumo-meta">
        <div>
          <p className="label">Unidad</p>
          <strong>{insumo.unidadMedida}</strong>
        </div>
        <div>
          <p className="label">Precio unitario</p>
          <strong>{formatCurrency(insumo.precioUnitario)}</strong>
        </div>
      </div>

      <div className="insumo-stock">
        <div>
          <p className="label">Cantidad actual</p>
          <strong>{numberFormatter.format(insumo.cantidadActual)}</strong>
        </div>
        <div>
          <p className="label">Mínimo</p>
          <strong>{numberFormatter.format(insumo.cantidadMinima)}</strong>
        </div>
      </div>

      <div className="insumo-actions">
        <button className="btn btn-light" onClick={() => onEditar(insumo)}>
          ✏️ Editar
        </button>
        <button className="btn-primary btn" onClick={() => onAjustar(insumo)}>
          ⚖️ Ajustar
        </button>
        <button className="btn btn-danger" onClick={() => onEliminar(insumo)}>
          🗑️ Eliminar
        </button>
      </div>
    </div>
  )
}

export default TarjetaInsumo

