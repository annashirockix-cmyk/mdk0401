// Ждем полной загрузки HTML документа
document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. ПОЛУЧАЕМ ЭЛЕМЕНТЫ ИЗ HTML ---
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
            // Если пользователь вошел
            userNameDisplay.textContent = user.name;
            userGroupDisplay.textContent = user.role === 'teacher' ? 'Преподаватель' : user.group;
            
            // Меняем иконки для авторизованного пользователя
            document.querySelector(".user-avatar-icons .icons").innerHTML = "<span>👨‍🏫</span><span>📚</span>";
            
            // Показываем кнопку выхода (делаем её активной)
            logoutBtn.style.display = "inline-block";
            
            // Меняем заголовки форм (опционально, для красоты)
            document.querySelector(".login-block h2").textContent = "ВЫ ВОШЛИ В СИСТЕМУ";
        } else {
            // Если пользователь вышел
            userNameDisplay.textContent = "Гость";
            userGroupDisplay.textContent = "Группа";
            xpBadge.innerHTML = "🌟 0 XP";
            document.querySelector(".user-avatar-icons .icons").innerHTML = "<span>👨‍🎓</span><span>📖</span>";
            
            // Сбрасываем формы
            if(studentForm) studentForm.reset();
            if(teacherForm) teacherForm.reset();
        }
    }

    // --- 3. ПРОВЕРКА СЕССИИ ПРИ ЗАГРУЗКЕ ---
    // Если пользователь уже заходил ранее (данные есть в localStorage)
    const savedUser = localStorage.getItem("mdk_user");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        updateUI(user);
    }

    // --- 4. ОБРАБОТКА ВХОДА СТУДЕНТА ---
    if (studentForm) {
        studentForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Останавливаем перезагрузку страницы
            
            const name = studentNameInput.value.trim();
            const group = studentGroupInput.value.trim();
            
            if (name === "" || group === "") {
                showMessage("Пожалуйста, заполните ФИО и Группу.", "error");
                return;
            }

            // Создаем объект пользователя
            const user = {
                name: name,
                group: group,
                role: "student"
            };

            // Сохраняем в браузер (имитация базы данных)
            localStorage.setItem("mdk_user", JSON.stringify(user));
            
            // Обновляем интерфейс
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
            
            // Имитация проверки пароля (в реальности это делает сервер)
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
            event.preventDefault(); // Отменяем переход по ссылке "#"
            
            // Удаляем данные из хранилища
            localStorage.removeItem("mdk_user");
            
            // Обновляем интерфейс
            updateUI(null);
            
            // Возвращаем заголовки форм обратно (если меняли)
            document.querySelectorAll(".login-block h2")[0].textContent = "ВХОД СТУДЕНТА";
            document.querySelectorAll(".login-block h2")[1].textContent = "ВХОД ПРЕПОДАВАТЕЛЯ";
            
            showMessage("Вы вышли из системы.", "success");
        });
    }

    // --- 7. ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ УВЕДОМЛЕНИЙ (Toasts) ---
    function showMessage(text, type) {
        // Создаем элемент уведомления
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = text;
        
        // Добавляем на страницу
        document.body.appendChild(toast);
        
        // Анимация появления
        setTimeout(() => toast.classList.add("show"), 100);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});