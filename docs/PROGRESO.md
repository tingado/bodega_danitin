# PROGRESO — bodega_danitin

> Este archivo es el **contexto de continuidad entre sesiones de IA**.
> Al iniciar una nueva sesión, subí SOLO este archivo para retomar el trabajo.

---

## Estado General

**Etapa actual:** 8 — Propuesta Comercial Final  
**Última sesión:** 2026-06-15  
**Repo:** https://github.com/tingado/bodega_danitin  
**Notion:** https://app.notion.com/p/380e678b8e978059ac59eac0484ada38  
**Drive:** https://drive.google.com/drive/folders/1gDPVEfz4KDgbtgyRsyCjHjlxJzwnzmxd  

---

## Etapas

| # | Etapa | Estado | Fecha |
|---|---|---|---|
| 0 | Cimientos del repositorio | ✅ Completado | 2026-06-15 |
| 1 | Levantamiento del flujo físico | ✅ Completado | 2026-06-15 |
| 2 | Modelo de datos (esquema Sheets) | ✅ Completado | 2026-06-15 |
| 3 | API Serverless (Apps Script) | ✅ Completado | 2026-06-15 |
| 4 | Módulo QR | ✅ Completado | 2026-06-15 |
| 5 | Frontend CRUD | ✅ Completado | 2026-06-15 |
| 6 | Dashboard y métricas | ✅ Completado | 2026-06-15 |
| 7 | Despliegue GitHub Pages | ✅ Completado | 2026-06-15 |
| 8 | Propuesta comercial final | 🔄 Siguiente | — |

---

## Decisiones Tomadas

- **Stack:** HTML/JS puro + Apps Script + Google Sheets (serverless, sin backend)
- **Frontend:** Sin framework (GitHub Pages directo, sin build)
- **QR:** `qrcode.js` (generar) + `html5-qrcode` (escanear desde navegador)
- **Gráficos:** Chart.js 4.4 vía CDN
- **Repo:** `https://github.com/tingado/bodega_danitin`
- **Hojas de Sheets:** Items (19 campos), Ubicaciones (14 pre-cargadas), Movimientos (append-only), Config
- **6 zonas** identificadas desde video IMG_0879.MOV
- **12 categorías** de objetos catalogadas

---

## Archivos del Proyecto

```
bodega_danitin/
├── README.md                        ✅
├── docs/
│   ├── architecture.md              ✅ Arquitectura + decisiones de diseño
│   ├── 01-flujo-fisico.md           ✅ 6 zonas, 14 ubicaciones, 12 categorías
│   ├── 03-api-contract.md           ✅ 6 GET + 3 POST con JSON de req/res
│   ├── 07-deploy.md                 ✅ Guía paso a paso (Sheets + Apps Script + Pages)
│   └── PROGRESO.md                  ✅ Este archivo
├── data-schema/
│   ├── schema.md                    ✅ 4 hojas con campos tipados
│   └── Sheets-template.csv          ✅ Importable directamente en Sheets
├── apps-script/
│   └── Code.gs                      ✅ API completa (reemplazar SHEET_ID)
└── frontend/
    ├── index.html                   ✅ App principal (listado + CRUD + escáner QR)
    ├── dashboard.html               ✅ Dashboard KPIs + Chart.js
    ├── config.js                    ✅ Reemplazar API_URL con URL de Apps Script
    └── js/
        ├── app.js                   ✅ Lógica CRUD + movimientos + navegación
        ├── qr.js                    ✅ Generar + escanear QR
        └── dashboard.js             ✅ Gráficos zona/estados + últimos movimientos
```

---

## Pendiente ANTES de que funcione en producción

1. Crear Google Sheet y copiar encabezados de `data-schema/schema.md`
2. Pegar `Code.gs` en Apps Script, reemplazar `SHEET_ID`
3. Desplegar Apps Script como Web App → copiar URL
4. Reemplazar `API_URL` en `frontend/config.js`
5. Activar GitHub Pages en Settings del repo
6. (Opcional) Mover contenido de `frontend/` a raíz para URL limpia

## Próximo paso — Etapa 8

Generar `docs/08-propuesta.md`: documento ejecutivo presentable con alcance, funcionalidades, stack técnico, cronograma estimado, y ventajas competitivas de la solución serverless.

---

## Log de Sesiones

| Fecha | Sesión | Qué se hizo | Archivos tocados |
|---|---|---|---|
| 2026-06-15 | 1 | Planificación, benchmarking, setup Notion/Drive/GitHub | — |
| 2026-06-15 | 2 | Etapas 0-7 completas: repo, flujo físico, schema, API, QR, frontend, dashboard, deploy | Todos los archivos del proyecto |
