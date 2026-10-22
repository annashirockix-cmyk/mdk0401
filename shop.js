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
    { id: "neon", title: "Киберпанк", price: 200, bg: "#09090b", text: "#ff00cc" },
    { id: "matrix", title: "Матрица", price: 200, bg: "#000000", text: "#00ff00" },
    { id: "cyberpunk", title: "Cyberpunk", price: 300, bg: "#0a0015", text: "#00ffff" },
    { id: "rgb", title: "RGB Геймер", price: 500, bg: "#111", text: "#ff0055" },
    { id: "hacker", title: "Хакер", price: 400, bg: "#000", text: "#00ff00" },
    { id: "cs", title: "Counter-Strike", price: 400, bg: "#1a1a1a", text: "#f39c12" },
    { id: "genshin", title: "Genshin Impact", price: 400, bg: "#0f172a", text: "#38bdf8" }
];

const FONTS = [
    { id: "default", title: "Стандарт", price: 0, family: "inherit" },
    { id: "atkinson", title: "Atkinson", price: 0, family: "'Atkinson Hyperlegible', sans-serif" },
    { id: "newsreader", title: "Newsreader", price: 200, family: "'Newsreader', serif" },
    { id: "spectral", title: "Spectral", price: 200, family: "'Spectral', serif" },
    { id: "quattrocento", title: "Quattrocento", price: 200, family: "'Quattrocento Sans', sans-serif" },
    { id: "orbitron", title: "Orbitron", price: 300, family: "'Orbitron', sans-serif" },
    { id: "sharetech", title: "Share Tech", price: 300, family: "'Share Tech Mono', monospace" }
];

const AVATARS = [
    { id: "default", url: null, price: 0, title: "Стандарт" },
    { id: "av1", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix", price: 100, title: "Парень" },
    { id: "av2", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka", price: 100, title: "Девушка" },
    { id: "av3", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Robo", price: 200, title: "Робот" },
    { id: "av4", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Gamer", price: 200, title: "Пиксель" },
    { id: "av5", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Smile", price: 150, title: "Смайл" },
    { id: "av6", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=CSGO", price: 300, title: "CS" },
    { id: "av7", url: "https://api.dicebear.com/7.x/micah/svg?seed=Genshin", price: 300, title: "Аниме" },
    { id: "custom", url: "url", price: 500, title: "Свой URL" }
];

window.renderShopPage = function() {
    var app = document.getElementById("app"); 
    if (!app) return; 
    app.innerHTML = "";
    document.getElementById("crumbs").textContent = "Магазин XP";
    app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
    
    var isTeacher = !!window.state.staff;
    var balance = isTeacher ? "∞ (Преподаватель)" : window.state.xp + " XP";
    
    app.appendChild(el(`<section class="hero"><h1>🛒 Магазин</h1><p>Баланс: <b style="color:var(--gold); font-size:24px;">${balance}</b></p></section>`));

    function renderCategory(title, items, type) {
        var html = `<h3 style="margin-top:30px; border-bottom: 2px solid var(--border); padding-bottom:10px;">${title}</h3>`;
        html += `<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:16px; margin-top:15px;">`;
        
        items.forEach(item => {
            var isOwned = isTeacher || 
                          (window.state.purchasedThemes && window.state.purchasedThemes.includes(item.id)) || 
                          (window.state.avatar === item.url) || 
                          (window.state.purchasedFonts && window.state.purchasedFonts.includes(item.id));
            
            var isActive = false;
            if (type === 'theme') isActive = localStorage.getItem("mdk.theme_active") === item.id || (item.id === 'default' && !localStorage.getItem("mdk.theme_active"));
            if (type === 'avatar') isActive = window.state.avatar === item.url || (item.id === 'default' && !window.state.avatar);
            if (type === 'font') isActive = (window.state.font || 'default') === item.id;

            var btnHtml = "";
            if (isActive) {
                btnHtml = `<button class="btn ghost" disabled style="border-color:var(--ok); color:var(--ok); width:100%;">✅ Активно</button>`;
            } else if (isOwned) {
                btnHtml = `<button class="btn" onclick="window.applyShopItem('${type}', '${item.id}', '${item.url || ''}')" style="width:100%; background:var(--card-soft); color:var(--text); border:1px solid var(--border);">Применить</button>`;
            } else {
                btnHtml = `<button class="btn" onclick="window.buyShopItem('${type}', '${item.id}', ${item.price}, '${item.url || ''}')" style="width:100%; background:var(--gold); color:#000;">Купить (${item.price} XP)</button>`;
            }

            var preview = "";
            if (type === 'theme') {
                preview = `<div class="theme-preview" style="background:${item.bg}; color:${item.text}; display:flex; align-items:center; justify-content:center; font-weight:bold; height:60px; border-radius:6px; margin-bottom:10px;">Aa</div>`;
            }
            if (type === 'avatar' && item.url && item.url !== 'url') {
                preview = `<img src="${item.url}" style="width:60px; height:60px; border-radius:50%; margin:0 auto 10px; display:block; background:#fff;">`;
            } else if (type === 'avatar' && item.id === 'default') {
                preview = `<div style="font-size:40px; margin-bottom:10px;">👨‍🎓</div>`;
            }
            if (type === 'font') {
                preview = `<div style="font-family:${item.family}; font-size:24px; margin-bottom:10px;">AaБб</div>`;
            }

            html += `<div class="module" style="padding:15px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; margin-bottom:0;">
                <div>
                    ${preview}
                    <h4 style="margin:0 0 10px 0; font-size:14px;">${item.title}</h4>
                </div>
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
        
        if (type === 'theme') { 
            if(!window.state.purchasedThemes) window.state.purchasedThemes = []; 
            window.state.purchasedThemes.push(id); 
            window.applyShopItem(type, id, value);
        }
        if (type === 'avatar') {
            window.state.avatar = value;
            window.applyShopItem(type, id, value);
        }
        if (type === 'font') { 
            if(!window.state.purchasedFonts) window.state.purchasedFonts = []; 
            window.state.purchasedFonts.push(id); 
            window.applyShopItem(type, id, value);
        }
        
        if (window.saveStudentData) window.saveStudentData();
        window.showToast("Покупка успешна!", "ok");
        window.renderShopPage();
    }
};

window.applyShopItem = function(type, id, value) {
    if (type === 'theme') {
        localStorage.setItem("mdk.theme_active", id);
        document.documentElement.setAttribute("data-theme", id === "default" ? "dark" : id);
        if (document.getElementById("themeModalOverlay")) {
            document.getElementById("themeModalOverlay").remove();
            window.openThemeModal();
        }
    } else if (type === 'avatar') {
        window.state.avatar = value || null;
        if (window.renderUserChip) window.renderUserChip();
    } else if (type === 'font') {
        window.state.font = id;
        var fontDef = FONTS.find(f => f.id === id);
        var styleEl = document.getElementById("customFontStyle");
        if (id === "default") {
            if (styleEl) styleEl.remove();
            document.body.style.fontFamily = "";
        } else {
            if (!styleEl) {
                styleEl = document.createElement("style");
                styleEl.id = "customFontStyle";
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = "body, button, input, textarea, select { font-family: " + fontDef.family + " !important; }";
        }
    }
    
    if (window.saveStudentData) window.saveStudentData();
    window.showToast("Применено!", "ok");
    
    if (location.hash === "#/shop") {
        window.renderShopPage();
    }
};