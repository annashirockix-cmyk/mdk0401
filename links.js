"use strict";

window.renderLinksPage = function(){
  var app = document.getElementById("app"); 
  if (!app) return; 
  app.innerHTML = "";
  var crumbs = document.getElementById("crumbs");
  if (crumbs) crumbs.textContent = "Полезные материалы";

  app.appendChild(el('<a class="backlink" href="#/" style="color:var(--accent);">← На главную</a>'));
  app.appendChild(el('<section class="hero"><h1>📚 Полезные материалы</h1><p>Подборка статей, видеороликов и книг по ЧПУ.</p></section>'));

  var courseId = (window.state && window.state.activeCourseId) ? window.state.activeCourseId : "07.01";
  
  var LINKS_DATA = {
    "07.01": {
      articles: [
        { title: "Что такое G-код? Руководство по командам и программированию ЧПУ", source: "TiRapid", url: "https://tirapid.com/", desc: "Базовое руководство: из чего состоит язык G-кода, как он управляет положением инструмента, траекторией резания и режимами." },
        { title: "Модальные коды ЧПУ: полный гид для специалиста", source: "Intervesp", url: "https://intervespco.ru/", desc: "Разбор модальных кодов: какие G-команды сохраняют действие до замены, как это влияет на структуру программы и безопасность." },
        { title: "Программирование станков с ЧПУ: от G-кода до CAM-систем", source: "Abplanalp", url: "https://abplanalp.ua/", desc: "Обзорный материал: ручное программирование, структура программ, использование G- и M-кодов, переход к CAM." }
      ],
      videos: [
        { title: "ПЛАНЕТА ЧПУ — видеокурс на YouTube", source: "LOCNITI", url: "https://www.youtube.com/", desc: "Базовый видеокурс в 4K: более 54 видеоуроков по устройству и программированию станков с ЧПУ. Доступен бесплатно." },
        { title: "NYC CNC — канал по практическому ЧПУ", source: "YouTube", url: "https://www.youtube.com/@NYCNC", desc: "Один из самых известных обучающих каналов по ЧПУ: обзоры станков, наладка, программирование, работа в CAM-системах." }
      ],
      books: [
        { title: "Основы программирования для станков с ЧПУ", author: "И. Е. Колошкина, В. А. Селезнев", publisher: "Юрайт", year: "2025", desc: "Учебник для вузов. Начальное освоение программирования на устройстве ЧПУ HEIDENHAIN." },
        { title: "Программирование обработки на станках с ЧПУ", author: "Р. М. Нартыжев", publisher: "КБГУ", year: "2024", desc: "Учебное пособие для направления «Конструкторско-технологическое обеспечение производств»." }
      ]
    },
    "04.01": {
      articles: [
        { title: "Диагностика металлорежущего оборудования", source: "Машиностроение", url: "#", desc: "Основы вибродиагностики и методы поиска неисправностей." }
      ],
      videos: [
        { title: "Видеоурок: Вибродиагностика подшипников", source: "YouTube", url: "https://www.youtube.com/results?search_query=вибродиагностика+подшипников", desc: "Практический пример диагностики подшипников качения." }
      ],
      books: [
        { title: "Техническая диагностика", author: "А.В. Иванов", publisher: "Академия", year: "2020", desc: "Учебник по диагностике оборудования." }
      ]
    },
    "02.01": {
      articles: [
        { title: "Сборка типовых сборочных единиц", source: "Машиностроение", url: "#", desc: "Технология сборки подшипниковых узлов и передач." }
      ],
      videos: [
        { title: "Сборка подшипникового узла", source: "YouTube", url: "https://www.youtube.com/results?search_query=сборка+подшипникового+узла", desc: "Наглядный пример правильной сборки." }
      ],
      books: [
        { title: "Технология сборки машин", author: "В.С. Корсаков", publisher: "Машиностроение", year: "2019", desc: "Классический учебник по технологии сборки." }
      ]
    },
    "02.02": {
      articles: [
        { title: "Программирование сборочных операций", source: "САПР", url: "#", desc: "Обзор CAM-систем для автоматизации сборки." }
      ],
      videos: [],
      books: []
    }
  };

  var data = LINKS_DATA[courseId] || { articles: [], videos: [], books: [] };

  // Статьи
  var artBlock = el('<section class="module"><h2>📄 Статьи</h2><div id="articlesList" style="display:flex; flex-direction:column; gap:10px;"></div></section>');
  var artList = artBlock.querySelector("#articlesList");
  if (data.articles.length === 0) {
    artList.innerHTML = '<p style="color:var(--muted);">Материалы для этого МДК пока не добавлены.</p>';
  } else {
    data.articles.forEach(a => {
      artList.appendChild(el(`<a href="${a.url}" target="_blank" style="display:block; padding:15px; background:var(--card-soft); border-radius:8px; text-decoration:none; color:var(--text); border:1px solid var(--border); transition: 0.2s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="font-weight:bold; color:var(--accent); font-size:16px; margin-bottom:5px;">${a.title}</div>
        <div style="font-size:12px; color:var(--gold); margin-bottom:5px;">${a.source}</div>
        <div style="font-size:14px; color:var(--muted);">${a.desc}</div>
      </a>`));
    });
  }
  app.appendChild(artBlock);

  // Видео
  var vidBlock = el('<section class="module"><h2>🎬 Видеоролики</h2><div id="videosList" style="display:flex; flex-direction:column; gap:10px;"></div></section>');
  var vidList = vidBlock.querySelector("#videosList");
  if (data.videos.length === 0) {
    vidList.innerHTML = '<p style="color:var(--muted);">Видео для этого МДК пока не добавлены.</p>';
  } else {
    data.videos.forEach(v => {
      vidList.appendChild(el(`<a href="${v.url}" target="_blank" style="display:block; padding:15px; background:var(--card-soft); border-radius:8px; text-decoration:none; color:var(--text); border:1px solid var(--border); transition: 0.2s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="font-weight:bold; color:var(--accent); font-size:16px; margin-bottom:5px;">${v.title}</div>
        <div style="font-size:12px; color:var(--gold); margin-bottom:5px;">${v.source}</div>
        <div style="font-size:14px; color:var(--muted);">${v.desc}</div>
      </a>`));
    });
  }
  app.appendChild(vidBlock);

  // Книги
  var bookBlock = el('<section class="module"><h2>📚 Литература</h2><div id="booksList" style="display:flex; flex-direction:column; gap:10px;"></div></section>');
  var bookList = bookBlock.querySelector("#booksList");
  if (data.books.length === 0) {
    bookList.innerHTML = '<p style="color:var(--muted);">Литература для этого МДК пока не добавлена.</p>';
  } else {
    data.books.forEach(b => {
      bookList.appendChild(el(`<div style="padding:15px; background:var(--card-soft); border-radius:8px; border:1px solid var(--border);">
        <div style="font-weight:bold; font-size:16px; margin-bottom:5px;">${b.title}</div>
        <div style="font-size:14px; color:var(--text-soft); margin-bottom:5px;">${b.author}</div>
        <div style="font-size:12px; color:var(--gold); margin-bottom:5px;">${b.publisher} · ${b.year}</div>
        <div style="font-size:14px; color:var(--muted);">${b.desc}</div>
      </div>`));
    });
  }
  app.appendChild(bookBlock);
};
