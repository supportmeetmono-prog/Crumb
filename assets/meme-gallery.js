/* FREE CRUMB — editable, expandable official artwork collection. No server/API required. */
(() => {
  'use strict';
  const root = document.getElementById('crumbDownloads');
  if (!root) return;

  // ADD FUTURE ARTWORK HERE: upload its text-free image to assets/meme-gallery/ and add one entry.
  const galleryImages = [
    { id: '01', title: 'Mars Signal 01', category: 'Messages', tags: 'mars signal message', src: '/assets/meme-gallery/CRUMB-Message-01-clean.jpg', thumb: '/assets/meme-gallery/thumbs/CRUMB-01-thumb.jpg' },
    { id: '02', title: 'Mars Signal 02', category: 'Messages', tags: 'mars signal message', src: '/assets/meme-gallery/CRUMB-Message-02-clean.jpg', thumb: '/assets/meme-gallery/thumbs/CRUMB-02-thumb.jpg' },
    { id: '03', title: 'Mars Signal 03', category: 'Messages', tags: 'mars signal message', src: '/assets/meme-gallery/CRUMB-Message-03-clean.jpg', thumb: '/assets/meme-gallery/thumbs/CRUMB-03-thumb.jpg' },
    { id: '04', title: 'Mars Signal 04', category: 'Messages', tags: 'mars signal message', src: '/assets/meme-gallery/CRUMB-Message-04-clean.jpg', thumb: '/assets/meme-gallery/thumbs/CRUMB-04-thumb.jpg' },
    { id: '05', title: 'Futuristic Mars City', category: 'Mars City', tags: 'futuristic city mars space architecture spaceship hoodie spaceX alien', src: '/assets/meme-gallery/CRUMB-Mars-City-05.jpg', thumb: '/assets/meme-gallery/thumbs/CRUMB-05-thumb.jpg' }
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

  // Picker labels are available in all nine website languages.
  Object.assign(translations.en, {"openPicker":"▣ OPEN IMAGE GALLERY","pickerEyebrow":"FREE CRUMB COLLECTION","pickerTitle":"CHOOSE YOUR IMAGE","pickerSearch":"Search by number, title or category…","pickerClose":"Close gallery","pickerPrev":"Previous image","pickerNext":"Next image","pickerUse":"✓ USE THIS IMAGE","pickerSwipe":"Swipe sideways or use the arrows to browse.","pickerPagination":"Images load in small groups for faster browsing.","pickerPreviousPage":"Previous page","pickerNextPage":"Next page","pickerResults":"images","pickerEmpty":"No images found. Try another search."});
  Object.assign(translations.pt, {"openPicker":"▣ ABRIR GALERIA DE IMAGENS","pickerEyebrow":"COLEÇÃO FREE CRUMB","pickerTitle":"ESCOLHA SUA IMAGEM","pickerSearch":"Buscar por número, nome ou categoria…","pickerClose":"Fechar galeria","pickerPrev":"Imagem anterior","pickerNext":"Próxima imagem","pickerUse":"✓ USAR ESTA IMAGEM","pickerSwipe":"Deslize para os lados ou use as setas.","pickerPagination":"As imagens aparecem em pequenos grupos para carregar mais rápido.","pickerPreviousPage":"Página anterior","pickerNextPage":"Próxima página","pickerResults":"imagens","pickerEmpty":"Nenhuma imagem encontrada. Tente outra busca."});
  Object.assign(translations.es, {"openPicker":"▣ ABRIR GALERÍA","pickerEyebrow":"COLECCIÓN FREE CRUMB","pickerTitle":"ELIGE TU IMAGEN","pickerSearch":"Buscar por número, nombre o categoría…","pickerClose":"Cerrar galería","pickerPrev":"Imagen anterior","pickerNext":"Imagen siguiente","pickerUse":"✓ USAR ESTA IMAGEN","pickerSwipe":"Desliza o usa las flechas.","pickerPagination":"Las imágenes se cargan en grupos pequeños.","pickerPreviousPage":"Página anterior","pickerNextPage":"Página siguiente","pickerResults":"imágenes","pickerEmpty":"No se encontraron imágenes."});
  Object.assign(translations.it, {"openPicker":"▣ APRI GALLERIA","pickerEyebrow":"COLLEZIONE FREE CRUMB","pickerTitle":"SCEGLI LA TUA IMMAGINE","pickerSearch":"Cerca per numero, nome o categoria…","pickerClose":"Chiudi galleria","pickerPrev":"Immagine precedente","pickerNext":"Immagine successiva","pickerUse":"✓ USA QUESTA IMMAGINE","pickerSwipe":"Scorri lateralmente o usa le frecce.","pickerPagination":"Le immagini vengono caricate a piccoli gruppi.","pickerPreviousPage":"Pagina precedente","pickerNextPage":"Pagina successiva","pickerResults":"immagini","pickerEmpty":"Nessuna immagine trovata."});
  Object.assign(translations.fr, {"openPicker":"▣ OUVRIR LA GALERIE","pickerEyebrow":"COLLECTION FREE CRUMB","pickerTitle":"CHOISISSEZ VOTRE IMAGE","pickerSearch":"Rechercher par numéro, nom ou catégorie…","pickerClose":"Fermer la galerie","pickerPrev":"Image précédente","pickerNext":"Image suivante","pickerUse":"✓ UTILISER CETTE IMAGE","pickerSwipe":"Balayez sur les côtés ou utilisez les flèches.","pickerPagination":"Les images se chargent par petits groupes.","pickerPreviousPage":"Page précédente","pickerNextPage":"Page suivante","pickerResults":"images","pickerEmpty":"Aucune image trouvée."});
  Object.assign(translations.zh, {"openPicker":"▣ 打开图片库","pickerEyebrow":"FREE CRUMB 作品集","pickerTitle":"选择图片","pickerSearch":"按编号、名称或类别搜索…","pickerClose":"关闭图库","pickerPrev":"上一张","pickerNext":"下一张","pickerUse":"✓ 使用这张图片","pickerSwipe":"左右滑动或使用箭头浏览。","pickerPagination":"图片分批加载，浏览更快。","pickerPreviousPage":"上一页","pickerNextPage":"下一页","pickerResults":"张图片","pickerEmpty":"未找到图片。"});
  Object.assign(translations.hi, {"openPicker":"▣ चित्र गैलरी खोलें","pickerEyebrow":"FREE CRUMB संग्रह","pickerTitle":"अपनी तस्वीर चुनें","pickerSearch":"नंबर, नाम या श्रेणी खोजें…","pickerClose":"गैलरी बंद करें","pickerPrev":"पिछली तस्वीर","pickerNext":"अगली तस्वीर","pickerUse":"✓ यह तस्वीर चुनें","pickerSwipe":"बाएँ-दाएँ स्वाइप करें या तीर दबाएँ।","pickerPagination":"तेज़ लोडिंग के लिए छोटे समूह दिखाए जाते हैं।","pickerPreviousPage":"पिछला पेज","pickerNextPage":"अगला पेज","pickerResults":"तस्वीरें","pickerEmpty":"कोई तस्वीर नहीं मिली।"});
  Object.assign(translations.ar, {"openPicker":"▣ افتح معرض الصور","pickerEyebrow":"مجموعة FREE CRUMB","pickerTitle":"اختر صورتك","pickerSearch":"ابحث بالرقم أو الاسم أو الفئة…","pickerClose":"إغلاق المعرض","pickerPrev":"الصورة السابقة","pickerNext":"الصورة التالية","pickerUse":"✓ استخدم هذه الصورة","pickerSwipe":"اسحب يمينًا ويسارًا أو استخدم الأسهم.","pickerPagination":"تظهر الصور في مجموعات صغيرة لتسريع التحميل.","pickerPreviousPage":"الصفحة السابقة","pickerNextPage":"الصفحة التالية","pickerResults":"صور","pickerEmpty":"لا توجد صور مطابقة."});
  Object.assign(translations.ru, {"openPicker":"▣ ОТКРЫТЬ ГАЛЕРЕЮ","pickerEyebrow":"КОЛЛЕКЦИЯ FREE CRUMB","pickerTitle":"ВЫБЕРИТЕ ИЗОБРАЖЕНИЕ","pickerSearch":"Поиск по номеру, названию или категории…","pickerClose":"Закрыть галерею","pickerPrev":"Предыдущее изображение","pickerNext":"Следующее изображение","pickerUse":"✓ ИСПОЛЬЗОВАТЬ ЭТУ КАРТИНКУ","pickerSwipe":"Листайте в стороны или используйте стрелки.","pickerPagination":"Изображения загружаются небольшими группами.","pickerPreviousPage":"Предыдущая страница","pickerNextPage":"Следующая страница","pickerResults":"изображений","pickerEmpty":"Ничего не найдено."});

  const $ = id => root.querySelector('#' + id);

  const canvas = $('galleryCanvas');
  const ctx = canvas.getContext('2d');
  const caption = $('galleryCaption');
  const size = $('galleryFontSize');
  const color = $('galleryColor');
  const position = $('galleryPosition');
  const status = $('galleryStatus');
  // Keep at most 12 high-resolution decoded artworks in memory.
  const sourceImages = new Map();
  let selected = 0;
  let pickerIndex = 0, pickerPage = 0, filtered = [];
  let lastFocused = null, previousBodyOverflow = '';
  const PAGE_SIZE = 36; // 10,000 entries still render at most 36 thumbnails.
  const picker = $('galleryPicker');
  const pickerGrid = $('galleryPickerGrid');
  const pickerSearch = $('galleryPickerSearch');

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
    root.querySelectorAll('[data-gallery-i18n-aria]').forEach(el => el.setAttribute('aria-label',t(el.dataset.galleryI18nAria)));
    const nav = document.getElementById('freeCrumbNav');
    if (nav) nav.textContent = t('nav');
    canvas.setAttribute('aria-label', t('createPreview'));
    pickerGrid.setAttribute('aria-label',t('pickerTitle'));
    pickerSearch.setAttribute('aria-label',t('pickerSearch'));
    updateSelection();
    if (!picker.hidden) renderPicker();
  }
  function updateSelection() {
    const entry = galleryImages[selected];
    $('galleryCurrentImage').src = entry.thumb || entry.src;
    $('galleryCurrentImage').alt = entry.title;
    $('galleryCurrentName').textContent = entry.title;
    const num = String(selected + 1).padStart(2, '0') + ' / ' + String(galleryImages.length).padStart(2, '0');
    $('galleryCurrentCount').textContent = num;
    $('galleryNumber').textContent = num;
  }
  function filterGallery() {
    const q = pickerSearch.value.trim().toLocaleLowerCase();
    filtered = galleryImages.map((entry,index) => ({entry,index}))
      .filter(({entry}) => !q || [entry.id,entry.title,entry.category,entry.tags].join(' ').toLocaleLowerCase().includes(q))
      .map(({index}) => index);
    if (filtered.length && !filtered.includes(pickerIndex)) pickerIndex = filtered[0];
    pickerPage = filtered.length ? Math.floor(filtered.indexOf(pickerIndex) / PAGE_SIZE) : 0;
    renderPicker();
  }
  function renderPicker() {
    if (picker.hidden) return;
    const count = filtered.length;
    const pages = Math.max(1,Math.ceil(count / PAGE_SIZE));
    pickerPage = Math.max(0,Math.min(pickerPage,pages-1));
    $('galleryPickerResults').textContent = count.toLocaleString(document.documentElement.lang) + ' ' + t('pickerResults');
    const preview = $('galleryPickerImage');
    const entry = count ? galleryImages[pickerIndex] : null;
    if (entry) {
      if (preview.getAttribute('src') !== entry.src) preview.src = entry.src;
      preview.alt = entry.title;
      $('galleryPickerName').textContent = entry.title;
      $('galleryPickerPosition').textContent = (filtered.indexOf(pickerIndex)+1).toLocaleString() + ' / ' + count.toLocaleString();
    } else {
      preview.removeAttribute('src');
      $('galleryPickerName').textContent = t('pickerEmpty');
      $('galleryPickerPosition').textContent = '0 / 0';
    }
    $('galleryPickerPrev').disabled = count <= 1;
    $('galleryPickerNext').disabled = count <= 1;
    $('galleryPickerUse').disabled = !entry;
    pickerGrid.replaceChildren();
    const fragment = document.createDocumentFragment();
    const begin = pickerPage * PAGE_SIZE;
    for (const globalIndex of filtered.slice(begin, begin+PAGE_SIZE)) {
      const item = galleryImages[globalIndex];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-picker-thumb';
      button.setAttribute('aria-pressed', String(globalIndex === pickerIndex));
      button.setAttribute('aria-label', item.title + (globalIndex === pickerIndex ? ' • ' + t('selected') : ''));
      const img = document.createElement('img');
      img.src = item.thumb || item.src;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      const number = document.createElement('span');
      number.textContent = item.id;
      button.append(img,number);
      button.addEventListener('click', () => {
        pickerIndex = globalIndex;
        renderPicker();
      });
      fragment.appendChild(button);
    }
    pickerGrid.appendChild(fragment);
    $('galleryPickerPageCount').textContent = (pickerPage+1).toLocaleString() + ' / ' + pages.toLocaleString();
    $('galleryPickerPagePrev').disabled = pickerPage === 0 || !count;
    $('galleryPickerPageNext').disabled = pickerPage === pages-1 || !count;
  }
  function stepPicker(direction) {
    if (!filtered.length) return;
    const oldPos = filtered.indexOf(pickerIndex);
    const nextPos = (oldPos + direction + filtered.length) % filtered.length;
    pickerIndex = filtered[nextPos];
    pickerPage = Math.floor(nextPos / PAGE_SIZE);
    renderPicker();
  }
  function openPicker() {
    lastFocused = document.activeElement;
    pickerIndex = selected;
    pickerSearch.value = '';
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    picker.hidden = false;
    filterGallery();
    $('galleryPickerClose').focus();
  }
  function closePicker() {
    picker.hidden = true;
    document.body.style.overflow = previousBodyOverflow;
    if (lastFocused && lastFocused.isConnected) lastFocused.focus();
  }
  function pickImage() {
    if (!filtered.length) return;
    selected = pickerIndex;
    updateSelection();
    draw();
    closePicker();
  }
  function setupPicker() {
    $('galleryOpen').addEventListener('click',openPicker);
    $('galleryPickerClose').addEventListener('click',closePicker);
    $('galleryPickerUse').addEventListener('click',pickImage);
    $('galleryPickerPrev').addEventListener('click',()=>stepPicker(-1));
    $('galleryPickerNext').addEventListener('click',()=>stepPicker(1));
    pickerSearch.addEventListener('input',filterGallery);
    $('galleryPickerPagePrev').addEventListener('click',()=>{pickerPage--;pickerIndex=filtered[Math.max(0,pickerPage)*PAGE_SIZE];renderPicker()});
    $('galleryPickerPageNext').addEventListener('click',()=>{pickerPage++;pickerIndex=filtered[pickerPage*PAGE_SIZE];renderPicker()});
    picker.addEventListener('click', e => { if (e.target === picker) closePicker(); });
    picker.addEventListener('keydown', e => {
      if (e.key === 'Escape') {e.preventDefault();closePicker();}
      if (e.key === 'ArrowRight' && document.activeElement !== pickerSearch) {e.preventDefault();stepPicker(1);}
      if (e.key === 'ArrowLeft' && document.activeElement !== pickerSearch) {e.preventDefault();stepPicker(-1);}
      if (e.key === 'Tab') {
        const focusables = [...picker.querySelectorAll('button:not(:disabled),input:not(:disabled)')].filter(el => el.getClientRects().length);
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length-1];
        if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
        else if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
      }
    });
    const stage = $('galleryPickerStage');
    let startTouch = null;
    stage.addEventListener('touchstart', e => {
      if (e.touches.length === 1) startTouch = {x:e.touches[0].clientX,y:e.touches[0].clientY};
    },{passive:true});
    stage.addEventListener('touchend', e => {
      if (!startTouch || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - startTouch.x;
      const dy = e.changedTouches[0].clientY - startTouch.y;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) stepPicker(dx < 0 ? 1 : -1);
      startTouch = null;
    },{passive:true});
  }
  async function getImage(entry) {
    if (!sourceImages.has(entry.src)) {
      const loading = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => { sourceImages.delete(entry.src); reject(new Error('image load failed')); };
        img.src = entry.src;
      });
      sourceImages.set(entry.src, loading);
      if (sourceImages.size > 12) sourceImages.delete(sourceImages.keys().next().value);
    } else {
      const cached = sourceImages.get(entry.src);
      sourceImages.delete(entry.src);
      sourceImages.set(entry.src, cached);
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

  setupPicker();
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
