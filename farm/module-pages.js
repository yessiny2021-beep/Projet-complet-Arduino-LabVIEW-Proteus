const SF = window.SMARTFARM_MODULE || {};
const API_BASE = 'api/';
let tableInstance = null;
let charts = {};
let currentDeleteId = null;
let currentDeleteAction = null;
let currentEditId = null;
let animalsCache = [];
let moduleTheme = 'light';
let notificationTimer = null;
let moduleRows = [];
let filteredRows = [];
const bulkSelectedIds = new Set();

const FILTER_DATE_FIELDS = {
  animals: 'created_at',
  vaccinations: 'date_administered',
  weight_history: 'measurement_date',
  reproduction: 'mating_date',
  milk_production: 'production_date',
  medications: 'start_date',
  feed_inventory: 'created_at',
};

const FILTER_TEXT_FIELDS = {
  animals: ['rfid_number', 'name', 'species', 'breed', 'status'],
  vaccinations: ['animal_name', 'vaccine_name', 'veterinarian'],
  weight_history: ['animal_name'],
  reproduction: ['female_name', 'male_name'],
  milk_production: ['animal_name'],
  medications: ['animal_name', 'medicine_name'],
  feed_inventory: ['item_name', 'category', 'unit'],
};

const toast = (msg, type = 'success') => (window.sfShowToast ? window.sfShowToast(msg, type) : (console.log(type, msg), null));

async function api(path, method = 'GET', data = null) {
  const url = `${API_BASE}${path}`;
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data !== null) options.body = JSON.stringify(data);
  const res = await (window.sfApiFetch ? await window.sfApiFetch(url, options) : null);
  if (!res) throw new Error('Erreur réseau');
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error((res.payload && res.payload.error) || 'Erreur serveur');
  return res.payload;
}

function setTheme(theme) {
  moduleTheme = theme;
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  localStorage.setItem('sf-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('sf-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    setTheme(moduleTheme === 'dark' ? 'light' : 'dark');
  });
}

async function refreshNotifications() {
  const response = await api('notifications.php');
  const list = document.getElementById('notifList');
  const badge = document.getElementById('notifBadge');
  const filters = document.getElementById('notifFilters');
  const items = response.items || [];
  if (badge) badge.textContent = String(response.unreadCount ?? items.filter((item) => !item.read).length);
  if (filters) {
    const categories = [...new Set(items.map((item) => item.category))];
    filters.innerHTML = categories.slice(0, 5).map((category) => `<span class="notif-chip ${category.includes('expiration') || category.includes('overdue') ? 'high' : category.includes('near term') ? 'medium' : 'low'}">${category}</span>`).join('');
  }
  if (list) {
    list.innerHTML = items.length ? items.map((item) => `
      <div class="notif-item ${item.read ? 'read' : 'unread'} ${item.priority || 'low'}">
        <div class="notif-icon ${item.priority || 'low'}"><i class="fas fa-circle-exclamation"></i></div>
        <div class="notif-body">
          <div><strong>${item.title}</strong></div>
          <div class="notif-meta"><span>${item.category}</span><span>${item.timestamp || ''}</span></div>
          <div>${item.description}</div>
        </div>
      </div>
    `).join('') : '<div class="notif-item"><div class="notif-body">Aucune alerte</div></div>';
  }
}

async function searchGlobal(query) {
  const panel = document.getElementById('searchSuggestions');
  if (!panel) return;
  const text = query.trim();
  if (!text) {
    panel.classList.remove('show');
    panel.innerHTML = '';
    return;
  }
  const response = await api(`search.php?q=${encodeURIComponent(text)}`);
  const items = response.items || [];
  panel.innerHTML = items.length ? items.map((item) => `
    <div class="search-suggestion" data-href="${item.href}">
      <div>
        <div class="title">${item.label}</div>
        <div class="meta">${item.subtitle || ''}</div>
      </div>
      <span class="pill">${item.type}</span>
    </div>
  `).join('') : '<div class="search-suggestion"><div><div class="title">Aucun résultat</div><div class="meta">Essayez un autre terme</div></div></div>';
  panel.classList.add('show');
  panel.querySelectorAll('[data-href]').forEach((row) => row.addEventListener('click', () => { window.location.href = row.dataset.href; }));
}

