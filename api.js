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
    const timeoutId = setTimeout(function () { controller.abort(); }, 60000);
    options.signal = controller.signal;

    try {
        const response = await fetch(urlObj.toString(), options);
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("HTTP Error " + response.status);
        return await response.json();
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
    changePassword: function (email, oldPass, newPass) {
        return fetchAPI("changePassword", { email: email, oldPassword: oldPass, newPassword: newPass }, "POST");
    },
    changeName: function (email, password, newName) {
        return fetchAPI("changeName", { email: email, password: password, name: newName }, "POST");
    },
    changeEmail: function (oldEmail, newEmail, password) {
        return fetchAPI("changeEmail", { oldEmail: oldEmail, newEmail: newEmail, password: password }, "POST");
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