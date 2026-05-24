import React from 'react';
import { AuditoriaLog } from '../types/auditoria.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DetalleAuditoriaProps {
  log: AuditoriaLog;
  onCerrar: () => void;
}

export const DetalleAuditoria: React.FC<DetalleAuditoriaProps> = ({ log, onCerrar }) => {
  const formatearFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es });
    } catch {
      return fecha;
    }
  };

  const formatearJSON = (json: string | null) => {
    if (!json) return null;
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch {
      return json;
    }
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-detalle-auditoria" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Detalle de Auditoría</h2>
          <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <div className="modal-body">
          <div className="detalle-section">
            <h3>Información General</h3>
            <div className="detalle-grid">
              <div className="detalle-item">
                <label>ID de Log:</label>
                <span>{log.id}</span>
              </div>
              <div className="detalle-item">
                <label>Fecha y Hora:</label>
                <span>{formatearFecha(log.fecha)}</span>
              </div>
              <div className="detalle-item">
                <label>Usuario:</label>
                <span>{log.usuarioNombre} {log.usuarioId && `(ID: ${log.usuarioId})`}</span>
              </div>
              <div className="detalle-item">
                <label>Acción:</label>
                <span className={`badge badge-${log.accion.toLowerCase()}`}>
                  {log.accion}
                </span>
              </div>
              <div className="detalle-item">
                <label>Entidad:</label>
                <span className="entidad-badge">{log.entidad}</span>
              </div>
              <div className="detalle-item">
                <label>ID de Entidad:</label>
                <span>{log.entidadId || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <label>Resultado:</label>
                <span className={`badge ${log.resultado === 'EXITOSO' ? 'badge-success' : 'badge-danger'}`}>
                  {log.resultado}
                </span>
              </div>
            </div>
          </div>

          {log.descripcion && (
            <div className="detalle-section">
              <h3>Descripción</h3>
              <div className="descripcion-box">
                {log.descripcion}
              </div>
            </div>
          )}

          {log.datosAnteriores && (
            <div className="detalle-section">
              <h3>📄 Datos Anteriores</h3>
              <pre className="json-viewer">
                {formatearJSON(log.datosAnteriores)}
              </pre>
            </div>
          )}

          {log.datosNuevos && (
            <div className="detalle-section">
              <h3>📝 Datos Nuevos</h3>
              <pre className="json-viewer">
                {formatearJSON(log.datosNuevos)}
              </pre>
            </div>
          )}

          {log.mensajeError && (
            <div className="detalle-section error-section">
              <h3>❌ Mensaje de Error</h3>
              <div className="error-box">
                {log.mensajeError}
              </div>
            </div>
          )}

          <div className="detalle-section">
            <h3>Información Técnica</h3>
            <div className="detalle-grid">
              {log.ipAddress && (
                <div className="detalle-item">
                  <label>Dirección IP:</label>
                  <span>{log.ipAddress}</span>
                </div>
              )}
              {log.userAgent && (
                <div className="detalle-item full-width">
                  <label>User Agent:</label>
                  <span className="user-agent">{log.userAgent}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
