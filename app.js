document.addEventListener("DOMContentLoaded", function () {
    // Элементы
    const loginOverlay = document.getElementById("loginOverlay");
    const appContent = document.getElementById("appContent");
    
    const studentForm = document.getElementById("studentForm");
    const teacherForm = document.getElementById("teacherForm");
    
    const teacherLogin = document.getElementById("teacherLogin");
    const teacherPass = document.getElementById("teacherPass");
    
    const userStatus = document.getElementById("userStatus");
    const logoutBtn = document.getElementById("logoutBtn");
    const toastContainer = document.getElementById("toastContainer");

    // Функция показа уведомлений
    function showToast(text, type = 'ok') {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = text;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Вход
    function loginUser(name) {
        // Скрываем окно входа
        loginOverlay.style.display = "none";
        // Показываем портал
        appContent.style.display = "block";
        // Обновляем имя в шапке
        userStatus.textContent = name;
        
        showToast(`Добро пожаловать, ${name}!`);
    }

    // Обработка формы преподавателя
    if (teacherForm) {
        teacherForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const login = teacherLogin.value.trim();
            const pass = teacherPass.value.trim();

            if (login === "teacher" && pass === "teacher") {
                loginUser("Преподаватель");
            } else {
                showToast("Неверный логин или пароль", "err");
            }
        });
    }

    // Обработка формы студента (для простоты)
    if (studentForm) {
        studentForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nameInput = document.getElementById("studentName").value.trim();
            if (nameInput) {
                loginUser(nameInput);
            } else {
                showToast("Введите ФИО", "err");
            }
        });
    }

    // Выход
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            // Скрываем портал
            appContent.style.display = "none";
            // Показываем окно входа
            loginOverlay.style.display = "flex";
            userStatus.textContent = "Гость";
            showToast("Вы вышли из системы");
        });
    }
});