"use strict";

const ACHIEVEMENTS = [
    { id: "welcome", title: "Первый шаг", desc: "Войти в систему", icon: "🚪" },
    { id: "reader", title: "Книжный червь", desc: "Изучить лекцию", icon: "📖" },
    { id: "hacker", title: "Хакер", desc: "Пройти тест", icon: "💻" },
    { id: "gamer", title: "Геймер", desc: "Сыграть в игру", icon: "🎮" },
    { id: "gcode_pro", title: "G-кодер", desc: "Пройти уровень в тренажере G-кода", icon: "📐" },
    { id: "level_5", title: "Опытный", desc: "Достичь 5 уровня", icon: "⭐" },
    { id: "rich", title: "Богач", desc: "Накопить 1000 XP", icon: "💰" },
    { id: "first_practical", title: "Руки мастера", desc: "Сохранить первое практическое решение", icon: "🛠️" },
    { id: "mastercam_1", title: "Первый пуск", desc: "Открыть практику первого урока Mastercam", icon: "🧭" },
    { id: "mastercam_5", title: "Пять ступеней мастера", desc: "Завершить практические задания пяти уроков Mastercam", icon: "🏅" },
    { id: "collector", title: "Коллекционер", desc: "Открыть все базовые достижения", icon: "🏆" },
    { id: "xp_2500", title: "Запас опыта", desc: "Накопить 2500 XP", icon: "💎" }
];

const THEMES = [
    { id: "default", title: "Стандартная", price: 0, bg: "#0e0e10", text: "#e8e6e1" },
    { id: "light", title: "Светлая", price: 0, bg: "#f5f2ec", text: "#2c2c2c" },
    { id: "neon", title: "Киберпанк", price: 500, bg: "#09090b", text: "#ff00cc" },
    { id: "matrix", title: "Матрица", price: 500, bg: "#000000", text: "#00ff00" },
    { id: "cyberpunk", title: "Cyberpunk", price: 800, bg: "#0a0015", text: "#00ffff" },
    { id: "graphite", title: "Графит и мята", price: 650, bg: "#111827", text: "#a7f3d0" },
    { id: "lavender", title: "Лавандовая ночь", price: 650, bg: "#211a38", text: "#e9d5ff" },
    { id: "ocean", title: "Океанская глубина", price: 650, bg: "#062b3a", text: "#a5f3fc" },
    { id: "aurora", title: "Северное сияние", price: 700, bg: "#071c25", text: "#eafffa" },
    { id: "ruby", title: "Рубиновая ночь", price: 700, bg: "#210d18", text: "#fff0f4" },
    { id: "steel", title: "Сталь", price: 650, bg: "#171c22", text: "#f1f5f9" },
    { id: "amber", title: "Янтарная мастерская", price: 650, bg: "#21190c", text: "#fff7e8" },
    { id: "blueprint", title: "Синий чертёж", price: 750, bg: "#071a35", text: "#eff7ff" },
    { id: "emerald", title: "Изумруд", price: 700, bg: "#071e19", text: "#edfff6" }
];

