interface FiltrosMenuProps {
  filtroCategoria: string
  filtroEstado: string
  onCambiarCategoria: (categoria: string) => void
  onCambiarEstado: (estado: string) => void
  totalPlatos: number
}

const FiltrosMenu = ({
  filtroCategoria,
  filtroEstado,
  onCambiarCategoria,
  onCambiarEstado,
  totalPlatos
}: FiltrosMenuProps) => {
  const categorias = [
    { id: 'TODOS', nombre: 'Todos', icono: '🍽️' },
    { id: 'DESAYUNO', nombre: 'Desayunos', icono: '🍳' },
    { id: 'ALMUERZO', nombre: 'Almuerzos', icono: '🍛' },
    { id: 'BEBIDA', nombre: 'Bebidas', icono: '🥤' },
    { id: 'POSTRE', nombre: 'Postres', icono: '🍰' }
  ]

  const estados = [
    { id: 'TODOS', nombre: 'Todos' },
    { id: 'ACTIVOS', nombre: 'Activos' },
    { id: 'INACTIVOS', nombre: 'Inactivos' }
  ]

  return (
    <div className="filtros-menu">
      <div className="filtros-section">
        <label className="filtro-label">Categoría:</label>
        <div className="filtros-buttons">
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCambiarCategoria(cat.id)}
              className={`filtro-btn ${filtroCategoria === cat.id ? 'active' : ''}`}
            >
              {cat.icono} {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros-section">
        <label className="filtro-label">Estado:</label>
        <div className="filtros-buttons">
          {estados.map(est => (
            <button
              key={est.id}
              onClick={() => onCambiarEstado(est.id)}
              className={`filtro-btn ${filtroEstado === est.id ? 'active' : ''}`}
            >
              {est.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="filtros-resultado">
        <span className="resultado-badge">{totalPlatos} platos</span>
      </div>
    </div>
  )
}

export default FiltrosMenu
