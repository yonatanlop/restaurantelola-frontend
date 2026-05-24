import React from 'react';
import { Compra } from '../types/compras.types';
import { formatearMoneda } from '@/shared/utils/formatters';

interface ListaComprasProps {
  compras: Compra[];
}

export const ListaCompras: React.FC<ListaComprasProps> = ({ compras }) => {
  return (
    <div className="lista-compras">
      <h3>Historial de Compras</h3>
      <div className="tabla-container">
        <table className="tabla-compras">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {compras.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">No hay compras registradas</td>
              </tr>
            ) : (
              compras.map(compra => (
                <tr key={compra.id}>
                  <td>{compra.id}</td>
                  <td>{new Date(compra.fecha).toLocaleString()}</td>
                  <td>{compra.proveedorNombre}</td>
                  <td className="text-right">{formatearMoneda(compra.total)}</td>
                  <td>
                    <span className={`badge badge-${compra.estado.toLowerCase()}`}>
                      {compra.estado}
                    </span>
                  </td>
                  <td>{compra.detalles?.length || 0} productos</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
