import React, { useState } from 'react';
import { comprasApi } from '../services/comprasApi';

interface ModalNuevoProveedorProps {
  onClose: () => void;
  onProveedorCreado: () => void;
}

export const ModalNuevoProveedor: React.FC<ModalNuevoProveedorProps> = ({ onClose, onProveedorCreado }) => {
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      setGuardando(true);
      await comprasApi.crearProveedor({
        nombre: nombre.trim(),
        contacto: contacto.trim() || null,
        telefono: telefono.trim() || null,
        email: email.trim() || null,
        direccion: direccion.trim() || null,
        activo: true
      });
      onProveedorCreado();
      onClose();
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      alert('Error al crear el proveedor');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Nuevo Proveedor</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contacto</label>
            <input type="text" value={contacto} onChange={e => setContacto(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <textarea value={direccion} onChange={e => setDireccion(e.target.value)} rows={3} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
            <button type="submit" disabled={guardando} className="btn-guardar">
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
