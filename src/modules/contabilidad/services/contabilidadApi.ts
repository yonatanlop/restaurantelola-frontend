import httpClient from '@/shared/api/httpClient'
import { ResumenCaja } from '@/shared/types/contabilidad'

const toQuery = (date: string) => encodeURIComponent(date)

export const obtenerResumenCaja = async (inicio: string, fin: string): Promise<ResumenCaja> => {
  const response = await httpClient.get(
    `/api/contabilidad/resumen?inicio=${toQuery(inicio)}&fin=${toQuery(fin)}`
  )
  const data = response.data ?? {}
  return {
    fechaInicio: data.fechaInicio ?? inicio,
    fechaFin: data.fechaFin ?? fin,
    totalIngresos: Number(data.totalIngresos ?? 0),
    totalEgresos: Number(data.totalEgresos ?? 0),
    saldo: Number(data.saldo ?? 0),
    cantidadMovimientos: Number(data.cantidadMovimientos ?? 0),
    ingresosVentas: Number(data.ingresosVentas ?? 0),
    egresosCompras: Number(data.egresosCompras ?? 0),
    egresosNomina: Number(data.egresosNomina ?? 0),
    egresosOtros: Number(data.egresosOtros ?? 0)
  }
}