function avatarSvg(bg, skin, hair, shirt, accent, hairShape) {
    var hairPath = hairShape === "long" ? "M31 52 Q25 14 50 12 Q79 12 70 54 L72 84 Q60 93 61 65 L38 65 Q35 87 27 82 Z" :
        hairShape === "short" ? "M29 43 Q26 12 51 12 Q76 12 72 44 L65 36 Q52 28 36 38 Z" :
        "M28 43 Q27 13 51 12 Q76 13 73 43 L67 31 Q55 38 37 31 Z";
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="b" x2="1" y2="1"><stop stop-color="' + bg + '"/><stop offset="1" stop-color="' + accent + '"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#b)"/><path d="M15 100 Q18 70 50 69 Q82 70 85 100" fill="' + shirt + '"/><path d="' + hairPath + '" fill="' + hair + '"/><ellipse cx="50" cy="49" rx="20" ry="25" fill="' + skin + '"/><path d="M30 44 Q31 22 50 22 Q70 22 70 45 Q58 34 43 36 Q36 40 30 44" fill="' + hair + '"/><circle cx="43" cy="50" r="2" fill="#27313b"/><circle cx="57" cy="50" r="2" fill="#27313b"/><path d="M45 61 Q50 65 55 61" fill="none" stroke="#9d5961" stroke-width="2" stroke-linecap="round"/><path d="M35 75 Q50 84 65 75" fill="none" stroke="' + accent + '" stroke-width="3" opacity=".9"/></svg>';
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}
const AVATARS = [
    { id: "default", url: null, price: 0, title: "Стандарт" },
    { id: "av1", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix", price: 100, title: "Парень" },
    { id: "av2", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka", price: 100, title: "Девушка" },
    { id: "av3", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Robo", price: 200, title: "Робот" },
    { id: "av4", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vasilisa", price: 180, title: "Василиса" },
    { id: "av5", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Orion", price: 180, title: "Орион" },
    { id: "av6", url: "https://api.dicebear.com/7.x/bottts/svg?seed=GearMaster", price: 250, title: "Механоид" },
    { id: "av7", url: avatarSvg("#203b63","#e7b99a","#33251f","#2f91a2","#79d4d0","short"), price: 160, title: "Инженер" },
    { id: "av8", url: avatarSvg("#56365f","#f2c9ad","#39243e","#c27ba7","#e7b4d3","long"), price: 180, title: "Мечтательница" },
    { id: "av9", url: avatarSvg("#284d45","#9b6046","#211b19","#d3a64f","#f2d58a","short"), price: 180, title: "Мастер" },
    { id: "av10", url: avatarSvg("#32445d","#f4d3b5","#c6a36b","#6279ad","#b8d8f2","long"), price: 200, title: "Исследователь" },
    { id: "av11", url: avatarSvg("#6a3c3b","#d99a78","#231e29","#8e5367","#e8a8a1","short"), price: 200, title: "Киберпанк" },
    { id: "av12", url: avatarSvg("#174a62","#e7c7a5","#e0e4e8","#3b879c","#a6e5ee","long"), price: 220, title: "Полярная звезда" },
    { id: "av13", url: avatarSvg("#34445c","#ad704e","#211a18","#6e8f64","#b5d5a0","short"), price: 190, title: "Технолог" },
    { id: "av14", url: avatarSvg("#513c72","#f1d0b5","#76513d","#a68bd0","#d9c4f5","long"), price: 220, title: "Академия" },
    { id: "av15", url: avatarSvg("#5b344b","#c98768","#19151c","#b16b7d","#f1b7bf","short"), price: 220, title: "Механик" },
    { id: "av16", url: avatarSvg("#26445c","#e9c3a1","#7d4932","#416e9a","#9bc6ed","long"), price: 240, title: "Навигатор" },
    { id: "custom", url: "url", price: 500, title: "Свой URL" }
];

const TEXT_EFFECTS = [
    { id: "none", title: "Без эффекта", price: 0 },
    { id: "fx-rainbow-text", title: "Радужный текст", price: 300 },
    { id: "fx-neon-text", title: "Неоновое свечение", price: 400 },
    { id: "fx-glitch-text", title: "Глитч (Помехи)", price: 500 },
    { id: "fx-typewriter", title: "Пишущая машинка", price: 200 },
    { id: "fx-gold-text", title: "Золотое сияние", price: 450 },
    { id: "fx-ice-text", title: "Ледяные буквы", price: 450 },
    { id: "fx-fire-text", title: "Пламенный текст", price: 500 }
];

// Добавлены шрифты
const FONTS = [
    { id: "font-default", title: "Atkinson — удобный", price: 0, font: "'Atkinson Hyperlegible', sans-serif" },
    { id: "font-mono", title: "Моноширинный", price: 100, font: "'Overpass Mono', monospace" },
    { id: "font-serif", title: "Классика", price: 100, font: "'Libre Caslon Text', Georgia, serif" },
    { id: "font-monomakh", title: "Мономах", price: 300, font: "'Monomakh', serif" },
    { id: "font-sacramento", title: "Sacramento", price: 400, font: "'Sacramento', cursive" },
    { id: "font-atkinson", title: "Atkinson Hyperlegible", price: 120, font: "'Atkinson Hyperlegible', sans-serif" },
    { id: "font-open-sauce", title: "Open Sauce Sans", price: 180, font: "'Open Sauce Sans', sans-serif" },
    { id: "font-manrope", title: "Manrope", price: 180, font: "'Manrope', sans-serif" },
    { id: "font-inter", title: "Inter", price: 180, font: "'Inter', sans-serif" },
    { id: "font-bricolage", title: "Bricolage Grotesque", price: 220, font: "'Bricolage Grotesque', sans-serif" },
    { id: "font-spectral", title: "Spectral", price: 220, font: "'Spectral', Georgia, serif" },
    { id: "font-newsreader", title: "Newsreader", price: 220, font: "'Newsreader', Georgia, serif" },
    { id: "font-cooper", title: "Cooper", price: 260, font: "'Cooper', Georgia, serif" },
    { id: "font-playwrite", title: "Playwrite Us", price: 280, font: "'Playwrite Us', cursive" },
    { id: "font-quattrocento", title: "Quattrocento Sans", price: 220, font: "'Quattrocento Sans', sans-serif" },
    { id: "font-libre-caslon", title: "Libre Caslon", price: 250, font: "'Libre Caslon', Georgia, serif" },
    { id: "font-wittgenstein", title: "Wittgenstein", price: 250, font: "'Wittgenstein', Georgia, serif" },
    { id: "font-sorts-mill", title: "Sorts Mill Goudy", price: 250, font: "'Sorts Mill Goudy', Georgia, serif" },
    { id: "font-kumiko", title: "Kumiko", price: 300, font: "'Kumiko', serif" },
    { id: "font-minsk", title: "Минск", price: 300, font: "'Minsk', serif" },
    { id: "font-tiny5", title: "Tiny5 Pixel", price: 300, font: "'Tiny5', monospace" },
    { id: "font-neoneon", title: "Neoneon", price: 350, font: "'Neoneon', sans-serif" }
];

const BG_EFFECTS = [
    { id: "none", title: "Без эффекта", price: 0 },
    { id: "fx-aurora-bg", title: "Северное сияние", price: 500 },
    { id: "fx-matrix-bg", title: "Матрица (Дождь)", price: 600 },
    { id: "fx-starfield-bg", title: "Звездное небо", price: 600 },
    { id: "bg-underwater", title: "Подводный мир", price: 700 },
    { id: "bg-foggy-forest", title: "Лесная дымка", price: 700 },
    { id: "bg-stone-alley", title: "Старый переулок", price: 700 },
    { id: "bg-cats-yarn", title: "Кошачий уют", price: 700 },
    { id: "bg-pumpkins", title: "Осенний урожай", price: 700 },
    { id: "bg-spooky-room", title: "Жуткая комната", price: 700 },
    { id: "bg-halloween", title: "Хэллоуин", price: 700 },
    { id: "bg-red-forest", title: "Красный лес", price: 700 },
    { id: "bg-lanterns", title: "Тёплые фонари", price: 700 },
    { id: "bg-dark-table", title: "Тёмная мастерская", price: 700 },
    { id: "bg-graveyard", title: "Ночной некрополь", price: 700 },
    { id: "bg-cats-notebook", title: "Коты и заметки", price: 700 },
    { id: "bg-galaxy", title: "Космическая пыль", price: 750 },
    { id: "bg-tech-grid", title: "Чертёжная сетка", price: 750 },
    { id: "bg-workshop", title: "Мастерская ЧПУ", price: 750 },
    { id: "bg-aurora-wave", title: "Полярное сияние", price: 800 },
    { id: "bg-sunset", title: "Закат на Марсе", price: 700 }
];

const FONT_SIZES = [
    { id: "small", title: "Компактный", scale: "0.92", price: 0 },
    { id: "normal", title: "Обычный", scale: "1", price: 0 },
    { id: "large", title: "Крупный", scale: "1.12", price: 100 },
    { id: "xlarge", title: "Очень крупный", scale: "1.25", price: 150 }
];

const CARD_EFFECTS = [
    { id: "none", title: "Без эффекта", price: 0 },
    { id: "fx-holo-card", title: "Голографическая карта", price: 700 },
    { id: "fx-3d-card", title: "3D карточка", price: 800 },
    { id: "fx-glass-card", title: "Матовый Glass", price: 850 },
    { id: "fx-pulse-card", title: "Пульсирующая рамка", price: 850 },
    { id: "fx-blueprint-card", title: "Инженерный чертёж", price: 900 }
];

// Экспортируем для app.js
window.ACHIEVEMENTS = ACHIEVEMENTS;

window.applyShopAppearance = function () {
    var state = window.state || {};
    var theme = "dark";
    try { theme = localStorage.getItem("mdk.theme_active") || "dark"; } catch (e) {}
    document.documentElement.setAttribute("data-theme", theme === "default" ? "dark" : theme);
    var font = FONTS.find(function (x) { return x.id === (state.activeFont || "font-default"); }) || FONTS[0];
    document.documentElement.style.setProperty("--portal-font-family", font.font);
    if (document.body) document.body.style.fontFamily = font.font;
    var size = FONT_SIZES.find(function (x) { return x.id === (state.activeFontSize || "normal"); }) || FONT_SIZES[1];
    document.documentElement.style.setProperty("--portal-font-scale", size.scale);
};
if (window.applyGlobalEffects && !window.__shopAppearanceBound) {
    window.__shopAppearanceBound = true;
    var baseGlobalEffects = window.applyGlobalEffects;
    window.applyGlobalEffects = function () {
        var result = baseGlobalEffects.apply(this, arguments);
        window.applyShopAppearance();
        return result;
    };
}
if (window.API && typeof window.API.login === "function" && !window.__shopLoginBound) {
    window.__shopLoginBound = true;
    var baseShopLogin = window.API.login;
    window.API.login = function () {
        return baseShopLogin.apply(this, arguments).then(function (result) {
            if (result && result.success) window.applyShopAppearance();
            return result;
        });
    };
}
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () { if (window.applyShopAppearance) window.applyShopAppearance(); }, 350);
});

window.renderShopPage = function() {
    if (window.applyShopAppearance) window.applyShopAppearance();
    var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
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
                          (type === 'theme' && (window.state.purchasedThemes || []).includes(item.id)) ||
                          (type === 'avatar' && ((window.state.purchasedAvatars || []).includes(item.url) || window.state.avatar === item.url)) ||
                          (type === 'text' && (window.state.purchasedTextEffects || []).includes(item.id)) ||
                          (type === 'font' && (window.state.purchasedFonts || []).includes(item.id)) ||
                          (type === 'fontSize' && (window.state.purchasedFontSizes || []).includes(item.id)) ||
                          (type === 'bg' && (window.state.purchasedBgEffects || []).includes(item.id)) ||
                          (type === 'card' && (window.state.purchasedCardEffects || []).includes(item.id)) ||
                          item.price === 0;
            
            var isActive = false;
            if (type === 'theme') isActive = localStorage.getItem("mdk.theme_active") === item.id;
            if (type === 'avatar') isActive = window.state.avatar === item.url || (item.id === 'default' && !window.state.avatar);
            if (type === 'text') isActive = (window.state.activeTextEffect || 'none') === item.id;
            if (type === 'font') isActive = (window.state.activeFont || 'font-default') === item.id;
            if (type === 'fontSize') isActive = (window.state.activeFontSize || 'normal') === item.id;
            if (type === 'bg') isActive = (window.state.activeBgEffect || 'none') === item.id;
            if (type === 'card') isActive = (window.state.activeCardEffect || 'none') === item.id;

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
                preview = `<div style="background:${item.bg}; color:${item.text}; height:60px; border-radius:6px; margin-bottom:10px; display:flex; align-items:center; justify-content:center; font-weight:bold;">Aa</div>`;
            }
            if (type === 'avatar' && item.url && item.url !== 'url') {
                preview = `<img src="${item.url}" style="width:60px; height:60px; border-radius:50%; margin:0 auto 10px; display:block;">`;
            } else if (type === 'avatar' && item.id === 'default') {
                preview = `<div style="font-size:40px; margin-bottom:10px;">👨‍🎓</div>`;
            }
            if (type === 'text') {
                preview = `<div class="${item.id !== 'none' ? item.id : ''}" data-text="Текст" style="font-size:20px; font-weight:bold; margin-bottom:10px; height:40px;">${item.title}</div>`;
            }
            if (type === 'fontSize') {
                preview = '<div style="font-size:calc(16px * ' + item.scale + ');font-weight:bold;margin-bottom:10px;height:40px;">Аа 123</div>';
            }
            if (type === 'font') {
                preview = `<div style="font-family:${item.font}; font-size:20px; font-weight:bold; margin-bottom:10px; height:40px;">${item.title}</div>`;
            }
            if (type === 'bg') {
                preview = `<div class="${item.id !== 'none' ? item.id : ''}" style="height:60px; border-radius:6px; margin-bottom:10px; border:1px solid var(--border);"></div>`;
            }
            if (type === 'card') {
                preview = `<div class="${item.id !== 'none' ? item.id : ''}" style="height:60px; background:var(--card-soft); border-radius:6px; margin-bottom:10px; border:1px solid var(--accent); display:flex; align-items:center; justify-content:center;">Карта</div>`;
            }

            html += `<div class="module" style="padding:15px; text-align:center; display:flex; flex-direction:column; justify-content:space-between; margin-bottom:0;">
                <div>${preview}<h4 style="margin:0 0 10px 0; font-size:14px;">${item.title}</h4></div>
                ${btnHtml}
            </div>`;
        });
        html += `</div>`;
        return html;
    }

    app.innerHTML += renderCategory("🎨 Темы оформления", THEMES, "theme");
    app.innerHTML += renderCategory("👤 Аватары", AVATARS, "avatar");
    app.innerHTML += renderCategory("✨ Эффекты текста", TEXT_EFFECTS, "text");
    app.innerHTML += renderCategory("🔤 Шрифты", FONTS, "font");
    app.innerHTML += renderCategory("🔎 Масштаб шрифта", FONT_SIZES, "fontSize");
    app.innerHTML += renderCategory("🌌 Эффекты фона", BG_EFFECTS, "bg");
    app.innerHTML += renderCategory("🃏 Эффекты карточек", CARD_EFFECTS, "card");
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
        if (type === 'avatar') { window.state.avatar = value || null; if(!window.state.purchasedAvatars) window.state.purchasedAvatars = []; if(value && !window.state.purchasedAvatars.includes(value)) window.state.purchasedAvatars.push(value); }
        if (type === 'text') { if(!window.state.purchasedTextEffects) window.state.purchasedTextEffects = []; window.state.purchasedTextEffects.push(id); }
        if (type === 'font') { if(!window.state.purchasedFonts) window.state.purchasedFonts = []; window.state.purchasedFonts.push(id); }
        if (type === 'fontSize') { if(!window.state.purchasedFontSizes) window.state.purchasedFontSizes = []; window.state.purchasedFontSizes.push(id); }
        if (type === 'bg') { if(!window.state.purchasedBgEffects) window.state.purchasedBgEffects = []; window.state.purchasedBgEffects.push(id); }
        if (type === 'card') { if(!window.state.purchasedCardEffects) window.state.purchasedCardEffects = []; window.state.purchasedCardEffects.push(id); }
        
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
    } else if (type === 'text') {
        window.state.activeTextEffect = id;
    } else if (type === 'font') {
        window.state.activeFont = id;
        // Находим шрифт в списке FONTS
        var fontObj = FONTS.find(f => f.id === id);
        if (fontObj) {
            document.documentElement.style.setProperty("--portal-font-family", fontObj.font);
            document.body.style.fontFamily = fontObj.font;
        }
    } else if (type === 'fontSize') {
        window.state.activeFontSize = id;
        var sizeObj = FONT_SIZES.find(f => f.id === id);
        if (sizeObj) document.documentElement.style.setProperty('--portal-font-scale', sizeObj.scale);
    } else if (type === 'bg') {
        window.state.activeBgEffect = id;
    } else if (type === 'card') {
        window.state.activeCardEffect = id;
    }
    
    window.saveStudentData();
    if (window.applyShopAppearance) window.applyShopAppearance();
    window.showToast("Применено!", "ok");
    window.renderShopPage();
    if (window.renderUserChip) window.renderUserChip();
    if (window.applyGlobalEffects) window.applyGlobalEffects();
};