import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TendenciaVentas } from '../types/dashboard.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatearMoneda } from '@/shared/utils/formatters';

interface GraficoTendenciasProps {
  datos: TendenciaVentas[];
}

export const GraficoTendencias: React.FC<GraficoTendenciasProps> = ({ datos }) => {
  const datosFormateados = datos.map(item => ({
    ...item,
    fecha: format(new Date(item.fecha), 'dd/MM', { locale: es }),
    totalVentas: Number(item.totalVentas)
  }));

  return (
    <div className="grafico-container">
      <h3 className="grafico-titulo">📈 Tendencia de Ventas (Últimos 7 Días)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datosFormateados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="fecha" 
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`${formatearMoneda(value)}`, 'Ventas']}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="totalVentas" 
            stroke="#3498db" 
            strokeWidth={3}
            name="Total Ventas"
            dot={{ fill: '#3498db', r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
