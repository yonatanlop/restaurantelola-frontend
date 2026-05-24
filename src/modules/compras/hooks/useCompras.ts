import { useState, useEffect } from 'react';
import { Compra, Proveedor } from '../types/compras.types';
import { comprasApi } from '../services/comprasApi';

export const useCompras = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [comprasData, proveedoresData] = await Promise.all([
        comprasApi.obtenerCompras(),
        comprasApi.obtenerProveedores()
      ]);
      setCompras(comprasData);
      setProveedores(proveedoresData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    compras,
    proveedores,
    loading,
    recargar: cargarDatos
  };
};
