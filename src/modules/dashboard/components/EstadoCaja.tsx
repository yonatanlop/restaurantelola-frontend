import React from 'react';
import { EstadoCaja as EstadoCajaType } from '../types/dashboard.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatearMoneda } from '@/shared/utils/formatters';

interface EstadoCajaProps {
  estado: EstadoCajaType;
}

export const EstadoCaja: React.FC<EstadoCajaProps> = ({ estado }) => {
  const formatearFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="estado-caja-container">
      <h3 className="section-titulo">💰 Estado de Caja</h3>
      <div className="estado-caja-fecha">
        {formatearFecha(estado.fecha)}
      </div>
      <div className="estado-caja-grid">
        <div className="caja-item caja-ingresos">
          <div className="caja-icono">📈</div>
          <div className="caja-info">
            <div className="caja-label">Ingresos</div>
            <div className="caja-valor">{formatearMoneda(estado.ingresosHoy)}</div>
          </div>
        </div>
        <div className="caja-item caja-egresos">
          <div className="caja-icono">📉</div>
          <div className="caja-info">
            <div className="caja-label">Egresos</div>
            <div className="caja-valor">{formatearMoneda(estado.egresosHoy)}</div>
          </div>
        </div>
        <div className="caja-item caja-saldo">
          <div className="caja-icono">💵</div>
          <div className="caja-info">
            <div className="caja-label">Saldo Actual</div>
            <div className="caja-valor destacado">{formatearMoneda(estado.saldoActual)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
