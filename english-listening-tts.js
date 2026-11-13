"use strict";
(function () {
  if (window.EnglishListeningTTS) return;

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function supported() {
    return !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }

  function voicesFor(lang) {
    if (!supported()) return [];
    var all = window.speechSynthesis.getVoices() || [];
    var prefix = String(lang || "en-GB").toLowerCase().split("-")[0];
    return all.filter(function (voice) {
      return String(voice.lang || "").toLowerCase().indexOf(prefix) === 0;
    });
  }

  function render(container, options) {
    options = options || {};
    if (!container) throw new Error("Listening container is required.");

    var text = String(options.text || "").trim();
    var lang = options.lang || "en-GB";
    var repeatCount = Math.max(1, Math.min(3, Number(options.repeatCount) || 2));
    var initialRate = Math.max(0.7, Math.min(1.15, Number(options.rate) || 0.88));
    var currentRate = initialRate;
    var currentVoice = null;
    var completedPlays = 0;
    var active = false;
    var runToken = 0;
    var disposed = false;

    container.innerHTML = "";
    container.classList.add("english-listening-tts");
    var controls = make("div", "english-listening-controls");
    controls.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;align-items:center";
    var play = make("button", "btn", "▶ Прослушать (" + repeatCount + " раза)");
    play.type = "button";
    var pause = make("button", "btn ghost", "Ⅱ Пауза");
    pause.type = "button";
    pause.disabled = true;
    var stop = make("button", "btn ghost", "■ Остановить");
    stop.type = "button";
    stop.disabled = true;
    var rateLabel = make("label", "museum-muted", "Скорость ");
    var rate = make("select", "self-input");
    rate.setAttribute("aria-label", "Скорость озвучивания");
    [{v:"0.75",t:"Медленно"},{v:"0.88",t:"Обычно"},{v:"1",t:"Быстрее"},{v:"1.1",t:"Быстро"}].forEach(function (item) {
      var option = make("option", "", item.t);
      option.value = item.v;
      if (Number(item.v) === initialRate) option.selected = true;
      rate.appendChild(option);
    });
    rateLabel.appendChild(rate);
    var voiceLabel = make("label", "museum-muted", "Голос ");
    var voiceSelect = make("select", "self-input");
    voiceSelect.setAttribute("aria-label", "Английский голос");
    var voiceStatus = make("small", "museum-muted", "");
    voiceLabel.appendChild(voiceSelect);
    var status = make("p", "museum-muted", supported()
      ? "Текст прочитает английский голос, установленный в браузере или операционной системе."
      : "В этом браузере нет поддержки синтеза речи. Попробуйте обновить браузер или разрешить системные голоса.");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    function refreshVoices() {
      var list = voicesFor(lang);
      var previous = voiceSelect.value;
      voiceSelect.innerHTML = "";
      var automatic = make("option", "", "Автоматически (" + lang + ")");
      automatic.value = "";
      voiceSelect.appendChild(automatic);
      list.forEach(function (voice, index) {
        var option = make("option", "", voice.name + " — " + voice.lang);
        option.value = String(index);
        voiceSelect.appendChild(option);
      });
      if (previous && Array.prototype.some.call(voiceSelect.options, function (o) { return o.value === previous; })) {
        voiceSelect.value = previous;
      }
      voiceStatus.textContent = list.length ? "" : "Английский голос не найден; будет использован голос по умолчанию.";
    }

    function selectedVoice() {
      var list = voicesFor(lang);
      var index = voiceSelect.value;
      return index === "" ? null : (list[Number(index)] || null);
    }

    function setIdle(message) {
      active = false;
      pause.disabled = true;
      pause.textContent = "Ⅱ Пауза";
      stop.disabled = true;
      play.disabled = !supported() || !text || disposed;
      if (message) status.textContent = message;
    }

    function stopSpeech(message) {
      runToken += 1;
      if (supported()) window.speechSynthesis.cancel();
      completedPlays = 0;
      setIdle(message || "Озвучивание остановлено.");
    }

    function speakNext() {
      if (disposed || !active) return;
      if (completedPlays >= repeatCount) {
        setIdle("Прослушивание завершено. Можно запустить его ещё раз.");
        return;
      }
      var token = runToken;
      var utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = currentRate;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.voice = currentVoice || selectedVoice() || null;
      utterance.onend = function () {
        if (disposed || !active || token !== runToken) return;
        completedPlays += 1;
        if (completedPlays < repeatCount) {
          status.textContent = "Первое прослушивание завершено. Повтор " + (completedPlays + 1) + " из " + repeatCount + "…";
          window.setTimeout(speakNext, 650);
        } else {
          setIdle("Прослушивание завершено. Теперь выполните задания.");
        }
      };
      utterance.onerror = function (event) {
        if (disposed || token !== runToken) return;
        setIdle("Не удалось озвучить текст (" + (event && event.error || "ошибка синтеза речи") + "). Проверьте голосовые настройки браузера.");
      };
      status.textContent = "Идёт прослушивание " + (completedPlays + 1) + " из " + repeatCount + "…";
      window.speechSynthesis.speak(utterance);
    }

    play.addEventListener("click", function () {
      if (!supported() || !text) return;
      window.speechSynthesis.cancel();
      completedPlays = 0;
      runToken += 1;
      currentRate = Number(rate.value) || initialRate;
      currentVoice = selectedVoice();
      active = true;
      play.disabled = true;
      pause.disabled = false;
      stop.disabled = false;
      speakNext();
    });
    pause.addEventListener("click", function () {
      if (!supported() || !active) return;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        pause.textContent = "Ⅱ Пауза";
        status.textContent = "Прослушивание продолжается…";
      } else {
        window.speechSynthesis.pause();
        pause.textContent = "▶ Продолжить";
        status.textContent = "Прослушивание приостановлено.";
      }
    });
    stop.addEventListener("click", function () { stopSpeech(); });
    rate.addEventListener("change", function () {
      currentRate = Number(rate.value) || initialRate;
      if (active) {
        runToken += 1;
        window.speechSynthesis.cancel();
        completedPlays = 0;
        speakNext();
      }
    });
    voiceSelect.addEventListener("change", function () {
      currentVoice = selectedVoice();
      if (active) {
        runToken += 1;
        window.speechSynthesis.cancel();
        completedPlays = 0;
        speakNext();
      }
    });

    controls.appendChild(play);
    controls.appendChild(pause);
    controls.appendChild(stop);
    controls.appendChild(rateLabel);
    controls.appendChild(voiceLabel);
    container.appendChild(controls);
    container.appendChild(voiceStatus);
    container.appendChild(status);

    if (supported()) {
      refreshVoices();
      if (window.speechSynthesis.addEventListener) {
        window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
      } else {
        window.speechSynthesis.onvoiceschanged = refreshVoices;
      }
    } else {
      play.disabled = true;
      pause.disabled = true;
      stop.disabled = true;
      rate.disabled = true;
      voiceSelect.disabled = true;
    }

    return {
      stop: function () { stopSpeech(); },
      destroy: function () {
        disposed = true;
        stopSpeech();
        if (window.speechSynthesis && window.speechSynthesis.removeEventListener) {
          window.speechSynthesis.removeEventListener("voiceschanged", refreshVoices);
        }
        container.innerHTML = "";
      }
    };
  }

  window.EnglishListeningTTS = {
    supported: supported,
    render: render
  };
})();
