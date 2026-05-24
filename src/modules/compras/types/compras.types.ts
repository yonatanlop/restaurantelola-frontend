export interface Proveedor {
  id: number;
  nombre: string;
  contacto: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  activo: boolean;
}

export interface CompraDetalle {
  id?: number;
  insumoId: number;
  insumoNombre?: string;
  unidadMedida?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Compra {
  id: number;
  proveedorId: number;
  proveedorNombre?: string;
  fecha: string;
  total: number;
  estado: string;
  notas: string | null;
  registradoPor: number;
  detalles: CompraDetalle[];
}

export interface RegistrarCompraDTO {
  proveedorId: number;
  notas: string;
  registradoPor: number;
  detalles: CompraDetalle[];
}
