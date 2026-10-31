"use strict";

var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRqMojX_gOjCKByLFtJYrmnIwdzpWlMn0Isy-LBTGlDJi5J24GgytsjMMjfVGxDxA/exec";

/**
 * Универсальная функция для отправки запросов к Google Apps Script.
 * Использует application/x-www-form-urlencoded для POST-запросов,
 * чтобы обойти CORS preflight (OPTIONS) и корректно заполнить e.parameter в GAS.
 */
async function fetchAPI(action, params, method) {
    params = params || {};
    method = method || "GET";
    
    var url = APPS_SCRIPT_URL;
    var options = { 
        cache: "no-store", 
        redirect: 'follow'
    };

    if (method === "POST") {
        options.method = "POST";
        var bodyData = new URLSearchParams();
        bodyData.append("action", action);
        
        for (var key in params) {
            if (params[key] !== undefined && params[key] !== null) {
                bodyData.append(key, params[key]);
            }
        }
        // Браузер автоматически поставит Content-Type: application/x-www-form-urlencoded
        // Это "простой" запрос, который не вызывает предварительный OPTIONS (CORS)
        options.body = bodyData;
    } else {
        var urlObj = new URL(url);
        urlObj.searchParams.append("action", action);
        urlObj.searchParams.append("t", String(Date.now()));
        for (var k in params) {
            if (params[k] !== undefined && params[k] !== null) {
                urlObj.searchParams.append(k, params[k]);
            }
        }
        url = urlObj.toString();
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, 60000);
    options.signal = controller.signal;

    try {
        const response = await fetch(url, options);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error("HTTP Error " + response.status + " " + response.statusText);
        }
        
        const data = await response.json();
        return data;
    } catch (err) {
        clearTimeout(timeoutId);
        console.error("API Error [" + action + "]:", err);
        throw err;
    }
}

window.API = {
    // ==========================================
    // АВТОРИЗАЦИЯ И ПРОФИЛЬ
    // ==========================================
    login: function (user, pass) {
        var email = String(user || "").trim().toLowerCase();
        return fetchAPI("login", { email: email, password: pass }, "POST");
    },
    register: function (email, password, name, group) {
        return fetchAPI("register", { 
            email: String(email || "").trim().toLowerCase(), 
            password: password, 
            name: name, 
            group: group 
        }, "POST");
    },
    changePassword: function (email, oldPass, newPass) {
        return fetchAPI("changePassword", {
            email: String(email || "").trim().toLowerCase(),
            oldPassword: oldPass,
            newPassword: newPass
        }, "POST");
    },
    changeName: function (email, password, newName) {
        return fetchAPI("changeName", {
            email: String(email || "").trim().toLowerCase(),
            password: password,
            name: newName
        }, "POST");
    },
    changeEmail: function (oldEmail, newEmail, password) {
        return fetchAPI("changeEmail", {
            oldEmail: String(oldEmail || "").trim().toLowerCase(),
            newEmail: String(newEmail || "").trim().toLowerCase(),
            password: password
        }, "POST");
    },

    // ==========================================
    // СТУДЕНТЫ И РЕЗУЛЬТАТЫ
    // ==========================================
    getStudents: function () {
        return fetchAPI("getStudents");
    },
    saveStudent: function (key, name, group, payload) {
        return fetchAPI("saveStudent", { 
            email: key.split('|')[0], 
            name: name, 
            group: group, 
            payload: payload 
        }, "POST");
    },
    getResults: function (filters) {
        return fetchAPI("getResults", filters || {});
    },
    saveResult: function (data) {
        return fetchAPI("saveResult", data, "POST");
    },

    // ==========================================
    // РАСПИСАНИЕ
    // ==========================================
    getSchedule: function () { 
        return fetchAPI("getSchedule"); 
    },
    saveSchedule: function (data) { 
        return fetchAPI("saveSchedule", { schedule: JSON.stringify(data) }, "POST"); 
    },

    // ==========================================
    // ПОЛЬЗОВАТЕЛЬСКИЙ КОНТЕНТ (ЛЕКЦИИ, ФАЙЛЫ)
    // ==========================================
    uploadFile: function (fileName, mimeType, fileData) {
        // Отправка файла (Base64) в теле POST-запроса
        return fetchAPI("upload_file", { 
            fileName: fileName, 
            mimeType: mimeType, 
            fileData: fileData 
        }, "POST");
    },
    getCustomContent: function () {
        return fetchAPI("get_custom_content");
    },
    saveCustomContent: function (data) {
        return fetchAPI("save_custom_content", data, "POST");
    },
    deleteCustomContent: function (id) {
        return fetchAPI("delete_custom_content", { id: id }, "POST");
    },

    // ==========================================
    // ЧАТ (ЗАГЛУШКИ, ЕСЛИ ИСПОЛЬЗУЮТСЯ)
    // ==========================================
    getChat: function (group) { 
        return fetchAPI("getChat", { group: group }); 
    },
    sendChat: function (group, key, name, text) {
        return fetchAPI("sendChat", { group: group, key: key, name: name, text: text }, "POST");
    }
};