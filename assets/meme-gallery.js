/* FREE CRUMB — editable, expandable official artwork collection. No server/API required. */
(() => {
  'use strict';
  const root = document.getElementById('crumbDownloads');
  if (!root) return;

  // ADD FUTURE ARTWORK HERE: upload its text-free image to assets/meme-gallery/ and add one entry.
  const galleryImages = [
    { id: '01', src: '/assets/meme-gallery/CRUMB-Message-01-clean.jpg' },
    { id: '02', src: '/assets/meme-gallery/CRUMB-Message-02-clean.jpg' },
    { id: '03', src: '/assets/meme-gallery/CRUMB-Message-03-clean.jpg' },
    { id: '04', src: '/assets/meme-gallery/CRUMB-Message-04-clean.jpg' }
  ];

  const translations = {
    en: { nav: 'FREE CRUMB', eyebrow: 'FREE CRUMB • THE OFFICIAL COLLECTION', title: 'CHOOSE YOUR IMAGE!', intro: 'CREATE YOUR APPEAL, POST IT AND TAG ELON MUSK AND @realcrumb_.', choose: '01 / CHOOSE YOUR IMAGE', chooseHint: 'Select an official CRUMB image. New artworks will be added to this collection.', create: '02 / CREATE YOUR APPEAL', label: 'YOUR MESSAGE', placeholder: 'Write your message to Elon here…', font: 'TEXT SIZE', color: 'TEXT COLOR', position: 'TEXT POSITION', top: 'Top', middle: 'Middle', bottom: 'Bottom', download: '↓ DOWNLOAD PNG', posting: '03 / POST AND TAG', share: 'POST ON X ↗', shareNote: 'Download your image and attach the PNG to your X post. Include @elonmusk and @realcrumb_ — this button prepares your post text but cannot attach an image automatically.', error: 'This image could not be loaded. Try again.', image: 'Choose CRUMB image', selected: 'Selected', empty: 'Write your own appeal. The original artwork will stay unchanged.', sharePrefix: 'My appeal to Elon Musk:', createPreview: 'Live preview', reset: 'CLEAR TEXT' },
    pt: { nav: 'FREE CRUMB', eyebrow: 'FREE CRUMB • COLEÇÃO OFICIAL', title: 'ESCOLHA SUA IMAGEM!', intro: 'CRIE SEU APELO, POSTE E MARQUE O ELON MUSK E @realcrumb_.', choose: '01 / ESCOLHA SUA IMAGEM', chooseHint: 'Escolha uma arte oficial do CRUMB. Vamos adicionar mais imagens a esta coleção.', create: '02 / CRIE SEU APELO', label: 'SUA FRASE', placeholder: 'Escreva seu apelo para o Elon aqui…', font: 'TAMANHO DO TEXTO', color: 'COR DO TEXTO', position: 'POSIÇÃO DO TEXTO', top: 'Em cima', middle: 'No meio', bottom: 'Embaixo', download: '↓ BAIXAR PNG', posting: '03 / POSTE E MARQUE', share: 'POSTAR NO X ↗', shareNote: 'Baixe a imagem e anexe o PNG à publicação no X. Marque @elonmusk e @realcrumb_. O botão prepara o texto da postagem, mas não anexa a imagem automaticamente.', error: 'Não foi possível carregar esta imagem. Tente novamente.', image: 'Escolher imagem do CRUMB', selected: 'Selecionada', empty: 'Escreva seu próprio apelo. A arte original continuará intacta.', sharePrefix: 'Meu apelo para Elon Musk:', createPreview: 'Prévia em tempo real', reset: 'LIMPAR FRASE' },
    es: { nav: 'FREE CRUMB', eyebrow: 'FREE CRUMB • COLECCIÓN OFICIAL', title: '¡ELIGE TU IMAGEN!', intro: 'CREA TU MENSAJE, PUBLICA Y ETIQUETA A ELON MUSK Y @realcrumb_.', choose: '01 / ELIGE TU IMAGEN', chooseHint: 'Elige una imagen oficial de CRUMB. Añadiremos más imágenes a esta colección.', create: '02 / CREA TU MENSAJE', label: 'TU MENSAJE', placeholder: 'Escribe tu mensaje para Elon…', font: 'TAMAÑO DEL TEXTO', color: 'COLOR DEL TEXTO', position: 'POSICIÓN', top: 'Arriba', middle: 'Centro', bottom: 'Abajo', download: '↓ DESCARGAR PNG', posting: '03 / PUBLICA Y ETIQUETA', share: 'PUBLICAR EN X ↗', shareNote: 'Descarga la imagen y adjunta el PNG en X. Etiqueta @elonmusk y @realcrumb_. El botón prepara el texto, pero no adjunta el archivo automáticamente.', error: 'No se pudo cargar esta imagen.', image: 'Elegir imagen de CRUMB', selected: 'Seleccionada', empty: 'Escribe tu mensaje. La imagen original permanece intacta.', sharePrefix: 'Mi mensaje para Elon Musk:', createPreview: 'Vista previa en vivo', reset: 'BORRAR TEXTO' },
    it: { nav: 'FREE CRUMB', eyebrow: 'FREE CRUMB • COLLEZIONE UFFICIALE', title: 'SCEGLI LA TUA IMMAGINE!', intro: 'SCRIVI IL TUO MESSAGGIO, PUBBLICA E TAGGA ELON MUSK E @realcrumb_.', choose: '01 / SCEGLI UN’IMMAGINE', chooseHint: 'Scegli una grafica ufficiale CRUMB. Ne aggiungeremo altre.', create: '02 / SCRIVI IL TUO APPELLO', label: 'IL TUO MESSAGGIO', placeholder: 'Scrivi qui per Elon…', font: 'DIMENSIONE TESTO', color: 'COLORE TESTO', position: 'POSIZIONE', top: 'Alto', middle: 'Centro', bottom: 'Basso', download: '↓ SCARICA PNG', posting: '03 / PUBBLICA E TAGGA', share: 'PUBBLICA SU X ↗', shareNote: 'Scarica il PNG e allegalo al post su X. Tagga @elonmusk e @realcrumb_. Il pulsante prepara il testo, non allega automaticamente il file.', error: 'Impossibile caricare l’immagine.', image: 'Seleziona immagine CRUMB', selected: 'Selezionata', empty: 'Scrivi il messaggio. L’arte originale resterà intatta.', sharePrefix: 'Il mio messaggio per Elon Musk:', createPreview: 'Anteprima dal vivo', reset: 'CANCELLA TESTO' },
    fr: { nav: 'FREE CRUMB', eyebrow: 'FREE CRUMB • COLLECTION OFFICIELLE', title: 'CHOISISSEZ VOTRE IMAGE !', intro: 'CRÉEZ VOTRE MESSAGE, PUBLIEZ ET IDENTIFIEZ ELON MUSK ET @realcrumb_.', choose: '01 / CHOISISSEZ VOTRE IMAGE', chooseHint: 'Sélectionnez une image officielle CRUMB. D’autres seront ajoutées.', create: '02 / CRÉEZ VOTRE MESSAGE', label: 'VOTRE MESSAGE', placeholder: 'Écrivez à Elon ici…', font: 'TAILLE DU TEXTE', color: 'COULEUR DU TEXTE', position: 'POSITION', top: 'Haut', middle: 'Milieu', bottom: 'Bas', download: '↓ TÉLÉCHARGER PNG', posting: '03 / PUBLIEZ ET IDENTIFIEZ', share: 'PUBLIER SUR X ↗', shareNote: 'Téléchargez le PNG et joignez-le à votre publication sur X. Mentionnez @elonmusk et @realcrumb_. Le bouton prépare le texte sans joindre l’image automatiquement.', error: 'Impossible de charger cette image.', image: 'Choisir une image CRUMB', selected: 'Sélectionnée', empty: 'Écrivez votre message. L’œuvre originale restera intacte.', sharePrefix: 'Mon message à Elon Musk :', createPreview: 'Aperçu en direct', reset: 'EFFACER LE TEXTE' },
    zh: { nav: '免费 CRUMB', eyebrow: 'FREE CRUMB • 官方图片库', title: '选择你的图片！', intro: '写下你的呼吁，发布并标记 @elonmusk 和 @realcrumb_。', choose: '01 / 选择图片', chooseHint: '选择一张 CRUMB 官方图片。未来会不断添加新作品。', create: '02 / 写下你的呼吁', label: '你的留言', placeholder: '给 Elon 写下你的留言…', font: '字体大小', color: '文字颜色', position: '文字位置', top: '顶部', middle: '中间', bottom: '底部', download: '↓ 下载 PNG', posting: '03 / 发布并标记', share: '发布到 X ↗', shareNote: '下载图片并自行附加到 X 帖子中。请标记 @elonmusk 和 @realcrumb_。按钮只准备文字，不会自动附加图片。', error: '图片无法加载，请重试。', image: '选择 CRUMB 图片', selected: '已选择', empty: '写下你的呼吁。原始图片不会改变。', sharePrefix: '给 Elon Musk 的留言：', createPreview: '实时预览', reset: '清空文字' },
    hi: { nav: 'FREE CRUMB', eyebrow: 'FREE CRUMB • आधिकारिक संग्रह', title: 'अपनी तस्वीर चुनें!', intro: 'अपना संदेश लिखें, पोस्ट करें और @elonmusk तथा @realcrumb_ को टैग करें।', choose: '01 / तस्वीर चुनें', chooseHint: 'CRUMB की आधिकारिक तस्वीर चुनें। आगे और तस्वीरें जुड़ेंगी।', create: '02 / अपना संदेश लिखें', label: 'आपका संदेश', placeholder: 'Elon के लिए यहाँ लिखें…', font: 'अक्षर आकार', color: 'पाठ का रंग', position: 'पाठ का स्थान', top: 'ऊपर', middle: 'बीच', bottom: 'नीचे', download: '↓ PNG डाउनलोड', posting: '03 / पोस्ट और टैग', share: 'X पर पोस्ट करें ↗', shareNote: 'PNG डाउनलोड करके X पोस्ट में खुद जोड़ें। @elonmusk और @realcrumb_ को टैग करें। बटन केवल पोस्ट टेक्स्ट तैयार करता है।', error: 'तस्वीर लोड नहीं हुई।', image: 'CRUMB तस्वीर चुनें', selected: 'चुनी गई', empty: 'अपना संदेश लिखें। मूल तस्वीर नहीं बदलेगी।', sharePrefix: 'Elon Musk के लिए मेरा संदेश:', createPreview: 'लाइव प्रीव्यू', reset: 'टेक्स्ट हटाएँ' },
    ar: { nav: 'فري كرامب', eyebrow: 'FREE CRUMB • المجموعة الرسمية', title: 'اختر صورتك!', intro: 'اكتب رسالتك وانشرها وأشر إلى @elonmusk و @realcrumb_.', choose: '01 / اختر الصورة', chooseHint: 'اختر إحدى صور CRUMB الرسمية. ستُضاف صور جديدة لاحقًا.', create: '02 / اكتب رسالتك', label: 'رسالتك', placeholder: 'اكتب رسالتك لإيلون هنا…', font: 'حجم الخط', color: 'لون النص', position: 'مكان النص', top: 'أعلى', middle: 'وسط', bottom: 'أسفل', download: '↓ تنزيل PNG', posting: '03 / انشر وأشر', share: 'انشر على X ↗', shareNote: 'نزّل الصورة وأرفقها بنفسك بمنشور X. أشر إلى @elonmusk و @realcrumb_. يجهّز الزر النص فقط ولا يرفق الصورة تلقائيًا.', error: 'تعذر تحميل الصورة.', image: 'اختر صورة CRUMB', selected: 'محددة', empty: 'اكتب رسالتك. ستبقى الصورة الأصلية كما هي.', sharePrefix: 'رسالتي إلى إيلون ماسك:', createPreview: 'معاينة مباشرة', reset: 'مسح النص' },
    ru: { nav: 'FREE CRUMB', eyebrow: 'FREE CRUMB • ОФИЦИАЛЬНАЯ КОЛЛЕКЦИЯ', title: 'ВЫБЕРИТЕ ИЗОБРАЖЕНИЕ!', intro: 'НАПИШИТЕ ОБРАЩЕНИЕ, ОПУБЛИКУЙТЕ И ОТМЕТЬТЕ @elonmusk И @realcrumb_.', choose: '01 / ВЫБЕРИТЕ ИЗОБРАЖЕНИЕ', chooseHint: 'Выберите официальную картинку CRUMB. Коллекция будет пополняться.', create: '02 / НАПИШИТЕ ОБРАЩЕНИЕ', label: 'ВАШ ТЕКСТ', placeholder: 'Напишите сообщение Илону…', font: 'РАЗМЕР ТЕКСТА', color: 'ЦВЕТ ТЕКСТА', position: 'РАСПОЛОЖЕНИЕ', top: 'Сверху', middle: 'Посередине', bottom: 'Снизу', download: '↓ СКАЧАТЬ PNG', posting: '03 / ОПУБЛИКУЙТЕ И ОТМЕТЬТЕ', share: 'ОПУБЛИКОВАТЬ В X ↗', shareNote: 'Скачайте PNG и прикрепите его к публикации в X. Отметьте @elonmusk и @realcrumb_. Кнопка подготавливает текст без автоматического вложения.', error: 'Не удалось загрузить изображение.', image: 'Выберите изображение CRUMB', selected: 'Выбрано', empty: 'Введите своё обращение. Оригинал останется без изменений.', sharePrefix: 'Моё обращение к Илону Маску:', createPreview: 'Предпросмотр', reset: 'ОЧИСТИТЬ ТЕКСТ' }
  };

  const $ = id => root.querySelector('#' + id);
  const strip = $('galleryThumbs');
  const canvas = $('galleryCanvas');
  const ctx = canvas.getContext('2d');
  const caption = $('galleryCaption');
  const size = $('galleryFontSize');
  const color = $('galleryColor');
  const position = $('galleryPosition');
  const status = $('galleryStatus');
  const sourceImages = new Map();
  let selected = 0;

  function tr() {
    const code = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    return translations[code] || translations.en;
  }
  function t(key) { return tr()[key] || translations.en[key] || ''; }
  function updateWords() {
    root.querySelectorAll('[data-gallery-i18n]').forEach(el => {
      const k = el.dataset.galleryI18n;
      if (k) el.textContent = t(k);
    });
    root.querySelectorAll('[data-gallery-placeholder]').forEach(el => el.placeholder = t(el.dataset.galleryPlaceholder));
    root.querySelectorAll('[data-gallery-image-alt]').forEach(el => el.alt = t('image') + ' ' + el.dataset.galleryImageAlt);
    const nav = document.getElementById('freeCrumbNav');
    if (nav) nav.textContent = t('nav');
    canvas.setAttribute('aria-label', t('createPreview'));
    strip.setAttribute('aria-label', t('choose'));
    updateSelection();
  }
  function updateSelection() {
    strip.querySelectorAll('button[data-gallery-index]').forEach((button, i) => {
      const active = i === selected;
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', t('image') + ' ' + (i + 1) + (active ? ' • ' + t('selected') : ''));
    });
    $('galleryNumber').textContent = String(selected + 1).padStart(2, '0') + ' / ' + String(galleryImages.length).padStart(2, '0');
  }
  function prepareGallery() {
    galleryImages.forEach((entry, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.galleryIndex = String(index);
      button.className = 'gallery-thumb';
      const img = document.createElement('img');
      img.src = entry.src;
      img.alt = '';
      img.loading = index < 4 ? 'eager' : 'lazy';
      img.decoding = 'async';
      const count = document.createElement('span');
      count.className = 'gallery-thumb-number';
      count.textContent = String(index + 1).padStart(2, '0');
      button.append(img, count);
      button.addEventListener('click', () => { selected = index; updateSelection(); draw(); });
      strip.appendChild(button);
    });
  }
  async function getImage(entry) {
    if (!sourceImages.has(entry.src)) {
      sourceImages.set(entry.src, new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('image load failed'));
        img.src = entry.src;
      }));
    }
    return sourceImages.get(entry.src);
  }
  function splitText(text, maxWidth) {
    const lines = [];
    const inputLines = text.replace(/\r/g, '').split('\n');
    for (const para of inputLines) {
      if (!para) { if (lines.length) lines.push(''); continue; }
      let line = '';
      for (const char of Array.from(para)) {
        const next = line + char;
        if (line && ctx.measureText(next).width > maxWidth) { lines.push(line.trim()); line = char.trimStart(); }
        else line = next;
      }
      if (line) lines.push(line.trim());
    }
    return lines;
  }
  function putWords(message) {
    if (!message.trim()) return;
    let px = Number(size.value) || 64;
    const w = canvas.width, h = canvas.height;
    const maxWidth = w * .86;
    let lines = [];
    do {
      ctx.font = '900 ' + px + 'px "Barlow Condensed", "Arial Narrow", Arial, sans-serif';
      lines = splitText(message, maxWidth);
      if (lines.length <= 6 && lines.length * px * 1.23 < h * .48) break;
      px -= 3;
    } while (px > 25);
    const leading = px * 1.24;
    const blockHeight = lines.length * leading;
    const spot = position.value;
    const centerY = spot === 'top' ? h * .18 + blockHeight / 2 : spot === 'middle' ? h / 2 : h * .88 - blockHeight / 2;
    let baseY = centerY - blockHeight / 2 + leading * .74;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '900 ' + px + 'px "Barlow Condensed", "Arial Narrow", Arial, sans-serif';
    ctx.fillStyle = color.value;
    ctx.strokeStyle = 'rgba(0,0,0,.90)';
    ctx.lineWidth = Math.max(4,px*.13);
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0,0,0,.65)';
    ctx.shadowBlur = Math.max(6,px*.2);
    for (const line of lines) {
      if (line) { ctx.strokeText(line,w/2,baseY,maxWidth); ctx.fillText(line,w/2,baseY,maxWidth); }
      baseY += leading;
    }
    ctx.restore();
  }
  let renderCycle = 0;
  async function draw() {
    const cycle = ++renderCycle;
    const entry = galleryImages[selected];
    status.textContent = '';
    try {
      const img = await getImage(entry);
      if (cycle !== renderCycle) return;
      if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
      if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
      putWords(caption.value);
      canvas.dataset.readyImage = entry.id;
    } catch (e) { if (cycle === renderCycle) status.textContent = t('error'); }
  }
  function download() {
    if (canvas.dataset.readyImage !== galleryImages[selected].id) { status.textContent = t('error'); return; }
    canvas.toBlob(blob => {
      if (!blob) { status.textContent = t('error'); return; }
      const uri = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = uri;
      a.download = 'CRUMB-' + galleryImages[selected].id + '-MY-APPEAL.png';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(uri), 15000);
    }, 'image/png');
  }
  function postToX() {
    const text = [caption.value.trim() ? t('sharePrefix') + ' ' + caption.value.trim() : '', '@elonmusk @realcrumb_ #CRUMB', 'https://crumb.vision/#crumbDownloads'].filter(Boolean).join('\n\n');
    const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  prepareGallery();
  updateWords();
  draw();
  caption.addEventListener('input', draw);
  size.addEventListener('input', () => { $('galleryFontValue').textContent = size.value + 'px'; draw(); });
  color.addEventListener('input', draw);
  position.addEventListener('change', draw);
  $('galleryDownload').addEventListener('click', download);
  $('galleryShare').addEventListener('click', postToX);
  $('galleryReset').addEventListener('click', () => { caption.value = ''; draw(); caption.focus(); });
  const language = document.getElementById('lang');
  if (language) language.addEventListener('change', () => requestAnimationFrame(updateWords));
  new MutationObserver(updateWords).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw).catch(() => {});
})();
