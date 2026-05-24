import React from 'react';
import { AuditoriaLog } from '../types/auditoria.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TablaAuditoriaProps {
  logs: AuditoriaLog[];
  onVerDetalle: (log: AuditoriaLog) => void;
}

export const TablaAuditoria: React.FC<TablaAuditoriaProps> = ({ logs, onVerDetalle }) => {
  const formatearFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss', { locale: es });
    } catch {
      return fecha;
    }
  };

  const getAccionBadge = (accion: string) => {
    const badges: Record<string, string> = {
      CREATE: 'badge-success',
      UPDATE: 'badge-info',
      DELETE: 'badge-danger',
      AJUSTE: 'badge-warning',
      LOGIN: 'badge-primary',
      LOGOUT: 'badge-secondary',
      ERROR: 'badge-error'
    };
    return badges[accion] || 'badge-default';
  };

  const getResultadoBadge = (resultado: string) => {
    return resultado === 'EXITOSO' ? 'badge-success' : 'badge-danger';
  };

  const getAccionIcono = (accion: string) => {
    const iconos: Record<string, string> = {
      CREATE: '➕',
      UPDATE: '✏️',
      DELETE: '🗑️',
      AJUSTE: '⚙️',
      LOGIN: '🔓',
      LOGOUT: '🔒',
      ERROR: '❌'
    };
    return iconos[accion] || '📝';
  };

  if (logs.length === 0) {
    return (
      <div className="tabla-vacia">
        <p>📋 No se encontraron registros de auditoría</p>
      </div>
    );
  }

  return (
    <div className="tabla-auditoria-container">
      <div className="tabla-info">
        <span>Total de registros: <strong>{logs.length}</strong></span>
      </div>
      
      <div className="tabla-scroll">
        <table className="tabla-auditoria">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Entidad</th>
              <th>ID</th>
              <th>Descripción</th>
              <th>Resultado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className={log.resultado === 'FALLIDO' ? 'row-error' : ''}>
                <td className="fecha-cell">
                  {formatearFecha(log.fecha)}
                </td>
                <td>
                  <div className="usuario-cell">
                    <span className="usuario-nombre">{log.usuarioNombre}</span>
                    {log.usuarioId && (
                      <span className="usuario-id">ID: {log.usuarioId}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`badge ${getAccionBadge(log.accion)}`}>
                    {getAccionIcono(log.accion)} {log.accion}
                  </span>
                </td>
                <td>
                  <span className="entidad-badge">{log.entidad}</span>
                </td>
                <td className="id-cell">
                  {log.entidadId || '-'}
                </td>
                <td className="descripcion-cell">
                  {log.descripcion || '-'}
                </td>
                <td>
                  <span className={`badge ${getResultadoBadge(log.resultado)}`}>
                    {log.resultado === 'EXITOSO' ? '✓' : '✗'} {log.resultado}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-ver-detalle"
                    onClick={() => onVerDetalle(log)}
                    title="Ver detalles"
                  >
                    👁️ Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
