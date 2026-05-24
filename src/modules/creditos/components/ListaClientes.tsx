import React from 'react';
import { Cliente } from '../types/creditos.types';
import { formatearMoneda } from '@/shared/utils/formatters';

interface ListaClientesProps {
  clientes: Cliente[];
  onSeleccionar: (cliente: Cliente) => void;
}

export const ListaClientes: React.FC<ListaClientesProps> = ({ clientes, onSeleccionar }) => {
  return (
    <div className="lista-clientes">
      <h3>Clientes con Crédito</h3>
      <div className="clientes-grid">
        {clientes.map(cliente => (
          <div 
            key={cliente.id} 
            className="cliente-card"
            onClick={() => onSeleccionar(cliente)}
          >
            <h4>{cliente.nombre}</h4>
            {cliente.telefono && <p>📞 {cliente.telefono}</p>}
            <div className="cliente-deuda">
              <span className="label">Deuda Total:</span>
              <span className="valor">{formatearMoneda(cliente.deudaTotal)}</span>
            </div>
            <div className="cliente-pendientes">
              <span className="badge">{cliente.creditosPendientes} pendientes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
