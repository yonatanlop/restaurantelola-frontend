import React from 'react';
import { PlatoPopular } from '../types/dashboard.types';
import { formatearMoneda } from '@/shared/utils/formatters';

interface TopPlatosProps {
  platos: PlatoPopular[];
}

export const TopPlatos: React.FC<TopPlatosProps> = ({ platos }) => {
  const getMedalIcon = (index: number) => {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    return medals[index] || '📍';
  };

  return (
    <div className="top-platos-container">
      <h3 className="section-titulo">🍽️ Top 5 Platos Más Vendidos</h3>
      <div className="top-platos-lista">
        {platos.length === 0 ? (
          <div className="empty-state">
            <p>No hay datos de platos vendidos</p>
          </div>
        ) : (
          platos.map((plato, index) => (
            <div key={plato.platoId} className="plato-item">
              <div className="plato-ranking">
                <span className="plato-medal">{getMedalIcon(index)}</span>
                <span className="plato-posicion">#{index + 1}</span>
              </div>
              <div className="plato-info">
                <div className="plato-nombre">{plato.nombrePlato}</div>
                <div className="plato-categoria">{plato.categoria || 'Sin categoría'}</div>
              </div>
              <div className="plato-stats">
                <div className="plato-cantidad">
                  <span className="stat-label">Vendidos:</span>
                  <span className="stat-valor">{plato.cantidadVendida}</span>
                </div>
                <div className="plato-total">
                  <span className="stat-label">Total:</span>
                  <span className="stat-valor">{formatearMoneda(plato.totalVentas)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
