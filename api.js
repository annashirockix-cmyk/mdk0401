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
        return fetchAPI("login", {
            email: email,
            username: email,
            password: pass
        }).then(function (res) {
            if (res && res.success) res.ok = true;
            return res;
        });
    },
    getStudents: function () { return fetchAPI("getstudents"); },
    getStudentData: function (key) { return fetchAPI("getstudentdata", { key: key }); },
    saveStudent: function (key, name, group, payload) {
        return fetchAPI("save", { key: key, name: name, group: group, payload: payload }, "POST");
    },
    grantXP: function (key, amount) {
        return fetchAPI("grantXP", { key: key, amount: amount }, "POST");
    },
    deleteStudent: function (key) {
        return fetchAPI("deleteStudent", { key: key }, "POST");
    },
    getChat: function (group) { return fetchAPI("chatload", { group: group }); },
    sendChat: function (group, key, name, text) {
        return fetchAPI("chatsave", { group: group, key: key, name: name, text: text }, "POST");
    },
    getSchedule: function () { return fetchAPI("getschedule"); },
    saveSchedule: function (data) {
        return fetchAPI("saveschedule", { data: JSON.stringify(data) }, "POST");
    },
    changePassword: function (email, oldPass, newPass) {
        return fetchAPI("changePassword", {
            email: String(email || "").trim().toLowerCase(),
            oldPassword: oldPass,
            newPassword: newPass
        }, "POST").then(function (res) {
            if (res && res.success) res.ok = true;
            return res;
        });
    },
    changeName: function (email, password, newName) {
        return fetchAPI("changeName", {
            email: String(email || "").trim().toLowerCase(),
            password: password,
            name: newName
        }, "POST").then(function (res) {
            if (res && res.success) res.ok = true;
            return res;
        });
    }
};
