# Contrato de la API — bodega_danitin

> Implementada en Google Apps Script como Web App (`doGet` / `doPost`)  
> URL base: `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec`

---

## Endpoints GET

### GET ?action=getItems
Retorna todos los ítems activos.

**Request:** `?action=getItems`  
**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "item-001",
      "nombre": "Sillón Ejecutivo m+Design 222",
      "categoria": "MUEBLE",
      "ubicacion_id": "UB-01",
      "stock_actual": 1,
      "stock_minimo": 0,
      "estado_item": "en_stock",
      "alerta": false
    }
  ]
}
```

---

### GET ?action=getItem&id={item_id}
Retorna un ítem por ID.

**Request:** `?action=getItem&id=item-001`  
**Response:**
```json
{
  "ok": true,
  "data": { /* objeto Item completo con todos los campos */ },
  "alerta": false
}
```
**Error:**
```json
{ "ok": false, "error": "Item no encontrado" }
```

---

### GET ?action=getUbicaciones
Retorna todas las ubicaciones activas.

**Request:** `?action=getUbicaciones`  
**Response:**
```json
{
  "ok": true,
  "data": [
    { "id": "UB-01", "zona_id": "Z-01", "zona_nombre": "Entrada / Tránsito", "estante": "", "nivel": "piso" }
  ]
}
```

---

### GET ?action=getMovimientos&item_id={item_id}
Retorna los últimos 50 movimientos de un ítem.

**Request:** `?action=getMovimientos&item_id=item-001`  
**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "mov-20260615-001",
      "tipo": "entrada",
      "cantidad": 1,
      "responsable": "admin",
      "fecha": "15/06/2026 14:30",
      "stock_resultante": 1
    }
  ]
}
```

---

### GET ?action=getStats
Retorna estadísticas para el dashboard.

**Request:** `?action=getStats`  
**Response:**
```json
{
  "ok": true,
  "data": {
    "total_items": 14,
    "items_en_stock": 12,
    "items_en_transito": 1,
    "items_con_alerta": 2,
    "movimientos_hoy": 5,
    "stock_por_zona": [
      { "zona": "Z-02", "nombre": "Rack Azul", "cantidad": 6 },
      { "zona": "Z-03", "nombre": "Estante Madera", "cantidad": 4 }
    ],
    "ultimos_movimientos": [ /* últimos 10 */ ]
  }
}
```

---

### GET ?action=searchItems&q={query}
Búsqueda por nombre o categoría.

**Request:** `?action=searchItems&q=sillon`  
**Response:** igual a `getItems` pero filtrado.

---

## Endpoints POST

Todos los POST reciben `Content-Type: application/json` en el body.

### POST action=createItem
Crea un nuevo ítem.

**Body:**
```json
{
  "action": "createItem",
  "data": {
    "nombre": "Sillón Ejecutivo m+Design 222",
    "categoria": "MUEBLE",
    "subcategoria": "Silla de oficina",
    "ubicacion_id": "UB-01",
    "stock_actual": 1,
    "stock_minimo": 0,
    "estado_embalaje": "en_caja_original",
    "estado_item": "en_stock",
    "requiere_dos_personas": false,
    "creado_por": "admin"
  }
}
```
**Response:**
```json
{
  "ok": true,
  "id": "item-001",
  "qr_code": "item-001"
}
```

---

### POST action=updateItem
Actualiza campos de un ítem existente.

**Body:**
```json
{
  "action": "updateItem",
  "id": "item-001",
  "data": {
    "ubicacion_id": "UB-07",
    "notas": "Movido al estante madera"
  }
}
```
**Response:**
```json
{ "ok": true }
```

---

### POST action=registrarMovimiento
Registra un movimiento (entrada/salida/traslado/ajuste).

**Body:**
```json
{
  "action": "registrarMovimiento",
  "data": {
    "item_id": "item-001",
    "tipo": "salida",
    "cantidad": 1,
    "ubicacion_destino_id": "",
    "motivo": "Venta cliente",
    "responsable": "Juan Pérez"
  }
}
```
**Response (sin alerta):**
```json
{
  "ok": true,
  "stock_resultante": 0,
  "alerta": false
}
```
**Response (con alerta de stock mínimo):**
```json
{
  "ok": true,
  "stock_resultante": 0,
  "alerta": true,
  "alerta_mensaje": "Stock de 'Sillón Ejecutivo' llegó al mínimo (0 unidades)"
}
```
**Error (stock insuficiente):**
```json
{
  "ok": false,
  "error": "Stock insuficiente. Actual: 0, solicitado: 1"
}
```

---

## Códigos de Error

| Código | Significado |
|---|---|
| `ITEM_NOT_FOUND` | El item_id no existe en la hoja Items |
| `UBICACION_NOT_FOUND` | El ubicacion_id no existe en la hoja Ubicaciones |
| `STOCK_INSUFICIENTE` | La salida dejaría el stock en negativo |
| `MISSING_FIELD` | Falta un campo requerido en el body |
| `INVALID_ACTION` | El parámetro `action` no existe |
