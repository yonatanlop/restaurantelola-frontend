export interface ResumenVentas {
  totalVentas: number;
  cantidadOrdenes: number;
  ticketPromedio: number;
  variacionPorcentual: number;
}

export interface PlatoPopular {
  platoId: number;
  nombrePlato: string;
  cantidadVendida: number;
  totalVentas: number;
  categoria: string;
}

export interface AlertaStock {
  insumoId: number;
  nombreInsumo: string;
  cantidadActual: number;
  stockMinimo: number;
  unidadMedida: string;
  nivelAlerta: 'CRITICO' | 'BAJO' | 'MEDIO';
}

export interface EstadoCaja {
  saldoActual: number;
  ingresosHoy: number;
  egresosHoy: number;
  fecha: string;
}

export interface TendenciaVentas {
  fecha: string;
  totalVentas: number;
  cantidadOrdenes: number;
}

export interface DashboardData {
  ventasHoy: ResumenVentas;
  ventasSemana: ResumenVentas;
  ventasMes: ResumenVentas;
  topPlatos: PlatoPopular[];
  alertasStock: AlertaStock[];
  estadoCaja: EstadoCaja;
  tendenciasSemanal: TendenciaVentas[];
}
