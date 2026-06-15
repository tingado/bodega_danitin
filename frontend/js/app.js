// app.js — Lógica principal CRUD + navegación + movimientos

// ── API ───────────────────────────────────────────────────────────────────

async function api(params) {
  const url = new URL(CONFIG.API_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

async function apiPost(body) {
  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

// ── Estado global ─────────────────────────────────────────────────────────

const State = {
  items: [],
  ubicaciones: [],
  itemSeleccionado: null,
  seccionActiva: 'listado'
};

// ── Navegación ────────────────────────────────────────────────────────────

function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(s => s.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
  State.seccionActiva = id;

  if (id === 'listado')     cargarListado();
  if (id === 'escanear')    iniciarEscaner();
  if (id !== 'escanear')    QRModule.detenerEscaner();
}

// ── Listado de ítems ──────────────────────────────────────────────────────

async function cargarListado(filtro = '') {
  mostrarLoader('tabla-items');
  try {
    const data = filtro
      ? await api({ action: 'searchItems', q: filtro })
      : await api({ action: 'getItems' });

    State.items = data.data || [];
    renderTabla(State.items);
  } catch {
    mostrarError('tabla-items', 'Error al cargar ítems');
  }
}

function renderTabla(items) {
  const tbody = document.getElementById('tabla-items');
  if (!items.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty">No hay ítems</td></tr>';
    return;
  }
  tbody.innerHTML = items.map(item => `
    <tr class="${item.alerta ? 'fila-alerta' : ''}">
      <td><span class="badge-categoria">${item.categoria}</span></td>
      <td>${item.nombre}</td>
      <td>${item.ubicacion_id}</td>
      <td class="${item.alerta ? 'stock-alerta' : ''}">${item.stock_actual}</td>
      <td><span class="badge-estado estado-${item.estado_item}">${item.estado_item}</span></td>
      <td>
        <div id="qr-mini-${item.id}" class="qr-mini"></div>
      </td>
      <td class="acciones">
        <button onclick="abrirDetalle('${item.id}')" class="btn-sm">Ver</button>
        <button onclick="abrirMovimiento('${item.id}', 'entrada')" class="btn-sm btn-entrada">Entrada</button>
        <button onclick="abrirMovimiento('${item.id}', 'salida')" class="btn-sm btn-salida">Salida</button>
      </td>
    </tr>
  `).join('');

  // Generar QR mini para cada ítem visible
  items.forEach(item => {
    QRModule.generarQR(`qr-mini-${item.id}`, item.id, { width: 60, height: 60 });
  });
}

// ── Detalle / edición de ítem ─────────────────────────────────────────────

async function abrirDetalle(itemId) {
  const data = await api({ action: 'getItem', id: itemId });
  if (!data.ok) { mostrarToast('Item no encontrado', 'error'); return; }

  State.itemSeleccionado = data.data;
  rellenarFormulario('form-editar', data.data);
  QRModule.generarQR('qr-detalle', itemId, { width: 180, height: 180 });

  cargarHistorial(itemId);
  mostrarSeccion('detalle');
}

async function guardarEdicion(e) {
  e.preventDefault();
  const data = obtenerFormulario('form-editar');
  const res = await apiPost({ action: 'updateItem', id: State.itemSeleccionado.id, data });
  if (res.ok) {
    mostrarToast('Ítem actualizado', 'ok');
    mostrarSeccion('listado');
  } else {
    mostrarToast(res.error, 'error');
  }
}

// ── Alta de ítem ──────────────────────────────────────────────────────────

async function guardarNuevoItem(e) {
  e.preventDefault();
  cargarUbicaciones(); // por si no están cargadas
  const data = obtenerFormulario('form-nuevo');
  data.creado_por = CONFIG.RESPONSABLE_DEFAULT;

  const res = await apiPost({ action: 'createItem', data });
  if (res.ok) {
    mostrarToast(`Ítem creado. ID: ${res.id}`, 'ok');
    QRModule.generarQR('qr-nuevo-resultado', res.id, { width: 180, height: 180 });
    document.getElementById('nuevo-qr-container').classList.remove('hidden');
    document.getElementById('btn-descargar-qr').onclick = () =>
      QRModule.descargarQR('qr-nuevo-resultado', `qr_${res.id}`);
  } else {
    mostrarToast(res.error, 'error');
  }
}

// ── Movimientos ───────────────────────────────────────────────────────────

function abrirMovimiento(itemId, tipo) {
  const item = State.items.find(i => i.id === itemId);
  document.getElementById('mov-item-id').value    = itemId;
  document.getElementById('mov-item-nombre').textContent = item?.nombre || itemId;
  document.getElementById('mov-tipo').value       = tipo;
  document.getElementById('mov-cantidad').value   = '';
  document.getElementById('mov-motivo').value     = '';
  document.getElementById('mov-responsable').value = CONFIG.RESPONSABLE_DEFAULT;
  mostrarSeccion('movimiento');
}

async function registrarMovimiento(e) {
  e.preventDefault();
  const data = {
    item_id:    document.getElementById('mov-item-id').value,
    tipo:       document.getElementById('mov-tipo').value,
    cantidad:   Number(document.getElementById('mov-cantidad').value),
    motivo:     document.getElementById('mov-motivo').value,
    responsable: document.getElementById('mov-responsable').value
  };

  const res = await apiPost({ action: 'registrarMovimiento', data });

  if (res.ok) {
    let msg = `${data.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada. Stock: ${res.stock_resultante}`;
    mostrarToast(msg, 'ok');
    if (res.alerta) mostrarToast(res.alerta_mensaje, 'alerta');
    mostrarSeccion('listado');
  } else {
    mostrarToast(res.error, 'error');
  }
}

// ── Escaneo QR ────────────────────────────────────────────────────────────

function iniciarEscaner() {
  QRModule.iniciarEscaner('qr-video', async (itemId) => {
    QRModule.detenerEscaner();
    const data = await api({ action: 'getItem', id: itemId });
    if (data.ok) {
      State.itemSeleccionado = data.data;
      document.getElementById('scan-resultado-nombre').textContent = data.data.nombre;
      document.getElementById('scan-resultado-stock').textContent  = data.data.stock_actual;
      document.getElementById('scan-resultado-ub').textContent     = data.data.ubicacion_id;
      document.getElementById('scan-resultado').classList.remove('hidden');
      document.getElementById('btn-scan-entrada').onclick = () => abrirMovimiento(itemId, 'entrada');
      document.getElementById('btn-scan-salida').onclick  = () => abrirMovimiento(itemId, 'salida');
      document.getElementById('btn-scan-ver').onclick     = () => abrirDetalle(itemId);
    } else {
      mostrarToast('QR no reconocido: ' + itemId, 'error');
    }
  }, (err) => {
    mostrarToast('Error de cámara: ' + err, 'error');
  });
}

// ── Historial de movimientos ──────────────────────────────────────────────

async function cargarHistorial(itemId) {
  const data = await api({ action: 'getMovimientos', item_id: itemId });
  const tbody = document.getElementById('tabla-historial');
  if (!data.data?.length) {
    tbody.innerHTML = '<tr><td colspan="5">Sin movimientos</td></tr>';
    return;
  }
  tbody.innerHTML = data.data.map(m => `
    <tr>
      <td>${m.fecha}</td>
      <td><span class="badge-tipo tipo-${m.tipo}">${m.tipo}</span></td>
      <td>${m.cantidad}</td>
      <td>${m.stock_resultante}</td>
      <td>${m.responsable}</td>
    </tr>
  `).join('');
}

// ── Ubicaciones ───────────────────────────────────────────────────────────

async function cargarUbicaciones() {
  if (State.ubicaciones.length) return;
  const data = await api({ action: 'getUbicaciones' });
  State.ubicaciones = data.data || [];
  const selects = document.querySelectorAll('select[data-ubicaciones]');
  selects.forEach(sel => {
    sel.innerHTML = '<option value="">Seleccionar ubicación</option>' +
      State.ubicaciones.map(u =>
        `<option value="${u.id}">${u.id} — ${u.zona_nombre} ${u.estante || ''} ${u.nivel}</option>`
      ).join('');
  });
}

// ── Utilidades UI ─────────────────────────────────────────────────────────

function mostrarLoader(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = '<tr><td colspan="7" class="loading">Cargando...</td></tr>';
}

function mostrarError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<tr><td colspan="7" class="error">${msg}</td></tr>`;
}

function mostrarToast(msg, tipo = 'ok') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function rellenarFormulario(formId, data) {
  const form = document.getElementById(formId);
  if (!form) return;
  Object.entries(data).forEach(([k, v]) => {
    const el = form.querySelector(`[name="${k}"]`);
    if (el) el.value = v;
  });
}

function obtenerFormulario(formId) {
  const form = document.getElementById(formId);
  const data = {};
  new FormData(form).forEach((v, k) => { data[k] = v; });
  return data;
}

// ── Init ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('bodega-nombre').textContent = CONFIG.BODEGA_NOMBRE;
  cargarUbicaciones();
  cargarListado();

  document.getElementById('buscador')?.addEventListener('input', e =>
    cargarListado(e.target.value)
  );
  document.getElementById('form-nuevo')?.addEventListener('submit', guardarNuevoItem);
  document.getElementById('form-editar')?.addEventListener('submit', guardarEdicion);
  document.getElementById('form-movimiento')?.addEventListener('submit', registrarMovimiento);
});
