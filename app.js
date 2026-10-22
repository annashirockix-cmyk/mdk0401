document.addEventListener("DOMContentLoaded", function () {
    
    // Элементы форм и секций
    const loginSection = document.getElementById("loginSection"); // Блок с формами
    const successSection = document.getElementById("successSection"); // Блок "Вы вошли"
    
    const studentForm = document.getElementById("studentLoginForm");
    const teacherForm = document.getElementById("teacherLoginForm");
    
    const studentNameInput = document.getElementById("studentName");
    const studentGroupInput = document.getElementById("studentGroup");
    
    const teacherLoginInput = document.getElementById("teacherLogin");
    const teacherPassInput = document.getElementById("teacherPass");
    
    // Элементы профиля
    const profileName = document.getElementById("profileName");
    const profileGroup = document.getElementById("profileGroup");
    const successName = document.getElementById("successName");
    const icon1 = document.getElementById("icon1");
    const icon2 = document.getElementById("icon2");
    const logoutBtn = document.getElementById("logoutBtn");

    // --- ЛОГИКА ИНТЕРФЕЙСА ---
    function updateUI(user) {
        if (user) {
            // 1. Обновляем профиль
            profileName.textContent = user.name;
            profileGroup.textContent = user.role === 'teacher' ? 'Преподаватель' : user.group;
            successName.textContent = user.name;
            
            if (user.role === 'teacher') {
                icon1.textContent = "👨‍🏫";
                icon2.textContent = "📚";
            } else {
                icon1.textContent = "👨‍🎓";
                icon2.textContent = "📖";
            }
            
            // 2. СКРЫВАЕМ ФОРМЫ И ПОКАЗЫВАЕМ УСПЕХ
            if (loginSection) loginSection.classList.add("hidden");
            if (successSection) successSection.classList.remove("hidden");
            
        } else {
            // 1. Сбрасываем профиль
            profileName.textContent = "Гость";
            profileGroup.textContent = "Группа";
            successName.textContent = "";
            icon1.textContent = "👨‍🎓";
            icon2.textContent = "📖";
            
            // 2. ПОКАЗЫВАЕМ ФОРМЫ И СКРЫВАЕМ УСПЕХ
            if (loginSection) loginSection.classList.remove("hidden");
            if (successSection) successSection.classList.add("hidden");
            
            // 3. Очищаем формы
            if(studentForm) studentForm.reset();
            if(teacherForm) teacherForm.reset();
        }
    }

    // Проверка: если уже заходили ранее
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
                showMessage("Заполните ФИО и Группу", "error");
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
                showMessage("Вход выполнен успешно!", "success");
            } else {
                showMessage("Неверный логин или пароль", "error");
            }
        });
    }

    // --- ВЫХОД ---
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("mdk_user");
            updateUI(null);
            showMessage("Вы вышли из системы", "success");
        });
    }

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