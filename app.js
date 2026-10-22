document.addEventListener("DOMContentLoaded", function () {
    // Элементы экранов
    const loginOverlay = document.getElementById("loginOverlay");
    const appContent = document.getElementById("appContent");
    
    // Формы
    const studentForm = document.getElementById("studentForm");
    const teacherForm = document.getElementById("teacherForm");
    
    // Данные
    const teacherLogin = document.getElementById("teacherLogin");
    const teacherPass = document.getElementById("teacherPass");
    const studentNameInput = document.getElementById("studentName");
    const studentGroupInput = document.getElementById("studentGroup");
    
    // Элементы интерфейса (Профиль)
    const profileName = document.getElementById("profileName");
    const profileGroup = document.getElementById("profileGroup");
    const profileIcon1 = document.getElementById("profileIcon1");
    const profileIcon2 = document.getElementById("profileIcon2");
    const topbarStatus = document.getElementById("topbarStatus");
    
    // Кнопка выхода
    const logoutBtn = document.getElementById("logoutBtn");
    
    // Контейнер уведомлений
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

    // Функция входа
    function loginUser(user) {
        // Скрываем оверлей, показываем портал
        loginOverlay.style.display = "none";
        appContent.style.display = "block";
        
        // Обновляем данные в профиле
        profileName.textContent = user.name;
        profileGroup.textContent = user.group;
        topbarStatus.textContent = user.name;
        
        // Меняем иконки
        if (user.role === 'teacher') {
            profileIcon1.textContent = "👨‍🏫";
            profileIcon2.textContent = "📚";
        } else {
            profileIcon1.textContent = "👨‍🎓";
            profileIcon2.textContent = "📖";
        }
        
        showToast(`Добро пожаловать, ${user.name}!`);
    }

    // Обработка формы преподавателя
    if (teacherForm) {
        teacherForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const login = teacherLogin.value.trim();
            const pass = teacherPass.value.trim();

            if (login === "teacher" && pass === "teacher") {
                loginUser({ name: "Преподаватель", group: "Журнал", role: "teacher" });
            } else {
                showToast("Неверный логин или пароль", "err");
            }
        });
    }

    // Обработка формы студента
    if (studentForm) {
        studentForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = studentNameInput.value.trim();
            const group = studentGroupInput.value.trim();
            
            if (name && group) {
                loginUser({ name: name, group: group, role: "student" });
            } else {
                showToast("Заполните ФИО и Группу", "err");
            }
        });
    }

    // Обработка выхода
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            // Скрываем портал, показываем оверлей
            appContent.style.display = "none";
            loginOverlay.style.display = "flex";
            
            // Очищаем формы
            if(teacherForm) teacherForm.reset();
            if(studentForm) studentForm.reset();
            
            showToast("Вы вышли из системы");
        });
    }
});