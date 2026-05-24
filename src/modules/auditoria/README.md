# 📋 Módulo de Auditoría - Frontend

## Descripción
Interfaz completa para visualizar y consultar los registros de auditoría del sistema.

## Estructura del Módulo

```
auditoria/
├── components/
│   ├── FiltrosAuditoria.tsx      # Filtros de búsqueda
│   ├── TablaAuditoria.tsx        # Tabla de logs
│   └── DetalleAuditoria.tsx      # Modal de detalles
├── pages/
│   └── AuditoriaPage.tsx         # Página principal
├── services/
│   └── auditoria.service.ts      # Servicios API
├── types/
│   └── auditoria.types.ts        # Tipos TypeScript
├── styles/
│   └── auditoria.css             # Estilos
├── index.ts                      # Exports
└── README.md                     # Este archivo
```

## Características

### ✅ Implementadas

1. **Visualización de Logs**
   - Tabla completa con todos los registros
   - Información detallada por log
   - Formato de fechas en español
   - Badges de colores por tipo de acción
   - Indicadores de resultado (exitoso/fallido)

2. **Filtros de Búsqueda**
   - Por rango de fechas
   - Por tipo de acción
   - Por entidad
   - Por ID de entidad
   - Por usuario
   - Combinación de filtros

3. **Detalles de Log**
   - Modal con información completa
   - Visualización de datos anteriores (JSON)
   - Visualización de datos nuevos (JSON)
   - Información técnica (IP, User Agent)
   - Mensajes de error (si aplica)

4. **Funcionalidades Extra**
   - Exportación a CSV
   - Actualización manual
   - Carga automática de últimas 24 horas
   - Mostrar/ocultar filtros
   - Responsive design

### 🎨 Componentes

#### AuditoriaPage
Página principal que orquesta todo el módulo.

**Props:** Ninguna

**Estado:**
- `logs`: Array de logs de auditoría
- `logSeleccionado`: Log seleccionado para ver detalles
- `cargando`: Estado de carga
- `error`: Mensaje de error
- `mostrarFiltros`: Toggle de filtros

#### FiltrosAuditoria
Componente de filtros de búsqueda.

**Props:**
```typescript
{
  onFiltrar: (filtros: AuditoriaFiltro) => void;
  onLimpiar: () => void;
}
```

#### TablaAuditoria
Tabla de logs con formato y badges.

**Props:**
```typescript
{
  logs: AuditoriaLog[];
  onVerDetalle: (log: AuditoriaLog) => void;
}
```

#### DetalleAuditoria
Modal con detalles completos del log.

**Props:**
```typescript
{
  log: AuditoriaLog;
  onCerrar: () => void;
}
```

## Uso

### Instalación de Dependencias

```bash
cd tialola-frontend
npm install
```

Esto instalará `date-fns` que se agregó al package.json.

### Acceso a la Página

1. Iniciar sesión como **DUENO**
2. Ir a **Menú Avanzado**
3. Clic en **Auditoría**

URL: `http://localhost:3000/dueno/avanzado/auditoria`

### Ejemplos de Uso

#### Buscar logs de hoy
```typescript
// Los filtros se configuran automáticamente al cargar
// Muestra las últimas 24 horas por defecto
```

#### Buscar por usuario específico
```typescript
// En el filtro "ID Usuario" ingresar el ID
// Clic en "Buscar"
```

#### Buscar por tipo de acción
```typescript
// Seleccionar acción en el dropdown
// Ejemplo: "CREATE", "UPDATE", "DELETE"
// Clic en "Buscar"
```

#### Ver detalles de un log
```typescript
// Clic en el botón "👁️ Ver" en cualquier fila
// Se abre modal con detalles completos
```

#### Exportar a CSV
```typescript
// Clic en "📥 Exportar CSV"
// Se descarga archivo con todos los logs visibles
```

## API Endpoints Utilizados

```typescript
GET  /api/auditoria/usuario/{id}           // Por usuario
GET  /api/auditoria/entidad/{entidad}/{id} // Por entidad
GET  /api/auditoria/accion/{accion}        // Por acción
GET  /api/auditoria/rango?inicio=&fin=     // Por rango
POST /api/auditoria/buscar                 // Con filtros
```

## Tipos de Datos

### AuditoriaLog
```typescript
interface AuditoriaLog {
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
```

### AuditoriaFiltro
```typescript
interface AuditoriaFiltro {
  fechaInicio?: string;
  fechaFin?: string;
  usuarioId?: number;
  accion?: string;
  entidad?: string;
  entidadId?: number;
}
```

## Estilos

Los estilos están en `styles/auditoria.css` e incluyen:

- Diseño responsive
- Badges de colores por tipo
- Modal con overlay
- Tabla con hover effects
- Formato de JSON con syntax highlighting
- Loading spinner
- Estados de error

### Colores de Badges

| Acción | Color | Clase CSS |
|--------|-------|-----------|
| CREATE | Verde | badge-success |
| UPDATE | Azul | badge-info |
| DELETE | Rojo | badge-danger |
| AJUSTE | Amarillo | badge-warning |
| LOGIN | Azul primario | badge-primary |
| LOGOUT | Gris | badge-secondary |
| ERROR | Rojo | badge-error |

## Personalización

### Cambiar formato de fecha
Editar en `TablaAuditoria.tsx` y `DetalleAuditoria.tsx`:
```typescript
format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss', { locale: es })
```

### Cambiar colores de badges
Editar en `auditoria.css`:
```css
.badge-success {
  background: #d4edda;
  color: #155724;
}
```

### Agregar más filtros
Editar `FiltrosAuditoria.tsx` y agregar campos al formulario.

## Testing

### Probar con datos reales

1. Realizar operaciones en el sistema:
   - Crear una venta
   - Actualizar un plato
   - Ajustar inventario
   - Registrar nómina

2. Ir a Auditoría

3. Verificar que aparezcan los logs

### Probar filtros

1. Aplicar diferentes combinaciones de filtros
2. Verificar que los resultados sean correctos
3. Probar exportación a CSV

## Troubleshooting

### No aparecen logs
- Verificar que el backend esté corriendo
- Verificar que la tabla `auditoria_logs` exista en la BD
- Verificar que haya operaciones registradas

### Error al cargar
- Verificar conexión con el backend
- Verificar que el usuario tenga rol DUENO
- Ver consola del navegador para errores

### Fechas incorrectas
- Verificar zona horaria del servidor
- Verificar formato de fecha en el backend

## Próximas Mejoras

- [ ] Paginación de resultados
- [ ] Gráficos de actividad
- [ ] Dashboard de auditoría
- [ ] Filtros guardados
- [ ] Alertas en tiempo real
- [ ] Comparación de cambios (diff viewer)
- [ ] Exportación a Excel con formato
- [ ] Búsqueda de texto completo

## Notas

- El módulo requiere rol **DUENO** para acceder
- Los logs se cargan automáticamente (últimas 24 horas)
- La exportación CSV incluye solo los logs visibles
- Los datos JSON se formatean automáticamente
- El modal de detalles es scrolleable para logs grandes
