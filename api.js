/**
 * api.js — слой работы с Google Apps Script
 */

const API = {
  // Вставлена ВАША новая ссылка из Apps Script
  BASE_URL: 'https://script.google.com/macros/s/AKfycbzRqMojX_gOjCKByLFtJYrmnIwdzpWlMn0Isy-LBTGlDJi5J24GgytsjMMjfVGxDxA/exec',

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

      const contentType = response.headers.get('content-type') || '';
      let data;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try { data = JSON.parse(text); } catch { data = { raw: text }; }
      }

      if (data && data.error) throw new Error(data.error);
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      const isNetworkError = err.name === 'TypeError' || err.message.includes('Failed to fetch');
      if (isNetworkError) {
        if (typeof window.showToast === 'function') window.showToast('Ой! Пропал интернет.', 'err');
        throw new Error('Нет соединения с сервером.');
      }
      if (err.name === 'AbortError') throw new Error('Сервер долго не отвечает.');
      throw err;
    }
  },

  async login(email, password) {
    const result = await this.safeFetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка входа');
    return result;
  },

  async register(email, password, name, group) {
    const result = await this.safeFetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'register', email, password, name, group })
    });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка регистрации');
    return result;
  },

  async getStudent(email) {
    const result = await this.safeFetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'get_student', email })
    });
    if (!result || !result.success) throw new Error(result?.error || 'Студент не найден');
    return result;
  },

  async changePassword(email, oldPassword, newPassword) {
    const result = await this.safeFetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'change_password', email, oldPassword, newPassword })
    });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка смены пароля');
    return result;
  },

  async changeEmail(oldEmail, newEmail, password) {
    const result = await this.safeFetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'change_email', oldEmail, newEmail, password })
    });
    if (!result || !result.success) throw new Error(result?.error || 'Ошибка смены Email');
    return result;
  }
};