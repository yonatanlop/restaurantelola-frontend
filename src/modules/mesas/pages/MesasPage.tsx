import React, { useState, useEffect } from 'react';
import { TarjetaMesa } from '../components/TarjetaMesa';
import { ModalMesa } from '../components/ModalMesa';
import { FiltrosMesas } from '../components/FiltrosMesas';
import { mesasService } from '../services/mesas.service';
import { Mesa } from '../types/mesas.types';
import '../styles/mesas.css';

export const MesasPage: React.FC = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [mesasFiltradas, setMesasFiltradas] = useState<Mesa[]>([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [ubicacionFiltro, setUbicacionFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarMesas = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await mesasService.obtenerTodasLasMesas();
      setMesas(data);
      aplicarFiltros(data, estadoFiltro, ubicacionFiltro);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las mesas');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMesas();
    
    // Auto-actualizar cada 30 segundos
    const interval = setInterval(cargarMesas, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    aplicarFiltros(mesas, estadoFiltro, ubicacionFiltro);
  }, [estadoFiltro, ubicacionFiltro, mesas]);

  const aplicarFiltros = (mesasData: Mesa[], estado: string, ubicacion: string) => {
    let filtradas = [...mesasData];

    if (estado) {
      filtradas = filtradas.filter(m => m.estado === estado);
    }

    if (ubicacion) {
      filtradas = filtradas.filter(m => m.ubicacion === ubicacion);
    }

    setMesasFiltradas(filtradas);
  };

  const handleMesaClick = (mesa: Mesa) => {
    setMesaSeleccionada(mesa);
  };

  const handleCerrarModal = () => {
    setMesaSeleccionada(null);
  };

  const handleOcuparMesa = async (mesaId: number) => {
    try {
      // Por ahora, crear una venta temporal
      // En producción, esto debería abrir el POS o crear una venta real
      const ventaId = Date.now(); // ID temporal
      await mesasService.ocuparMesa(mesaId, ventaId);
      await cargarMesas();
      setMesaSeleccionada(null);
      alert('Mesa ocupada exitosamente');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al ocupar la mesa');
    }
  };

  const handleLiberarMesa = async (mesaId: number) => {
    if (!confirm('¿Está seguro de liberar esta mesa?')) return;
    
    try {
      await mesasService.liberarMesa(mesaId);
      await cargarMesas();
      setMesaSeleccionada(null);
      alert('Mesa liberada exitosamente');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al liberar la mesa');
    }
  };

  const handleTransferirMesa = (_mesaId: number) => {
    alert('Funcionalidad de transferencia en desarrollo');
    // TODO: Implementar modal de transferencia
  };

  const handleVerComandas = (_mesaId: number) => {
    alert('Funcionalidad de comandas en desarrollo');
    // TODO: Implementar vista de comandas
  };

  const handleCambiarEstado = async (mesaId: number, estado: string) => {
    try {
      await mesasService.cambiarEstadoMesa(mesaId, estado);
      await cargarMesas();
      setMesaSeleccionada(null);
      alert(`Estado cambiado a ${estado}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cambiar el estado');
    }
  };

  const contarPorEstado = (estado: string) => {
    return mesas.filter(m => m.estado === estado).length;
  };

  if (cargando && mesas.length === 0) {
    return (
      <div className="mesas-loading">
        <div className="spinner-large"></div>
        <p>Cargando mesas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mesas-error">
        <div className="error-icon">❌</div>
        <h2>Error al cargar las mesas</h2>
        <p>{error}</p>
        <button className="btn-retry" onClick={cargarMesas}>
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="mesas-page">
      <div className="mesas-header">
        <div className="header-content">
          <h1>🍽️ Gestión de Mesas</h1>
          <p className="subtitle">Control de mesas y comandas del restaurante</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-actualizar"
            onClick={cargarMesas}
            disabled={cargando}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className="mesas-stats">
        <div className="stat-card stat-total">
          <span className="stat-icon">🍽️</span>
          <div className="stat-info">
            <span className="stat-label">Total Mesas</span>
            <span className="stat-valor">{mesas.length}</span>
          </div>
        </div>
        <div className="stat-card stat-libre">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-label">Libres</span>
            <span className="stat-valor">{contarPorEstado('LIBRE')}</span>
          </div>
        </div>
        <div className="stat-card stat-ocupada">
          <span className="stat-icon">🔴</span>
          <div className="stat-info">
            <span className="stat-label">Ocupadas</span>
            <span className="stat-valor">{contarPorEstado('OCUPADA')}</span>
          </div>
        </div>
        <div className="stat-card stat-reservada">
          <span className="stat-icon">🟡</span>
          <div className="stat-info">
            <span className="stat-label">Reservadas</span>
            <span className="stat-valor">{contarPorEstado('RESERVADA')}</span>
          </div>
        </div>
      </div>

      <FiltrosMesas
        estadoFiltro={estadoFiltro}
        ubicacionFiltro={ubicacionFiltro}
        onEstadoChange={setEstadoFiltro}
        onUbicacionChange={setUbicacionFiltro}
      />

      <div className="mesas-grid">
        {mesasFiltradas.length === 0 ? (
          <div className="empty-state">
            <p>No hay mesas que coincidan con los filtros seleccionados</p>
          </div>
        ) : (
          mesasFiltradas.map((mesa) => (
            <TarjetaMesa
              key={mesa.id}
              mesa={mesa}
              onClick={handleMesaClick}
            />
          ))
        )}
      </div>

      {mesaSeleccionada && (
        <ModalMesa
          mesa={mesaSeleccionada}
          onCerrar={handleCerrarModal}
          onOcupar={handleOcuparMesa}
          onLiberar={handleLiberarMesa}
          onTransferir={handleTransferirMesa}
          onVerComandas={handleVerComandas}
          onCambiarEstado={handleCambiarEstado}
        />
      )}
    </div>
  );
};
