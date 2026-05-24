export interface AuditoriaLog {
  id: number;
  usuarioId: number | null;
  usuarioNombre: string;
  accion: string;
  entidad: string;
  entidadId: number | null;
  descripcion: string;
  datosAnteriores: string | null;
  datosNuevos: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  fecha: string;
  resultado: 'EXITOSO' | 'FALLIDO';
  mensajeError: string | null;
}

export interface AuditoriaFiltro {
  fechaInicio?: string;
  fechaFin?: string;
  usuarioId?: number;
  accion?: string;
  entidad?: string;
  entidadId?: number;
}

export type AccionAuditoria = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'AJUSTE' 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'ERROR';

export type EntidadAuditoria = 
  | 'VENTA' 
  | 'PLATO' 
  | 'INSUMO' 
  | 'INVENTARIO' 
  | 'EMPLEADO' 
  | 'NOMINA' 
  | 'COMPRA' 
  | 'MESA' 
  | 'COMANDA' 
  | 'USUARIO';
