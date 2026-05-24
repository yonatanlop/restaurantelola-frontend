import React from 'react';

interface TarjetaMetricaProps {
  titulo: string;
  valor: string | number;
  icono: string;
  subtitulo?: string;
  variacion?: number;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

export const TarjetaMetrica: React.FC<TarjetaMetricaProps> = ({
  titulo,
  valor,
  icono,
  subtitulo,
  variacion,
  color = 'blue'
}) => {
  const getVariacionClase = () => {
    if (variacion === undefined) return '';
    return variacion >= 0 ? 'variacion-positiva' : 'variacion-negativa';
  };

  const formatearVariacion = () => {
    if (variacion === undefined) return null;
    const signo = variacion >= 0 ? '+' : '';
    return `${signo}${variacion.toFixed(1)}%`;
  };

  return (
    <div className={`tarjeta-metrica tarjeta-${color}`}>
      <div className="tarjeta-header">
        <span className="tarjeta-icono">{icono}</span>
        <span className="tarjeta-titulo">{titulo}</span>
      </div>
      <div className="tarjeta-body">
        <div className="tarjeta-valor">{valor}</div>
        {subtitulo && <div className="tarjeta-subtitulo">{subtitulo}</div>}
        {variacion !== undefined && (
          <div className={`tarjeta-variacion ${getVariacionClase()}`}>
            {formatearVariacion()} vs período anterior
          </div>
        )}
      </div>
    </div>
  );
};
