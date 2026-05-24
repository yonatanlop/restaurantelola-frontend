import React, { useState } from 'react';
import { AuditoriaFiltro } from '../types/auditoria.types';

interface FiltrosAuditoriaProps {
  onFiltrar: (filtros: AuditoriaFiltro) => void;
  onLimpiar: () => void;
}

export const FiltrosAuditoria: React.FC<FiltrosAuditoriaProps> = ({ onFiltrar, onLimpiar }) => {
  const [filtros, setFiltros] = useState<AuditoriaFiltro>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltrar(filtros);
  };

  const handleLimpiar = () => {
    setFiltros({});
    onLimpiar();
  };

  const handleChange = (field: keyof AuditoriaFiltro, value: any) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  return (
    <div className="filtros-auditoria">
      <form onSubmit={handleSubmit}>
        <div className="filtros-grid">
          <div className="filtro-item">
            <label>Fecha Inicio</label>
            <input
              type="datetime-local"
              value={filtros.fechaInicio || ''}
              onChange={(e) => handleChange('fechaInicio', e.target.value)}
            />
          </div>

          <div className="filtro-item">
            <label>Fecha Fin</label>
            <input
              type="datetime-local"
              value={filtros.fechaFin || ''}
              onChange={(e) => handleChange('fechaFin', e.target.value)}
            />
          </div>

          <div className="filtro-item">
            <label>Acción</label>
            <select
              value={filtros.accion || ''}
              onChange={(e) => handleChange('accion', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="CREATE">Crear</option>
              <option value="UPDATE">Actualizar</option>
              <option value="DELETE">Eliminar</option>
              <option value="AJUSTE">Ajuste</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="ERROR">Error</option>
            </select>
          </div>

          <div className="filtro-item">
            <label>Entidad</label>
            <select
              value={filtros.entidad || ''}
              onChange={(e) => handleChange('entidad', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="VENTA">Venta</option>
              <option value="PLATO">Plato</option>
              <option value="INSUMO">Insumo</option>
              <option value="INVENTARIO">Inventario</option>
              <option value="EMPLEADO">Empleado</option>
              <option value="NOMINA">Nómina</option>
              <option value="COMPRA">Compra</option>
              <option value="MESA">Mesa</option>
              <option value="COMANDA">Comanda</option>
              <option value="USUARIO">Usuario</option>
            </select>
          </div>

          <div className="filtro-item">
            <label>ID Entidad</label>
            <input
              type="number"
              placeholder="ID"
              value={filtros.entidadId || ''}
              onChange={(e) => handleChange('entidadId', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div className="filtro-item">
            <label>ID Usuario</label>
            <input
              type="number"
              placeholder="ID"
              value={filtros.usuarioId || ''}
              onChange={(e) => handleChange('usuarioId', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="filtros-acciones">
          <button type="submit" className="btn-primary">
            🔍 Buscar
          </button>
          <button type="button" className="btn-secondary" onClick={handleLimpiar}>
            🗑️ Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};
