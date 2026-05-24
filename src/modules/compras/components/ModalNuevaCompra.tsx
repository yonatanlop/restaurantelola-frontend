import React, { useState, useEffect } from 'react';
import { Proveedor, CompraDetalle } from '../types/compras.types';
import { comprasApi } from '../services/comprasApi';
import axios from 'axios';
import { formatearMoneda } from '@/shared/utils/formatters';

interface ModalNuevaCompraProps {
  proveedores: Proveedor[];
  onClose: () => void;
  onCompraRegistrada: () => void;
}

interface Insumo {
  id: number;
  nombre: string;
  unidadMedida: string;
}

export const ModalNuevaCompra: React.FC<ModalNuevaCompraProps> = ({ 
  proveedores, 
  onClose, 
  onCompraRegistrada 
}) => {
  const [proveedorId, setProveedorId] = useState<number>(0);
  const [notas, setNotas] = useState('');
  const [detalles, setDetalles] = useState<CompraDetalle[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarInsumos();
  }, []);

  const cargarInsumos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Error al cargar insumos:', error);
    }
  };

  const agregarDetalle = () => {
    setDetalles([...detalles, {
      insumoId: 0,
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0
    }]);
  };

  const actualizarDetalle = (index: number, campo: string, valor: any) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index] = { ...nuevosDetalles[index], [campo]: valor };
    
    if (campo === 'cantidad' || campo === 'precioUnitario') {
      const cantidad = campo === 'cantidad' ? valor : nuevosDetalles[index].cantidad;
      const precio = campo === 'precioUnitario' ? valor : nuevosDetalles[index].precioUnitario;
      nuevosDetalles[index].subtotal = cantidad * precio;
    }
    
    setDetalles(nuevosDetalles);
  };

  const eliminarDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, d) => sum + d.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proveedorId) {
      alert('Seleccione un proveedor');
      return;
    }
    
    if (detalles.length === 0) {
      alert('Agregue al menos un producto');
      return;
    }

    try {
      setGuardando(true);
      const usuarioId = parseInt(localStorage.getItem('usuarioId') || '1');
      
      await comprasApi.registrarCompra({
        proveedorId,
        notas,
        registradoPor: usuarioId,
        detalles
      });
      
      onCompraRegistrada();
      onClose();
    } catch (error) {
      console.error('Error al registrar compra:', error);
      alert('Error al registrar la compra');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-compra" onClick={e => e.stopPropagation()}>
        <h2>Registrar Nueva Compra</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Proveedor *</label>
            <select value={proveedorId} onChange={e => setProveedorId(Number(e.target.value))} required>
              <option value={0}>Seleccione un proveedor</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Notas</label>
            <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={2} />
          </div>

          <div className="detalles-section">
            <div className="detalles-header">
              <h3>Productos</h3>
              <button type="button" onClick={agregarDetalle} className="btn-agregar">
                + Agregar Producto
              </button>
            </div>

            {detalles.map((detalle, index) => (
              <div key={index} className="detalle-item">
                <select 
                  value={detalle.insumoId} 
                  onChange={e => actualizarDetalle(index, 'insumoId', Number(e.target.value))}
                  required
                >
                  <option value={0}>Seleccione insumo</option>
                  {insumos.map(i => (
                    <option key={i.id} value={i.id}>{i.nombre} ({i.unidadMedida})</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  placeholder="Cantidad" 
                  value={detalle.cantidad}
                  onChange={e => actualizarDetalle(index, 'cantidad', Number(e.target.value))}
                  min="0.01"
                  step="0.01"
                  required
                />
                <input 
                  type="number" 
                  placeholder="Precio" 
                  value={detalle.precioUnitario}
                  onChange={e => actualizarDetalle(index, 'precioUnitario', Number(e.target.value))}
                  min="0"
                  step="0.01"
                  required
                />
                <span className="subtotal">{formatearMoneda(detalle.subtotal)}</span>
                <button type="button" onClick={() => eliminarDetalle(index)} className="btn-eliminar">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="total-compra">
            <strong>Total: {formatearMoneda(calcularTotal())}</strong>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
            <button type="submit" disabled={guardando} className="btn-guardar">
              {guardando ? 'Guardando...' : 'Registrar Compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
