import React, { useState } from 'react';
import { creditosApi } from '@/modules/creditos/services/creditosApi';

interface ModalNuevoClienteRapidoProps {
  onClose: () => void;
  onClienteCreado: (clienteId: number) => void;
}

export const ModalNuevoClienteRapido: React.FC<ModalNuevoClienteRapidoProps> = ({ 
  onClose, 
  onClienteCreado 
}) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      setGuardando(true);
      const nuevoCliente = await creditosApi.crearCliente({
        nombre: nombre.trim(),
        telefono: telefono.trim() || null,
        direccion: null,
        notas: 'Cliente creado desde POS'
      });
      onClienteCreado(nuevoCliente.id);
      onClose();
    } catch (error) {
      console.error('Error al crear cliente:', error);
      alert('Error al crear el cliente');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay-interno" onClick={onClose}>
      <div className="modal-content-interno" onClick={e => e.stopPropagation()}>
        <h3>Nuevo Cliente</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group-rapido">
            <label>Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Nombre del cliente"
              required
              autoFocus
            />
          </div>

          <div className="form-group-rapido">
            <label>Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="Teléfono (opcional)"
            />
          </div>

          <div className="modal-actions-rapido">
            <button type="button" onClick={onClose} className="btn-cancelar-rapido">
              Cancelar
            </button>
            <button type="submit" disabled={guardando} className="btn-guardar-rapido">
              {guardando ? 'Guardando...' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
