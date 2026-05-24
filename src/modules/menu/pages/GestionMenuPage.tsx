import { useState, useEffect } from 'react'
import { obtenerPlatos, crearPlato, actualizarPlato, cambiarEstadoPlato } from '../services/menuApi'
import TarjetaPlato from '../components/TarjetaPlato'
import ModalPlato from '../components/ModalPlato'
import FiltrosMenu from '../components/FiltrosMenu'

interface Plato {
  id: number
  nombre: string
  descripcion: string
  precio: number
  tipoComida: string
  activo: boolean
  categoriaId?: number
}

const GestionMenuPage = () => {
  const [platos, setPlatos] = useState<Plato[]>([])
  const [platosFiltrados, setPlatosFiltrados] = useState<Plato[]>([])
  const [loading, setLoading] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [platoEditar, setPlatoEditar] = useState<Plato | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState('TODOS')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  useEffect(() => {
    cargarPlatos()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [platos, filtroCategoria, filtroEstado])

  const cargarPlatos = async () => {
    setLoading(true)
    try {
      const data = await obtenerPlatos()
      setPlatos(data)
    } catch (error) {
      console.error('Error al cargar platos:', error)
      alert('Error al cargar el menú')
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    let resultado = [...platos]

    if (filtroCategoria !== 'TODOS') {
      resultado = resultado.filter(p => p.tipoComida === filtroCategoria)
    }

    if (filtroEstado === 'ACTIVOS') {
      resultado = resultado.filter(p => p.activo)
    } else if (filtroEstado === 'INACTIVOS') {
      resultado = resultado.filter(p => !p.activo)
    }

    setPlatosFiltrados(resultado)
  }

  const handleNuevoPlato = () => {
    setPlatoEditar(null)
    setMostrarModal(true)
  }

  const handleEditarPlato = (plato: Plato) => {
    setPlatoEditar(plato)
    setMostrarModal(true)
  }

  const handleGuardarPlato = async (platoData: any) => {
    try {
      if (platoEditar) {
        await actualizarPlato(platoEditar.id, platoData)
      } else {
        await crearPlato(platoData)
      }
      await cargarPlatos()
      setMostrarModal(false)
    } catch (error) {
      console.error('Error al guardar plato:', error)
      alert('Error al guardar el plato')
    }
  }

  const handleCambiarEstado = async (id: number, activo: boolean) => {
    try {
      await cambiarEstadoPlato(id, activo)
      await cargarPlatos()
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      alert('Error al cambiar el estado del plato')
    }
  }

  return (
    <div className="gestion-menu-page">
      <div className="page-header">
        <div>
          <h2>🍽️ Gestión de Menú</h2>
          <p className="page-subtitle">Administra los platos y precios del restaurante</p>
        </div>
        <button onClick={handleNuevoPlato} className="btn-primary btn-large">
          ➕ Nuevo Plato
        </button>
      </div>

      <FiltrosMenu
        filtroCategoria={filtroCategoria}
        filtroEstado={filtroEstado}
        onCambiarCategoria={setFiltroCategoria}
        onCambiarEstado={setFiltroEstado}
        totalPlatos={platosFiltrados.length}
      />

      {loading ? (
        <div className="loading-container">
          <p>Cargando menú...</p>
        </div>
      ) : platosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No hay platos</h3>
          <p>Agrega tu primer plato al menú</p>
          <button onClick={handleNuevoPlato} className="btn-primary">
            ➕ Crear Plato
          </button>
        </div>
      ) : (
        <div className="platos-grid">
          {platosFiltrados.map(plato => (
            <TarjetaPlato
              key={plato.id}
              plato={plato}
              onEditar={handleEditarPlato}
              onCambiarEstado={handleCambiarEstado}
            />
          ))}
        </div>
      )}

      {mostrarModal && (
        <ModalPlato
          plato={platoEditar}
          onGuardar={handleGuardarPlato}
          onCancelar={() => setMostrarModal(false)}
        />
      )}
    </div>
  )
}

export default GestionMenuPage
