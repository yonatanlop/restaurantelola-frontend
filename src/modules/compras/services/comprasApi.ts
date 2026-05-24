import axios from 'axios';
import { Compra, Proveedor, RegistrarCompraDTO } from '../types/compras.types';

const API_URL = 'http://localhost:8080/api';

export const comprasApi = {
  // Compras
  obtenerCompras: async (): Promise<Compra[]> => {
    const response = await axios.get(`${API_URL}/compras`);
    return response.data;
  },

  obtenerComprasPorFecha: async (inicio: string, fin: string): Promise<Compra[]> => {
    const response = await axios.get(`${API_URL}/compras/fecha`, {
      params: { inicio, fin }
    });
    return response.data;
  },

  registrarCompra: async (compra: RegistrarCompraDTO): Promise<Compra> => {
    const response = await axios.post(`${API_URL}/compras`, compra);
    return response.data;
  },

  // Proveedores
  obtenerProveedores: async (): Promise<Proveedor[]> => {
    const response = await axios.get(`${API_URL}/proveedores`);
    return response.data;
  },

  obtenerProveedoresActivos: async (): Promise<Proveedor[]> => {
    const response = await axios.get(`${API_URL}/proveedores/activos`);
    return response.data;
  },

  crearProveedor: async (proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> => {
    const response = await axios.post(`${API_URL}/proveedores`, proveedor);
    return response.data;
  },

  actualizarProveedor: async (id: number, proveedor: Partial<Proveedor>): Promise<Proveedor> => {
    const response = await axios.put(`${API_URL}/proveedores/${id}`, proveedor);
    return response.data;
  },

  cambiarEstadoProveedor: async (id: number, activo: boolean): Promise<Proveedor> => {
    const response = await axios.patch(`${API_URL}/proveedores/${id}/estado`, { activo });
    return response.data;
  }
};
