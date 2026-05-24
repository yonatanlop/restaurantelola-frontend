import httpClient from '@/shared/api/httpClient'

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// Convierte fecha YYYY-MM-DD a LocalDateTime ISO (inicio: 00:00:00, fin: 23:59:59)
const formatDateTime = (fecha: string, esFin: boolean = false): string => {
  return esFin ? `${fecha}T23:59:59` : `${fecha}T00:00:00`
}

const buildParams = (inicio: string, fin: string, metodoPago?: string, tipoComida?: string) =>
  new URLSearchParams({
    inicio: formatDateTime(inicio, false),
    fin: formatDateTime(fin, true),
    ...(metodoPago && { metodoPago }),
    ...(tipoComida && { tipoComida })
  }).toString()

const endpoint = (tipo: string, formato: 'excel' | 'pdf') => {
  if (tipo === 'COMPRAS') return `/api/reportes/compras/${formato}`
  if (tipo === 'CAJA') return `/api/reportes/caja/${formato}`
  return `/api/reportes/ventas/${formato}`
}

export const generarReporteExcel = async (
  tipo: string,
  inicio: string,
  fin: string,
  metodoPago?: string,
  tipoComida?: string
) => {
  try {
    const response = await httpClient.get(
      `${endpoint(tipo, 'excel')}?${buildParams(inicio, fin, metodoPago, tipoComida)}`,
      { responseType: 'blob' }
    )
    // Verificar si la respuesta es realmente un blob válido (no un error)
    if (response.data instanceof Blob && response.data.size > 0) {
      downloadBlob(response.data, `reporte_${tipo.toLowerCase()}_${Date.now()}.xlsx`)
    } else {
      throw new Error('Respuesta inválida del servidor')
    }
  } catch (error: any) {
    // Si el error viene como blob, intentar leerlo como texto
    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text()
      try {
        const jsonError = JSON.parse(text)
        throw new Error(jsonError.message || 'Error al generar el reporte')
      } catch {
        throw new Error('Error al generar el reporte Excel')
      }
    }
    throw error
  }
}

export const generarReportePdf = async (
  tipo: string,
  inicio: string,
  fin: string,
  metodoPago?: string,
  tipoComida?: string
) => {
  try {
    const response = await httpClient.get(
      `${endpoint(tipo, 'pdf')}?${buildParams(inicio, fin, metodoPago, tipoComida)}`,
      { responseType: 'blob' }
    )
    // Verificar si la respuesta es realmente un blob válido (no un error)
    if (response.data instanceof Blob && response.data.size > 0) {
      downloadBlob(response.data, `reporte_${tipo.toLowerCase()}_${Date.now()}.pdf`)
    } else {
      throw new Error('Respuesta inválida del servidor')
    }
  } catch (error: any) {
    // Si el error viene como blob, intentar leerlo como texto
    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text()
      try {
        const jsonError = JSON.parse(text)
        throw new Error(jsonError.message || 'Error al generar el reporte')
      } catch {
        throw new Error('Error al generar el reporte PDF')
      }
    }
    throw error
  }
}
