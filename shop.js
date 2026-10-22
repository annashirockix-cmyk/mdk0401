"use strict";

const ACHIEVEMENTS = [
    { id: "welcome", title: "Первый шаг", desc: "Войти в систему", icon: "🚪" },
    { id: "reader", title: "Книжный червь", desc: "Изучить лекцию", icon: "📖" },
    { id: "hacker", title: "Хакер", desc: "Пройти тест", icon: "💻" },
    { id: "gamer", title: "Геймер", desc: "Сыграть в игру", icon: "🎮" },
    { id: "level_5", title: "Опытный", desc: "5 уровень", icon: "⭐" },
    { id: "rich", title: "Богач", desc: "1000 XP", icon: "💰" }
];

const THEMES = [
    { id: "default", title: "Стандарт (Dark)", price: 0, bg: "#0e0e10", text: "#e8e6e1" },
    { id: "ury-light", title: "Ury Light", price: 0, bg: "#FFFFFF", text: "#252525" },
    { id: "ury-dark", title: "Ury Dark", price: 0, bg: "#2b2b2b", text: "#ebebeb" },
    { id: "ury-sepia", title: "Ury Sepia", price: 0, bg: "#f3f2ec", text: "#252525" },
    { id: "neon", title: "Киберпанк", price: 500, bg: "#09090b", text: "#ff00cc" },
    { id: "matrix", title: "Матрица", price: 500, bg: "#000000", text: "#00ff00" }
];

const FONTS = [
    { id: "default", title: "Стандарт", price: 0, family: "inherit" },
    { id: "peter", title: "Peter Ivanovitsch", price: 200, family: "'Peter Ivanovitsch', serif" },
    { id: "danger", title: "Another Danger", price: 200, family: "'Another Danger', cursive" },
    { id: "tiny5", title: "Tiny5", price: 200, family: "'Tiny5', sans-serif" },
    { id: "scumbria", title: "Scumbria", price: 200, family: "'Scumbria', sans-serif" },
    { id: "cherry", title: "ST-Cherry", price: 300, family: "'ST-Cherry', cursive" },
    { id: "tagtype", title: "TagType", price: 300, family: "'TagType', sans-serif" }
];

const AVATARS = [
    { id: "default", url: null, price: 0, title: "Стандарт" },
    { id: "av1", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix", price: 100, title: "Парень" },
    { id: "av2", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka", price: 100, title: "Девушка" },
    { id: "av3", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Robo", price: 200, title: "Робот" },
    { id: "custom", url: "url", price: 500, title: "Свой URL" }
];

window.renderShopPage = function() {
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Магазин XP";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    var isTeacher = !!window.state.staff;
    var balance = isTeacher ? "∞ (Преподаватель)" : window.state.xp + " XP";
    
    app.appendChild(el(`<section class="hero"><h1>🛒 Магазин</h1><p>Баланс: <b style="color:var(--gold); font-size:24px;">${balance}</b></p></section>`));

    function renderCategory(title, items, type) {
        var html = `<h3 style="margin-top:30px; border-bottom: 2px solid var(--border); padding-bottom:10px;">${title}</h3>`;
        html += `<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:16px;">`;
        
        items.forEach(item => {
            var isOwned = isTeacher || (window.state.purchasedThemes || []).includes(item.id) || 
                         (window.state.avatar === item.url) || 
                         (window.state.purchasedFonts || []).includes(item.id);
            
            var isActive = false;
            if (type === 'theme') isActive = localStorage.getItem("mdk.theme_active") === item.id;
            if (type === 'avatar') isActive = window.state.avatar === item.url || (item.id === 'default' && !window.state.avatar);
            if (type === 'font') isActive = (window.state.font || 'default') === item.id;

            var btnHtml = "";
            if (isActive) {
                btnHtml = `<button class="btn ghost" disabled style="border-color:var(--ok); color:var(--ok); width:100%;">✅ Активно</button>`;
            } else if (isOwned) {
                btnHtml = `<button class="btn" onclick="window.applyShopItem('${type}', '${item.id}', '${item.url || ''}')" style="width:100%; background:var(--card-soft); color:var(--text);">Применить</button>`;
            } else {
                btnHtml = `<button class="btn" onclick="window.buyShopItem('${type}', '${item.id}', ${item.price}, '${item.url || ''}')" style="width:100%; background:var(--gold); color:#000;">Купить (${item.price} XP)</button>`;
            }

            var preview = "";
            if (type === 'theme') {
                preview = `<div class="theme-preview" style="background:${item.bg}; color:${item.text}; display:flex; align-items:center; justify-content:center; font-weight:bold;">Aa</div>`;
            }
            if (type === 'avatar' && item.url && item.url !== 'url') {
                preview = `<img src="${item.url}" style="width:60px; height:60px; border-radius:50%; margin:0 auto 10px; display:block;">`;
            }
            if (type === 'font') {
                preview = `<div style="font-family:${item.family}; font-size:24px; margin-bottom:10px;">AaБб</div>`;
            }

            html += `<div class="module" style="padding:15px; text-align:center;">
                ${preview}
                <h4 style="margin:0 0 10px 0; font-size:14px;">${item.title}</h4>
                ${btnHtml}
            </div>`;
        });
        html += `</div>`;
        return html;
    }

    app.innerHTML += renderCategory("🎨 Темы", THEMES, "theme");
    app.innerHTML += renderCategory("👤 Аватары", AVATARS, "avatar");
    app.innerHTML += renderCategory("🔤 Шрифты", FONTS, "font");
};

window.buyShopItem = function(type, id, price, value) {
    if (!window.state.staff && window.state.xp < price) return window.showToast("Недостаточно XP!", "err");
    
    if (type === 'avatar' && value === 'url') {
        value = prompt("Введите прямую ссылку на картинку (URL):");
        if (!value || (!value.startsWith("http") && !value.startsWith("data:"))) return window.showToast("Неверный URL", "err");
    }

    if (window.state.staff || confirm(`Купить за ${price} XP?`)) {
        if (!window.state.staff) window.state.xp -= price;
        
        if (type === 'theme') { if(!window.state.purchasedThemes) window.state.purchasedThemes = []; window.state.purchasedThemes.push(id); }
        if (type === 'avatar') window.state.avatar = value;
        if (type === 'font') { if(!window.state.purchasedFonts) window.state.purchasedFonts = []; window.state.purchasedFonts.push(id); }
        
        window.saveStudentData();
        window.showToast("Покупка успешна!", "ok");
        window.renderShopPage();
    }
};

window.applyShopItem = function(type, id, value) {
    if (type === 'theme') {
        localStorage.setItem("mdk.theme_active", id);
        document.documentElement.setAttribute("data-theme", id === "default" ? "dark" : id);
    } else if (type === 'avatar') {
        window.state.avatar = value || null;
    } else if (type === 'font') {
        window.state.font = id;
        var fontDef = FONTS.find(f => f.id === id);
        document.body.style.fontFamily = fontDef.family;
    }
    window.saveStudentData();
    window.showToast("Применено!", "ok");
    window.renderShopPage();
    window.renderUserChip();
};