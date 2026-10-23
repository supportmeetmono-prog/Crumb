"use strict";

/* Read-only visitor widget. X credentials stay on the Vercel server. */
(() => {
  const goal = 1000000;
  const elCount = document.getElementById("xFollowerCount");
  const elSource = document.getElementById("xFollowerSource");
  const elProgress = document.getElementById("xFollowerProgress");
  const elFill = document.getElementById("xFollowerProgressFill");
  const elLabel = document.getElementById("xFollowerProgressLabel");
  const elNote = document.getElementById("xFollowerProgressNote");
  if (![elCount, elSource, elProgress, elFill, elLabel, elNote].every(Boolean)) return;

  const messages = {
    en: { checking:"CHECKING X…", checkingNote:"Requesting official X data…", pending:"Follower verification pending", unavailable:"NOT AVAILABLE", unavailableNote:"Official X data is temporarily unavailable.", credits:"X API credits or access may be required.", goal:"of 1,000,000 followers", remaining:"followers to go", completed:"GOAL REACHED!", updated:"Updated", note:"Official count from X. Refreshes approximately every 5 minutes." },
    pt: { checking:"CONSULTANDO O X…", checkingNote:"Consultando dados oficiais do X…", pending:"Verificação de seguidores em andamento", unavailable:"INDISPONÍVEL", unavailableNote:"Os dados oficiais do X estão temporariamente indisponíveis.", credits:"Pode ser necessário liberar créditos ou acesso à API do X.", goal:"de 1.000.000 de seguidores", remaining:"seguidores restantes", completed:"META ATINGIDA!", updated:"Atualizado", note:"Contagem oficial do X. Atualiza aproximadamente a cada 5 minutos." },
    es: { checking:"CONSULTANDO X…", checkingNote:"Consultando datos oficiales de X…", pending:"Verificación de seguidores pendiente", unavailable:"NO DISPONIBLE", unavailableNote:"Los datos oficiales de X no están disponibles ahora.", credits:"Es posible que se necesiten créditos o acceso a la API de X.", goal:"de 1.000.000 seguidores", remaining:"seguidores restantes", completed:"¡META CONSEGUIDA!", updated:"Actualizado", note:"Conteo oficial de X. Se actualiza cada 5 minutos aproximadamente." },
    fr: { checking:"CONSULTATION DE X…", checkingNote:"Demande de données officielles de X…", pending:"Vérification des abonnés en attente", unavailable:"INDISPONIBLE", unavailableNote:"Les données officielles de X sont temporairement indisponibles.", credits:"Des crédits ou un accès à l'API X peuvent être requis.", goal:"sur 1 000 000 d'abonnés", remaining:"abonnés restants", completed:"OBJECTIF ATTEINT !", updated:"Mis à jour", note:"Nombre officiel de X. Actualisation toutes les 5 minutes environ." },
    it: { checking:"CONTROLLO X…", checkingNote:"Richiesta dei dati ufficiali di X…", pending:"Verifica follower in attesa", unavailable:"NON DISPONIBILE", unavailableNote:"I dati ufficiali di X non sono disponibili al momento.", credits:"Potrebbero servire crediti o accesso API X.", goal:"su 1.000.000 di follower", remaining:"follower mancanti", completed:"OBIETTIVO RAGGIUNTO!", updated:"Aggiornato", note:"Conteggio ufficiale di X. Aggiornato circa ogni 5 minuti." },
    zh: { checking:"正在查询 X…", checkingNote:"正在读取 X 官方数据…", pending:"等待粉丝数验证", unavailable:"暂不可用", unavailableNote:"暂时无法获取 X 官方数据。", credits:"可能需要 X API 额度或权限。", goal:"／1,000,000 粉丝", remaining:"粉丝还差", completed:"已达成目标！", updated:"更新时间", note:"数据来自 X 官方接口，约每 5 分钟更新一次。" },
    hi: { checking:"X जाँच जारी…", checkingNote:"आधिकारिक X डेटा प्राप्त किया जा रहा है…", pending:"फ़ॉलोअर सत्यापन लंबित", unavailable:"उपलब्ध नहीं", unavailableNote:"आधिकारिक X डेटा अभी उपलब्ध नहीं है।", credits:"X API क्रेडिट या अनुमति की ज़रूरत हो सकती है।", goal:"/ 10,00,000 फ़ॉलोअर्स", remaining:"फ़ॉलोअर्स बाकी", completed:"लक्ष्य पूरा!", updated:"अपडेट", note:"X की आधिकारिक गिनती। लगभग हर 5 मिनट में अपडेट।" },
    ar: { checking:"جارٍ التحقق من X…", checkingNote:"جارٍ قراءة بيانات X الرسمية…", pending:"بانتظار التحقق من المتابعين", unavailable:"غير متاح", unavailableNote:"بيانات X الرسمية غير متاحة مؤقتًا.", credits:"قد يلزم رصيد أو تصريح من واجهة X.", goal:"من مليون متابع", remaining:"متابع متبقٍ", completed:"تم تحقيق الهدف!", updated:"آخر تحديث", note:"العدد الرسمي من X. يتم التحديث كل 5 دقائق تقريبًا." },
    ru: { checking:"ПРОВЕРКА X…", checkingNote:"Запрос официальных данных X…", pending:"Проверка подписчиков", unavailable:"НЕДОСТУПНО", unavailableNote:"Официальные данные X временно недоступны.", credits:"Может потребоваться доступ или средства API X.", goal:"из 1 000 000 подписчиков", remaining:"подписчиков осталось", completed:"ЦЕЛЬ ДОСТИГНУТА!", updated:"Обновлено", note:"Официальные данные X. Обновление примерно раз в 5 минут." }
  };
  const locales = {
    en:"en-US",pt:"pt-BR",es:"es-ES",fr:"fr-FR",it:"it-IT",
    zh:"zh-CN",hi:"hi-IN",ar:"ar-SA",ru:"ru-RU"
  };

  let state = { status:"checking" };
  function language() {
    const lang = document.documentElement.lang || "en";
    return Object.prototype.hasOwnProperty.call(messages,lang) ? lang : "en";
  }
  function render() {
    const lang = language();
    const text = messages[lang];
    const locale = locales[lang];
    const number = new Intl.NumberFormat(locale);
    if (state.status !== "ok") {
      const failed = state.status === "unavailable";
      elCount.textContent = failed ? text.unavailable : text.checking;
      elSource.textContent = failed ? text.unavailableNote : text.checkingNote;
      elLabel.textContent = text.pending;
      elNote.textContent = failed && state.reason === "credits_required" ? text.credits : text.unavailableNote;
      if (!failed) elNote.textContent = text.note;
      elFill.style.width = "0%";
      elProgress.removeAttribute("aria-valuenow");
      elProgress.setAttribute("aria-valuetext",elLabel.textContent);
      return;
    }
    const amount = state.followers;
    const remaining = Math.max(0,goal - amount);
    const pct = Math.min(100, amount / goal * 100);
    const percent = new Intl.NumberFormat(locale, {
      maximumFractionDigits: pct > 0 && pct < 0.01 ? 4 : 2,
      minimumFractionDigits: 0
    }).format(pct) + "%";
    elCount.textContent = number.format(amount);
    let time = "";
    if (state.updatedAt) {
      const date = new Date(state.updatedAt);
      if (!Number.isNaN(date.valueOf())) {
        time = " · " + text.updated + " " +
          new Intl.DateTimeFormat(locale,{hour:"2-digit",minute:"2-digit"}).format(date);
      }
    }
    elSource.textContent = "@" + state.username + " · X" + time;
    elLabel.textContent = remaining === 0 ? text.completed : percent + " · " + number.format(remaining) + " " + text.remaining;
    elNote.textContent = number.format(amount) + " " + text.goal + ". " + text.note;
    elFill.style.width = pct + "%";
    elProgress.setAttribute("aria-valuenow",String(Math.min(goal,amount)));
    elProgress.setAttribute("aria-valuetext",number.format(amount) + " " + text.goal);
  }

  async function loadFollowers() {
    try {
      const response = await fetch("/api/followers", {
        method:"GET",
        credentials:"omit",
        headers:{ Accept:"application/json" }
      });
      const json = await response.json();
      if (response.ok && json.status === "ok" &&
          json.username === "realcrumb_" &&
          Number.isSafeInteger(json.followers) && json.followers >= 0) {
        state = { status:"ok", followers:json.followers, username:json.username, updatedAt:json.updatedAt };
      } else {
        // Never pretend a failed request means zero followers.
        state = { status:"unavailable", reason:typeof json.reason === "string" ? json.reason : "unknown" };
      }
    } catch (err) {
      state = { status:"unavailable", reason:"network" };
    }
    render();
  }

  render();
  const observer = new MutationObserver(render);
  observer.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  loadFollowers();
  // Browser refresh is light; the Vercel CDN caches successful upstream results.
  setInterval(loadFollowers,300000);
})();
