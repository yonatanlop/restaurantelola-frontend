import { useState, useEffect } from 'react';
import { Cliente, Credito } from '../types/creditos.types';
import { creditosApi } from '../services/creditosApi';

export const useCreditos = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [creditosPendientes, setCreditosPendientes] = useState<Credito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await creditosApi.obtenerClientes();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarCreditosPendientes = async () => {
    try {
      setLoading(true);
      const data = await creditosApi.obtenerCreditosPendientes();
      setCreditosPendientes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar créditos pendientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
    cargarCreditosPendientes();
  }, []);

  return {
    clientes,
    creditosPendientes,
    loading,
    error,
    recargar: () => {
      cargarClientes();
      cargarCreditosPendientes();
    }
  };
};
