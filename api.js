"use strict";

var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRqMojX_gOjCKByLFtJYrmnIwdzpWlMn0Isy-LBTGlDJi5J24GgytsjMMjfVGxDxA/exec";

async function fetchAPI(action, params, method) {
    params = params || {};
    method = method || "GET";

    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append("action", action);
    url.searchParams.append("t", String(Date.now()));

    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, 60000);

    try {
        const options = { signal: controller.signal, cache: "no-store" };
        if (method === "POST") {
            options.method = "POST";
            options.body = url.searchParams;
        }
        const response = await fetch(url.toString(), options);
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("HTTP Error " + response.status);

        const data = await response.json();
        return data;
    } catch (err) {
        clearTimeout(timeoutId);
        console.error("API Error [" + action + "]:", err);
        throw err;
    }
}

window.API = {
    login: function (user, pass) {
        var email = String(user || "").trim().toLowerCase();
        return fetchAPI("login", { email: email, username: email, password: pass }).then(function (res) { if (res && res.success) res.ok = true; return res; });
    },
    getStudents: function () {
        return fetchAPI("getStudents").then(function (res) { if (res && res.success) res.ok = true; return res; });
    },
    saveStudent: function (key, name, group, payload) {
        return fetchAPI("saveStudent", { email: key.split('|')[0], name: name, group: group, payload: payload }, "POST");
    },
    getSchedule: function () { return fetchAPI("getSchedule"); },
    saveSchedule: function (data) { return fetchAPI("saveSchedule", { schedule: JSON.stringify(data) }, "POST"); },
    
    // НОВЫЕ МЕТОДЫ
    uploadFile: function (fileName, mimeType, fileData) {
        return fetchAPI("upload_file", { fileName: fileName, mimeType: mimeType, fileData: fileData }, "POST");
    },
    getCustomContent: function () {
        return fetchAPI("get_custom_content");
    },
    saveCustomContent: function (data) {
        return fetchAPI("save_custom_content", data, "POST");
    },
    deleteCustomContent: function (id) {
        return fetchAPI("delete_custom_content", { id: id }, "POST");
    }
};