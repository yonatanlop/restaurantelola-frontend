import React, { useState, useEffect } from 'react';
import { FiltrosAuditoria } from '../components/FiltrosAuditoria';
import { TablaAuditoria } from '../components/TablaAuditoria';
import { DetalleAuditoria } from '../components/DetalleAuditoria';
import { auditoriaService } from '../services/auditoria.service';
import { AuditoriaLog, AuditoriaFiltro } from '../types/auditoria.types';
import '../styles/auditoria.css';

export const AuditoriaPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [logSeleccionado, setLogSeleccionado] = useState<AuditoriaLog | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  // Cargar logs iniciales (últimas 24 horas)
  useEffect(() => {
    cargarLogsRecientes();
  }, []);

  const cargarLogsRecientes = async () => {
    setCargando(true);
    setError(null);
    try {
      const ahora = new Date();
      const hace24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
      
      const logs = await auditoriaService.obtenerPorRango(
        hace24h.toISOString(),
        ahora.toISOString()
      );
      setLogs(logs);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar logs de auditoría');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleFiltrar = async (filtros: AuditoriaFiltro) => {
    setCargando(true);
    setError(null);
    try {
      const logs = await auditoriaService.buscarConFiltros(filtros);
      setLogs(logs);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar logs');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleLimpiar = () => {
    cargarLogsRecientes();
  };

  const handleVerDetalle = (log: AuditoriaLog) => {
    setLogSeleccionado(log);
  };

  const handleCerrarDetalle = () => {
    setLogSeleccionado(null);
  };

  const handleExportar = () => {
    // Convertir a CSV
    const headers = ['Fecha', 'Usuario', 'Acción', 'Entidad', 'ID', 'Descripción', 'Resultado'];
    const rows = logs.map(log => [
      log.fecha,
      log.usuarioNombre,
      log.accion,
      log.entidad,
      log.entidadId || '',
      log.descripcion || '',
      log.resultado
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="auditoria-page">
      <div className="page-header">
        <div className="header-content">
          <h1>📋 Auditoría de Operaciones</h1>
          <p className="subtitle">Registro completo de todas las operaciones del sistema</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-toggle-filtros"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            {mostrarFiltros ? '🔼 Ocultar Filtros' : '🔽 Mostrar Filtros'}
          </button>
          <button 
            className="btn-exportar"
            onClick={handleExportar}
            disabled={logs.length === 0}
          >
            📥 Exportar CSV
          </button>
          <button 
            className="btn-refresh"
            onClick={cargarLogsRecientes}
            disabled={cargando}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="filtros-container">
          <FiltrosAuditoria 
            onFiltrar={handleFiltrar}
            onLimpiar={handleLimpiar}
          />
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>❌</span>
          <span>{error}</span>
        </div>
      )}

      {cargando ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando registros de auditoría...</p>
        </div>
      ) : (
        <div className="tabla-container">
          <TablaAuditoria 
            logs={logs}
            onVerDetalle={handleVerDetalle}
          />
        </div>
      )}

      {logSeleccionado && (
        <DetalleAuditoria 
          log={logSeleccionado}
          onCerrar={handleCerrarDetalle}
        />
      )}
    </div>
  );
};
