import React, { useState, useEffect } from 'react';
// import axios from 'axios';

interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  rol: string;
  activo: boolean;
}

export const ConfiguracionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    usuario: '',
    password: '',
    rol: 'CAJERO'
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      // En producción, esto vendría de la API
      // const response = await axios.get('http://localhost:8080/api/usuarios');
      // setUsuarios(response.data);
      
      // Por ahora, datos de ejemplo
      setUsuarios([
        { id: 1, nombre: 'Administrador', usuario: 'admin', rol: 'ADMIN', activo: true },
        { id: 2, nombre: 'Dueño', usuario: 'dueno', rol: 'DUENO', activo: true },
        { id: 3, nombre: 'Cajero 1', usuario: 'cajero1', rol: 'CAJERO', activo: true }
      ]);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUsuario = (id: number) => {
    setUsuarios(usuarios.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  };

  const agregarUsuario = () => {
    if (!nuevoUsuario.nombre.trim() || !nuevoUsuario.usuario.trim() || !nuevoUsuario.password) {
      alert('Complete todos los campos');
      return;
    }

    const nuevo: Usuario = {
      id: Date.now(),
      nombre: nuevoUsuario.nombre,
      usuario: nuevoUsuario.usuario,
      rol: nuevoUsuario.rol,
      activo: true
    };

    setUsuarios([...usuarios, nuevo]);
    setNuevoUsuario({ nombre: '', usuario: '', password: '', rol: 'CAJERO' });
    setMostrarFormulario(false);
    alert('Usuario creado exitosamente');
  };

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  return (
    <div className="seccion-config">
      <h2>Gestión de Usuarios</h2>
      <p className="descripcion">Administra los usuarios del sistema</p>

      <div className="usuarios-lista">
        {usuarios.map(usuario => (
          <div key={usuario.id} className="usuario-item">
            <div className="usuario-info">
              <h4>{usuario.nombre}</h4>
              <p className="usuario-username">@{usuario.usuario}</p>
              <span className={`badge badge-rol-${usuario.rol.toLowerCase()}`}>
                {usuario.rol}
              </span>
            </div>
            <div className="usuario-acciones">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={usuario.activo}
                  onChange={() => toggleUsuario(usuario.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {!mostrarFormulario ? (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn-agregar-usuario"
        >
          + Agregar Usuario
        </button>
      ) : (
        <div className="formulario-usuario">
          <h4>Nuevo Usuario</h4>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={nuevoUsuario.nombre}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
              placeholder="Juan Pérez"
            />
          </div>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={nuevoUsuario.usuario}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, usuario: e.target.value })}
              placeholder="juanperez"
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={nuevoUsuario.password}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select
              value={nuevoUsuario.rol}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
            >
              <option value="CAJERO">Cajero</option>
              <option value="DUENO">Dueño</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div className="form-actions">
            <button onClick={() => setMostrarFormulario(false)} className="btn-cancelar">
              Cancelar
            </button>
            <button onClick={agregarUsuario} className="btn-guardar">
              Crear Usuario
            </button>
          </div>
        </div>
      )}

      <div className="info-box">
        <h4>ℹ️ Roles del Sistema</h4>
        <ul>
          <li><strong>CAJERO:</strong> Acceso al punto de venta</li>
          <li><strong>DUENO:</strong> Acceso completo al sistema</li>
          <li><strong>ADMIN:</strong> Acceso administrativo total</li>
        </ul>
      </div>
    </div>
  );
};
