// Ждем полной загрузки HTML документа
document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. ПОЛУЧАЕМ ЭЛЕМЕНТЫ ИЗ HTML ---
    const loginGrid = document.querySelector(".login-grid"); // Блок со всеми формами
    const studentForm = document.getElementById("studentLoginForm");
    const teacherForm = document.getElementById("teacherLoginForm");
    
    const studentNameInput = document.getElementById("studentName");
    const studentGroupInput = document.getElementById("studentGroup");
    
    const teacherLoginInput = document.getElementById("teacherLogin");
    const teacherPassInput = document.getElementById("teacherPass");
    
    // Элементы для отображения профиля
    const userNameDisplay = document.querySelector(".user-details h3");
    const userGroupDisplay = document.querySelector(".user-details .meta");
    const xpBadge = document.querySelector(".xp-badge");
    const logoutBtn = document.querySelector(".logout-link");

    // --- 2. ФУНКЦИЯ ОБНОВЛЕНИЯ ИНТЕРФЕЙСА ---
    function updateUI(user) {
        if (user) {
            // Если пользователь вошел:
            userNameDisplay.textContent = user.name;
            userGroupDisplay.textContent = user.role === 'teacher' ? 'Преподаватель' : user.group;
            
            // Меняем иконки
            document.querySelector(".user-avatar-icons .icons").innerHTML = "<span>👨‍🏫</span><span>📚</span>";
            
            // СКРЫВАЕМ ФОРМЫ ВХОДА
            if (loginGrid) loginGrid.classList.add("hidden");
            
        } else {
            // Если пользователь вышел:
            userNameDisplay.textContent = "Гость";
            userGroupDisplay.textContent = "Группа";
            xpBadge.innerHTML = "🌟 0 XP";
            document.querySelector(".user-avatar-icons .icons").innerHTML = "<span>👨‍🎓</span><span>📖</span>";
            
            // ПОКАЗЫВАЕМ ФОРМЫ ВХОДА ОБРАТНО
            if (loginGrid) loginGrid.classList.remove("hidden");
            
            // Очищаем поля
            if(studentForm) studentForm.reset();
            if(teacherForm) teacherForm.reset();
        }
    }

    // --- 3. ПРОВЕРКА СЕССИИ ПРИ ЗАГРУЗКЕ ---
    const savedUser = localStorage.getItem("mdk_user");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        updateUI(user);
    }

    // --- 4. ОБРАБОТКА ВХОДА СТУДЕНТА ---
    if (studentForm) {
        studentForm.addEventListener("submit", function (event) {
            event.preventDefault();
            
            const name = studentNameInput.value.trim();
            const group = studentGroupInput.value.trim();
            
            if (name === "" || group === "") {
                showMessage("Пожалуйста, заполните ФИО и Группу.", "error");
                return;
            }

            const user = {
                name: name,
                group: group,
                role: "student"
            };

            localStorage.setItem("mdk_user", JSON.stringify(user));
            updateUI(user);
            showMessage(`Добро пожаловать, ${name}!`, "success");
        });
    }

    // --- 5. ОБРАБОТКА ВХОДА ПРЕПОДАВАТЕЛЯ ---
    if (teacherForm) {
        teacherForm.addEventListener("submit", function (event) {
            event.preventDefault();
            
            const login = teacherLoginInput.value.trim();
            const password = teacherPassInput.value.trim();
            
            if (login === "teacher" && password === "teacher") {
                const user = {
                    name: "Преподаватель",
                    group: "Журнал",
                    role: "teacher"
                };

                localStorage.setItem("mdk_user", JSON.stringify(user));
                updateUI(user);
                showMessage("Вход в журнал выполнен успешно!", "success");
            } else {
                showMessage("Неверный логин или пароль. Попробуйте: teacher / teacher", "error");
            }
        });
    }

    // --- 6. ОБРАБОТКА ВЫХОДА ---
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            
            localStorage.removeItem("mdk_user");
            updateUI(null);
            showMessage("Вы вышли из системы.", "success");
        });
    }

    // --- 7. ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ УВЕДОМЛЕНИЙ ---
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