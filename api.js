/**
 * api.js — слой работы с Google Apps Script
 */

const API = {
  // URL Web App (замените на свой)
  BASE_URL: 'https://script.google.com/macros/s/ВАШ_DEPLOYMENT_ID/exec',

  /**
   * Безопасный fetch (обработка CORS, таймаута, ошибок сети)
   */
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let data;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }
      }

      if (data && data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        throw new Error('Превышено время ожидания ответа от сервера');
      }
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('Нет соединения с сервером. Проверьте интернет.');
      }
      throw err;
    }
  },

  /**
   * Вход по Email + Пароль
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>}
   */
  async login(email, password) {
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error('Укажите email и пароль');
    }

    const result = await this.safeFetch(this.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'login',
        email: normalizedEmail,
        password: password
      })
    });

    if (!result || !result.success) {
      throw new Error(result?.error || result?.message || 'Ошибка входа');
    }

    return {
      email: result.email,
      name: result.name || result.email,
      group: result.group || '',
      role: result.role || 'student'
    };
  },

  /**
   * Сохранение / обновление студента (по email)
   * Если email уже есть — обновляет запись, а не создаёт дубликат
   * @param {object} studentData { email, password?, name?, group?, role? }
   */
  async saveStudent(studentData) {
    const email = String(studentData.email || '').trim().toLowerCase();
    if (!email) {
      throw new Error('Email обязателен');
    }

    const payload = {
      action: 'save_student',
      email: email,
      name: studentData.name || '',
      group: studentData.group || '',
      role: studentData.role || 'student'
    };

    if (studentData.password) {
      payload.password = studentData.password;
    }

    const result = await this.safeFetch(this.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!result || !result.success) {
      throw new Error(result?.error || 'Не удалось сохранить данные студента');
    }

    return result;
  },

  /**
   * Получение данных студента по email
   */
  async getStudent(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error('Email обязателен');
    }

    const result = await this.safeFetch(this.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'get_student',
        email: normalizedEmail
      })
    });

    if (!result || !result.success) {
      throw new Error(result?.error || 'Студент не найден');
    }

    return result;
  }
};