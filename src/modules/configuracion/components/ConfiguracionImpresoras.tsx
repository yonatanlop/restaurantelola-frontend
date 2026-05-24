import React, { useState } from 'react';

interface Impresora {
  id: number;
  nombre: string;
  tipo: 'TICKET' | 'COMANDA' | 'REPORTE';
  activa: boolean;
}

export const ConfiguracionImpresoras: React.FC = () => {
  const [impresoras, setImpresoras] = useState<Impresora[]>([
    { id: 1, nombre: 'Impresora Principal', tipo: 'TICKET', activa: true },
    { id: 2, nombre: 'Impresora Cocina', tipo: 'COMANDA', activa: false }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaImpresora, setNuevaImpresora] = useState({
    nombre: '',
    tipo: 'TICKET' as 'TICKET' | 'COMANDA' | 'REPORTE'
  });

  const toggleImpresora = (id: number) => {
    setImpresoras(impresoras.map(imp => 
      imp.id === id ? { ...imp, activa: !imp.activa } : imp
    ));
  };

  const agregarImpresora = () => {
    if (!nuevaImpresora.nombre.trim()) {
      alert('Ingrese un nombre para la impresora');
      return;
    }

    const nueva: Impresora = {
      id: Date.now(),
      nombre: nuevaImpresora.nombre,
      tipo: nuevaImpresora.tipo,
      activa: true
    };

    setImpresoras([...impresoras, nueva]);
    setNuevaImpresora({ nombre: '', tipo: 'TICKET' });
    setMostrarFormulario(false);
  };

  const eliminarImpresora = (id: number) => {
    if (confirm('¿Eliminar esta impresora?')) {
      setImpresoras(impresoras.filter(imp => imp.id !== id));
    }
  };

  return (
    <div className="seccion-config">
      <h2>Configuración de Impresoras</h2>
      <p className="descripcion">Administra las impresoras del sistema</p>

      <div className="impresoras-lista">
        {impresoras.map(impresora => (
          <div key={impresora.id} className="impresora-item">
            <div className="impresora-info">
              <h4>{impresora.nombre}</h4>
              <span className={`badge badge-${impresora.tipo.toLowerCase()}`}>
                {impresora.tipo}
              </span>
            </div>
            <div className="impresora-acciones">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={impresora.activa}
                  onChange={() => toggleImpresora(impresora.id)}
                />
                <span className="slider"></span>
              </label>
              <button
                onClick={() => eliminarImpresora(impresora.id)}
                className="btn-eliminar-small"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {!mostrarFormulario ? (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn-agregar-impresora"
        >
          + Agregar Impresora
        </button>
      ) : (
        <div className="formulario-impresora">
          <h4>Nueva Impresora</h4>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={nuevaImpresora.nombre}
              onChange={(e) => setNuevaImpresora({ ...nuevaImpresora, nombre: e.target.value })}
              placeholder="Ej: Impresora Cocina"
            />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={nuevaImpresora.tipo}
              onChange={(e) => setNuevaImpresora({ ...nuevaImpresora, tipo: e.target.value as any })}
            >
              <option value="TICKET">Ticket (Cliente)</option>
              <option value="COMANDA">Comanda (Cocina)</option>
              <option value="REPORTE">Reporte</option>
            </select>
          </div>
          <div className="form-actions">
            <button onClick={() => setMostrarFormulario(false)} className="btn-cancelar">
              Cancelar
            </button>
            <button onClick={agregarImpresora} className="btn-guardar">
              Agregar
            </button>
          </div>
        </div>
      )}

      <div className="info-box">
        <h4>ℹ️ Información</h4>
        <ul>
          <li><strong>TICKET:</strong> Imprime tickets para clientes</li>
          <li><strong>COMANDA:</strong> Imprime órdenes para cocina</li>
          <li><strong>REPORTE:</strong> Imprime reportes y cierres</li>
        </ul>
      </div>
    </div>
  );
};
