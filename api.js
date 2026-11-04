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
            'Content-Type': 'text/plain;charset=utf-8' // Обход preflight-запроса
        }
    };

    if (method === "POST") {
        // Отправляем данные как JSON-строку в теле запроса
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
        if (!response.ok) {
            throw new Error("HTTP Error " + response.status + " " + response.statusText);
        }
        return await response.json();
    } catch (err) {
        clearTimeout(timeoutId);
        console.error("API Error [" + action + "]:", err);
        throw err;
    }
}
