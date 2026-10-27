/**
 * api.js — клиент к Google Apps Script
 */
const API = {
  BASE_URL:
    'https://script.google.com/macros/s/AKfycbzRqMojX_gOjCKByLFtJYrmnIwdzpWlMn0Isy-LBTGlDJi5J24GgytsjMMjfVGxDxA/exec',

  async safeFetch(url, options = {}, timeoutMs = 20000) {
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

      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        if (text && text.indexOf('<html') !== -1) {
          throw new Error(
            'Сервер вернул HTML вместо JSON. Переразверните Apps Script (Deploy → New version, доступ: Все).'
          );
        }
        data = { raw: text };
      }

      if (data && data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'TypeError' || (err.message && err.message.indexOf('Failed to fetch') !== -1)) {
        if (typeof window.showToast === 'function') {
          window.showToast('Ошибка сети. Проверьте интернет.', 'err');
        }
        throw new Error('Нет соединения с сервером или доступ к нему заблокирован.');
      }
      if (err.name === 'AbortError') {
        throw new Error('Сервер долго не отвечает.');
      }
      throw err;
    }
  },

  async post(action, payload) {
    payload = payload || {};
    const body = JSON.stringify(Object.assign({ action: action }, payload));

    try {
      return await this.safeFetch(this.BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: body
      });
    } catch (postErr) {
      try {
        const params = new URLSearchParams({ action: action });
        Object.keys(payload).forEach(function (k) {
          const v = payload[k];
          if (v !== undefined && v !== null) {
            params.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
          }
        });
        const sep = this.BASE_URL.indexOf('?') >= 0 ? '&' : '?';
        return await this.safeFetch(this.BASE_URL + sep + params.toString(), {
          method: 'GET'
        });
      } catch (getErr) {
        throw postErr;
      }
    }
  },

  async login(email, password) {
    const result = await this.post('login', { email: email, password: password });
    if (!result || !result.success) throw new Error((result && result.error) || 'Ошибка входа');
    return result;
  },

  async register(email, password, name, group) {
    const result = await this.post('register', {
      email: email,
      password: password,
      name: name,
      group: group
    });
    if (!result || !result.success) throw new Error((result && result.error) || 'Ошибка регистрации');
    return result;
  },

  async getStudent(email) {
    const result = await this.post('getStudent', { email: email });
    if (!result || !result.success) throw new Error((result && result.error) || 'Студент не найден');
    return result;
  },

  async changePassword(email, oldPass, newPass) {
    const result = await this.post('changePassword', {
      email: email,
      oldPassword: oldPass,
      newPassword: newPass
    });
    if (!result || !result.success) throw new Error((result && result.error) || 'Ошибка смены пароля');
    return result;
  },

  async changeEmail(oldEmail, newEmail, password) {
    const result = await this.post('changeEmail', {
      oldEmail: oldEmail,
      newEmail: newEmail,
      password: password
    });
    if (!result || !result.success) throw new Error((result && result.error) || 'Ошибка смены Email');
    return result;
  },

  async getStudents() {
    const result = await this.post('getStudents');
    if (!result || !result.success) throw new Error((result && result.error) || 'Ошибка загрузки студентов');
    return result;
  },

  async saveStudent(email, name, group, payload) {
    payload = payload || {};
    const result = await this.post('saveStudent', {
      email: email,
      name: name,
      group: group,
      role: payload.role,
      password: payload.password
    });
    if (!result || !result.success) {
      throw new Error((result && result.error) || 'Ошибка сохранения данных студента');
    }
    return result;
  },

  async getSchedule() {
    const result = await this.post('getSchedule');
    if (!result || !result.success) throw new Error((result && result.error) || 'Ошибка загрузки расписания');
    return result;
  },

  async saveSchedule(schedule) {
    const result = await this.post('saveSchedule', {
      schedule: typeof schedule === 'string' ? schedule : JSON.stringify(schedule)
    });
    if (!result || !result.success) throw new Error((result && result.error) || 'Ошибка сохранения расписания');
    return result;
  },

  async getChat(group) {
    return this.post('getChat', { group: group });
  },

  async sendChat(group, key, name, text) {
    return this.post('sendChat', { group: group, key: key, name: name, text: text });
  },

  async saveResult(payload) {
    const result = await this.post('saveResult', payload || {});
    if (!result || !result.success) throw new Error((result && result.error) || 'Ошибка сохранения результата');
    return result;
  },

  async getResults(filters) {
    const result = await this.post('getResults', filters || {});
    if (!result || !result.success) throw new Error((result && result.error) || 'Ошибка загрузки результатов');
    return result;
  }
};
