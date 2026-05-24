import React from 'react';
import { AlertaStock } from '../types/dashboard.types';

interface AlertasStockProps {
  alertas: AlertaStock[];
}

export const AlertasStock: React.FC<AlertasStockProps> = ({ alertas }) => {
  const getNivelClase = (nivel: string) => {
    const clases: Record<string, string> = {
      CRITICO: 'alerta-critico',
      BAJO: 'alerta-bajo',
      MEDIO: 'alerta-medio'
    };
    return clases[nivel] || 'alerta-medio';
  };

  const getNivelIcono = (nivel: string) => {
    const iconos: Record<string, string> = {
      CRITICO: '🔴',
      BAJO: '🟡',
      MEDIO: '🟠'
    };
    return iconos[nivel] || '⚠️';
  };

  const getNivelTexto = (nivel: string) => {
    const textos: Record<string, string> = {
      CRITICO: 'Crítico',
      BAJO: 'Bajo',
      MEDIO: 'Medio'
    };
    return textos[nivel] || nivel;
  };

  return (
    <div className="alertas-stock-container">
      <h3 className="section-titulo">⚠️ Alertas de Stock Bajo</h3>
      <div className="alertas-lista">
        {alertas.length === 0 ? (
          <div className="empty-state success">
            <span className="success-icon">✅</span>
            <p>¡Todo el inventario está en niveles óptimos!</p>
          </div>
        ) : (
          alertas.map((alerta) => (
            <div key={alerta.insumoId} className={`alerta-item ${getNivelClase(alerta.nivelAlerta)}`}>
              <div className="alerta-header">
                <span className="alerta-icono">{getNivelIcono(alerta.nivelAlerta)}</span>
                <span className="alerta-nivel">{getNivelTexto(alerta.nivelAlerta)}</span>
              </div>
              <div className="alerta-body">
                <div className="alerta-nombre">{alerta.nombreInsumo}</div>
                <div className="alerta-stats">
                  <div className="stat-item">
                    <span className="stat-label">Actual:</span>
                    <span className="stat-valor">
                      {alerta.cantidadActual} {alerta.unidadMedida}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Mínimo:</span>
                    <span className="stat-valor">
                      {alerta.stockMinimo} {alerta.unidadMedida}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
