import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import {
  obtenerInsumos,
  crearInsumo,
  actualizarInsumo,
  ajustarStock,
  eliminarInsumo
} from '../services/inventarioApi'
import TarjetaInsumo from '../components/TarjetaInsumo'
import ModalInsumo from '../components/ModalInsumo'
import ModalAjustarStock from '../components/ModalAjustarStock'
import { Insumo, InsumoPayload } from '@/shared/types/inventario'

const GestionInventarioPage = () => {
  const { usuario } = useAuth()

  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [loading, setLoading] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarModalAjuste, setMostrarModalAjuste] = useState(false)
  const [insumoEditar, setInsumoEditar] = useState<Insumo | null>(null)
  const [insumoAjustar, setInsumoAjustar] = useState<Insumo | null>(null)
  const [filtro, setFiltro] = useState('TODOS')
  const [alerta, setAlerta] = useState<{ tipo: 'success' | 'error'; mensaje: string } | null>(null)

  useEffect(() => {
    cargarInsumos()
  }, [])

  const cargarInsumos = async () => {
    setLoading(true)
    try {
      const data = await obtenerInsumos()
      setInsumos(data)
    } catch (error) {
      console.error('Error al cargar insumos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNuevoInsumo = () => {
    setInsumoEditar(null)
    setMostrarModal(true)
  }

  const handleEditarInsumo = (insumo: Insumo) => {
    setInsumoEditar(insumo)
    setMostrarModal(true)
  }

  const handleAjustarStock = (insumo: Insumo) => {
    setInsumoAjustar(insumo)
    setMostrarModalAjuste(true)
  }

  const handleGuardarInsumo = async (payload: InsumoPayload) => {
    setAlerta(null)
    try {
      if (insumoEditar) {
        await actualizarInsumo(insumoEditar.id, payload)
        setAlerta({ tipo: 'success', mensaje: 'Insumo actualizado correctamente' })
      } else {
        await crearInsumo(payload)
        setAlerta({ tipo: 'success', mensaje: 'Insumo creado correctamente' })
      }
      await cargarInsumos()
      setMostrarModal(false)
    } catch (error) {
      console.error(error)
      setAlerta({ tipo: 'error', mensaje: 'No se pudo guardar el insumo' })
    }
  }

  const handleGuardarAjuste = async (cantidad: number, motivo: string) => {
    if (!insumoAjustar) return
    setAlerta(null)
    try {
      await ajustarStock(insumoAjustar.id, {
        cantidad,
        motivo,
        usuarioId: usuario?.id
      })
      setAlerta({ tipo: 'success', mensaje: 'Ajuste registrado correctamente' })
      await cargarInsumos()
      setMostrarModalAjuste(false)
      setInsumoAjustar(null)
    } catch (error) {
      console.error(error)
      setAlerta({ tipo: 'error', mensaje: 'No se pudo registrar el ajuste' })
    }
  }

  const insumosFiltrados = filtro === 'BAJO_STOCK' 
    ? insumos.filter(i => i.bajoStock)
    : insumos

  const totalBajoStock = insumos.filter(i => i.bajoStock).length

  const handleEliminarInsumo = async (insumo: Insumo) => {
    const confirmar = window.confirm(
      `¿Eliminar el insumo "${insumo.nombre}"? Esta acción no se puede deshacer.`
    )
    if (!confirmar) return

    try {
      await eliminarInsumo(insumo.id)
      setAlerta({ tipo: 'success', mensaje: 'Insumo eliminado correctamente' })
      await cargarInsumos()
    } catch (error) {
      console.error(error)
      setAlerta({ tipo: 'error', mensaje: 'No se pudo eliminar el insumo' })
    }
  }

  return (
    <div className="gestion-inventario-page">
      <div className="page-header">
        <div>
          <h2>📦 Gestión de Inventario</h2>
          <p className="page-subtitle">Administra insumos y controla el stock</p>
        </div>
        <button onClick={handleNuevoInsumo} className="btn-primary btn-large">
          ➕ Nuevo Insumo
        </button>
      </div>

      {alerta && (
        <div className={`alert ${alerta.tipo === 'success' ? 'alert-success' : 'alert-error'}`}>
          {alerta.mensaje}
        </div>
      )}

      <div className="filtros-inventario">
        <button
          onClick={() => setFiltro('TODOS')}
          className={`filtro-btn ${filtro === 'TODOS' ? 'active' : ''}`}
        >
          📦 Todos ({insumos.length})
        </button>
        <button
          onClick={() => setFiltro('BAJO_STOCK')}
          className={`filtro-btn ${filtro === 'BAJO_STOCK' ? 'active' : ''} ${totalBajoStock > 0 ? 'alerta' : ''}`}
        >
          ⚠️ Bajo Stock ({totalBajoStock})
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Cargando inventario...</p>
        </div>
      ) : insumosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay insumos</h3>
          <p>Agrega tu primer insumo al inventario</p>
          <button onClick={handleNuevoInsumo} className="btn-primary">
            ➕ Crear Insumo
          </button>
        </div>
      ) : (
        <div className="insumos-grid">
          {insumosFiltrados.map(insumo => (
            <TarjetaInsumo
              key={insumo.id}
              insumo={insumo}
              onEditar={handleEditarInsumo}
              onAjustar={handleAjustarStock}
              onEliminar={handleEliminarInsumo}
            />
          ))}
        </div>
      )}

      <ModalInsumo
        isOpen={mostrarModal}
        insumo={insumoEditar}
        onGuardar={handleGuardarInsumo}
        onCancelar={() => setMostrarModal(false)}
      />

      {insumoAjustar && (
        <ModalAjustarStock
          isOpen={mostrarModalAjuste}
          insumo={insumoAjustar}
          onGuardar={handleGuardarAjuste}
          onCancelar={() => {
            setMostrarModalAjuste(false)
            setInsumoAjustar(null)
          }}
        />
      )}
    </div>
  )
}

export default GestionInventarioPage
