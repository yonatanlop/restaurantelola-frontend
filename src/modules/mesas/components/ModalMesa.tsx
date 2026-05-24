import React, { useState } from 'react';
import { Mesa } from '../types/mesas.types';
import { formatearMoneda } from '../../../shared/utils/formatters';

interface ModalMesaProps {
  mesa: Mesa;
  onCerrar: () => void;
  onOcupar: (mesaId: number) => void;
  onLiberar: (mesaId: number) => void;
  onTransferir: (mesaId: number) => void;
  onVerComandas: (mesaId: number) => void;
  onCambiarEstado: (mesaId: number, estado: string) => void;
}

export const ModalMesa: React.FC<ModalMesaProps> = ({
  mesa,
  onCerrar,
  onOcupar,
  onLiberar,
  onTransferir,
  onVerComandas,
  onCambiarEstado
}) => {
  const [mostrarCambioEstado, setMostrarCambioEstado] = useState(false);

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleString('es-ES');
    } catch {
      return fecha;
    }
  };

  const formatearTiempo = (minutos: number | null) => {
    if (!minutos) return 'N/A';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas} hora${horas > 1 ? 's' : ''} ${mins} minuto${mins !== 1 ? 's' : ''}`;
    }
    return `${mins} minuto${mins !== 1 ? 's' : ''}`;
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-mesa" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Mesa {mesa.numero}</h2>
          <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <div className="modal-body">
          <div className="mesa-detalle-grid">
            <div className="detalle-item">
              <label>Estado:</label>
              <span className={`badge badge-${mesa.estado.toLowerCase()}`}>
                {mesa.estado}
              </span>
            </div>

            <div className="detalle-item">
              <label>Ubicación:</label>
              <span>{mesa.ubicacion}</span>
            </div>

            <div className="detalle-item">
              <label>Capacidad:</label>
              <span>👥 {mesa.capacidad} personas</span>
            </div>

            {mesa.estado === 'OCUPADA' && (
              <>
                <div className="detalle-item">
                  <label>Hora de Ocupación:</label>
                  <span>{formatearFecha(mesa.horaOcupacion)}</span>
                </div>

                <div className="detalle-item">
                  <label>Tiempo Ocupada:</label>
                  <span>⏱️ {formatearTiempo(mesa.tiempoOcupacion)}</span>
                </div>

                <div className="detalle-item">
                  <label>Total Cuenta:</label>
                  <span className="total-destacado">💰 {formatearMoneda(mesa.totalCuenta)}</span>
                </div>
              </>
            )}
          </div>

          {mostrarCambioEstado && (
            <div className="cambio-estado-section">
              <h4>Cambiar Estado</h4>
              <div className="estados-grid">
                <button
                  className="btn-estado btn-libre"
                  onClick={() => {
                    onCambiarEstado(mesa.id, 'LIBRE');
                    setMostrarCambioEstado(false);
                  }}
                >
                  ✅ Libre
                </button>
                <button
                  className="btn-estado btn-reservada"
                  onClick={() => {
                    onCambiarEstado(mesa.id, 'RESERVADA');
                    setMostrarCambioEstado(false);
                  }}
                >
                  🟡 Reservada
                </button>
                <button
                  className="btn-estado btn-limpieza"
                  onClick={() => {
                    onCambiarEstado(mesa.id, 'LIMPIEZA');
                    setMostrarCambioEstado(false);
                  }}
                >
                  🧹 Limpieza
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="acciones-grid">
            {mesa.estado === 'LIBRE' && (
              <button
                className="btn-accion btn-ocupar"
                onClick={() => onOcupar(mesa.id)}
              >
                🔴 Ocupar Mesa
              </button>
            )}

            {mesa.estado === 'OCUPADA' && (
              <>
                <button
                  className="btn-accion btn-comandas"
                  onClick={() => onVerComandas(mesa.id)}
                >
                  📋 Ver Comandas
                </button>
                <button
                  className="btn-accion btn-transferir"
                  onClick={() => onTransferir(mesa.id)}
                >
                  🔄 Transferir
                </button>
                <button
                  className="btn-accion btn-liberar"
                  onClick={() => onLiberar(mesa.id)}
                >
                  ✅ Liberar Mesa
                </button>
              </>
            )}

            <button
              className="btn-accion btn-cambiar-estado"
              onClick={() => setMostrarCambioEstado(!mostrarCambioEstado)}
            >
              ⚙️ Cambiar Estado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
