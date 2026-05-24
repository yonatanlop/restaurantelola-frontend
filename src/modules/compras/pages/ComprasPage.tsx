import React, { useState } from 'react';
import { useCompras } from '../hooks/useCompras';
import { ListaCompras } from '../components/ListaCompras';
import { ModalNuevaCompra } from '../components/ModalNuevaCompra';
import { ModalNuevoProveedor } from '../components/ModalNuevoProveedor';
import { formatearMoneda } from '@/shared/utils/formatters';
import './ComprasPage.css';

export const ComprasPage: React.FC = () => {
  const { compras, proveedores, loading, recargar } = useCompras();
  const [mostrarModalCompra, setMostrarModalCompra] = useState(false);
  const [mostrarModalProveedor, setMostrarModalProveedor] = useState(false);

  const totalCompras = compras.reduce((sum, c) => sum + c.total, 0);

  if (loading) {
    return <div className="compras-page">Cargando...</div>;
  }

  return (
    <div className="compras-page">
      <div className="compras-header">
        <h1>Gestión de Compras</h1>
        <div className="header-actions">
          <button 
            onClick={() => setMostrarModalProveedor(true)}
            className="btn-nuevo-proveedor"
          >
            + Nuevo Proveedor
          </button>
          <button 
            onClick={() => setMostrarModalCompra(true)}
            className="btn-nueva-compra"
          >
            + Registrar Compra
          </button>
        </div>
      </div>

      <div className="compras-resumen">
        <div className="resumen-card">
          <h3>Total Compras</h3>
          <p className="numero">{compras.length}</p>
        </div>
        <div className="resumen-card">
          <h3>Proveedores Activos</h3>
          <p className="numero">{proveedores.filter(p => p.activo).length}</p>
        </div>
        <div className="resumen-card destacado">
          <h3>Monto Total</h3>
          <p className="numero">{formatearMoneda(totalCompras)}</p>
        </div>
      </div>

      <ListaCompras compras={compras} />

      {mostrarModalCompra && (
        <ModalNuevaCompra
          proveedores={proveedores.filter(p => p.activo)}
          onClose={() => setMostrarModalCompra(false)}
          onCompraRegistrada={recargar}
        />
      )}

      {mostrarModalProveedor && (
        <ModalNuevoProveedor
          onClose={() => setMostrarModalProveedor(false)}
          onProveedorCreado={recargar}
        />
      )}
    </div>
  );
};
