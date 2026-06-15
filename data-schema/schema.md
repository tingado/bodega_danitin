# Schema de Google Sheets — bodega_danitin

> Basado en: docs/01-flujo-fisico.md + patrón ProxxiTech/HardInventory  
> Cada hoja = una colección documental. Cada fila = un documento.

---

## Hoja 1: Items

Colección principal. Un registro por ítem físico de la bodega.

| Columna | Campo | Tipo | Requerido | Valores posibles / Ejemplo |
|---|---|---|---|---|
| A | `id` | STRING (UUID) | ✅ | `item-001`, `550e8400-e29b-41d4-a716` |
| B | `nombre` | STRING | ✅ | "Sillón Ejecutivo m+Design 222" |
| C | `descripcion` | STRING | — | "Negro con ruedas, respaldo malla" |
| D | `categoria` | STRING (enum) | ✅ | Ver tabla Categorías abajo |
| E | `subcategoria` | STRING | — | "Silla de oficina" |
| F | `ubicacion_id` | STRING (FK → Ubicaciones.id) | ✅ | `UB-01` |
| G | `stock_actual` | NUMBER (entero) | ✅ | `1` |
| H | `stock_minimo` | NUMBER (entero) | ✅ | `0` |
| I | `estado_embalaje` | STRING (enum) | ✅ | `en_caja_original` / `en_film` / `sin_embalaje` / `en_contenedor` |
| J | `estado_item` | STRING (enum) | ✅ | `en_stock` / `en_transito` / `pendiente_despacho` / `dado_de_baja` |
| K | `requiere_dos_personas` | BOOLEAN | ✅ | `TRUE` / `FALSE` |
| L | `valor_estimado` | NUMBER (decimal) | — | `45000` |
| M | `moneda` | STRING | — | `CLP` / `USD` |
| N | `foto_url` | STRING (URL) | — | `https://drive.google.com/...` |
| O | `notas` | STRING | — | "Detrás del carro de madera" |
| P | `qr_code` | STRING | — | *(generado automáticamente por el sistema)* |
| Q | `fecha_ingreso` | DATE (DD/MM/YYYY) | ✅ | `15/06/2026` |
| R | `fecha_actualizacion` | DATE (DD/MM/YYYY) | ✅ | *(actualizado en cada movimiento)* |
| S | `creado_por` | STRING | ✅ | "admin" |

**Categorías válidas (campo D):**
`MUEBLE` · `EQUIPAJE_BOLSO` · `TEXTIL_ROPA` · `CONTENEDOR_PLASTICO` · `CAJA_CARTON` · `ELECTRODOMESTICO` · `HERRAMIENTA_BODEGA` · `ITEM_EMBALADO` · `OTRO`

---

## Hoja 2: Ubicaciones

Catálogo de posiciones físicas. Un registro por ubicación única.

| Columna | Campo | Tipo | Requerido | Ejemplo |
|---|---|---|---|---|
| A | `id` | STRING | ✅ | `UB-01` |
| B | `zona_id` | STRING (FK → Zonas) | ✅ | `Z-01` |
| C | `zona_nombre` | STRING | ✅ | "Entrada / Tránsito" |
| D | `estante` | STRING | — | "Rack Azul" / "Estante Madera" / `—` (piso) |
| E | `nivel` | STRING (enum) | ✅ | `piso` / `N1` / `N2` / `N3` / `pallet` |
| F | `descripcion` | STRING | — | "Sector izquierdo, segunda fila desde arriba" |
| G | `capacidad_max` | NUMBER | — | `5` *(unidades estimadas)* |
| H | `activa` | BOOLEAN | ✅ | `TRUE` / `FALSE` |

**Zonas predefinidas (del flujo físico):**

| zona_id | zona_nombre |
|---|---|
| Z-01 | Entrada / Tránsito |
| Z-02 | Rack Azul-Naranja (Izquierda) |
| Z-03 | Estante Madera-Naranja (Centro-Derecha) |
| Z-04 | Piso / Pallet (Fondo) |
| Z-05 | Estante de Chapa (Rincón) |
| Z-06 | Pasillo Central (libre) |

---

## Hoja 3: Movimientos

Log inmutable de entradas y salidas. Nunca se edita, solo se agrega.

| Columna | Campo | Tipo | Requerido | Ejemplo |
|---|---|---|---|---|
| A | `id` | STRING (UUID) | ✅ | `mov-20260615-001` |
| B | `item_id` | STRING (FK → Items.id) | ✅ | `item-001` |
| C | `tipo` | STRING (enum) | ✅ | `entrada` / `salida` / `traslado` / `ajuste` |
| D | `cantidad` | NUMBER (entero) | ✅ | `1` |
| E | `ubicacion_origen_id` | STRING (FK → Ubicaciones.id) | — | `UB-01` *(vacío en entrada)* |
| F | `ubicacion_destino_id` | STRING (FK → Ubicaciones.id) | — | `UB-07` *(vacío en salida)* |
| G | `motivo` | STRING | — | "Venta cliente X" / "Reposición" |
| H | `responsable` | STRING | ✅ | "Juan Pérez" |
| I | `fecha` | DATETIME (DD/MM/YYYY HH:MM) | ✅ | `15/06/2026 14:30` |
| J | `stock_resultante` | NUMBER | ✅ | `2` *(calculado al momento)* |
| K | `notas` | STRING | — | "Revisado físicamente" |

**Tipos de movimiento:**
- `entrada` → ítem ingresa a la bodega (stock sube)
- `salida` → ítem sale de la bodega (stock baja)
- `traslado` → cambia de ubicación dentro de la bodega (stock no cambia)
- `ajuste` → corrección manual por conteo físico (stock puede subir o bajar)

---

## Hoja 4: Config

Tabla clave-valor para configuración global del sistema.

| Columna | Campo | Tipo | Ejemplo |
|---|---|---|---|
| A | `clave` | STRING | `alerta_stock_minimo_global` |
| B | `valor` | STRING | `TRUE` |
| C | `descripcion` | STRING | "Activar alertas globales de stock mínimo" |

**Registros iniciales:**

| clave | valor | descripcion |
|---|---|---|
| `nombre_bodega` | `Bodega Danitin` | Nombre que aparece en el frontend |
| `responsable_default` | `admin` | Responsable por defecto en movimientos |
| `alerta_stock_minimo` | `TRUE` | Activar alertas de stock mínimo |
| `moneda_default` | `CLP` | Moneda por defecto para valores |
| `version_schema` | `1.0` | Versión del esquema para migraciones |

---

## Reglas de Integridad

1. `Items.ubicacion_id` debe existir en `Ubicaciones.id`
2. `Movimientos.item_id` debe existir en `Items.id`
3. `Items.stock_actual` nunca puede ser negativo (validar en Apps Script)
4. Al registrar una `salida`, si `stock_actual - cantidad < stock_minimo` → responder con `alerta: true`
5. Al registrar un `traslado`, actualizar `Items.ubicacion_id` al `ubicacion_destino_id`
6. `Movimientos` es append-only — nunca DELETE ni UPDATE sobre esta hoja
