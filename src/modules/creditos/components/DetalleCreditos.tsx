import React, { useState, useEffect } from 'react';
import { Cliente, Credito } from '../types/creditos.types';
import { creditosApi } from '../services/creditosApi';
import { formatearMoneda } from '@/shared/utils/formatters';

interface DetalleCreditosProps {
  cliente: Cliente;
  onPagar: (creditoId: number) => void;
  onVolver: () => void;
}

export const DetalleCreditos: React.FC<DetalleCreditosProps> = ({ cliente, onPagar, onVolver }) => {
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCreditos();
  }, [cliente.id]);

  const cargarCreditos = async () => {
    try {
      const data = await creditosApi.obtenerCreditosCliente(cliente.id);
      setCreditos(data);
    } catch (error) {
      console.error('Error al cargar créditos:', error);
    } finally {
      setLoading(false);
    }
  };

  const creditosPendientes = creditos.filter(c => !c.pagado);
  const creditosPagados = creditos.filter(c => c.pagado);

  return (
    <div className="detalle-creditos">
      <div className="header">
        <button onClick={onVolver} className="btn-volver">← Volver</button>
        <h2>{cliente.nombre}</h2>
      </div>

      <div className="info-cliente">
        {cliente.telefono && <p>📞 {cliente.telefono}</p>}
        {cliente.direccion && <p>📍 {cliente.direccion}</p>}
        <div className="deuda-total">
          <h3>Deuda Total: {formatearMoneda(cliente.deudaTotal)}</h3>
        </div>
      </div>

      {loading ? (
        <p>Cargando créditos...</p>
      ) : (
        <>
          <div className="creditos-pendientes">
            <h3>Créditos Pendientes ({creditosPendientes.length})</h3>
            {creditosPendientes.map(credito => (
              <div key={credito.id} className="credito-item pendiente">
                <div className="credito-info">
                  <span className="fecha">{new Date(credito.fechaPedido).toLocaleDateString()}</span>
                  <span className="valor">{formatearMoneda(credito.valorPedido)}</span>
                  {credito.descripcion && <p className="descripcion">{credito.descripcion}</p>}
                </div>
                <button 
                  onClick={() => onPagar(credito.id)}
                  className="btn-pagar"
                >
                  Marcar como Pagado
                </button>
              </div>
            ))}
          </div>

          {creditosPagados.length > 0 && (
            <div className="creditos-pagados">
              <h3>Historial Pagado ({creditosPagados.length})</h3>
              {creditosPagados.map(credito => (
                <div key={credito.id} className="credito-item pagado">
                  <div className="credito-info">
                    <span className="fecha">{new Date(credito.fechaPedido).toLocaleDateString()}</span>
                    <span className="valor">{formatearMoneda(credito.valorPedido)}</span>
                    {credito.fechaPago && (
                      <span className="fecha-pago">
                        Pagado: {new Date(credito.fechaPago).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
