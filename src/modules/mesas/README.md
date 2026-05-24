# 🍽️ Módulo de Gestión de Mesas - Frontend

## Descripción
Sistema visual e interactivo para gestionar mesas del restaurante con control de estados, ocupación y comandas.

## Estructura del Módulo

```
mesas/
├── components/
│   ├── TarjetaMesa.tsx           # Tarjeta visual de mesa
│   ├── ModalMesa.tsx             # Modal con detalles y acciones
│   └── FiltrosMesas.tsx          # Filtros por estado y ubicación
├── pages/
│   └── MesasPage.tsx             # Página principal
├── services/
│   └── mesas.service.ts          # Servicios API
├── types/
│   └── mesas.types.ts            # Tipos TypeScript
├── styles/
│   └── mesas.css                 # Estilos
├── index.ts                      # Exports
└── README.md                     # Este archivo
```

## Características

### ✅ Implementadas

1. **Vista de Plano de Mesas**
   - Grid visual con todas las mesas
   - Tarjetas con información clave
   - Colores por estado
   - Iconos visuales

2. **Estados de Mesa**
   - 🟢 LIBRE - Disponible
   - 🔴 OCUPADA - Con clientes
   - 🟡 RESERVADA - Reservación activa
   - 🧹 LIMPIEZA - En proceso de limpieza

3. **Ubicaciones**
   - 🏠 SALON - Salón principal
   - 🌳 TERRAZA - Área exterior
   - ⭐ VIP - Área VIP

4. **Información por Mesa**
   - Número de mesa
   - Capacidad (personas)
   - Estado actual
   - Ubicación
   - Tiempo de ocupación (si está ocupada)
   - Total de cuenta (si está ocupada)

5. **Filtros**
   - Por estado (Todas, Libres, Ocupadas, Reservadas, Limpieza)
   - Por ubicación (Todas, Salón, Terraza, VIP)
   - Combinación de filtros

6. **Estadísticas**
   - Total de mesas
   - Mesas libres
   - Mesas ocupadas
   - Mesas reservadas

7. **Acciones sobre Mesas**
   - Ocupar mesa
   - Liberar mesa
   - Cambiar estado
   - Ver comandas (preparado)
   - Transferir mesa (preparado)

8. **Funcionalidades Extra**
   - Auto-actualización cada 30 segundos
   - Actualización manual
   - Modal con detalles completos
   - Responsive design

## Componentes

### MesasPage
Página principal con grid de mesas y filtros.

**Características:**
- Carga automática de mesas
- Auto-actualización cada 30 segundos
- Filtros interactivos
- Estadísticas en tiempo real

### TarjetaMesa
Tarjeta visual para cada mesa.

**Props:**
```typescript
{
  mesa: Mesa;
  onClick: (mesa: Mesa) => void;
}
```

**Características:**
- Color por estado
- Información resumida
- Hover effects
- Click para ver detalles

### ModalMesa
Modal con detalles completos y acciones.

**Props:**
```typescript
{
  mesa: Mesa;
  onCerrar: () => void;
  onOcupar: (mesaId: number) => void;
  onLiberar: (mesaId: number) => void;
  onTransferir: (mesaId: number) => void;
  onVerComandas: (mesaId: number) => void;
  onCambiarEstado: (mesaId: number, estado: string) => void;
}
```

### FiltrosMesas
Botones de filtro por estado y ubicación.

**Props:**
```typescript
{
  estadoFiltro: string;
  ubicacionFiltro: string;
  onEstadoChange: (estado: string) => void;
  onUbicacionChange: (ubicacion: string) => void;
}
```

## Uso

### Acceso a la Página

1. Iniciar sesión como **DUENO**
2. Ir a **Menú Avanzado**
3. Clic en **Mesas**

URL: `http://localhost:3000/dueno/avanzado/mesas`

### Flujo de Trabajo

#### 1. Ver Estado de Mesas
- Al entrar, se muestra el plano completo
- Estadísticas en la parte superior
- Filtros disponibles

#### 2. Ocupar una Mesa
1. Clic en una mesa LIBRE
2. Se abre modal con detalles
3. Clic en "🔴 Ocupar Mesa"
4. Mesa cambia a OCUPADA

#### 3. Ver Detalles de Mesa Ocupada
1. Clic en una mesa OCUPADA
2. Ver tiempo de ocupación
3. Ver total de cuenta
4. Opciones disponibles

