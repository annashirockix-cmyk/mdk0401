const API = {
  // Вставьте ссылку, полученную после переразвертывания (шаг 2)
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

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

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

  // ... (остальные методы register, getStudent, changePassword, changeEmail остаются без изменений, но с тем же заголовком 'text/plain;charset=utf-8')
};