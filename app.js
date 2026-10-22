document.addEventListener("DOMContentLoaded", function () {
    
    const loginSection = document.getElementById("loginSection");
    const dashboardSection = document.getElementById("dashboardSection");
    const studentForm = document.getElementById("studentLoginForm");
    const teacherForm = document.getElementById("teacherLoginForm");
    
    const studentNameInput = document.getElementById("studentName");
    const studentGroupInput = document.getElementById("studentGroup");
    const teacherLoginInput = document.getElementById("teacherLogin");
    const teacherPassInput = document.getElementById("teacherPass");
    
    const userNameDisplay = document.querySelector(".user-details h3");
    const userGroupDisplay = document.querySelector(".user-details .meta");
    const xpBadge = document.querySelector(".xp-badge");
    const logoutBtn = document.querySelector(".logout-link");
    const navLinks = document.querySelectorAll(".portal-nav a:not(.logout-link)");

    // --- ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ---
    function updateUI(user) {
        if (user) {
            // Пользователь ВОШЕЛ
            userNameDisplay.textContent = user.name;
            userGroupDisplay.textContent = user.role === 'teacher' ? 'Преподаватель' : user.group;
            document.querySelector(".user-avatar-icons .icons").innerHTML = "<span>👨‍🏫</span><span>📚</span>";
            
            // СКРЫВАЕМ формы, ПОКАЗЫВАЕМ рабочий стол
            if (loginSection) loginSection.classList.add("hidden");
            if (dashboardSection) dashboardSection.classList.remove("hidden");
            
        } else {
            // Пользователь ВЫШЕЛ
            userNameDisplay.textContent = "Гость";
            userGroupDisplay.textContent = "Группа";
            xpBadge.innerHTML = "🌟 0 XP";
            document.querySelector(".user-avatar-icons .icons").innerHTML = "<span>👨‍🎓</span><span>📖</span>";
            
            // ПОКАЗЫВАЕМ формы, СКРЫВАЕМ рабочий стол
            if (loginSection) loginSection.classList.remove("hidden");
            if (dashboardSection) dashboardSection.classList.add("hidden");
            
            if(studentForm) studentForm.reset();
            if(teacherForm) teacherForm.reset();
            
            // Сброс активной вкладки на Главную
            navLinks.forEach(link => link.classList.remove("active"));
            if(navLinks.length > 0) navLinks[0].classList.add("active");
        }
    }

    // --- ПРОВЕРКА СЕССИИ ---
    const savedUser = localStorage.getItem("mdk_user");
    if (savedUser) {
        updateUI(JSON.parse(savedUser));
    }

    // --- ВХОД СТУДЕНТА ---
    if (studentForm) {
        studentForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = studentNameInput.value.trim();
            const group = studentGroupInput.value.trim();
            if (name === "" || group === "") {
                showMessage("Пожалуйста, заполните ФИО и Группу.", "error");
                return;
            }
            const user = { name: name, group: group, role: "student" };
            localStorage.setItem("mdk_user", JSON.stringify(user));
            updateUI(user);
            showMessage(`Добро пожаловать, ${name}!`, "success");
        });
    }

    // --- ВХОД ПРЕПОДАВАТЕЛЯ ---
    if (teacherForm) {
        teacherForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const login = teacherLoginInput.value.trim();
            const password = teacherPassInput.value.trim();
            if (login === "teacher" && password === "teacher") {
                const user = { name: "Преподаватель", group: "Журнал", role: "teacher" };
                localStorage.setItem("mdk_user", JSON.stringify(user));
                updateUI(user);
                showMessage("Вход в журнал выполнен успешно!", "success");
            } else {
                showMessage("Неверный логин или пароль. Попробуйте: teacher / teacher", "error");
            }
        });
    }

    // --- ВЫХОД ---
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("mdk_user");
            updateUI(null);
            showMessage("Вы вышли из системы.", "success");
        });
    }

    // --- ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК МЕНЮ ---
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            // Убираем активный класс у всех
            navLinks.forEach(l => l.classList.remove("active"));
            // Добавляем кликнутому
            this.classList.add("active");
            
            // Если вошли, можем менять заголовок на "Рабочем столе"
            if (dashboardSection && !dashboardSection.classList.contains("hidden")) {
                const sectionTitle = dashboardSection.querySelector("h2");
                sectionTitle.textContent = this.textContent;
            }
        });
    });

    // --- УВЕДОМЛЕНИЯ ---
    function showMessage(text, type) {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add("show"), 100);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});