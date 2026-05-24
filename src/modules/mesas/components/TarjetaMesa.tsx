import React from 'react';
import { Mesa } from '../types/mesas.types';
import { formatearMoneda } from '../../../shared/utils/formatters';

interface TarjetaMesaProps {
  mesa: Mesa;
  onClick: (mesa: Mesa) => void;
}

export const TarjetaMesa: React.FC<TarjetaMesaProps> = ({ mesa, onClick }) => {
  const getEstadoClase = () => {
    const clases: Record<string, string> = {
      LIBRE: 'mesa-libre',
      OCUPADA: 'mesa-ocupada',
      RESERVADA: 'mesa-reservada',
      LIMPIEZA: 'mesa-limpieza'
    };
    return clases[mesa.estado] || 'mesa-libre';
  };

  const getEstadoIcono = () => {
    const iconos: Record<string, string> = {
      LIBRE: '✅',
      OCUPADA: '🔴',
      RESERVADA: '🟡',
      LIMPIEZA: '🧹'
    };
    return iconos[mesa.estado] || '❓';
  };

  const getUbicacionIcono = () => {
    const iconos: Record<string, string> = {
      SALON: '🏠',
      TERRAZA: '🌳',
      VIP: '⭐'
    };
    return iconos[mesa.ubicacion] || '📍';
  };

  const formatearTiempo = (minutos: number | null) => {
    if (!minutos) return '';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div 
      className={`tarjeta-mesa ${getEstadoClase()}`}
      onClick={() => onClick(mesa)}
    >
      <div className="mesa-header">
        <div className="mesa-numero">
          <span className="numero-texto">{mesa.numero}</span>
          <span className="estado-icono">{getEstadoIcono()}</span>
        </div>
        <div className="mesa-ubicacion">
          {getUbicacionIcono()} {mesa.ubicacion}
        </div>
      </div>

      <div className="mesa-body">
        <div className="mesa-info">
          <span className="info-label">Capacidad:</span>
          <span className="info-valor">👥 {mesa.capacidad} personas</span>
        </div>

        <div className="mesa-estado-badge">
          {mesa.estado}
        </div>

        {mesa.estado === 'OCUPADA' && (
          <div className="mesa-ocupada-info">
            {mesa.tiempoOcupacion !== null && (
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <span>{formatearTiempo(mesa.tiempoOcupacion)}</span>
              </div>
            )}
            {mesa.totalCuenta > 0 && (
              <div className="info-item">
                <span className="info-icon">💰</span>
                <span>{formatearMoneda(mesa.totalCuenta)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mesa-footer">
        <span className="mesa-accion">
          {mesa.estado === 'LIBRE' ? 'Clic para ocupar' : 'Clic para ver detalles'}
        </span>
      </div>
    </div>
  );
};
