import React, { useState } from 'react';
import { ConfiguracionGeneral } from '../components/ConfiguracionGeneral';
import { ConfiguracionImpresoras } from '../components/ConfiguracionImpresoras';
import { ConfiguracionUsuarios } from '../components/ConfiguracionUsuarios';
import './ConfiguracionPage.css';

export const ConfiguracionPage: React.FC = () => {
  const [seccionActiva, setSeccionActiva] = useState<'general' | 'impresoras' | 'usuarios'>('general');

  return (
    <div className="configuracion-page">
      <div className="configuracion-header">
        <h1>⚙️ Configuración del Sistema</h1>
        <p className="subtitle">Administra los ajustes del restaurante</p>
      </div>

      <div className="configuracion-container">
        <div className="configuracion-sidebar">
          <button
            className={`sidebar-item ${seccionActiva === 'general' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('general')}
          >
            <span className="icon">🏪</span>
            <span>General</span>
          </button>
          <button
            className={`sidebar-item ${seccionActiva === 'impresoras' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('impresoras')}
          >
            <span className="icon">🖨️</span>
            <span>Impresoras</span>
          </button>
          <button
            className={`sidebar-item ${seccionActiva === 'usuarios' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('usuarios')}
          >
            <span className="icon">👥</span>
            <span>Usuarios</span>
          </button>
        </div>

        <div className="configuracion-content">
          {seccionActiva === 'general' && <ConfiguracionGeneral />}
          {seccionActiva === 'impresoras' && <ConfiguracionImpresoras />}
          {seccionActiva === 'usuarios' && <ConfiguracionUsuarios />}
        </div>
      </div>
    </div>
  );
};
