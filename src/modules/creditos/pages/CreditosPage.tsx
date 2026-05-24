import React, { useState } from 'react';
import { useCreditos } from '../hooks/useCreditos';
import { ListaClientes } from '../components/ListaClientes';
import { DetalleCreditos } from '../components/DetalleCreditos';
import { ModalNuevoCliente } from '../components/ModalNuevoCliente';
import { Cliente } from '../types/creditos.types';
import { creditosApi } from '../services/creditosApi';
import { formatearMoneda } from '@/shared/utils/formatters';
import './CreditosPage.css';

export const CreditosPage: React.FC = () => {
  const { clientes, creditosPendientes, loading, recargar } = useCreditos();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

  const handlePagarCredito = async (creditoId: number) => {
    const usuarioId = parseInt(localStorage.getItem('usuarioId') || '1');
    
    if (confirm('¿Marcar este crédito como pagado?')) {
      try {
        await creditosApi.marcarComoPagado(creditoId, usuarioId);
        recargar();
        if (clienteSeleccionado) {
          const clienteActualizado = await creditosApi.obtenerClientePorId(clienteSeleccionado.id);
          setClienteSeleccionado(clienteActualizado);
        }
      } catch (error) {
        console.error('Error al marcar como pagado:', error);
        alert('Error al procesar el pago');
      }
    }
  };

  const deudaTotalGeneral = clientes.reduce((sum, c) => sum + c.deudaTotal, 0);

  if (loading) {
    return <div className="creditos-page">Cargando...</div>;
  }

  return (
    <div className="creditos-page">
      <div className="creditos-header">
        <h1>Sistema de Créditos</h1>
        <button 
          onClick={() => setMostrarModalNuevo(true)}
          className="btn-nuevo-cliente"
        >
          + Nuevo Cliente
        </button>
      </div>

      <div className="creditos-resumen">
        <div className="resumen-card">
          <h3>Total Clientes</h3>
          <p className="numero">{clientes.length}</p>
        </div>
        <div className="resumen-card">
          <h3>Créditos Pendientes</h3>
          <p className="numero">{creditosPendientes.length}</p>
        </div>
        <div className="resumen-card destacado">
          <h3>Deuda Total</h3>
          <p className="numero">{formatearMoneda(deudaTotalGeneral)}</p>
        </div>
      </div>

      {clienteSeleccionado ? (
        <DetalleCreditos
          cliente={clienteSeleccionado}
          onPagar={handlePagarCredito}
          onVolver={() => setClienteSeleccionado(null)}
        />
      ) : (
        <ListaClientes
          clientes={clientes}
          onSeleccionar={setClienteSeleccionado}
        />
      )}

      {mostrarModalNuevo && (
        <ModalNuevoCliente
          onClose={() => setMostrarModalNuevo(false)}
          onClienteCreado={recargar}
        />
      )}
    </div>
  );
};
