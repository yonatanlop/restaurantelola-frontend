export interface Cliente {
  id: number;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  notas: string | null;
  deudaTotal: number;
  creditosPendientes: number;
}

export interface Credito {
  id: number;
  clienteId: number;
  ventaId: number | null;
  fechaPedido: string;
  valorPedido: number;
  pagado: boolean;
  fechaPago: string | null;
  usuarioRegistroId: number | null;
  usuarioPagoId: number | null;
  descripcion: string | null;
  notas: string | null;
}

export interface RegistrarCreditoDTO {
  clienteId: number;
  ventaId: number | null;
  valorPedido: number;
  descripcion: string;
  notas: string;
  usuarioRegistroId: number;
}
