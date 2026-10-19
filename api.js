"use strict";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQ95IDuQsD4ULogpY5RjfJ-B3xcfs4yA2zFtCliM-y_am2ApKjvz8RVXJ0aQ_DHGMl/exec";

async function fetchAPI(action, params = {}, method = "GET") {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append("action", action);
    url.searchParams.append("t", Date.now());
    
    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) url.searchParams.append(key, params[key]);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const options = { signal: controller.signal, cache: "no-store" };
        if (method === "POST") {
            options.method = "POST";
            options.body = url.searchParams;
        }

        const response = await fetch(url.toString(), options);
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        
        const text = await response.text();
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Сервер вернул некорректные данные"); }
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") throw new Error("Сервер не отвечает.");
        throw err;
    }
}

window.API = {
    login: (user, pass) => fetchAPI("login", { username: user, password: pass }),
    getStudents: () => fetchAPI("getstudents"),
    getStudentData: (key) => fetchAPI("getstudentdata", { key: key }),
    saveStudent: (key, name, group, payload) => fetchAPI("save", { key, name, group, payload }, "POST"),
    grantXP: (key, amount) => fetchAPI("grantxp", { key, amount }, "POST"),
    approveWork: (key, topicId, code, grade) => fetchAPI("approvework", { key, topicId, code, grade }, "POST"),
    getSchedule: () => fetchAPI("getschedules"),
    getChat: (group) => fetchAPI("chatload", { group }),
    sendChat: (group, key, name, text) => fetchAPI("chatsave", { group, key, name, text }, "POST"),
    loadComments: () => fetchAPI("loadcomments"),
    saveComment: (name, group, text) => fetchAPI("savecomment", { name, group, text }, "POST")
};