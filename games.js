"use strict";

// ... (renderArcadePage и startGame оставляем без изменений, они нормальные) ...

function startGcode(container) {
    container.innerHTML = `<div style="text-align:center;">
        <h3>📐 G-код Рисование</h3>
        <p style="font-size:14px; color:var(--muted); margin-bottom:10px;">Вводите: G01 X50 Y-50</p>
        <div style="overflow-x:auto; display:flex; justify-content:center;">
            <canvas id="gcodeCanvas" width="300" height="300" style="background:#111; border-radius:8px; border:2px solid var(--border); touch-action:none;"></canvas>
        </div>
        <div style="margin-top:15px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <input type="text" id="gcodeInput" class="self-input" placeholder="G01 X50 Y50" style="max-width:150px; margin:0;">
            <button class="btn" onclick="window._execGcode()">Выполнить</button>
            <button class="btn ghost" onclick="window.startGame('gcode')">Сброс</button>
        </div>
        <div id="gcodeLog" style="margin-top:10px; font-size:12px; color:var(--err); height:20px;"></div>
    </div>`;

    var canvas = document.getElementById("gcodeCanvas");
    var ctx = canvas.getContext("2d");
    var currentX = 150, currentY = 150;

    function drawGrid() {
        ctx.clearRect(0,0,300,300);
        ctx.strokeStyle = "#333"; ctx.lineWidth = 1;
        for (var i = 0; i <= 300; i += 30) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 300); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(300, i); ctx.stroke();
        }
        ctx.strokeStyle = "#555";
        ctx.beginPath(); ctx.moveTo(150, 0); ctx.lineTo(150, 300); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(300, 150); ctx.stroke();
        
        // Текущая позиция
        ctx.fillStyle = "var(--accent)";
        ctx.beginPath(); ctx.arc(currentX, currentY, 4, 0, Math.PI * 2); ctx.fill();
    }
    drawGrid();

    window._execGcode = function() {
        var input = document.getElementById("gcodeInput").value.toUpperCase().trim();
        var log = document.getElementById("gcodeLog");
        log.textContent = "";
        if (!input) return;

        // Простой парсер G00 и G01
        var match = input.match(/^(G0[0-3])(?:\s*X(-?\d+(?:\.\d+)?))?(?:\s*Y(-?\d+(?:\.\d+)?))?/);
        if (!match) { log.textContent = "Ошибка формата. Пример: G01 X50 Y50"; return; }

        var cmd = match[1];
        var targetX = match[2] !== undefined ? parseFloat(match[2]) : null;
        var targetY = match[3] !== undefined ? parseFloat(match[3]) : null;

        var newX = targetX !== null ? 150 + targetX : currentX;
        var newY = targetY !== null ? 150 - targetY : currentY; // Инверсия Y

        if (cmd === "G00") {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.setLineDash([5, 5]);
        } else if (cmd === "G01") {
            ctx.strokeStyle = "#ff6b3d";
            ctx.setLineDash([]);
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(newX, newY);
        ctx.stroke();

        currentX = newX;
        currentY = newY;
        drawGrid();
        document.getElementById("gcodeInput").value = "";
    };
}

// ... (остальные игры startMinesweeper, startTicTacToe и т.д. оставляем как были) ...