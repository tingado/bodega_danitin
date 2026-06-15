# bodega_danitin 🏭

Sistema web de gestión de bodegas con escaneo/generación de códigos QR, respaldado por Google Sheets como base de datos documental y desplegable en GitHub Pages sin backend tradicional.

## ¿Qué hace este sistema?

```
[Bodega Física] → [Etiqueta QR] → [Frontend GitHub Pages] → [Apps Script API] → [Google Sheets]
  ubicaciones       ID del ítem      scanner + dashboard       capa serverless    1 fila = 1 doc
```

- **Escanear o generar QR** vinculado al ID único de cada ítem de bodega
- **Registrar movimientos** de entrada y salida con ubicación física
- **Alertas de stock mínimo** configurables por ítem
- **Dashboard de métricas** con gráficos de stock por ubicación (Chart.js)
- **Sin servidor propio** — todo corre sobre Google Apps Script + GitHub Pages

## Stack Técnico

| Capa | Tecnología | Rol |
|---|---|---|
| Base de datos | Google Sheets | 1 fila = 1 documento (ítems, ubicaciones, movimientos) |
| API | Google Apps Script (`doGet` / `doPost`) | Endpoint serverless REST |
| QR | `qrcode.js` + `html5-qrcode` | Generación y escaneo en el navegador |
| Frontend | HTML / CSS / JS puro | Sin framework, desplegable en GitHub Pages |
| Gráficos | Chart.js | Dashboard de stock y movimientos |

## Estructura del Proyecto

```
bodega_danitin/
├── README.md
├── docs/
│   ├── architecture.md      # Arquitectura y decisiones de diseño
│   ├── 01-flujo-fisico.md   # Mapa de zonas y ubicaciones de la bodega
│   ├── 03-api-contract.md   # Contrato de la API (rutas + JSON)
│   ├── 07-deploy.md         # Guía de despliegue
│   ├── 08-propuesta.md      # Propuesta ejecutiva final
│   └── PROGRESO.md          # Continuidad entre sesiones de desarrollo IA
├── data-schema/
│   ├── schema.md            # Definición de hojas y tipos de campo
│   └── Sheets-template.csv  # Plantilla importable a Google Sheets
├── apps-script/
│   └── Code.gs              # API serverless (Google Apps Script)
└── frontend/
    ├── index.html           # App principal (CRUD + escáner QR)
    ├── dashboard.html       # Dashboard de métricas
    ├── config.js            # URL de la API (Apps Script Web App)
    └── js/
        ├── app.js           # Lógica CRUD y navegación
        ├── qr.js            # Módulo de generación y escaneo QR
        └── dashboard.js     # Gráficos Chart.js
```

## Referencias de Arquitectura

| Patrón | Repo de referencia |
|---|---|
| Modelo de datos Sheets-as-DB | [ProxxiTech/HardInventory](https://github.com/ProxxiTech/HardInventory) |
| CRUD React↔Sheets | [Alex-Gichau/react-to-googlesheets](https://github.com/Alex-Gichau/react-to-googlesheets) |
| Lógica QR + movimientos | [sagar15795/QR-Code_inventory_management](https://github.com/sagar15795/QR-Code_inventory_management) |
| API doGet() + Chart.js | [Google Apps Script topics](https://github.com/topics/google-apps-script) |

## Estado del Proyecto

| Etapa | Descripción | Estado |
|---|---|---|
| 0 | Cimientos del repositorio | ✅ Completado |
| 1 | Levantamiento del flujo físico | ⬜ Pendiente |
| 2 | Modelo de datos (esquema Sheets) | ⬜ Pendiente |
| 3 | API Serverless (Apps Script) | ⬜ Pendiente |
| 4 | Módulo QR | ⬜ Pendiente |
| 5 | Frontend CRUD | ⬜ Pendiente |
| 6 | Dashboard y métricas | ⬜ Pendiente |
| 7 | Despliegue GitHub Pages | ⬜ Pendiente |
| 8 | Propuesta comercial final | ⬜ Pendiente |

## Links del Proyecto

- **Repo:** https://github.com/tingado/bodega_danitin
- **Notion:** https://app.notion.com/p/380e678b8e978059ac59eac0484ada38
- **Drive:** https://drive.google.com/drive/folders/1gDPVEfz4KDgbtgyRsyCjHjlxJzwnzmxd
- **App (GitHub Pages):** *(disponible en Etapa 7)*

---

> Proyecto desarrollado con arquitectura serverless — sin backend propio, sin costos de infraestructura.
