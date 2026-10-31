function setupLogin() {
    var overlay = document.getElementById("loginOverlay"); 
    if (!overlay) return;
    
    function applyAuthSession(res, email) {
        var role = (res.role || "student").toLowerCase();
        if (role === "teacher" || role === "admin") {
            window.state.staff = { name: res.name || email, role: role, email: email };
            window.state.student = null;
        } else {
            window.state.student = { name: res.name || email, group: res.group || "", email: email };
            window.state.staff = null;
        }
        window.saveStudentData(); 
        window.renderUserChip();
        overlay.style.display = "none";
        window.unlockAchievement("welcome");
        location.hash = "#/"; 
        window.router();
    }

    function doUnifiedLogin() {
        var email = document.getElementById("loginEmail").value.trim(); 
        var pass = document.getElementById("loginPassword").value;
        var btn = document.getElementById("btnLoginUnified");
        
        if (!email || !pass) { 
            alert("Введите email и пароль"); 
            return; 
        }
        
        btn.disabled = true; 
        btn.textContent = "Вход...";
        console.log("Попытка входа...", email);

        if (typeof window.API === "undefined") {
            alert("Критическая ошибка: API не загружен (файл api.js).");
            btn.disabled = false; 
            btn.textContent = "Войти";
            return;
        }

        window.API.login(email, pass).then(function(res) {
            console.log("Ответ от сервера:", res);
            if (res && res.success) {
                applyAuthSession(res, email);
            } else {
                alert("Ошибка входа: " + (res && res.error ? res.error : "Неизвестная ошибка"));
                btn.disabled = false; 
                btn.textContent = "Войти";
            }
        }).catch(function(err) {
            console.error("Ошибка при запросе логина:", err);
            alert("Ошибка сети или CORS. Проверьте, что вы переопубликовали Google Script (Новая версия) и обновили страницу с очисткой кэша.");
            btn.disabled = false; 
            btn.textContent = "Войти";
        });
    }

    var btn = document.getElementById("btnLoginUnified"); 
    if (btn) btn.onclick = function(e) { e.preventDefault(); doUnifiedLogin(); };
    
    var form = document.getElementById("unifiedLoginForm"); 
    if (form) form.onsubmit = function(e) { e.preventDefault(); doUnifiedLogin(); };
}