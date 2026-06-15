# PROGRESO — bodega_danitin

> Este archivo es el **contexto de continuidad entre sesiones de IA**.
> Al iniciar una nueva sesión, subí SOLO este archivo para retomar el trabajo.

---

## Estado General

**Etapa actual:** 1 — Levantamiento del Flujo Físico  
**Última sesión:** 2026-06-15  
**Repo:** https://github.com/tingado/bodega_danitin  
**Notion:** https://app.notion.com/p/380e678b8e978059ac59eac0484ada38  
**Drive:** https://drive.google.com/drive/folders/1gDPVEfz4KDgbtgyRsyCjHjlxJzwnzmxd  

---

## Etapas

| # | Etapa | Estado | Fecha |
|---|---|---|---|
| 0 | Cimientos del repositorio | ✅ Completado | 2026-06-15 |
| 1 | Levantamiento del flujo físico | 🔄 Siguiente | — |
| 2 | Modelo de datos (esquema Sheets) | ⬜ Pendiente | — |
| 3 | API Serverless (Apps Script) | ⬜ Pendiente | — |
| 4 | Módulo QR | ⬜ Pendiente | — |
| 5 | Frontend CRUD | ⬜ Pendiente | — |
| 6 | Dashboard y métricas | ⬜ Pendiente | — |
| 7 | Despliegue GitHub Pages | ⬜ Pendiente | — |
| 8 | Propuesta comercial final | ⬜ Pendiente | — |

---

## Decisiones Tomadas

- **Stack:** HTML/JS puro + Apps Script + Google Sheets (serverless, sin backend)
- **Frontend:** Sin framework (GitHub Pages directo, sin build)
- **QR:** `qrcode.js` para generar + `html5-qrcode` para escanear desde navegador
- **Gráficos:** Chart.js vía CDN
- **Nombre del repo:** `bodega_danitin` (usuario: `tingado`)
- **Hojas de Sheets:** Items, Ubicaciones, Movimientos, Config

---

## Archivos Creados en Etapa 0

```
bodega_danitin/
├── README.md                  ✅
├── docs/
│   ├── architecture.md        ✅
│   └── PROGRESO.md            ✅ (este archivo)
├── data-schema/               ✅ (carpeta vacía — se puebla en Etapa 2)
├── apps-script/               ✅ (carpeta vacía — se puebla en Etapa 3)
└── frontend/js/               ✅ (carpeta vacía — se puebla en Etapa 5)
```

---

## Instrucciones para la Etapa 1 (próxima sesión)

**Objetivo:** Traducir los videos/imágenes de la bodega en un mapa lógico de zonas.

**Cómo procesar:**
1. Abrí una sesión nueva de IA
2. Subí este archivo `PROGRESO.md` como primer mensaje
3. Subí UN video o imagen de la bodega
4. Pedí: *"Basándote en este material, extraé en tabla Markdown: zonas, pasillos, estantes, niveles y tipos de objetos almacenados."*
5. Guardá el resultado como `docs/01-flujo-fisico.md`
6. Repetí con el siguiente video/imagen
7. En la última sesión de esta etapa: consolidá todas las tablas en un solo archivo

**Entregable:** `docs/01-flujo-fisico.md` con:
- Tabla de zonas (nombre, descripción, tipo de ítems que contiene)
- Tabla de ubicaciones (zona, pasillo, estante, nivel)
- Catálogo de tipos de objetos/ítems con campos relevantes

---

## Log de Sesiones

| Fecha | Sesión | Qué se hizo | Archivos tocados |
|---|---|---|---|
| 2026-06-15 | 1 | Planificación, benchmarking, setup Notion/Drive/GitHub, Etapa 0 completa | README.md, architecture.md, PROGRESO.md |
