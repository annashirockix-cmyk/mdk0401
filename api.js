"use strict";

window.APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3Ev3stuvLl36nxjmXU0q2zi4UsS5ViXwEj1x6q_JjlCccMJld36o6y1H__CvJn5KB/exec";

async function fetchAPI(action, params = {}) {
    if (!window.APPS_SCRIPT_URL || window.APPS_SCRIPT_URL.includes("ВАША_НОВАЯ_ССЫЛКА")) {
        return { ok: false, error: "URL не настроен в api.js" };
    }

    const url = new URL(window.APPS_SCRIPT_URL);
    url.searchParams.append("action", action);
    url.searchParams.append("t", Date.now()); 
    
    for (const key in params) { 
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]); 
        } 
    }
    
    try {
        const response = await fetch(url.toString(), {
            method: "POST",
            // КЛЮЧЕВОЙ МОМЕНТ: text/plain обходит preflight-запрос браузера[reference:6]
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(params),
            mode: "cors",
            redirect: "follow" // Google часто перенаправляет запросы[reference:7]
        });
        
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error(`API Error [${action}]:`, err);
        return { ok: false, error: err.message };
    }
}

window.API = {
    login: (user, pass) => fetchAPI("login", { username: user, password: pass }),
    getStudents: () => fetchAPI("getstudents"),
    getStudentData: (key) => fetchAPI("getstudentdata", { key: key }),
    saveStudent: (key, name, group, payload) => fetchAPI("save", { key, name, group, payload }),
    grantXP: (key, amount) => fetchAPI("grantXP", { key, amount }),
    deleteStudent: (key) => fetchAPI("deleteStudent", { key: key }),
    getChat: (group) => fetchAPI("chatload", { group }),
    sendChat: (group, key, name, text) => fetchAPI("chatsave", { group, key, name, text }),
    getSchedule: () => fetchAPI("getschedule"),
    saveSchedule: (data) => fetchAPI("saveschedule", { data: JSON.stringify(data) })
};