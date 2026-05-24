import React, { useState, useEffect } from 'react';

export const ConfiguracionGeneral: React.FC = () => {
  const [config, setConfig] = useState({
    nombreRestaurante: 'Restaurante Doña Lola',
    direccion: '',
    telefono: '',
    email: '',
    rtn: '',
    moneda: '$',
    impuestos: 0,
    propinasHabilitadas: false
  });

  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    // Cargar configuración desde localStorage o API
    const configGuardada = localStorage.getItem('configuracionGeneral');
    if (configGuardada) {
      setConfig(JSON.parse(configGuardada));
    }
  }, []);

  const handleChange = (campo: string, valor: any) => {
    setConfig({ ...config, [campo]: valor });
  };

  const handleGuardar = () => {
    setGuardando(true);
    // Guardar en localStorage (en producción sería una llamada a la API)
    localStorage.setItem('configuracionGeneral', JSON.stringify(config));
    
    setTimeout(() => {
      setGuardando(false);
      alert('Configuración guardada exitosamente');
    }, 500);
  };

  return (
    <div className="seccion-config">
      <h2>Información General</h2>
      <p className="descripcion">Configura la información básica del restaurante</p>

      <div className="config-form">
        <div className="form-group">
          <label>Nombre del Restaurante</label>
          <input
            type="text"
            value={config.nombreRestaurante}
            onChange={(e) => handleChange('nombreRestaurante', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            value={config.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Calle Principal #123"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={config.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={config.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contacto@restaurante.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>RTN / RUC</label>
            <input
              type="text"
              value={config.rtn}
              onChange={(e) => handleChange('rtn', e.target.value)}
              placeholder="0801-1234-567890"
            />
          </div>

          <div className="form-group">
            <label>Símbolo de Moneda</label>
            <input
              type="text"
              value={config.moneda}
              onChange={(e) => handleChange('moneda', e.target.value)}
              maxLength={3}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Impuestos (%)</label>
          <input
            type="number"
            value={config.impuestos}
            onChange={(e) => handleChange('impuestos', Number(e.target.value))}
            min="0"
            max="100"
            step="0.1"
          />
          <small>Porcentaje de impuestos aplicado a las ventas</small>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={config.propinasHabilitadas}
              onChange={(e) => handleChange('propinasHabilitadas', e.target.checked)}
            />
            <span>Habilitar propinas en ventas</span>
          </label>
        </div>

        <div className="form-actions">
          <button onClick={handleGuardar} disabled={guardando} className="btn-guardar">
            {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};
