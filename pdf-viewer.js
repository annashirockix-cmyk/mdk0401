"use strict";
(function () {
  var overlay, frame, titleNode, downloadLink, externalLink, lastFocus = null;
  function ensureViewer() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "portalPdfViewer";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Просмотр PDF");
    overlay.innerHTML = '<div class="pdf-viewer-panel"><header class="pdf-viewer-head"><div><b id="pdfViewerTitle">Документ PDF</b><small>Просмотр внутри учебного портала</small></div><div class="pdf-viewer-actions"><a id="pdfViewerDownload" class="btn ghost" download>Скачать</a><a id="pdfViewerExternal" class="btn ghost" target="_blank" rel="noopener">Открыть отдельно ↗</a><button type="button" class="btn" id="pdfViewerClose" aria-label="Закрыть просмотр">✕</button></div></header><iframe id="pdfViewerFrame" title="Просмотр PDF"></iframe><p class="pdf-viewer-fallback">Если встроенный просмотр не поддерживается браузером, воспользуйтесь кнопкой «Открыть отдельно» или «Скачать».</p></div>';
    document.body.appendChild(overlay);
    frame = overlay.querySelector("#pdfViewerFrame");
    titleNode = overlay.querySelector("#pdfViewerTitle");
    downloadLink = overlay.querySelector("#pdfViewerDownload");
    externalLink = overlay.querySelector("#pdfViewerExternal");
    overlay.querySelector("#pdfViewerClose").addEventListener("click", closeViewer);
    overlay.addEventListener("click", function (event) { if (event.target === overlay) closeViewer(); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && !overlay.hidden) closeViewer(); });
  }
  function openViewer(url, title) {
    ensureViewer();
    lastFocus = document.activeElement;
    titleNode.textContent = title || "Документ PDF";
    downloadLink.href = url;
    externalLink.href = url;
    frame.src = url + (url.indexOf("#") >= 0 ? "&" : "#") + "toolbar=1&navpanes=0&view=FitH";
    overlay.hidden = false;
    document.body.classList.add("pdf-viewer-open");
    overlay.querySelector("#pdfViewerClose").focus();
  }
  function closeViewer() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    frame.src = "about:blank";
    document.body.classList.remove("pdf-viewer-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  document.addEventListener("click", function (event) {
    var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!link || link.hasAttribute("download") || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var url;
    try { url = new URL(link.href, window.location.href); } catch (e) { return; }
    if (url.origin !== window.location.origin || !/\.pdf$/i.test(url.pathname)) return;
    event.preventDefault();
    openViewer(url.href, link.getAttribute("data-pdf-title") || link.textContent.trim());
  });
  if (!document.getElementById("portalPdfViewerStyles")) {
    var style = document.createElement("style");
    style.id = "portalPdfViewerStyles";
    style.textContent = "#portalPdfViewer{position:fixed;inset:0;z-index:100500;background:rgba(3,8,18,.82);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:clamp(8px,2vw,24px)}#portalPdfViewer[hidden]{display:none!important}.pdf-viewer-panel{width:min(1180px,100%);height:min(94vh,1000px);background:var(--card,#172033);border:1px solid var(--border,#475569);border-radius:14px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 70px #0008}.pdf-viewer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-bottom:1px solid var(--border);flex-wrap:wrap}.pdf-viewer-head>div:first-child{display:grid;gap:2px}.pdf-viewer-head small,.pdf-viewer-fallback{color:var(--muted);font-size:11px}.pdf-viewer-actions{display:flex;gap:7px;flex-wrap:wrap}.pdf-viewer-actions .btn{font-size:12px;padding:7px 10px}.pdf-viewer-panel iframe{width:100%;flex:1;min-height:0;border:0;background:#fff}.pdf-viewer-fallback{margin:0;padding:7px 12px;text-align:center;border-top:1px solid var(--border)}body.pdf-viewer-open{overflow:hidden}@media(max-width:620px){.pdf-viewer-panel{height:96vh;border-radius:8px}.pdf-viewer-head{align-items:flex-start}.pdf-viewer-actions{width:100%}.pdf-viewer-actions .btn{flex:1}}";
    document.head.appendChild(style);
  }
})();
