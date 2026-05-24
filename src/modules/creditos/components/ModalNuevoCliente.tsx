import React, { useState } from 'react';
import { creditosApi } from '../services/creditosApi';

interface ModalNuevoClienteProps {
  onClose: () => void;
  onClienteCreado: () => void;
}

export const ModalNuevoCliente: React.FC<ModalNuevoClienteProps> = ({ onClose, onClienteCreado }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      setGuardando(true);
      await creditosApi.crearCliente({
        nombre: nombre.trim(),
        telefono: telefono.trim() || null,
        direccion: direccion.trim() || null,
        notas: notas.trim() || null
      });
      onClienteCreado();
      onClose();
    } catch (error) {
      console.error('Error al crear cliente:', error);
      alert('Error al crear el cliente');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Nuevo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Nombre del cliente"
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="Teléfono"
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              placeholder="Dirección"
            />
          </div>

          <div className="form-group">
            <label>Notas</label>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Notas adicionales"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" disabled={guardando} className="btn-guardar">
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
