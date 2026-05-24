import { useState } from 'react'
import { abrirCajon } from '../services/cajaRegistradoraApi'

interface BotonAbrirCajaProps {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const BotonAbrirCaja: React.FC<BotonAbrirCajaProps> = ({ 
  variant = 'secondary', 
  size = 'medium',
  className = '' 
}) => {
  const [abriendo, setAbriendo] = useState(false)

  const handleAbrirCaja = async () => {
    setAbriendo(true)
    try {
      const resultado = await abrirCajon()
      
      if (resultado.exito) {
        console.log('✅ Cajón abierto exitosamente')
        // Opcional: mostrar notificación de éxito
      } else {
        console.warn('⚠️ No se pudo abrir el cajón:', resultado.mensaje)
        alert(`No se pudo abrir el cajón:\n${resultado.mensaje}\n\nVerifica que la caja registradora esté conectada al puerto ${resultado.puerto}`)
      }
    } catch (error: any) {
      console.error('❌ Error al abrir cajón:', error)
      alert('Error al comunicarse con la caja registradora.\nVerifica la conexión y configuración.')
    } finally {
      setAbriendo(false)
    }
  }

  return (
    <button
      onClick={handleAbrirCaja}
      disabled={abriendo}
      className={`btn btn-${variant} btn-${size} ${className}`}
      title="Abrir cajón de caja registradora"
    >
      {abriendo ? '⏳ Abriendo...' : '🔓 Abrir Caja'}
    </button>
  )
}
