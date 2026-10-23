"use strict";

/* CRUMB free manual follower counter.
 * To update, edit FOLLOWERS and LAST_MANUAL_UPDATE only.
 * This file makes ZERO requests to the X API, Vercel Functions, or external sites.
 * The number is entered by the project owner, not independently verified.
 */
(() => {
  const FOLLOWERS = 34;
  const GOAL = 1000000;
  const LAST_MANUAL_UPDATE = "2026-10-23";
  const username = "realcrumb_";

  const elCount = document.getElementById("xFollowerCount");
  const elSource = document.getElementById("xFollowerSource");
  const elProgress = document.getElementById("xFollowerProgress");
  const elFill = document.getElementById("xFollowerProgressFill");
  const elLabel = document.getElementById("xFollowerProgressLabel");
  const elNote = document.getElementById("xFollowerProgressNote");
  if (![elCount, elSource, elProgress, elFill, elLabel, elNote].every(Boolean)) return;

  const languages = {
    en: { locale:"en-US", manual:"Manual count", target:"of 1,000,000 followers", remaining:"to go", full:"GOAL REACHED!", note:"Manual update: October 23, 2026. Not a live or independently verified X count." },
    pt: { locale:"pt-BR", manual:"Contagem manual", target:"de 1.000.000 de seguidores", remaining:"restantes", full:"META ATINGIDA!", note:"Atualização manual: 23 de outubro de 2026. Não é uma contagem ao vivo nem verificada independentemente no X." },
    es: { locale:"es-ES", manual:"Conteo manual", target:"de 1.000.000 seguidores", remaining:"restantes", full:"¡META ALCANZADA!", note:"Actualización manual: 23 de octubre de 2026. No es un conteo en vivo ni verificado de forma independiente en X." },
    fr: { locale:"fr-FR", manual:"Nombre manuel", target:"sur 1 000 000 d’abonnés", remaining:"restants", full:"OBJECTIF ATTEINT !", note:"Mise à jour manuelle : 23 octobre 2026. Pas de comptage en direct ni de vérification indépendante sur X." },
    it: { locale:"it-IT", manual:"Conteggio manuale", target:"su 1.000.000 di follower", remaining:"mancanti", full:"OBIETTIVO RAGGIUNTO!", note:"Aggiornamento manuale: 23 ottobre 2026. Non è un conteggio in tempo reale né verificato indipendentemente su X." },
    zh: { locale:"zh-CN", manual:"手动更新的数量", target:"／1,000,000 位关注者", remaining:"位关注者仍需增加", full:"目标已达成！", note:"手动更新日期：2026年10月23日。不是实时数据，未经独立核实。" },
    hi: { locale:"hi-IN", manual:"मैन्युअल गिनती", target:"/ 10,00,000 फ़ॉलोअर्स", remaining:"बाकी", full:"लक्ष्य पूरा!", note:"मैन्युअल अपडेट: 23 अक्टूबर 2026। यह लाइव या स्वतंत्र रूप से सत्यापित X गिनती नहीं है।" },
    ar: { locale:"ar-SA", manual:"عدد مُدخل يدويًا", target:"من ١٬٠٠٠٬٠٠٠ متابع", remaining:"متابع متبقٍ", full:"تم تحقيق الهدف!", note:"تحديث يدوي: ٢٣ أكتوبر ٢٠٢٦. العدد ليس مباشرًا ولم يتم التحقق منه بصورة مستقلة على X." },
    ru: { locale:"ru-RU", manual:"Подсчёт вручную", target:"из 1 000 000 подписчиков", remaining:"осталось", full:"ЦЕЛЬ ДОСТИГНУТА!", note:"Обновлено вручную 23 октября 2026 г. Это не данные в реальном времени и не независимая проверка X." }
  };

  function render() {
    const lang = document.documentElement.lang || "en";
    const t = languages[lang] || languages.en;
    const fmt = new Intl.NumberFormat(t.locale);
    const progress = Math.max(0, Math.min(100, FOLLOWERS / GOAL * 100));
    const pct = new Intl.NumberFormat(t.locale, {maximumFractionDigits:4}).format(progress) + "%";
    const remaining = Math.max(0, GOAL - FOLLOWERS);

    elCount.textContent = fmt.format(FOLLOWERS);
    elSource.textContent = t.manual + " · @" + username;
    elLabel.textContent = remaining ? pct + " · " + fmt.format(remaining) + " " + t.remaining : t.full;
    elNote.textContent = fmt.format(FOLLOWERS) + " " + t.target + ". " + t.note;

    elFill.style.width = progress + "%";
    elFill.style.minWidth = FOLLOWERS > 0 ? "3px" : "0";
    elProgress.setAttribute("aria-valuenow", String(Math.min(FOLLOWERS, GOAL)));
    elProgress.setAttribute("aria-valuetext", fmt.format(FOLLOWERS) + " " + t.target);
    elProgress.setAttribute("data-updated", LAST_MANUAL_UPDATE);
  }
  render();
  // The existing 9-language selector updates <html lang>; redraw labels only.
  new MutationObserver(render).observe(document.documentElement, {
    attributes:true, attributeFilter:["lang"]
  });
})();