/* Free CRUMB: original wildlife photos only; no captions, filters, image editing, or X API. */
(() => {
  'use strict';
  const root = document.getElementById('crumbDownloads');
  if (!root) return;

  /* To publish tomorrow, add original licensed raccoon photographs to
     /assets/meme-gallery/photos/ and list their relative paths in
     /assets/meme-gallery/photos.json.
     Example: [{ "src": "/assets/meme-gallery/photos/raccoon-01.jpg" }]
     Only the photos appear in the album, with no written captions.
  */
  const messages = {
    en: { eyebrow:'FREE CRUMB · THE OFFICIAL COLLECTION',title:'THE RACCOON ALBUM.',intro:'Real raccoon photographs. Just the pictures — no captions, edits or filters.',coming:'PHOTOS COMING SOON.',empty:"We're preparing our real raccoon photo collection. Check back soon.",close:'Close photo',prev:'Previous photo',next:'Next photo',download:'↓ DOWNLOAD ORIGINAL PHOTO',open:'Open photo',failed:'Photos are temporarily unavailable.' },
    pt: { eyebrow:'FREE CRUMB · COLEÇÃO OFICIAL',title:'ÁLBUM DE GUAXININS.',intro:'Fotografias reais de guaxinins. Apenas as fotos, sem legendas, edições ou filtros.',coming:'FOTOS EM BREVE.',empty:'Estamos preparando nossa coleção de fotos reais de guaxinins. Volte em breve.',close:'Fechar foto',prev:'Foto anterior',next:'Próxima foto',download:'↓ BAIXAR FOTO ORIGINAL',open:'Abrir foto',failed:'As fotos estão temporariamente indisponíveis.' },
    es: { eyebrow:'FREE CRUMB · COLECCIÓN OFICIAL',title:'ÁLBUM DE MAPACHES.',intro:'Fotografías reales de mapaches. Solo imágenes, sin subtítulos, ediciones ni filtros.',coming:'FOTOS PRÓXIMAMENTE.',empty:'Estamos preparando la colección de fotos reales de mapaches. Vuelve pronto.',close:'Cerrar foto',prev:'Foto anterior',next:'Foto siguiente',download:'↓ DESCARGAR FOTO ORIGINAL',open:'Abrir foto',failed:'Las fotos no están disponibles temporalmente.' },
    it: { eyebrow:'FREE CRUMB · COLLEZIONE UFFICIALE',title:'ALBUM DEI PROCIONI.',intro:'Fotografie reali di procioni. Solo foto, senza didascalie, modifiche o filtri.',coming:'FOTO IN ARRIVO.',empty:'Stiamo preparando la raccolta di foto reali. Torna presto.',close:'Chiudi foto',prev:'Foto precedente',next:'Foto successiva',download:'↓ SCARICA FOTO ORIGINALE',open:'Apri foto',failed:'Le foto sono temporaneamente non disponibili.' },
    fr: { eyebrow:'FREE CRUMB · COLLECTION OFFICIELLE',title:'ALBUM DES RATONS LAVEURS.',intro:'De vraies photos de ratons laveurs. Seulement les photos, sans légende, retouche ni filtre.',coming:'PHOTOS BIENTÔT DISPONIBLES.',empty:'Nous préparons notre collection de vraies photos. Revenez bientôt.',close:'Fermer la photo',prev:'Photo précédente',next:'Photo suivante',download:'↓ TÉLÉCHARGER LA PHOTO ORIGINALE',open:'Ouvrir la photo',failed:'Les photos sont temporairement indisponibles.' },
    zh: { eyebrow:'FREE CRUMB · 官方照片集',title:'浣熊照片集。',intro:'真实浣熊照片。仅展示原图，不添加文字、编辑或滤镜。',coming:'照片即将上线。',empty:'我们正在准备真实浣熊照片集，敬请期待。',close:'关闭照片',prev:'上一张照片',next:'下一张照片',download:'↓ 下载原始照片',open:'打开照片',failed:'照片暂时不可用。' },
    hi: { eyebrow:'FREE CRUMB · आधिकारिक संग्रह',title:'रैकून फ़ोटो एल्बम।',intro:'असली रैकून की तस्वीरें। सिर्फ़ मूल तस्वीरें, कोई कैप्शन, संपादन या फ़िल्टर नहीं।',coming:'तस्वीरें जल्द आएँगी।',empty:'हम असली रैकून तस्वीरों का संग्रह तैयार कर रहे हैं।',close:'तस्वीर बंद करें',prev:'पिछली तस्वीर',next:'अगली तस्वीर',download:'↓ मूल फ़ोटो डाउनलोड करें',open:'तस्वीर खोलें',failed:'तस्वीरें अभी उपलब्ध नहीं हैं।' },
    ar: { eyebrow:'FREE CRUMB · المجموعة الرسمية',title:'ألبوم صور الراكون.',intro:'صور حقيقية لحيوان الراكون، دون تعليقات أو تعديل أو فلاتر.',coming:'الصور قريبًا.',empty:'نعمل على إعداد مجموعة من الصور الحقيقية للراكون.',close:'إغلاق الصورة',prev:'الصورة السابقة',next:'الصورة التالية',download:'↓ تنزيل الصورة الأصلية',open:'فتح الصورة',failed:'الصور غير متاحة مؤقتًا.' },
    ru: { eyebrow:'FREE CRUMB · ОФИЦИАЛЬНАЯ КОЛЛЕКЦИЯ',title:'АЛЬБОМ ЕНОТОВ.',intro:'Настоящие фотографии енотов. Только снимки — без подписей, редактирования и фильтров.',coming:'ФОТО СКОРО ПОЯВЯТСЯ.',empty:'Мы готовим коллекцию настоящих фотографий енотов. Загляните позже.',close:'Закрыть фото',prev:'Предыдущее фото',next:'Следующее фото',download:'↓ СКАЧАТЬ ОРИГИНАЛ',open:'Открыть фото',failed:'Фотографии временно недоступны.' }
  };
  const $ = id => document.getElementById(id);
  const photos = $('galleryPhotos');
  const empty = $('galleryEmpty');
  const modal = $('galleryLightbox');
  const full = $('galleryFullImage');
  const save = $('gallerySave');
  const prev = $('galleryPrev');
  const next = $('galleryNext');
  let collection = [];
  let active = 0;
  let previousFocus = null;
  function dictionary() {
    const lang = (document.documentElement.lang || 'en').split('-')[0].toLowerCase();
    return messages[lang] || messages.en;
  }
  function translate() {
    const t = dictionary();
    root.querySelectorAll('[data-gallery-i18n]').forEach(node => {
      node.textContent = t[node.dataset.galleryI18n] || '';
    });
    root.querySelectorAll('[data-gallery-i18n-aria]').forEach(node => {
      node.setAttribute('aria-label',t[node.dataset.galleryI18nAria] || '');
    });
    const nav = document.getElementById('freeCrumbNav');
    if (nav) nav.textContent = 'FREE CRUMB';
    photos.querySelectorAll('button[data-photo-index]').forEach((button,index) => {
      button.setAttribute('aria-label',t.open + ' ' + (index + 1));
    });
    if (!modal.hidden) full.alt = t.open + ' ' + (active + 1);
  }
  function showEmpty() {
    empty.hidden = collection.length > 0;
    photos.hidden = collection.length === 0;
  }
  function open(index) {
    if (!collection.length) return;
    previousFocus = document.activeElement;
    active = index;
    modal.hidden = false;
    document.body.classList.add('gallery-modal-open');
    show(index);
    $('galleryClose').focus();
  }
  function show(index) {
    if (!collection.length) return;
    active = (index + collection.length) % collection.length;
    full.src = collection[active].src;
    full.alt = dictionary().open + ' ' + (active + 1);
    save.href = collection[active].src;
    const filename = collection[active].src.split('/').pop().split('?')[0];
    save.setAttribute('download',filename || 'raccoon-photo.jpg');
    prev.hidden = collection.length < 2;
    next.hidden = collection.length < 2;
  }
  function close() {
    modal.hidden = true;
    document.body.classList.remove('gallery-modal-open');
    full.removeAttribute('src');
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }
  function render() {
    const fragment = document.createDocumentFragment();
    collection.forEach((photo,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-photo';
      button.dataset.photoIndex = String(index);
      button.setAttribute('aria-label',dictionary().open + ' ' + (index + 1));
      const img = document.createElement('img');
      img.src = photo.thumb || photo.src;
      img.alt = photo.alt || 'Raccoon photograph';
      img.loading = 'lazy';
      img.decoding = 'async';
      button.appendChild(img);
      button.addEventListener('click', () => open(index));
      fragment.appendChild(button);
    });
    photos.replaceChildren(fragment);
    showEmpty();
    translate();
  }
  $('galleryClose').addEventListener('click',close);
  prev.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  modal.addEventListener('click',e => { if (e.target === modal) close(); });
  modal.addEventListener('keydown',e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(active-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(active+1); }
    if (e.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll('button:not([hidden]),a[href]')).filter(el => el.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0],last = focusable[focusable.length-1];
      if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
      else if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
    }
  });
  const stage = modal.querySelector('.gallery-lightbox-stage');
  let pointerStart = null;
  stage.addEventListener('touchstart',e => {
    if (e.touches.length === 1) pointerStart = {x:e.touches[0].clientX,y:e.touches[0].clientY};
  },{passive:true});
  stage.addEventListener('touchend',e => {
    if (!pointerStart || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - pointerStart.x;
    const dy = e.changedTouches[0].clientY - pointerStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)*1.3) show(active + (dx < 0 ? 1 : -1));
    pointerStart = null;
  },{passive:true});
  const lang = document.getElementById('lang');
  if (lang) lang.addEventListener('change',() => requestAnimationFrame(translate));
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  translate();
  fetch('/assets/meme-gallery/photos.json',{cache:'no-cache'})
    .then(response => {
      if (!response.ok) throw Error('Photo manifest unavailable');
      return response.json();
    })
    .then(items => {
      if (!Array.isArray(items)) throw Error('Invalid photo manifest');
      // Only images stored on this site can be displayed; never load third-party
      // image URLs or old unrelated meme art by accident.
      collection = items.filter(item =>
        item && typeof item.src === 'string' &&
        /^\/assets\/meme-gallery\/photos\/[A-Za-z0-9._/-]+\.(?:jpe?g|png|webp|avif)$/i.test(item.src) &&
        (!item.thumb || /^\/assets\/meme-gallery\/photos\/[A-Za-z0-9._/-]+\.(?:jpe?g|png|webp|avif)$/i.test(item.thumb))
      );
      render();
    })
    .catch(() => {collection=[];render();});
})();