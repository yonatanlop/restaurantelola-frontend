import { useState, useEffect } from 'react'
import TecladoNumerico from '@/modules/ventas/components/TecladoNumerico'

interface Plato {
  id: number
  nombre: string
  descripcion: string
  precio: number
  tipoComida: string
  activo: boolean
}

interface ModalPlatoProps {
  plato: Plato | null
  onGuardar: (plato: any) => void
  onCancelar: () => void
}

const ModalPlato = ({ plato, onGuardar, onCancelar }: ModalPlatoProps) => {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [tipoComida, setTipoComida] = useState('DESAYUNO')
  const [mostrarTeclado, setMostrarTeclado] = useState(false)

  useEffect(() => {
    if (plato) {
      setNombre(plato.nombre)
      setDescripcion(plato.descripcion || '')
      setPrecio(plato.precio.toString())
      setTipoComida(plato.tipoComida)
    }
  }, [plato])

  const handleTecladoInput = (valor: string) => {
    if (valor === 'C') {
      setPrecio('')
    } else if (valor === '.') {
      if (!precio.includes('.')) {
        setPrecio(precio + '.')
      }
    } else {
      setPrecio(precio + valor)
    }
  }

  const handleGuardar = () => {
    if (!nombre.trim()) {
      alert('El nombre es obligatorio')
      return
    }

    if (!precio || parseFloat(precio) <= 0) {
      alert('El precio debe ser mayor a 0')
      return
    }

    onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: parseFloat(precio),
      tipoComida,
      activo: true
    })
  }

  const categorias = [
    { id: 'DESAYUNO', nombre: 'Desayuno', icono: '🍳' },
    { id: 'ALMUERZO', nombre: 'Almuerzo', icono: '🍛' },
    { id: 'BEBIDA', nombre: 'Bebida', icono: '🥤' },
    { id: 'POSTRE', nombre: 'Postre', icono: '🍰' }
  ]

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content modal-plato" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{plato ? '✏️ Editar Plato' : '➕ Nuevo Plato'}</h2>
          <button onClick={onCancelar} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Nombre del Plato *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Desayuno Típico"
              className="input-field input-touch"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del plato (opcional)"
              className="input-field input-touch textarea-touch"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Categoría *</label>
            <div className="categorias-selector">
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setTipoComida(cat.id)}
                  className={`categoria-btn ${tipoComida === cat.id ? 'selected' : ''}`}
                >
                  <span className="cat-icono">{cat.icono}</span>
                  <span className="cat-nombre">{cat.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Precio (L) *</label>
            <div className="precio-input-container">
              <input
                type="text"
                value={precio}
                onChange={(e) => setPrecio(e.target.value.replace(/[^0-9.]/g, ''))}
                onFocus={() => setMostrarTeclado(true)}
                placeholder="0.00"
                className="input-field input-touch precio-input"
                inputMode="none"
              />
              <button
                onClick={() => setMostrarTeclado(!mostrarTeclado)}
                className="btn-teclado-toggle"
              >
                🔢
              </button>
            </div>
          </div>

          {mostrarTeclado && (
            <div className="teclado-container">
              <TecladoNumerico onInput={handleTecladoInput} />
            </div>
          )}

          <div className="modal-actions">
            <button onClick={onCancelar} className="btn-secondary btn-large">
              Cancelar
            </button>
            <button onClick={handleGuardar} className="btn-primary btn-large">
              {plato ? 'Guardar Cambios' : 'Crear Plato'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalPlato
