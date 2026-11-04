"use strict";

var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRqMojX_gOjCKByLFtJYrmnIwdzpWlMn0Isy-LBTGlDJi5J24GgytsjMMjfVGxDxA/exec";

async function fetchAPI(action, params, method) {
    params = params || {};
    method = method || "GET";
    
    var urlObj = new URL(APPS_SCRIPT_URL);
    urlObj.searchParams.append("action", action);
    urlObj.searchParams.append("t", String(Date.now()));

    var options = { 
        method: method,
        cache: "no-store", 
        redirect: 'follow',
        headers: { 
            'Content-Type': 'text/plain;charset=utf-8' 
        }
    };

    if (method === "POST") {
        options.body = JSON.stringify(params);
    } else {
        for (var k in params) {
            if (params[k] !== undefined && params[k] !== null) {
                urlObj.searchParams.append(k, params[k]);
            }
        }
    }

    const controller = new AbortController();
    // Увеличиваем таймаут до 120 секунд (2 минуты) из-за медленного холодного старта Google
    const timeoutId = setTimeout(function () { controller.abort(); }, 120000); 
    options.signal = controller.signal;

    try {
        console.log(`[API] Отправка запроса: ${action}...`);
        const response = await fetch(urlObj.toString(), options);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error("HTTP Error " + response.status + " " + response.statusText);
        }
        
        // Получаем ответ как текст, чтобы отловить ошибки, если сервер вернул HTML вместо JSON
        const textResponse = await response.text();
        
        try {
            return JSON.parse(textResponse);
        } catch (parseError) {
            console.error("[API] Сервер вернул не JSON. Сырой ответ:", textResponse);
            throw new Error("Сервер вернул некорректный формат данных (не JSON). Скорее всего, скрипт развернут с ошибкой в правах доступа.");
        }
        
    } catch (err) {
        clearTimeout(timeoutId);
        console.error("API Error [" + action + "]:", err);
        throw err;
    }
}

window.API = {
    login: function (user, pass) {
        var email = String(user || "").trim().toLowerCase();
        return fetchAPI("login", { email: email, password: pass }, "POST");
    },
    register: function (email, password, name, group) {
        return fetchAPI("register", { email: email, password: password, name: name, group: group }, "POST");
    },
    getStudents: function () {
        return fetchAPI("getStudents", {}, "GET");
    },
    saveStudent: function (key, name, group, payload) {
        return fetchAPI("saveStudent", { email: key.split('|')[0], name: name, group: group, payload: payload }, "POST");
    },
    getResults: function (filters) {
        return fetchAPI("getResults", filters || {}, "GET");
    },
    saveResult: function (data) {
        return fetchAPI("saveResult", data, "POST");
    },
    getSchedule: function () {
        return fetchAPI("getSchedule", {}, "GET");
    },
    saveSchedule: function (data) {
        return fetchAPI("saveSchedule", { schedule: JSON.stringify(data) }, "POST");
    },
    uploadFile: function (fileName, mimeType, fileData) {
        return fetchAPI("upload_file", { fileName: fileName, mimeType: mimeType, fileData: fileData }, "POST");
    },
    getCustomContent: function () {
        return fetchAPI("get_custom_content", {}, "GET");
    },
    saveCustomContent: function (data) {
        return fetchAPI("save_custom_content", data, "POST");
    },
    deleteCustomContent: function (id) {
        return fetchAPI("delete_custom_content", { id: id }, "POST");
    }
};
