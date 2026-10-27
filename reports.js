/**
 * reports.js — кабинет преподавателя: отчёты и выгрузка CSV
 */

const Reports = {
  results: [],
  filteredResults: [],

  async init() {
    if (typeof loadSession === 'function') {
      const session = loadSession();
      if (!session || session.role !== 'teacher') {
        alert('Доступ только для преподавателей');
        if (typeof showScreen === 'function') showScreen('main-screen');
        return;
      }
    }

    this.bindEvents();
    await this.loadResults();
  },

  bindEvents() {
    const refreshBtn = document.getElementById('reports-refresh-btn');
    const exportBtn = document.getElementById('reports-export-btn');
    const filterGroup = document.getElementById('filter-group');
    const filterTest = document.getElementById('filter-test');

    if (refreshBtn) refreshBtn.addEventListener('click', () => this.loadResults());
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportToCSV());
    if (filterGroup) filterGroup.addEventListener('change', () => this.applyFilters());
    if (filterTest) filterTest.addEventListener('change', () => this.applyFilters());
  },

  async loadResults() {
    const tbody = document.getElementById('reports-tbody');
    const statusEl = document.getElementById('reports-status');

    if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Загрузка...</td></tr>';
    if (statusEl) {
      statusEl.textContent = 'Загрузка данных...';
      statusEl.style.color = 'inherit';
    }

    try {
      // ИСПОЛЬЗУЕМ ВСТРОЕННЫЙ МЕТОД API
      const response = await API.post('get_results');

      // Проверяем оба флага (success или ok)
      if (!response || (!response.success && !response.ok)) {
        throw new Error(response?.error || 'Сервер вернул ошибку (возможно, неверный URL или доступ)');
      }

      // Достаем результаты (вдруг сервер вернул их в поле data)
      const results = response.results || response.data || [];
      this.results = results;

      this.populateFilters();
      this.applyFilters();

      if (statusEl) {
        statusEl.textContent = `Всего записей: ${this.results.length}`;
      }
    } catch (err) {
      console.error('[Reports] Ошибка загрузки:', err);
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center; padding: 10px;">Ошибка: ${err.message}</td></tr>`;
      }
      if (statusEl) {
        statusEl.textContent = 'Ошибка загрузки';
        statusEl.style.color = 'red';
      }
    }
  },

  populateFilters() {
    const groupSelect = document.getElementById('filter-group');
    const testSelect = document.getElementById('filter-test');
    if (!groupSelect || !testSelect) return;

    const groups = [...new Set(this.results.map((r) => r.group || '').filter(Boolean))].sort();
    groupSelect.innerHTML = '<option value="">Все группы</option>';
    groups.forEach((g) => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      groupSelect.appendChild(opt);
    });

    const testsMap = new Map();
    this.results.forEach((r) => {
      if (r.testId) testsMap.set(r.testId, r.testTitle || r.testId);
    });

    testSelect.innerHTML = '<option value="">Все тесты</option>';
    [...testsMap.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .forEach(([id, title]) => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = title;
        testSelect.appendChild(opt);
      });
  },

  applyFilters() {
    const groupVal = (document.getElementById('filter-group')?.value || '').trim();
    const testVal = (document.getElementById('filter-test')?.value || '').trim();

    this.filteredResults = this.results.filter((r) => {
      if (groupVal && String(r.group || '') !== groupVal) return false;
      if (testVal && String(r.testId || '') !== testVal) return false;
      return true;
    });

    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById('reports-tbody');
    if (!tbody) return;

    if (this.filteredResults.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Нет данных</td></tr>';
      return;
    }

    const rows = this.filteredResults
      .map((r) => {
        const timeStr = this.formatTime(r.timeSpent);
        const dateStr = this.formatDate(r.finishedAt);
        return `
          <tr>
            <td>${this.escapeHtml(r.name || r.email || '—')}</td>
            <td>${this.escapeHtml(r.group || '—')}</td>
            <td>${this.escapeHtml(r.testTitle || r.testId || '—')}</td>
            <td class="grade-cell grade-${r.grade}">${r.grade || '—'}</td>
            <td>${timeStr}</td>
            <td>${r.attempts || 1}</td>
            <td>${dateStr}</td>
          </tr>
        `;
      })
      .join('');

    tbody.innerHTML = rows;
  },

  formatTime(seconds) {
    const sec = Math.max(0, Number(seconds) || 0);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  },

  formatDate(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return String(iso);
    }
  },

  escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  exportToCSV() {
    const data = this.filteredResults.length > 0 ? this.filteredResults : this.results;

    if (!data || data.length === 0) {
      alert('Нет данных для выгрузки');
      return;
    }

    const headers = ['ФИО', 'Группа', 'Тест', 'Оценка', 'Время', 'Попытки'];
    const rows = data.map((r) => {
      const timeStr = this.formatTime(r.timeSpent);
      return [
        this.csvEscape(r.name || r.email || ''),
        this.csvEscape(r.group || ''),
        this.csvEscape(r.testTitle || r.testId || ''),
        r.grade || '',
        timeStr,
        r.attempts || 1
      ].join(';');
    });

    const bom = '\uFEFF';
    const csvContent = bom + headers.join(';') + '\n' + rows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const now = new Date();
    const fileName = `отчёт_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  csvEscape(value) {
    const str = String(value ?? '');
    if (str.includes(';') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }
};
