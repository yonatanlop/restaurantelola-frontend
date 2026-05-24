import { useState, useRef } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { crearVenta as crearVentaApi } from '../services/ventasApi'

const useVentaTactil = () => {
  const { usuario } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const procesandoRef = useRef(false)

  const crearVenta = async (ventaData: any) => {
    // Prevenir llamadas duplicadas
    if (procesandoRef.current) {
      console.warn('Ya hay una venta en proceso, ignorando llamada duplicada')
      return null
    }

    procesandoRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      // Agregar información del cajero
      const ventaCompleta = {
        ...ventaData,
        cajero: usuario?.nombre || 'Cajero'
      }
      const result = await crearVentaApi(ventaCompleta)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al crear la venta'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
      // Desbloquear después de 1 segundo para evitar doble clic
      setTimeout(() => {
        procesandoRef.current = false
      }, 1000)
    }
  }

  return { crearVenta, loading, error }
}

export default useVentaTactil
