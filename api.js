"use strict";

var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3Ev3stuvLl36nxjmXU0q2zi4UsS5ViXwEj1x6q_JjlCccMJld36o6y1H__CvJn5KB/exec";

async function fetchAPI(action, params = {}, method = "GET") {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("ВАША_НОВАЯ_ССЫЛКА")) {
        console.warn("Внимание: Ссылка на Google Apps Script не указана в api.js!");
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
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); 
    
    try {
        const options = { signal: controller.signal, cache: "no-store" };
        if (method === "POST") { 
            options.method = "POST"; 
            options.body = url.searchParams; 
        }
        const response = await fetch(url.toString(), options);
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        return await response.json();
    } catch (err) {
        clearTimeout(timeoutId);
        console.error(`API Error [${action}]:`, err);
        return { ok: false, error: err.message };
    }
}

window.API = {
    login: (user, pass) => fetchAPI("login", { username: user, password: pass }),
    getStudents: () => fetchAPI("getstudents"),
    getStudentData: (key) => fetchAPI("getstudentdata", { key: key }),
    saveStudent: (key, name, group, payload) => fetchAPI("save", { key, name, group, payload }, "POST"),
    grantXP: (key, amount) => fetchAPI("grantXP", { key, amount }, "POST"),
    deleteStudent: (key) => fetchAPI("deleteStudent", { key: key }, "POST"),
    getChat: (group) => fetchAPI("chatload", { group }),
    sendChat: (group, key, name, text) => fetchAPI("chatsave", { group, key, name, text }, "POST"),
    getSchedule: () => fetchAPI("getschedule"),
    saveSchedule: (data) => fetchAPI("saveschedule", { data: JSON.stringify(data) }, "POST"),
    getInfo: () => fetchAPI("getinfo"),
    saveInfo: (text) => fetchAPI("saveinfo", { text }, "POST")
};