window._execGcode = function() {
    var input = document.getElementById("gcodeInput").value.toUpperCase().trim();
    var log = document.getElementById("gcodeLog");
    log.textContent = "";
    if (!input) return;

    // Улучшенный парсер: поддерживает G0/G00, G1/G01, G2/G02, G3/G03, X, Y, I, J
    var match = input.match(/^(G0[0-3])\s*(?:X(-?\d+(?:\.\d+)?))?\s*(?:Y(-?\d+(?:\.\d+)?))?\s*(?:I(-?\d+(?:\.\d+)?))?\s*(?:J(-?\d+(?:\.\d+)?))?/);
    if (!match) { log.textContent = "Ошибка формата. Пример: G01 X50 Y50"; return; }

    var cmd = match[1];
    var targetX = match[2] !== undefined ? parseFloat(match[2]) : null;
    var targetY = match[3] !== undefined ? parseFloat(match[3]) : null;
    var iVal = match[4] !== undefined ? parseFloat(match[4]) : null;
    var jVal = match[5] !== undefined ? parseFloat(match[5]) : null;

    var newX = targetX !== null ? 150 + targetX : currentX;
    var newY = targetY !== null ? 150 - targetY : currentY; // Инверсия Y

    if (cmd === "G00" || cmd === "G0") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.setLineDash([5, 5]);
    } else if (cmd === "G01" || cmd === "G1") {
        ctx.strokeStyle = "#ff6b3d";
        ctx.setLineDash([]);
    } else if (cmd === "G02" || cmd === "G2" || cmd === "G03" || cmd === "G3") {
        ctx.strokeStyle = "#ff6b3d";
        ctx.setLineDash([]);
        
        // Если заданы I и J (центр дуги)
        if (iVal !== null && jVal !== null) {
            var centerX = currentX + iVal;
            var centerY = currentY - jVal; // Инверсия Y для канваса
            var radius = Math.sqrt(iVal*iVal + jVal*jVal);
            var startAngle = Math.atan2(currentY - centerY, currentX - centerX);
            var endAngle = Math.atan2(newY - centerY, newX - centerX);
            
            ctx.beginPath();
            // Для G02 (по часовой) anticlockwise = false. Для G03 (против) = true.
            var anticlockwise = (cmd === "G03" || cmd === "G3");
            ctx.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise);
            ctx.stroke();
        } else {
            // Если нет I,J, рисуем прямую (упрощение)
            ctx.beginPath();
            ctx.moveTo(currentX, currentY);
            ctx.lineTo(newX, newY);
            ctx.stroke();
        }
        currentX = newX;
        currentY = newY;
        drawGrid();
        document.getElementById("gcodeInput").value = "";
        return;
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