function destroyTable() {
  if (tableInstance) {
    tableInstance.destroy();
    tableInstance = null;
  }
}

function renderStats(data) {
  (SF.stats || []).forEach((stat) => {
    const el = document.querySelector(`#${stat.id}`);
    if (!el) return;
    el.textContent = data?.[stat.key] ?? stat.fallback ?? 0;
  });
}

function renderAlerts(alerts) {
  const wrap = document.getElementById('alertStrip');
  if (!wrap) return;
  wrap.innerHTML = (alerts || []).map((alert) => `
    <div class="alert alert-${alert.level || 'info'} d-flex align-items-start gap-2">
      <i class="fas ${alert.icon || 'fa-circle-info'} mt-1"></i>
      <div><strong>${alert.title}</strong><div class="small">${alert.message}</div></div>
    </div>
  `).join('') || '<div class="alert alert-light mb-0">Aucune alerte</div>';
}

function renderChart(cfg, rows) {
  const canvas = document.getElementById(cfg.id);
  if (!canvas || typeof Chart === 'undefined') return;
  if (charts[cfg.id]) charts[cfg.id].destroy();
  charts[cfg.id] = new Chart(canvas, {
    type: cfg.type || 'line',
    data: {
      labels: rows.map((r) => r.label),
      datasets: [{ label: cfg.label, data: rows.map((r) => Number(r.value || 0)), borderColor: cfg.color || '#1e6fb5', backgroundColor: cfg.fill || 'rgba(30,111,181,.12)', fill: true, tension: 0.35 }],
    },
    options: { responsive: true, animation: { duration: 1000 }, plugins: { legend: { display: true } } },
  });
}

function renderTable(rows) {
  destroyTable();
  filteredRows = rows.slice();
  const tbody = document.querySelector(`#${SF.table.id} tbody`);
  const renderer = ROW_RENDERERS[SF.moduleKey] || defaultRowRenderer;
  tbody.innerHTML = rows.map((row, index) => decorateRowHtml(renderer(row, index), row)).join('') || `<tr><td colspan="${SF.table.columns.length + (SF.bulkEnabled ? 1 : 0)}" class="text-center text-muted py-4">Aucune donnée</td></tr>`;
  tbody.querySelectorAll('[data-bulk-select]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => toggleBulkSelection(Number(checkbox.value), checkbox.checked));
  });
  if (window.DataTable) {
    const dtOptions = {
      paging: true,
      searching: true,
      info: true,
      order: [],
      stateSave: true,
      responsive: true,
      pageLength: 25,
      lengthMenu: [10, 25, 50, 100],
      columnDefs: SF.bulkEnabled ? [{ orderable: false, targets: 0 }] : [],
      language: { url: 'https://cdn.datatables.net/plug-ins/2.1.8/i18n/fr-FR.json' },
    };

    // If Buttons extension is loaded, enable client-side export buttons
    if (typeof DataTable.Buttons !== 'undefined') {
      dtOptions.dom = "<'d-flex justify-content-between mb-2'<'dt-left'B><'dt-right'f>>rt<'d-flex justify-content-between mt-2'<'dt-left'i><'dt-right'p>>";
      dtOptions.buttons = [
        { extend: 'csvHtml5', text: 'CSV', className: 'btn btn-sm btn-outline-secondary' },
        { extend: 'excelHtml5', text: 'Excel', className: 'btn btn-sm btn-outline-success' },
        { extend: 'pdfHtml5', text: 'PDF', className: 'btn btn-sm btn-outline-danger' },
        { extend: 'print', text: 'Imprimer', className: 'btn btn-sm btn-outline-primary' },
      ];
    }

    tableInstance = new DataTable(`#${SF.table.id}`, dtOptions);
  }
  syncBulkUI();
}

