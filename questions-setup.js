// questions-setup.js
window._Q = { mdk: [], anime: [], games: [], logic: [] };

window._shuffle = function(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    if (a.length > 1 && a.every(function(value, index) { return value === index; })) a.push(a.shift());
    return a;
};
window._shuffleQuestionOptions = function(question) {
    if (!question || !Array.isArray(question.options) || question.options.length < 2) return question;
    var order = window._shuffle(question.options.map(function(_, index) { return index; }));
    var original = question.options.slice();
    question.options = order.map(function(index) { return original[index]; });
    function remap(value) {
        if (Array.isArray(value)) return value.map(remap);
        if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value < order.length) return order.indexOf(value);
        return value;
    }
    ["correct", "correctAnswer", "answer", "answers"].forEach(function(key) {
        if (Object.prototype.hasOwnProperty.call(question, key)) question[key] = remap(question[key]);
    });
    return question;
};
