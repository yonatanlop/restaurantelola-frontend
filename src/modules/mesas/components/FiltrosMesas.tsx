import React from 'react';

interface FiltrosMesasProps {
  estadoFiltro: string;
  ubicacionFiltro: string;
  onEstadoChange: (estado: string) => void;
  onUbicacionChange: (ubicacion: string) => void;
}

export const FiltrosMesas: React.FC<FiltrosMesasProps> = ({
  estadoFiltro,
  ubicacionFiltro,
  onEstadoChange,
  onUbicacionChange
}) => {
  return (
    <div className="filtros-mesas">
      <div className="filtro-group">
        <label>Estado:</label>
        <div className="filtro-botones">
          <button
            className={`filtro-btn ${estadoFiltro === '' ? 'active' : ''}`}
            onClick={() => onEstadoChange('')}
          >
            Todas
          </button>
          <button
            className={`filtro-btn filtro-libre ${estadoFiltro === 'LIBRE' ? 'active' : ''}`}
            onClick={() => onEstadoChange('LIBRE')}
          >
            ✅ Libres
          </button>
          <button
            className={`filtro-btn filtro-ocupada ${estadoFiltro === 'OCUPADA' ? 'active' : ''}`}
            onClick={() => onEstadoChange('OCUPADA')}
          >
            🔴 Ocupadas
          </button>
          <button
            className={`filtro-btn filtro-reservada ${estadoFiltro === 'RESERVADA' ? 'active' : ''}`}
            onClick={() => onEstadoChange('RESERVADA')}
          >
            🟡 Reservadas
          </button>
          <button
            className={`filtro-btn filtro-limpieza ${estadoFiltro === 'LIMPIEZA' ? 'active' : ''}`}
            onClick={() => onEstadoChange('LIMPIEZA')}
          >
            🧹 Limpieza
          </button>
        </div>
      </div>

      <div className="filtro-group">
        <label>Ubicación:</label>
        <div className="filtro-botones">
          <button
            className={`filtro-btn ${ubicacionFiltro === '' ? 'active' : ''}`}
            onClick={() => onUbicacionChange('')}
          >
            Todas
          </button>
          <button
            className={`filtro-btn ${ubicacionFiltro === 'SALON' ? 'active' : ''}`}
            onClick={() => onUbicacionChange('SALON')}
          >
            🏠 Salón
          </button>
          <button
            className={`filtro-btn ${ubicacionFiltro === 'TERRAZA' ? 'active' : ''}`}
            onClick={() => onUbicacionChange('TERRAZA')}
          >
            🌳 Terraza
          </button>
          <button
            className={`filtro-btn ${ubicacionFiltro === 'VIP' ? 'active' : ''}`}
            onClick={() => onUbicacionChange('VIP')}
          >
            ⭐ VIP
          </button>
        </div>
      </div>
    </div>
  );
};
