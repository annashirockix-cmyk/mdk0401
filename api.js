async function fetchAPI(action, params = {}, method = "POST") {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("ВАША_НОВАЯ_ССЫЛКА")) {
        console.warn("Ссылка на Google Apps Script не указана!");
        return { ok: false, error: "URL not configured" };
    }

    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append("action", action);
    url.searchParams.append("t", Date.now()); 
    
    for (const key in params) { 
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]); 
        } 
    }
    
    try {
        // ИСПОЛЬЗУЕМ POST с Content-Type: text/plain, чтобы избежать preflight (CORS)
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8", // <-- Ключевое изменение
            },
            body: JSON.stringify(params) // Отправляем данные в теле запроса
        });
        
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error(`API Error [${action}]:`, err);
        return { ok: false, error: err.message };
    }
}

// Остальная часть window.API остается без изменений
window.API = {
    login: (user, pass) => fetchAPI("login", { username: user, password: pass }),
    getStudents: () => fetchAPI("getstudents"),
    getStudentData: (key) => fetchAPI("getstudentdata", { key: key }),
    saveStudent: (key, name, group, payload) => fetchAPI("save", { key, name, group, payload }),
    grantXP: (key, amount) => fetchAPI("grantXP", { key, amount }),
    deleteStudent: (key) => fetchAPI("deleteStudent", { key: key }),
    // ... остальные методы
};