function decorateRowHtml(html, row) {
  if (!SF.bulkEnabled) return html;
  return html.replace('<tr>', `<tr data-row-id="${row.id}"><td class="row-check"><input type="checkbox" class="bulk-check" data-bulk-select value="${row.id}" ${bulkSelectedIds.has(Number(row.id)) ? 'checked' : ''} /></td>`);
}

function syncBulkUI() {
  const count = bulkSelectedIds.size;
  const bar = document.getElementById('bulkBar');
  const countEl = document.getElementById('bulkCount');
  if (countEl) countEl.textContent = String(count);
  if (bar) bar.classList.toggle('show', count > 0);
  const selectAll = document.getElementById('bulkSelectAll');
  if (selectAll) {
    const allVisibleSelected = filteredRows.length > 0 && filteredRows.every((row) => bulkSelectedIds.has(Number(row.id)));
    selectAll.checked = allVisibleSelected;
    selectAll.indeterminate = count > 0 && !allVisibleSelected;
  }
}

function toggleBulkSelection(id, checked) {
  if (checked) bulkSelectedIds.add(Number(id));
  else bulkSelectedIds.delete(Number(id));
  syncBulkUI();
}

function clearBulkSelection() {
  bulkSelectedIds.clear();
  document.querySelectorAll('[data-bulk-select]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  syncBulkUI();
}

function getSelectedIds() {
  return [...bulkSelectedIds];
}

function getFilterState() {
  return {
    text: document.getElementById('animalSearch')?.value || '',
    species: document.getElementById('speciesFilter')?.value || '',
    breed: document.getElementById('breedFilter')?.value || '',
    sex: document.getElementById('sexFilter')?.value || '',
    status: document.getElementById('statusFilter')?.value || '',
    from: document.getElementById('filterDateFrom')?.value || '',
    to: document.getElementById('filterDateTo')?.value || '',
  };
}

function persistFilters() {
  localStorage.setItem(`sf-filters-${SF.moduleKey}`, JSON.stringify(getFilterState()));
}

function restoreFilters() {
  try {
    const stored = JSON.parse(localStorage.getItem(`sf-filters-${SF.moduleKey}`) || '{}');
    if (stored.text !== undefined && document.getElementById('animalSearch')) document.getElementById('animalSearch').value = stored.text;
    if (stored.species !== undefined && document.getElementById('speciesFilter')) document.getElementById('speciesFilter').value = stored.species;
    if (stored.breed !== undefined && document.getElementById('breedFilter')) document.getElementById('breedFilter').value = stored.breed;
    if (stored.sex !== undefined && document.getElementById('sexFilter')) document.getElementById('sexFilter').value = stored.sex;
    if (stored.status !== undefined && document.getElementById('statusFilter')) document.getElementById('statusFilter').value = stored.status;
    if (stored.from !== undefined && document.getElementById('filterDateFrom')) document.getElementById('filterDateFrom').value = stored.from;
    if (stored.to !== undefined && document.getElementById('filterDateTo')) document.getElementById('filterDateTo').value = stored.to;
  } catch {
    // ignore malformed state
  }
}

function applyModuleFilters() {
  const filters = getFilterState();
  persistFilters();
  const textFields = FILTER_TEXT_FIELDS[SF.moduleKey] || [];
  const dateField = FILTER_DATE_FIELDS[SF.moduleKey];

  filteredRows = moduleRows.filter((row) => {
    if (filters.text) {
      const needle = filters.text.toLowerCase();
      const hay = textFields.map((field) => String(row[field] ?? '').toLowerCase()).join(' | ');
      if (!hay.includes(needle)) return false;
    }
    if (filters.species && String(row.species || '') !== filters.species) return false;
    if (filters.breed && String(row.breed || '') !== filters.breed) return false;
    if (filters.sex && String(row.sex || '') !== filters.sex) return false;
    if (filters.status && String(row.status || '') !== filters.status) return false;
    if (dateField) {
      const value = String(row[dateField] || '').slice(0, 10);
      if (filters.from && value && value < filters.from) return false;
      if (filters.to && value && value > filters.to) return false;
    }
    return true;
  });

  renderTable(filteredRows);
  if (tableInstance) {
    tableInstance.search(filters.text || '').draw();
  }
}

function defaultRowRenderer(row) {
  return `<tr><td colspan="${SF.table.columns.length}">${JSON.stringify(row)}</td></tr>`;
}

const ROW_RENDERERS = {
  animals: (row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><code>${row.rfid_number || '—'}</code></td>
      <td><strong>${row.name || ''}</strong></td>
      <td>${row.species || '—'}</td>
      <td>${row.breed || '—'}</td>
      <td>${row.sex || '—'}</td>
      <td><span class="badge ${row.status === 'gestante' ? 'bg-warning text-dark' : row.status === 'malade' ? 'bg-danger' : row.status === 'vendu' ? 'bg-secondary' : 'bg-success'}">${row.status || 'sain'}</span></td>
      <td>${Number(row.weight || 0).toFixed(1)} kg</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary" onclick="window.location.href='animal_profile.php?id=${row.id}'"><i class="fas fa-id-card"></i></button>
        <button class="btn btn-sm btn-outline-primary" onclick="editEntry(${row.id})"><i class="fas fa-pen"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${row.id})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `,
  vaccinations: (row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row.animal_name || row.animal_id}</td>
      <td><strong>${row.vaccine_name || ''}</strong></td>
      <td>${row.date_administered || '—'}</td>
      <td>${row.next_due_date || '—'}</td>
      <td>${row.veterinarian || '—'}</td>
      <td><span class="badge ${row.next_due_date && new Date(row.next_due_date) < new Date() ? 'bg-danger' : 'bg-success'}">${row.next_due_date && new Date(row.next_due_date) < new Date() ? 'En retard' : 'À jour'}</span></td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${row.id})"><i class="fas fa-trash"></i></button></td>
    </tr>
  `,
  weight_history: (row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row.animal_name || row.animal_id}</td>
      <td>${Number(row.weight || 0).toFixed(1)} kg</td>
      <td>${row.measurement_date || '—'}</td>
      <td>${Number(row.gmq || 0).toFixed(2)}</td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${row.id})"><i class="fas fa-trash"></i></button></td>
    </tr>
  `,
  reproduction: (row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row.female_name || row.female_id}</td>
      <td>${row.male_name || '—'}</td>
      <td>${row.mating_date || '—'}</td>
      <td>${row.expected_birth || '—'}</td>
      <td>${row.actual_birth || '—'}</td>
      <td>${row.babies_count ?? 0}</td>
      <td><span class="badge ${row.expected_birth && new Date(row.expected_birth) < new Date() ? 'bg-warning text-dark' : 'bg-info'}">${row.expected_birth && new Date(row.expected_birth) < new Date() ? 'mise bas proche' : 'prête'}</span></td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${row.id})"><i class="fas fa-trash"></i></button></td>
    </tr>
  `,
  milk_production: (row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row.animal_name || row.animal_id}</td>
      <td>${Number(row.quantity || 0).toFixed(1)} L</td>
      <td>${row.production_date || '—'}</td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${row.id})"><i class="fas fa-trash"></i></button></td>
    </tr>
  `,
  medications: (row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row.animal_name || row.animal_id}</td>
      <td><strong>${row.medicine_name || ''}</strong></td>
      <td>${row.dose || '—'}</td>
      <td>${row.start_date || '—'}</td>
      <td>${row.withdrawal_period || 0} j</td>
      <td><span class="badge ${row.sale_blocked_until && new Date(row.sale_blocked_until) < new Date() ? 'bg-danger' : 'bg-warning text-dark'}">${row.sale_blocked_until || '—'}</span></td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${row.id})"><i class="fas fa-trash"></i></button></td>
    </tr>
  `,
  feed_inventory: (row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${row.item_name || ''}</strong></td>
      <td>${row.category || '—'}</td>
      <td>${Number(row.quantity || 0).toFixed(1)}</td>
      <td>${Number(row.minimum_threshold || 0).toFixed(1)}</td>
      <td>${row.unit || 'kg'}</td>
      <td><span class="badge ${Number(row.quantity || 0) <= Number(row.minimum_threshold || 0) ? 'bg-danger' : 'bg-success'}">${Number(row.quantity || 0) <= Number(row.minimum_threshold || 0) ? 'Stock faible' : 'OK'}</span></td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${row.id})"><i class="fas fa-trash"></i></button></td>
    </tr>
  `,
};

async function loadData() {
  const needsAnimals = ['vaccinations', 'weight_history', 'reproduction', 'milk_production', 'medications', 'feed_inventory'].includes(SF.moduleKey);
  const [rows, summary, animals] = await Promise.all([
    api(SF.api.list),
    SF.api.summary ? api(SF.api.summary).catch(() => null) : Promise.resolve(null),
    needsAnimals ? api('animals.php').catch(() => []) : Promise.resolve([]),
  ]);
  animalsCache = animals || [];
  moduleRows = Array.isArray(rows) ? rows : [];
  renderStats(summary?.totals || summary || {});
  renderAlerts(summary?.alerts || []);
  restoreFilters();
  applyModuleFilters();
  (SF.charts || []).forEach((cfg) => renderChart(cfg, summary?.charts?.[cfg.sourceKey] || moduleRows.map((r) => ({ label: r[cfg.labelKey || 'label'] || r[cfg.labelField] || '', value: r[cfg.valueKey || 'value'] || r[cfg.valueField] || 0 }))));
  if (SF.afterLoad) SF.afterLoad(rows, summary);
  populateSelects();
}

function setSelectOptions(id, rows, labelFn) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = `<option value="">Choisir</option>` + rows.map((row) => `<option value="${row.id}">${labelFn(row)}</option>`).join('');
}

function populateSelects() {
  const animalOptionHtml = (rows) => '<option value="">Choisir</option>' + rows.map((row) => `<option value="${row.id}">${row.name} (${row.rfid_number || 'sans RFID'})</option>`).join('');
  const set = (id, rows) => {
    const select = document.getElementById(id);
    if (select) select.innerHTML = animalOptionHtml(rows);
  };
  if (['vaccinations', 'weight_history', 'milk_production', 'medications'].includes(SF.moduleKey)) {
    set('vacc_animal', animalsCache);
    set('weight_animal', animalsCache);
    set('milk_animal', animalsCache);
    set('med_animal', animalsCache);
  }
  if (SF.moduleKey === 'reproduction') {
    set('repro_female', animalsCache.filter((a) => a.sex === 'F'));
    set('repro_male', animalsCache.filter((a) => a.sex === 'M'));
  }
}

function openModal(id) {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
  modal.show();
}

function closeModal(id) {
  const modalEl = document.getElementById(id);
  if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).hide();
}

function openProfile() { openModal('profileModal'); }

function initShellInteractions() {
  document.getElementById('notifBtn')?.addEventListener('click', () => document.getElementById('notifPanel')?.classList.toggle('show'));
  document.getElementById('markAllRead')?.addEventListener('click', async () => {
    await api('notifications.php', 'POST', { all: true });
    await refreshNotifications();
  });
  document.getElementById('bulkSelectAll')?.addEventListener('change', (event) => {
    const checked = event.target.checked;
    document.querySelectorAll('[data-bulk-select]').forEach((checkbox) => {
      checkbox.checked = checked;
      if (checked) bulkSelectedIds.add(Number(checkbox.value));
      else bulkSelectedIds.delete(Number(checkbox.value));
    });
    syncBulkUI();
  });
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((event) => searchGlobal(event.target.value)));
  }
  ['animalSearch', 'speciesFilter', 'breedFilter', 'sexFilter', 'statusFilter', 'filterDateFrom', 'filterDateTo'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', applyModuleFilters);
    document.getElementById(id)?.addEventListener('change', applyModuleFilters);
  });
  document.addEventListener('click', () => document.getElementById('searchSuggestions')?.classList.remove('show'));
}

function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

async function submitForm(moduleCfg) {
  const form = document.getElementById(moduleCfg.formId);
  const data = Object.fromEntries(new FormData(form).entries());
  if (currentEditId) data.id = currentEditId;
  const payload = moduleCfg.preparePayload ? moduleCfg.preparePayload(data) : data;
  await api(moduleCfg.api.save, currentEditId ? 'PUT' : 'POST', payload);
  toast(currentEditId ? 'Enregistrement mis à jour' : 'Enregistrement créé');
  currentEditId = null;
  form.reset();
  closeModal(moduleCfg.modalId);
  await loadData();
}

function confirmDelete(action) {
  currentDeleteAction = action;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmModal')).show();
}

async function doDelete() {
  if (typeof currentDeleteAction === 'function') await currentDeleteAction();
  bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmModal')).hide();
  currentDeleteAction = null;
  await loadData();
}

async function logout() {
  try { await window.sfApiFetch('auth/logout.php', { method: 'POST' }); } catch (e) { /* ignore */ }
  window.location.href = 'login.html';
}

function selectedExportUrl(format = 'csv') {
  const ids = getSelectedIds();
  const params = new URLSearchParams({ module: SF.moduleKey, format });
  if (ids.length) params.set('ids', ids.join(','));
  const filters = getFilterState();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return `api/export.php?${params.toString()}`;
}

function exportModule(format = 'csv') {
  // If DataTables Buttons isn't available, provide a CSV client-side fallback
  if ((format === 'csv' || format === 'excel') && typeof DataTable === 'undefined' || (format === 'csv' || format === 'excel') && typeof DataTable !== 'undefined' && typeof DataTable.Buttons === 'undefined') {
    exportCsvFallback();
    return;
  }
  window.open(selectedExportUrl(format), '_blank', 'noopener');
}

function bulkExportSelected(format = 'csv') {
  if (!bulkSelectedIds.size) return toast('Aucune ligne sélectionnée', 'warning');
  // If Buttons not available, export selected rows client-side as CSV
  if ((format === 'csv' || format === 'excel') && (typeof DataTable === 'undefined' || typeof DataTable.Buttons === 'undefined')) {
    exportCsvFallback();
    return;
  }
  window.open(selectedExportUrl(format), '_blank', 'noopener');
}

// Build CSV from given rows and keys, then trigger download
function downloadCsv(rows, keys, filename) {
  const esc = (val) => {
    if (val === null || val === undefined) return '';
    const s = String(val);
    if (s.includes('"') || s.includes(',') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const header = keys.map((k) => (k === 'id' ? 'ID' : k.replace(/_/g, ' '))).join(',');
  const lines = rows.map((r) => keys.map((k) => esc(r[k])).join(','));
  const csv = [header].concat(lines).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Determine rows to export and keys to include, then call downloadCsv
function exportCsvFallback() {
  const ids = getSelectedIds();
  const rows = ids.length ? moduleRows.filter((r) => ids.includes(Number(r.id))) : filteredRows.length ? filteredRows : moduleRows;
  if (!rows.length) return toast('Aucune donnée à exporter', 'warning');
  // Prefer known column ordering per module, fallback to object keys
  const EXPORT_KEYS = {
    animals: ['id', 'rfid_number', 'name', 'species', 'breed', 'sex', 'status', 'weight'],
    vaccinations: null,
  };
  let keys = (EXPORT_KEYS[SF.moduleKey] && EXPORT_KEYS[SF.moduleKey].filter((k) => rows[0] && Object.prototype.hasOwnProperty.call(rows[0], k))) || Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object');
  // Ensure id is first
  keys = keys.filter((k) => k !== 'id');
  if (Object.prototype.hasOwnProperty.call(rows[0], 'id')) keys.unshift('id');
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filename = `${SF.moduleKey || 'export'}-${date}.csv`;
  downloadCsv(rows, keys, filename);
  toast('Export CSV généré', 'success');
}

async function bulkDeleteSelected() {
  const ids = getSelectedIds();
  if (!ids.length) return toast('Aucune ligne sélectionnée', 'warning');
  if (!confirm(`Supprimer ${ids.length} enregistrements ?`)) return;
  await api('module_bulk.php', 'POST', { module: SF.moduleKey, action: 'delete', ids });
  toast('Suppression groupée effectuée');
  clearBulkSelection();
  await loadData();
}

async function bulkArchiveSelected() {
  const ids = getSelectedIds();
  if (!ids.length) return toast('Aucune ligne sélectionnée', 'warning');
  await api('module_bulk.php', 'POST', { module: SF.moduleKey, action: 'archive', ids });
  toast('Archivage effectué');
  clearBulkSelection();
  await loadData();
}

async function bulkSetAnimalStatus(status) {
  const ids = getSelectedIds();
  if (!ids.length) return toast('Aucune ligne sélectionnée', 'warning');
  await api('module_bulk.php', 'POST', { module: SF.moduleKey, action: 'status', ids, payload: { status } });
  toast(`Statut mis à jour: ${status}`);
  clearBulkSelection();
  await loadData();
}

async function bulkAssignAnimalTask(taskType) {
  const ids = getSelectedIds();
  if (!ids.length) return toast('Aucune ligne sélectionnée', 'warning');
  const title = prompt(`Titre de la tâche ${taskType}`) || `${taskType} pour ${ids.length} animaux`;
  const dueDate = prompt('Date d’échéance (YYYY-MM-DD)') || null;
  await api('module_bulk.php', 'POST', { module: SF.moduleKey, action: 'task', ids, payload: { taskType, title, dueDate } });
  toast('Tâches créées');
  clearBulkSelection();
}

function printModule() {
  window.open(selectedExportUrl('print'), '_blank', 'noopener');
}

window.refreshModule = loadData;
window.openCreateModal = () => {
  currentEditId = null;
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => form.reset());
  openModal(SF.modalId);
};
window.openProfile = openProfile;
window.submitForm = submitForm;
window.confirmDelete = confirmDelete;
window.doDelete = doDelete;
window.logout = logout;
window.exportModule = exportModule;
window.printModule = printModule;
window.bulkDeleteSelected = bulkDeleteSelected;
window.bulkExportSelected = bulkExportSelected;
window.bulkArchiveSelected = bulkArchiveSelected;
window.bulkSetAnimalStatus = bulkSetAnimalStatus;
window.bulkAssignAnimalTask = bulkAssignAnimalTask;
window.clearBulkSelection = clearBulkSelection;
window.editEntry = async (id) => {
  currentEditId = id;
  const row = await api(`${SF.api.list}?id=${id}`);
  if (SF.moduleKey === 'animals') {
    document.getElementById('animal_rfid').value = row.rfid_number || '';
    document.getElementById('animal_name').value = row.name || '';
    document.getElementById('animal_species').value = row.species || '';
    document.getElementById('animal_breed').value = row.breed || '';
    document.getElementById('animal_sex').value = row.sex || 'M';
    document.getElementById('animal_birth').value = row.birth_date || '';
    document.getElementById('animal_status').value = row.status || 'sain';
    document.getElementById('animal_weight').value = row.weight || '';
    document.getElementById('animal_mother').value = row.mother_id || '';
    document.getElementById('animal_father').value = row.father_id || '';
  } else if (SF.moduleKey === 'vaccinations') {
    document.getElementById('vacc_animal').value = row.animal_id || '';
    document.getElementById('vacc_name').value = row.vaccine_name || '';
    document.getElementById('vacc_date').value = row.date_administered || '';
    document.getElementById('vacc_next').value = row.next_due_date || '';
    document.getElementById('vacc_vet').value = row.veterinarian || '';
    document.getElementById('vacc_notes').value = row.notes || '';
  } else if (SF.moduleKey === 'weight_history') {
    document.getElementById('weight_animal').value = row.animal_id || '';
    document.getElementById('weight_value').value = row.weight || '';
    document.getElementById('weight_date').value = row.measurement_date || '';
    document.getElementById('weight_gmq').value = row.gmq || '';
  } else if (SF.moduleKey === 'reproduction') {
    document.getElementById('repro_female').value = row.female_id || '';
    document.getElementById('repro_male').value = row.male_id || '';
    document.getElementById('repro_mating').value = row.mating_date || '';
    document.getElementById('repro_expected').value = row.expected_birth || '';
    document.getElementById('repro_actual').value = row.actual_birth || '';
    document.getElementById('repro_babies').value = row.babies_count || '';
  } else if (SF.moduleKey === 'milk_production') {
    document.getElementById('milk_animal').value = row.animal_id || '';
    document.getElementById('milk_quantity').value = row.quantity || '';
    document.getElementById('milk_date').value = row.production_date || '';
  } else if (SF.moduleKey === 'medications') {
    document.getElementById('med_animal').value = row.animal_id || '';
    document.getElementById('med_name').value = row.medicine_name || '';
    document.getElementById('med_dose').value = row.dose || '';
    document.getElementById('med_start').value = row.start_date || '';
    document.getElementById('med_wait').value = row.withdrawal_period || '';
    document.getElementById('med_blocked').value = row.sale_blocked_until || '';
  } else if (SF.moduleKey === 'feed_inventory') {
    document.getElementById('feed_name').value = row.item_name || '';
    document.getElementById('feed_category').value = row.category || '';
    document.getElementById('feed_qty').value = row.quantity || '';
    document.getElementById('feed_threshold').value = row.minimum_threshold || '';
    document.getElementById('feed_unit').value = row.unit || 'kg';
  }
  openModal(SF.modalId);
};
window.deleteEntry = (id) => confirmDelete(() => api(SF.api.save, 'DELETE', { id }));

window.submitAnimal = () => submitForm({ modalId: 'animalModal', formId: 'animalForm', api: SF.api });
window.submitVaccination = () => submitForm({ modalId: 'vaccinationModal', formId: 'vaccinationForm', api: SF.api });
window.submitWeight = () => submitForm({ modalId: 'weightModal', formId: 'weightForm', api: SF.api });
window.submitReproduction = () => submitForm({ modalId: 'reproductionModal', formId: 'reproductionForm', api: SF.api });
window.submitMilk = () => submitForm({ modalId: 'milkModal', formId: 'milkForm', api: SF.api });
window.submitMedication = () => submitForm({ modalId: 'medModal', formId: 'medForm', api: SF.api });
window.submitFeed = () => submitForm({ modalId: 'feedModal', formId: 'feedForm', api: SF.api });

window.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('currentDate').textContent = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());
  document.getElementById('hamburgerBtn')?.addEventListener('click', () => document.getElementById('sidebar')?.classList.toggle('open'));
  document.getElementById('userMenuToggle')?.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('userDropdown')?.classList.toggle('show'); });
  document.getElementById('confirmActionBtn')?.addEventListener('click', doDelete);
  initTheme();
  initShellInteractions();
  try {
    // use centralized apiFetch to avoid aggressive redirects
    let authRes = null;
    if (window.sfApiFetch) authRes = await window.sfApiFetch('auth/check.php');
    else authRes = await api('auth/check.php');
    if (!authRes || authRes.status === 401) {
      if (window.handleUnauthorized) await window.handleUnauthorized('auth/check.php', authRes);
      return;
    }
    const auth = authRes.payload || authRes;
    if (!auth.authenticated) { if (window.handleUnauthorized) await window.handleUnauthorized('auth/check.php', authRes); return; }
    document.getElementById('userDisplayName').textContent = `${auth.user.prenom} ${auth.user.nom}`;
    if (auth.user.photo) document.getElementById('avatarImg').innerHTML = `<img src="${auth.user.photo}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    document.body.dataset.role = auth.user.role || '';
    await loadData();
    await refreshNotifications();
    // visibility-aware notifications poller
    if (window.createPoller) notificationTimer = window.createPoller(refreshNotifications, 60000, { autoStart: true });
  } catch (error) {
    toast(error.message, 'danger');
    console.error(error);
  }
});
