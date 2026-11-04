    function doUnifiedLogin() {
        var email = document.getElementById("loginEmail").value.trim(); 
        var pass = document.getElementById("loginPassword").value;
        var btn = document.getElementById("btnLoginUnified");
        
        if (!email || !pass) { alert("Введите email и пароль"); return; }
        
        btn.disabled = true; 
        btn.textContent = "Ожидание сервера (до 15 сек)..."; // Показываем пользователю, что идет процесс
        
        if (typeof window.API === "undefined") {
            alert("Критическая ошибка: API не загружен.");
            btn.disabled = false; btn.textContent = "Войти"; return;
        }

        console.log("Попытка входа...", email);

        window.API.login(email, pass).then(function(res) {
            console.log("Ответ сервера:", res);
            if (res && res.success) {
                applyAuthSession(res, email);
            } else {
                alert("Ошибка входа: " + (res && res.error ? res.error : "Неизвестная ошибка"));
                btn.disabled = false; 
                btn.textContent = "Войти";
            }
        }).catch(function(err) {
            console.error("Ошибка запроса:", err);
            alert("Ошибка при входе. Проверьте консоль (F12) или настройки развертывания Google Script. \n\n" + err.message);
            btn.disabled = false; 
            btn.textContent = "Войти";
        });
    }
