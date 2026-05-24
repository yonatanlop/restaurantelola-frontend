import React, { useState, useEffect } from 'react';
import { TarjetaMetrica } from '../components/TarjetaMetrica';
import { GraficoTendencias } from '../components/GraficoTendencias';
import { TopPlatos } from '../components/TopPlatos';
import { AlertasStock } from '../components/AlertasStock';
import { EstadoCaja } from '../components/EstadoCaja';
import { dashboardService } from '../services/dashboard.service';
import { DashboardData } from '../types/dashboard.types';
import { formatearMoneda } from '@/shared/utils/formatters';
import '../styles/dashboard.css';

export const DashboardPage: React.FC = () => {
  const [datos, setDatos] = useState<DashboardData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date());

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await dashboardService.obtenerDashboard();
      setDatos(data);
      setUltimaActualizacion(new Date());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el dashboard');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    
    // Auto-actualizar cada 5 minutos
    const interval = setInterval(cargarDatos, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (cargando && !datos) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">❌</div>
        <h2>Error al cargar el dashboard</h2>
        <p>{error}</p>
        <button className="btn-retry" onClick={cargarDatos}>
          🔄 Reintentar
        </button>
      </div>
    );
  }

  if (!datos) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📊 Dashboard de Indicadores</h1>
          <p className="subtitle">Vista general del rendimiento del restaurante</p>
        </div>
        <div className="header-actions">
          <div className="ultima-actualizacion">
            <span className="label">Última actualización:</span>
            <span className="tiempo">{ultimaActualizacion.toLocaleTimeString()}</span>
          </div>
          <button 
            className="btn-actualizar"
            onClick={cargarDatos}
            disabled={cargando}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Sección: Ventas de Hoy */}
      <section className="dashboard-section">
        <h2 className="section-header">📅 Ventas de Hoy</h2>
        <div className="metricas-grid">
          <TarjetaMetrica
            titulo="Total Ventas"
            valor={formatearMoneda(datos.ventasHoy.totalVentas)}
            icono="💰"
            subtitulo={`${datos.ventasHoy.cantidadOrdenes} órdenes`}
            variacion={datos.ventasHoy.variacionPorcentual}
            color="green"
          />
          <TarjetaMetrica
            titulo="Ticket Promedio"
            valor={formatearMoneda(datos.ventasHoy.ticketPromedio)}
            icono="🎫"
            subtitulo="Por orden"
            color="blue"
          />
          <TarjetaMetrica
            titulo="Órdenes"
            valor={datos.ventasHoy.cantidadOrdenes}
            icono="📋"
            subtitulo="Total del día"
            color="purple"
          />
        </div>
      </section>

      {/* Sección: Ventas de la Semana */}
      <section className="dashboard-section">
        <h2 className="section-header">📆 Ventas de la Semana</h2>
        <div className="metricas-grid">
          <TarjetaMetrica
            titulo="Total Semana"
            valor={formatearMoneda(datos.ventasSemana.totalVentas)}
            icono="💵"
            subtitulo={`${datos.ventasSemana.cantidadOrdenes} órdenes`}
            variacion={datos.ventasSemana.variacionPorcentual}
            color="green"
          />
          <TarjetaMetrica
            titulo="Promedio Diario"
            valor={formatearMoneda(datos.ventasSemana.totalVentas / 7)}
            icono="📊"
            subtitulo="Últimos 7 días"
            color="blue"
          />
        </div>
      </section>

      {/* Sección: Ventas del Mes */}
      <section className="dashboard-section">
        <h2 className="section-header">📅 Ventas del Mes</h2>
        <div className="metricas-grid">
          <TarjetaMetrica
            titulo="Total Mes"
            valor={formatearMoneda(datos.ventasMes.totalVentas)}
            icono="💎"
            subtitulo={`${datos.ventasMes.cantidadOrdenes} órdenes`}
            variacion={datos.ventasMes.variacionPorcentual}
            color="purple"
          />
          <TarjetaMetrica
            titulo="Ticket Promedio"
            valor={formatearMoneda(datos.ventasMes.ticketPromedio)}
            icono="🎯"
            subtitulo="Del mes"
            color="orange"
          />
        </div>
      </section>

      {/* Sección: Gráfico de Tendencias */}
      <section className="dashboard-section">
        <GraficoTendencias datos={datos.tendenciasSemanal} />
      </section>

      {/* Sección: Top Platos y Alertas */}
      <section className="dashboard-section">
        <div className="two-columns">
          <div className="column">
            <TopPlatos platos={datos.topPlatos} />
          </div>
          <div className="column">
            <AlertasStock alertas={datos.alertasStock} />
          </div>
        </div>
      </section>

      {/* Sección: Estado de Caja */}
      <section className="dashboard-section">
        <EstadoCaja estado={datos.estadoCaja} />
      </section>
    </div>
  );
};
