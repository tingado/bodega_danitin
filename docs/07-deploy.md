# Guía de Despliegue — bodega_danitin

## Paso 1 — Crear el Google Sheet

1. Ir a [sheets.google.com](https://sheets.google.com) → **Nuevo spreadsheet**
2. Renombrarlo: `bodega_danitin_db`
3. Crear 4 hojas con exactamente estos nombres (sensible a mayúsculas):
   - `Items`
   - `Ubicaciones`
   - `Movimientos`
   - `Config`
4. En cada hoja, agregar los encabezados de la **fila 1** según `data-schema/schema.md`
5. Copiar los datos iniciales del archivo `data-schema/Sheets-template.csv` en las hojas `Ubicaciones` y `Config`
6. Copiar el **ID del spreadsheet** desde la URL:
   ```
   https://docs.google.com/spreadsheets/d/  ← ESTE_ES_EL_ID  /edit
   ```

---

## Paso 2 — Desplegar el Apps Script

1. En el spreadsheet, ir a **Extensiones → Apps Script**
2. Eliminar el contenido inicial del archivo `Code.gs`
3. Pegar el contenido completo de `apps-script/Code.gs` de este repo
4. En la línea 4, reemplazar:
   ```javascript
   const SHEET_ID = 'TU_SHEET_ID_AQUI';
   // →
   const SHEET_ID = 'el_id_copiado_en_el_paso_1';
   ```
5. Guardar (`Ctrl+S`)
6. Clic en **Implementar → Nueva implementación**
   - Tipo: **Aplicación web**
   - Descripción: `v1.0`
   - Ejecutar como: **Yo** (tu cuenta Google)
   - Quién tiene acceso: **Cualquier persona**
7. Clic en **Implementar** → Autorizar los permisos
8. Copiar la **URL de la aplicación web** que aparece al finalizar:
   ```
   https://script.google.com/macros/s/ABC.../exec
   ```

---

## Paso 3 — Configurar el Frontend

1. Abrir `frontend/config.js`
2. Reemplazar:
   ```javascript
   API_URL: 'TU_APPS_SCRIPT_URL_AQUI',
   // →
   API_URL: 'https://script.google.com/macros/s/ABC.../exec',
   ```
3. Guardar y hacer commit:
   ```bash
   git add frontend/config.js
   git commit -m "config: agregar URL de la API de producción"
   git push origin main
   ```

---

## Paso 4 — Activar GitHub Pages

1. En el repo [tingado/bodega_danitin](https://github.com/tingado/bodega_danitin), ir a **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / Carpeta: `/ (root)`

   > ⚠️ El `index.html` está en `/frontend/`, no en la raíz. Opciones:
   > - **Opción A (recomendada):** Mover `frontend/` a la raíz del repo en el próximo commit
   > - **Opción B:** Crear un `index.html` en la raíz que redirija a `frontend/index.html`

4. Guardar. En 1-2 minutos estará disponible en:
   ```
   https://tingado.github.io/bodega_danitin/
   ```

---

## Paso 5 — Verificar funcionamiento

### Test básico de la API
Abrir en el navegador:
```
https://script.google.com/macros/s/TU_ID/exec?action=getItems
```
Debe retornar:
```json
{ "ok": true, "data": [] }
```

### Test del frontend
1. Abrir `https://tingado.github.io/bodega_danitin/frontend/`
2. El listado debe cargar (vacío al inicio)
3. Crear un ítem de prueba con el botón **+ Nuevo Ítem**
4. Verificar que aparece en el Sheet y en el listado
5. Escanear el QR generado con un celular

---

## Actualizar la API (si cambiás Code.gs)

1. Apps Script → **Implementar → Administrar implementaciones**
2. Clic en el lápiz (editar)
3. Versión: **Nueva versión**
4. Guardar → **Implementar**

> La URL de la API **no cambia** entre versiones si usás la misma implementación.

---

## Troubleshooting

| Problema | Causa | Solución |
|---|---|---|
| API retorna HTML en lugar de JSON | Apps Script no está desplegado como Web App | Repetir Paso 2 |
| `CORS error` en el navegador | El Apps Script rechaza la solicitud | Verificar que "Quien tiene acceso" = "Cualquier persona" |
| `Hoja no encontrada` en la API | Nombre de hoja incorrecto | Verificar que los nombres coincidan exactamente (mayúsculas) |
| GitHub Pages muestra 404 | El `index.html` no está en la carpeta correcta | Ver Paso 4, Opción A |
| QR no escanea | Cámara bloqueada por el navegador | Abrir el sitio en HTTPS (GitHub Pages usa HTTPS por defecto) |