#### 4. Liberar una Mesa
1. Clic en mesa OCUPADA
2. Clic en "✅ Liberar Mesa"
3. Confirmar
4. Mesa cambia a LIBRE

#### 5. Cambiar Estado
1. Clic en cualquier mesa
2. Clic en "⚙️ Cambiar Estado"
3. Seleccionar nuevo estado
4. Estado se actualiza

#### 6. Filtrar Mesas
1. Usar botones de filtro
2. Ver solo mesas que coincidan
3. Combinar filtros de estado y ubicación

## API Endpoints Utilizados

### Mesas
```typescript
GET  /api/mesas                          // Todas las mesas
GET  /api/mesas/estado/{estado}         // Por estado
GET  /api/mesas/ubicacion/{ubicacion}   // Por ubicación
POST /api/mesas/{id}/ocupar             // Ocupar
POST /api/mesas/{id}/liberar            // Liberar
POST /api/mesas/transferir              // Transferir
PATCH /api/mesas/{id}/estado            // Cambiar estado
```

### Comandas (Preparado)
```typescript
POST  /api/comandas                      // Crear comanda
GET   /api/comandas/mesa/{id}           // Por mesa
GET   /api/comandas/pendientes          // Pendientes
PATCH /api/comandas/{id}/estado         // Cambiar estado
```

## Tipos de Datos

### Mesa
```typescript
interface Mesa {
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
```

## Estilos

Los estilos están en `styles/mesas.css` e incluyen:

- Grid responsive
- Tarjetas con colores por estado
- Modal con overlay
- Filtros interactivos
- Estadísticas visuales
- Hover effects
- Animaciones suaves

### Colores por Estado

| Estado | Color | Borde |
|--------|-------|-------|
| LIBRE | Verde | #27ae60 |
| OCUPADA | Rojo | #e74c3c |
| RESERVADA | Amarillo | #f39c12 |
| LIMPIEZA | Gris | #95a5a6 |

## Requisitos Previos

### Base de Datos
Ejecutar script SQL:
```bash
psql -U postgres -d restaurante_lola -f database/scripts/06_mesas_tables.sql
```

Esto crea:
- Tabla `mesas` con 12 mesas de ejemplo
- Tabla `comandas`
- Tabla `comanda_detalles`
- Tabla `transferencias_mesa`

## Testing

### Probar Visualización
1. Ir a la página de mesas
2. Verificar que aparezcan las 12 mesas
3. Verificar estadísticas
4. Verificar colores por estado

### Probar Filtros
1. Clic en "Libres"
2. Solo deben aparecer mesas libres
3. Clic en "Salón"
4. Solo mesas del salón
5. Combinar filtros

### Probar Ocupar Mesa
1. Clic en mesa libre
2. Clic en "Ocupar Mesa"
3. Verificar que cambie a OCUPADA
4. Verificar que aparezca tiempo de ocupación

### Probar Liberar Mesa
1. Clic en mesa ocupada
2. Clic en "Liberar Mesa"
3. Confirmar
4. Verificar que cambie a LIBRE

### Probar Cambio de Estado
1. Clic en cualquier mesa
2. Clic en "Cambiar Estado"
3. Seleccionar "Limpieza"
4. Verificar cambio

## Troubleshooting

### No aparecen mesas
- Verificar que el backend esté corriendo
- Ejecutar script SQL
- Ver consola del navegador

### Error al ocupar mesa
- Verificar que la mesa esté LIBRE
- Ver logs del backend
- Verificar permisos

### Filtros no funcionan
- Verificar que haya mesas con esos estados
- Limpiar filtros y volver a aplicar

## Próximas Mejoras

- [ ] Implementar comandas completas
- [ ] Implementar transferencia de mesas
- [ ] Vista de cocina con comandas pendientes
- [ ] Reservaciones con fecha/hora
- [ ] División de cuentas
- [ ] Mapa visual interactivo
- [ ] Drag & drop para transferir
- [ ] Notificaciones en tiempo real
- [ ] Historial de ocupación
- [ ] Estadísticas de rotación

## Notas

- El módulo requiere rol **DUENO** para acceder
- Las mesas se actualizan automáticamente cada 30 segundos
- El tiempo de ocupación se calcula en tiempo real
- Los colores ayudan a identificar rápidamente el estado
- El sistema está preparado para comandas (próxima implementación)
