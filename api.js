const API = {
  // ВСТАВЬТЕ СЮДА ВАШ НОВЫЙ URL ИЗ GOOGLE APPS SCRIPT (который заканчивается на /exec)
  BASE_URL: 'https://script.google.com/macros/s/ВАШ_НОВЫЙ_ID/exec',

  async safeFetch(url, options = {}, timeoutMs = 15000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
        redirect: 'follow'
      });

      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

      if (data && data.error) throw new Error(data.error);
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      const isNetworkError = err.name === 'TypeError' || err.message.includes('Failed to fetch');
      if (isNetworkError) {
        if (typeof window.showToast === 'function') window.showToast('Ошибка сети. Проверьте интернет.', 'err');
        throw new Error('Нет соединения с сервером или доступ к нему заблокирован.');
      }
      if (err.name === 'AbortError') throw new Error('Сервер долго не отвечает.');
      throw err;
    }
  },

  async post(action, payload = {}) {
    return this.safeFetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload })
    });
  },

  async login(email, password) {
    const result = await this.post('login', { email, password });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка входа');
    return result;
  },

  async register(email, password, name, group) {
    const result = await this.post('register', { email, password, name, group });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка регистрации');
    return result;
  },

  async getStudent(email) {
    const result = await this.post('getStudent', { email });
    if (!result || !result.success) throw new Error(result?.error || 'Студент не найден');
    return result;
  },

  async changePassword(email, oldPass, newPass) {
    // ИСПРАВЛЕНО: отправляем oldPassword и newPassword, как ждет Code.gs
    const result = await this.post('changePassword', { email, oldPassword: oldPass, newPassword: newPass });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка смены пароля');
    return result;
  },

  async changeEmail(oldEmail, newEmail, password) {
    const result = await this.post('changeEmail', { oldEmail, newEmail, password });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка смены Email');
    return result;
  },

  async getStudents() {
    const result = await this.post('getStudents');
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка загрузки студентов');
    return result;
  },

  // ИСПРАВЛЕНО: saveStudent в Code.gs ожидает email, а не key. 
  // Но если у вас где-то вызывается API.saveStudent(key, ...), возможно, вам нужно адаптировать Code.gs.
  async saveStudent(email, name, group, payload) {
    const result = await this.post('saveStudent', { email, name, group, role: payload?.role, password: payload?.password });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка сохранения данных студента');
    return result;
  },

  async getSchedule() {
    const result = await this.post('getSchedule');
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка загрузки расписания');
    return result;
  },

  async saveSchedule(schedule) {
    const result = await this.post('saveSchedule', { schedule: JSON.stringify(schedule) });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка сохранения расписания');
    return result;
  },

  async getChat(group) {
    return this.post('getChat', { group });
  },

  async sendChat(group, key, name, text) {
    return this.post('sendChat', { group, key, name, text });
  }
};