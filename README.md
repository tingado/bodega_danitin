# bodega_danitin 🏭

## Empieza aquí

- [Mapa visual, arquitectura y recorrido de los datos](docs/MAPA.md).
- [Revisión documental y pendientes](docs/REVISION.md).

> Revisión documental: 26 de octubre de 2026. La presencia de código no acredita despliegue ni pruebas aprobadas. Esta revisión no cambia lógica, datos ni configuración operativa.

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
│   ├── 08-propuesta.md      # PROPUESTO: aún no existe en el inventario revisado
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

## Estado del proyecto — código y despliegue separados

La tabla anterior del README marcaba las etapas 1–7 como pendientes, pero `docs/PROGRESO.md` las registraba completadas. El mismo registro conserva un listado de requisitos previos a producción. Por eso se distingue:

| Dimensión | Evidencia y estado |
|---|---|
| Código y documentos | Existen directorios de frontend, API, esquema y documentación. Se revisó la API, no toda la interfaz. |
| Configuración de Sheets | `SHEET_ID` conserva un placeholder en el código revisado. Falta configurar una copia de prueba. |
| Producción | No validada en esta revisión; no se consultaron el endpoint ni la planilla. |
| Propuesta ejecutiva | `docs/08-propuesta.md` figura planificada, pero no aparece en el listado actual de `docs/`. |
| Seguridad | Falta validar autenticación, autorización, concurrencia y validaciones de movimientos antes de abrir el endpoint. |

Consulta el [mapa visual](docs/MAPA.md) y la [revisión](docs/REVISION.md). El registro histórico `PROGRESO.md` se conserva sin modificar; sus marcas de finalización no acreditan por sí solas producción operativa.

## Links del Proyecto

Las referencias privadas de trabajo no se reproducen en esta entrada del repositorio.

- **Repo:** https://github.com/tingado/bodega_danitin
- **App (GitHub Pages):** *(disponible en Etapa 7)*

---

> Arquitectura sin servidor propio: Apps Script actúa como backend. Uso sujeto a cuotas, límites y condiciones de Google y de las dependencias externas.
