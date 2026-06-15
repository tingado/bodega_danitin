// dashboard.js — Gráficos Chart.js + métricas en tiempo real

let chartZona    = null;
let chartEstados = null;
let chartMovs    = null;

async function cargarDashboard() {
  try {
    const data = await api({ action: 'getStats' });
    if (!data.ok) { mostrarToast('Error al cargar stats', 'error'); return; }
    const s = data.data;

    // KPIs
    document.getElementById('kpi-total').textContent        = s.total_items;
    document.getElementById('kpi-en-stock').textContent     = s.items_en_stock;
    document.getElementById('kpi-en-transito').textContent  = s.items_en_transito;
    document.getElementById('kpi-alertas').textContent      = s.items_con_alerta;
    document.getElementById('kpi-movs-hoy').textContent     = s.movimientos_hoy;

    // Alerta banner
    const banner = document.getElementById('banner-alerta');
    if (s.items_con_alerta > 0) {
      banner.textContent = `⚠ ${s.items_con_alerta} ítem(s) con stock en mínimo`;
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }

    renderChartZona(s.stock_por_zona);
    renderChartEstados(s);
    renderUltimosMovs(s.ultimos_movimientos);

  } catch (err) {
    mostrarToast('Error de conexión con la API', 'error');
  }
}

function renderChartZona(stockPorZona) {
  const ctx = document.getElementById('chart-zona').getContext('2d');
  if (chartZona) chartZona.destroy();

  chartZona = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stockPorZona.map(z => z.nombre),
      datasets: [{
        label: 'Unidades en stock',
        data: stockPorZona.map(z => z.cantidad),
        backgroundColor: [
          '#1a1a2e','#e94560','#0f3460','#533483','#2b9348','#e9c46a'
        ],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

function renderChartEstados(s) {
  const ctx = document.getElementById('chart-estados').getContext('2d');
  if (chartEstados) chartEstados.destroy();

  const pendiente = (s.total_items - s.items_en_stock - s.items_en_transito);

  chartEstados = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['En stock', 'En tránsito', 'Otros'],
      datasets: [{
        data: [s.items_en_stock, s.items_en_transito, Math.max(0, pendiente)],
        backgroundColor: ['#2b9348', '#e9c46a', '#e94560'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

function renderUltimosMovs(movs) {
  const tbody = document.getElementById('tabla-ultimos-movs');
  if (!movs?.length) {
    tbody.innerHTML = '<tr><td colspan="4">Sin movimientos recientes</td></tr>';
    return;
  }
  tbody.innerHTML = movs.map(m => `
    <tr>
      <td>${m.fecha}</td>
      <td>${m.item_id}</td>
      <td><span class="badge-tipo tipo-${m.tipo}">${m.tipo}</span></td>
      <td>${m.cantidad}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // Se llama cuando el usuario navega al dashboard
});
