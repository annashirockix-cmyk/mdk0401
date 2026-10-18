/* ============================================================
   МДК 04.01 — links.js (Полезные материалы по диагностике)
   ============================================================ */
"use strict";

window.renderLinksPage = function(){
  var app = document.getElementById("app"); if (!app) return; app.innerHTML = "";
  document.getElementById("crumbs").textContent = "Полезные материалы";

  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
  app.appendChild(el('<section class="hero"><h1>Полезные материалы</h1><p>Статьи, стандарты и книги по диагностике и ремонту оборудования.</p></section>'));

  var data = {
    articles: [
        { title: "Вибродиагностика подшипников качения", source: "Техническая диагностика", url: "https://vibro-labs.ru/", desc: "Основы виброакустического метода: какие частоты искать, как отличить дефект наружного кольца от внутреннего." },
        { title: "Организация ТО и ремонта на производстве: система ТРМ", source: "Главный механик", url: "https://glavmech.ru/", desc: "Практическое руководство по внедрению Total Productive Maintenance и расчету OEE." },
        { title: "Тепловой контроль узлов станка", source: "Автоматизация", url: "#", desc: "Как с помощью пирометров и тепловизоров выявлять перегрев подшипников на ранней стадии." }
    ],
    videos: [
        { title: "Диагностика станков с ЧПУ", source: "YouTube", url: "https://www.youtube.com/results?search_query=диагностика+станков+чпу", desc: "Видеоуроки по поиску неисправностей в электронике и механике станков." },
        { title: "Наладка токарного станка с ЧПУ", source: "YouTube", url: "https://www.youtube.com/results?search_query=наладка+токарного+станка+с+чпу", desc: "Практические примеры привязки нуля и установки инструментов." }
    ],
    books: [
        { title: "Организация и планирование автоматизированных производств", author: "В. Ю. Шишмарёв", publisher: "Юрайт", year: "2023", desc: "Учебник для СПО. Основы ТО, диагностики и управления производством." },
        { title: "Металлорежущее технологическое оборудование", author: "Л. И. Вереина", publisher: "ИНФРА-М", year: "2020", desc: "Справочник по устройству и наладке станков различных групп." }
    ]
  };

  var artBlock = el('<section class="module"><h2>📄 Статьи и нормативы</h2><div class="links-list" id="articlesList"></div></section>');
  var artList = artBlock.querySelector("#articlesList");
  (data.articles || []).forEach(a => {
    artList.appendChild(el(`<a class="link-card" href="${a.url}" target="_blank"><div class="link-card-icon">📄</div><div class="link-card-body"><div class="link-card-title">${a.title}</div><div class="link-card-source">${a.source}</div><div class="link-card-desc">${a.desc}</div></div><div class="link-card-arrow">↗</div></a>`));
  });
  app.appendChild(artBlock);

  var vidBlock = el('<section class="module"><h2>🎬 Видеоролики</h2><div class="links-list" id="videosList"></div></section>');
  var vidList = vidBlock.querySelector("#videosList");
  (data.videos || []).forEach(v => {
    vidList.appendChild(el(`<a class="link-card" href="${v.url}" target="_blank"><div class="link-card-icon">🎬</div><div class="link-card-body"><div class="link-card-title">${v.title}</div><div class="link-card-source">${v.source}</div><div class="link-card-desc">${v.desc}</div></div><div class="link-card-arrow">↗</div></a>`));
  });
  app.appendChild(vidBlock);

  var bookBlock = el('<section class="module"><h2>📚 Литература</h2><div class="book-list" id="booksList"></div></section>');
  var bookList = bookBlock.querySelector("#booksList");
  (data.books || []).forEach(b => {
    bookList.appendChild(el(`<div class="book-card"><div class="book-cover">📕</div><div class="book-body"><div class="book-title">${b.title}</div><div class="book-author">${b.author}</div><div class="book-meta">${b.publisher} · ${b.year}</div><div class="book-desc">${b.desc}</div></div></div>`));
  });
  app.appendChild(bookBlock);
};