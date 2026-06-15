// bodega_danitin — Google Apps Script API
// Desplegado como Web App: Execute as "Me", Access "Anyone"

const SHEET_ID = 'TU_SHEET_ID_AQUI'; // Reemplazar con el ID de tu Google Sheet

const SHEETS = {
  ITEMS: 'Items',
  UBICACIONES: 'Ubicaciones',
  MOVIMIENTOS: 'Movimientos',
  CONFIG: 'Config'
};

// ─── Punto de entrada GET ───────────────────────────────────────────────────

function doGet(e) {
  const params = e.parameter;
  const action = params.action || '';

  try {
    let result;
    switch (action) {
      case 'getItems':           result = getItems();                              break;
      case 'getItem':            result = getItem(params.id);                     break;
      case 'getUbicaciones':     result = getUbicaciones();                       break;
      case 'getMovimientos':     result = getMovimientos(params.item_id);         break;
      case 'getStats':           result = getStats();                             break;
      case 'searchItems':        result = searchItems(params.q || '');            break;
      default:
        result = { ok: false, error: 'INVALID_ACTION', action };
    }
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ─── Punto de entrada POST ──────────────────────────────────────────────────

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || '';

    let result;
    switch (action) {
      case 'createItem':          result = createItem(body.data);                 break;
      case 'updateItem':          result = updateItem(body.id, body.data);        break;
      case 'registrarMovimiento': result = registrarMovimiento(body.data);        break;
      default:
        result = { ok: false, error: 'INVALID_ACTION', action };
    }
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ─── Helpers de respuesta ───────────────────────────────────────────────────

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getSheet(name) {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(name);
}

function sheetToObjects(sheet) {
  const [headers, ...rows] = sheet.getDataRange().getValues();
  return rows
    .filter(row => row[0] !== '')
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function now() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
}

function getConfig(clave) {
  const sheet = getSheet(SHEETS.CONFIG);
  const rows = sheet.getDataRange().getValues().slice(1);
  const row = rows.find(r => r[0] === clave);
  return row ? row[1] : null;
}

// ─── GET handlers ───────────────────────────────────────────────────────────

function getItems() {
  const items = sheetToObjects(getSheet(SHEETS.ITEMS));
  const active = items.filter(i => i.estado_item !== 'dado_de_baja');
  return {
    ok: true,
    data: active.map(item => ({
      ...item,
      alerta: item.stock_actual <= item.stock_minimo && item.stock_minimo > 0
    }))
  };
}

function getItem(id) {
  if (!id) return { ok: false, error: 'MISSING_FIELD', field: 'id' };
  const items = sheetToObjects(getSheet(SHEETS.ITEMS));
  const item = items.find(i => i.id === id);
  if (!item) return { ok: false, error: 'ITEM_NOT_FOUND', id };
  return {
    ok: true,
    data: item,
    alerta: item.stock_actual <= item.stock_minimo && item.stock_minimo > 0
  };
}

function getUbicaciones() {
  const ubs = sheetToObjects(getSheet(SHEETS.UBICACIONES));
  return { ok: true, data: ubs.filter(u => u.activa === true || u.activa === 'TRUE') };
}

function getMovimientos(item_id) {
  const movs = sheetToObjects(getSheet(SHEETS.MOVIMIENTOS));
  const filtered = item_id
    ? movs.filter(m => m.item_id === item_id)
    : movs;
  return { ok: true, data: filtered.slice(-50).reverse() };
}

function getStats() {
  const items = sheetToObjects(getSheet(SHEETS.ITEMS)).filter(i => i.estado_item !== 'dado_de_baja');
  const movs  = sheetToObjects(getSheet(SHEETS.MOVIMIENTOS));
  const hoy   = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');

  const stockPorZona = {};
  const ubicaciones = sheetToObjects(getSheet(SHEETS.UBICACIONES));
  const ubMap = {};
  ubicaciones.forEach(u => { ubMap[u.id] = u; });

  items.forEach(item => {
    const ub = ubMap[item.ubicacion_id];
    const zona = ub ? ub.zona_nombre : 'Sin zona';
    if (!stockPorZona[zona]) stockPorZona[zona] = { zona: ub ? ub.zona_id : '?', nombre: zona, cantidad: 0 };
    stockPorZona[zona].cantidad += Number(item.stock_actual) || 0;
  });

  return {
    ok: true,
    data: {
      total_items: items.length,
      items_en_stock:      items.filter(i => i.estado_item === 'en_stock').length,
      items_en_transito:   items.filter(i => i.estado_item === 'en_transito').length,
      items_con_alerta:    items.filter(i => i.stock_actual <= i.stock_minimo && i.stock_minimo > 0).length,
      movimientos_hoy:     movs.filter(m => String(m.fecha).startsWith(hoy)).length,
      stock_por_zona:      Object.values(stockPorZona),
      ultimos_movimientos: movs.slice(-10).reverse()
    }
  };
}

function searchItems(q) {
  if (!q) return getItems();
  const items = sheetToObjects(getSheet(SHEETS.ITEMS));
  const lower = q.toLowerCase();
  const filtered = items.filter(i =>
    String(i.nombre).toLowerCase().includes(lower) ||
    String(i.categoria).toLowerCase().includes(lower) ||
    String(i.descripcion).toLowerCase().includes(lower)
  );
  return { ok: true, data: filtered };
}

// ─── POST handlers ──────────────────────────────────────────────────────────

function createItem(data) {
  if (!data.nombre)       return { ok: false, error: 'MISSING_FIELD', field: 'nombre' };
  if (!data.ubicacion_id) return { ok: false, error: 'MISSING_FIELD', field: 'ubicacion_id' };
  if (!data.categoria)    return { ok: false, error: 'MISSING_FIELD', field: 'categoria' };

  const ubSheet = getSheet(SHEETS.UBICACIONES);
  const ubicaciones = sheetToObjects(ubSheet);
  if (!ubicaciones.find(u => u.id === data.ubicacion_id)) {
    return { ok: false, error: 'UBICACION_NOT_FOUND', id: data.ubicacion_id };
  }

  const id = data.id || generateId('item');
  const sheet = getSheet(SHEETS.ITEMS);
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');

  sheet.appendRow([
    id,
    data.nombre            || '',
    data.descripcion       || '',
    data.categoria         || '',
    data.subcategoria      || '',
    data.ubicacion_id      || '',
    data.stock_actual      || 0,
    data.stock_minimo      || 0,
    data.estado_embalaje   || 'sin_embalaje',
    data.estado_item       || 'en_stock',
    data.requiere_dos_personas || false,
    data.valor_estimado    || '',
    data.moneda            || getConfig('moneda_default') || 'CLP',
    data.foto_url          || '',
    data.notas             || '',
    id, // qr_code = id
    today,
    today,
    data.creado_por        || getConfig('responsable_default') || 'admin'
  ]);

  return { ok: true, id, qr_code: id };
}

function updateItem(id, data) {
  if (!id) return { ok: false, error: 'MISSING_FIELD', field: 'id' };

  const sheet = getSheet(SHEETS.ITEMS);
  const [headers, ...rows] = sheet.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => r[0] === id);
  if (rowIndex === -1) return { ok: false, error: 'ITEM_NOT_FOUND', id };

  const actualRow = rowIndex + 2; // +1 header, +1 base-1
  headers.forEach((header, colIndex) => {
    if (data[header] !== undefined) {
      sheet.getRange(actualRow, colIndex + 1).setValue(data[header]);
    }
  });
  // Actualizar fecha_actualizacion
  const fechaCol = headers.indexOf('fecha_actualizacion') + 1;
  if (fechaCol) {
    sheet.getRange(actualRow, fechaCol).setValue(
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy')
    );
  }

  return { ok: true };
}

function registrarMovimiento(data) {
  if (!data.item_id)    return { ok: false, error: 'MISSING_FIELD', field: 'item_id' };
  if (!data.tipo)       return { ok: false, error: 'MISSING_FIELD', field: 'tipo' };
  if (!data.cantidad)   return { ok: false, error: 'MISSING_FIELD', field: 'cantidad' };
  if (!data.responsable) return { ok: false, error: 'MISSING_FIELD', field: 'responsable' };

  const itemSheet = getSheet(SHEETS.ITEMS);
  const [headers, ...rows] = itemSheet.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => r[0] === data.item_id);
  if (rowIndex === -1) return { ok: false, error: 'ITEM_NOT_FOUND', id: data.item_id };

  const actualRow = rowIndex + 2;
  const stockCol  = headers.indexOf('stock_actual') + 1;
  const stockMin  = Number(rows[rowIndex][headers.indexOf('stock_minimo')]) || 0;
  const nombre    = rows[rowIndex][headers.indexOf('nombre')];
  let stockActual = Number(rows[rowIndex][headers.indexOf('stock_actual')]) || 0;
  const cantidad  = Number(data.cantidad);

  // Calcular nuevo stock
  let stockResultante = stockActual;
  if (data.tipo === 'entrada') {
    stockResultante = stockActual + cantidad;
  } else if (data.tipo === 'salida') {
    if (stockActual < cantidad) {
      return { ok: false, error: 'STOCK_INSUFICIENTE', actual: stockActual, solicitado: cantidad };
    }
    stockResultante = stockActual - cantidad;
  } else if (data.tipo === 'ajuste') {
    stockResultante = cantidad; // en ajuste, cantidad = nuevo valor absoluto
  }
  // traslado no cambia stock

  // Actualizar stock en Items
  if (data.tipo !== 'traslado') {
    itemSheet.getRange(actualRow, stockCol).setValue(stockResultante);
  }

  // Si es traslado, actualizar ubicacion_id
  if (data.tipo === 'traslado' && data.ubicacion_destino_id) {
    const ubCol = headers.indexOf('ubicacion_id') + 1;
    itemSheet.getRange(actualRow, ubCol).setValue(data.ubicacion_destino_id);
  }

  // Registrar en Movimientos
  const movSheet = getSheet(SHEETS.MOVIMIENTOS);
  const movId = generateId('mov');
  movSheet.appendRow([
    movId,
    data.item_id,
    data.tipo,
    cantidad,
    data.ubicacion_origen_id  || '',
    data.ubicacion_destino_id || '',
    data.motivo               || '',
    data.responsable,
    now(),
    stockResultante,
    data.notas                || ''
  ]);

  // Evaluar alerta
  const alerta = stockResultante <= stockMin && stockMin > 0;
  return {
    ok: true,
    stock_resultante: stockResultante,
    alerta,
    alerta_mensaje: alerta
      ? `Stock de '${nombre}' llegó al mínimo (${stockResultante} unidades)`
      : null
  };
}
