export interface Mesa {
  id: number;
  numero: string;
  capacidad: number;
  ubicacion: string;
  estado: 'LIBRE' | 'OCUPADA' | 'RESERVADA' | 'LIMPIEZA';
  ventaActualId: number | null;
  horaOcupacion: string | null;
  totalCuenta: number;
  tiempoOcupacion: number | null;
}

export interface Comanda {
  id: number;
  mesaId: number;
  ventaId: number | null;
  usuarioId: number;
  estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTA' | 'SERVIDA' | 'CANCELADA';
  fechaCreacion: string;
  fechaPreparacion: string | null;
  fechaLista: string | null;
  fechaServida: string | null;
  notas: string | null;
  detalles: ComandaDetalle[];
}

export interface ComandaDetalle {
  id: number;
  platoId: number;
  cantidad: number;
  precioUnitario: number;
  estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'SERVIDO' | 'CANCELADO';
  notas: string | null;
}

export interface CrearComandaDTO {
  mesaId: number;
  numeroMesa: string;
  usuarioId: number;
  notas: string;
  items: ItemComanda[];
}

export interface ItemComanda {
  platoId: number;
  cantidad: number;
  precioUnitario: number;
  notas: string;
}

export interface TransferenciaMesaDTO {
  mesaOrigenId: number;
  mesaDestinoId: number;
  ventaId: number;
  usuarioId: number;
  motivo: string;
}

export type EstadoMesa = 'LIBRE' | 'OCUPADA' | 'RESERVADA' | 'LIMPIEZA';
export type UbicacionMesa = 'SALON' | 'TERRAZA' | 'VIP';
