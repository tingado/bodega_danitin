# Arquitectura del Sistema — bodega_danitin

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BODEGA FÍSICA                                │
│   Pasillo A / Estante 1 / Nivel 2  →  Etiqueta QR pegada al ítem  │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ escaneo con celular / tablet
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   FRONTEND (GitHub Pages)                           │
│                                                                     │
│   index.html          dashboard.html         config.js             │
│   ├── qr.js           └── dashboard.js       └── API_URL           │
│   │   ├── generar QR       └── Chart.js                            │
│   │   └── escanear QR                                              │
│   └── app.js                                                        │
│       ├── alta/edición de ítems                                     │
│       ├── registro de movimientos                                   │
│       └── alertas de stock mínimo                                   │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ HTTP GET / POST (fetch API)
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│              API SERVERLESS (Google Apps Script)                    │
│                                                                     │
│   Code.gs                                                           │
│   ├── doGet(e)   → leer ítems, ubicaciones, stats                  │
│   └── doPost(e)  → crear/actualizar ítem, registrar movimiento     │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ SpreadsheetApp API
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 BASE DE DATOS (Google Sheets)                       │
│                                                                     │
│   Hoja: Items          Hoja: Ubicaciones                           │
│   ├── id (PK)          ├── id (PK)                                 │
│   ├── nombre           ├── zona                                    │
│   ├── descripcion      ├── pasillo                                 │
│   ├── categoria        ├── estante                                 │
│   ├── stock_actual     └── nivel                                   │
│   ├── stock_minimo                                                 │
│   ├── ubicacion_id     Hoja: Movimientos                           │
│   └── qr_code          ├── id (PK)                                 │
│                        ├── item_id (FK)                            │
│   Hoja: Config         ├── tipo (entrada/salida)                   │
│   ├── clave            ├── cantidad                                │
│   └── valor            ├── fecha                                   │
│                        └── responsable                             │
└─────────────────────────────────────────────────────────────────────┘
```

## Decisiones de Diseño

### Por qué Google Sheets como BD
- Cero costo de infraestructura
- El cliente puede ver y editar datos directamente si lo necesita
- La API de Sheets (vía Apps Script) es suficientemente rápida para el volumen de una bodega mediana
- No requiere conocimientos de administración de bases de datos

### Por qué Apps Script como API
- Serverless nativo de Google — sin configurar servidores
- Se despliega como Web App con una URL pública en segundos
- Cuota gratuita amplia: 6 min/ejecución, 20.000 llamadas/día
- Se autentica automáticamente con la hoja del mismo Google Account

### Por qué HTML/JS puro (sin framework)
- Desplegable directamente en GitHub Pages sin proceso de build
- Carga instantánea — no hay bundle de React/Vue que parsear
- Mantenible por cualquier desarrollador sin conocer ecosistemas específicos
- Suficiente para la complejidad de este sistema

### Por qué QR y no código de barras 1D
- El QR puede codificar el ID completo (UUID) sin colisiones
- Legible con cualquier cámara de celular sin hardware adicional
- La librería `html5-qrcode` permite escaneo directo desde el navegador

## Modelo de Seguridad

```
Apps Script Web App
├── "Execute as": Me (cuenta del propietario)
└── "Who has access": Anyone   ← simplicidad para MVP
```

> Para producción se puede agregar un token de API en el header o query param que el Apps Script valide antes de procesar la solicitud.

## Flujo de un Movimiento de Entrada

```
1. Operario escanea QR del ítem con celular
2. html5-qrcode decodifica el ID del ítem
3. app.js hace GET /api?action=getItem&id=XXX → Apps Script → Sheets
4. Se muestra el formulario pre-cargado con datos del ítem
5. Operario ingresa cantidad y confirma
6. app.js hace POST /api con {item_id, tipo:"entrada", cantidad, responsable}
7. Apps Script escribe nueva fila en hoja Movimientos y actualiza stock en Items
8. Frontend muestra confirmación + nuevo stock actual
```

## Flujo de Alerta de Stock Mínimo

```
1. En cada operación de salida, Apps Script compara stock_actual con stock_minimo
2. Si stock_actual ≤ stock_minimo → responde con flag "alerta: true"
3. Frontend muestra banner de alerta rojo con el ítem y stock actual
4. Dashboard también marca el ítem en rojo en la vista de inventario
```

## Referencias Técnicas

| Librería / Herramienta | Versión sugerida | CDN |
|---|---|---|
| qrcode.js (generar QR) | 1.5.3 | `cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js` |
| html5-qrcode (escanear) | 2.3.8 | `unpkg.com/html5-qrcode` |
| Chart.js (dashboard) | 4.4.x | `cdn.jsdelivr.net/npm/chart.js` |
| Google Apps Script | (sin versión — siempre actualizado) | — |
