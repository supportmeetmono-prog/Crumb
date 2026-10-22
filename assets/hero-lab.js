
(function(){
'use strict';
const $ = (id)=>document.getElementById(id);
const canvas=$('character'),ctx=canvas.getContext('2d',{alpha:true});
const photo=$('crumbPhoto');
const fields=['style','outfit','eyewear','accessory','pose','background','caption'];
const choices={
style:[['speed','Velocity Flame'],['dark','Midnight Sentinel'],['cosmic','Galactic Wanderer'],['solar','Solar Guardian'],['thunder','Storm Bringer'],['tech','Circuit Defender'],['royal','Royal Legend'],['frost','Frost Walker']],
outfit:[['armor','Hero Armor'],['cape','Cape & Crest'],['dress','Royal Dress'],['hoodie','Street Hoodie'],['suit','Tailored Suit'],['robe','Mystic Robe'],['classic','Original Crumb']],
eyewear:[['shades','Dark Sunglasses'],['none','Original Eyes'],['round','Round Glasses'],['mask','Hero Mask'],['visor','Cyber Visor'],['cat','Cat-Eye Glasses']],
accessory:[['lightning','Energy Bolts'],['none','None'],['crown','Golden Crown'],['shield','Power Shield'],['wings','Wings'],['halo','Energy Halo'],['staff','Mystic Staff']],
pose:[['classic','Legendary Stance'],['charge','Power Charge'],['flight','Sky Flight']],
background:[['energy','Energy Chamber'],['galaxy','Galactic Night'],['city','Neon City'],['fire','Solar Inferno'],['thunder','Electric Storm'],['frost','Frozen Kingdom'],['royal','Royal Stage'],['none','Clean Dark']],
caption:[['none','No Caption'],['unbutterable','YOU CANNOT BUTTER A GOD'],['hero','CRUMB NEVER SURRENDERS'],['speed','BORN FOR SPEED'],['fire','FORGED AT LEVEL SIX'],['royalty','THE CROWN BELONGS TO CRUMB'],['power','SMALL CRUMB. BIG POWER.'],['legend','LEGENDS NEVER CRUMBLE'],['cosmic','BEYOND THE TOASTER'],['future','BUILT DIFFERENT. TOASTED FOREVER'],['community','100% COMMUNITY · 100% CRUMB']]
};
const captions={none:'',unbutterable:'YOU CANNOT BUTTER A GOD',hero:'CRUMB NEVER SURRENDERS',speed:'BORN FOR SPEED',fire:'FORGED AT LEVEL SIX',royalty:'THE CROWN BELONGS TO CRUMB',power:'SMALL CRUMB. BIG POWER.',legend:'LEGENDS NEVER CRUMBLE',cosmic:'BEYOND THE TOASTER',future:'BUILT DIFFERENT. TOASTED FOREVER',community:'100% COMMUNITY · 100% CRUMB'};
const colors={
speed:['#f55231','#ffbf58','#f9e4ba'],dark:['#27394c','#6ee5c0','#a9d4d2'],cosmic:['#5c4fc9','#e598ff','#c2b2ff'],solar:['#ca6019','#ffd875','#ffeed1'],thunder:['#226dba','#83efff','#d4f6ff'],tech:['#347c4c','#a1ff87','#caffd2'],royal:['#973c99','#f5b0e2','#ffdf8e'],frost:['#5e8eaa','#c7f3ff','#ffffff']};
const dictionaries={
en:{back:'← BACK TO CRUMB',title:'CRUMB HERO LAB',subtitle:'Build an original hero, a royal toast, or a cosmic legend. One CRUMB. Endless identities. Every creation stays yours to download — no prompts, no accounts, no random nonsense.',preview:'✦ LIVE CHARACTER PREVIEW',local:'PRIVATE · IN YOUR BROWSER',renderHint:'OFFICIAL CRUMB REFERENCE · CUSTOM OUTFITS',sticker:'⬇ STICKER · TRANSPARENT',post:'⬇ X POST · SQUARE',banner:'⬇ X BANNER · 3:1',vertical:'⬇ VERTICAL · 4:5',design:'✦ DESIGN YOUR CRUMB',free:'FREE · NO GENERATION FEES',create:'Make it legendary.',step:'7 CREATIVE CONTROLS',style:'01 · HERO ARCHETYPE',outfit:'02 · OUTFIT',eyewear:'03 · EYEWEAR',accessory:'04 · POWER & ACCESSORY',pose:'05 · DYNAMIC POSE',background:'06 · BACKGROUND',caption:'07 · APPROVED CAPTION ONLY',random:'⚡ GENERATE A NEW CRUMB',original:'ORIGINAL BY DESIGN.',originalDesc:'The base is the official CRUMB image, with layered original costumes and effects. Speed, shadow and thunder are hero archetypes — no copied logos or trademarked hero uniforms. This is a curated visual builder, not an AI image generator.',privacy:'No free-text captions. No public uploads. Your creations render locally in your browser and are not automatically posted online.',success:'Image downloaded!',error:'Image could not be generated. Please try again.'},
pt:{back:'← VOLTAR AO CRUMB',title:'LABORATÓRIO DE HERÓIS CRUMB',subtitle:'Monte um herói original, uma torrada da realeza ou uma lenda cósmica. Escolha roupas e acessórios e baixe as imagens — sem cadastro e sem frases livres.',preview:'✦ PRÉVIA AO VIVO',local:'PRIVADO · NO SEU NAVEGADOR',renderHint:'PERSONAGEM OFICIAL · ROUPAS ORIGINAIS',sticker:'⬇ FIGURINHA · TRANSPARENTE',post:'⬇ POST PARA X · QUADRADO',banner:'⬇ CAPA X · 3:1',vertical:'⬇ IMAGEM VERTICAL · 4:5',design:'✦ MONTE O SEU CRUMB',free:'GRÁTIS · SEM CUSTO POR GERAÇÃO',create:'Crie sua lenda.',step:'7 OPÇÕES DE CRIAÇÃO',style:'01 · TIPO DE HERÓI',outfit:'02 · ROUPA',eyewear:'03 · ÓCULOS',accessory:'04 · PODER OU ACESSÓRIO',pose:'05 · POSE',background:'06 · CENÁRIO',caption:'07 · FRASE APROVADA',random:'⚡ GERAR OUTRO CRUMB',original:'PERSONAGEM ORIGINAL.',originalDesc:'Usamos a imagem oficial do CRUMB com roupas e efeitos próprios. Os estilos de herói não copiam símbolos ou uniformes de marcas conhecidas. Este editor monta imagens por camadas; não é uma IA geradora.',privacy:'Sem frases livres ou envio público. A criação acontece no seu navegador e não é publicada automaticamente.',success:'Imagem baixada!',error:'Não foi possível gerar a imagem. Tente novamente.'},
es:{back:'← VOLVER A CRUMB',title:'LABORATORIO DE HÉROES CRUMB',subtitle:'Crea un héroe original, una tostada real o una leyenda cósmica. Sin texto libre, sin cuenta y con descargas.',preview:'✦ VISTA PREVIA',local:'PRIVADO · EN TU NAVEGADOR',renderHint:'CRUMB ORIGINAL · ESTILOS PROPIOS',sticker:'⬇ STICKER · TRANSPARENTE',post:'⬇ PUBLICACIÓN X · CUADRADA',banner:'⬇ PORTADA X · 3:1',vertical:'⬇ VERTICAL · 4:5',design:'✦ DISEÑA TU CRUMB',free:'GRATIS · SIN COSTE POR IMAGEN',create:'Crea tu leyenda.',step:'7 CONTROLES',style:'01 · TIPO DE HÉROE',outfit:'02 · ROPA',eyewear:'03 · GAFAS',accessory:'04 · PODER O ACCESORIO',pose:'05 · POSE',background:'06 · FONDO',caption:'07 · FRASE APROBADA',random:'⚡ OTRO CRUMB',original:'DISEÑO ORIGINAL.',originalDesc:'El personaje original con accesorios nuevos. No copiamos uniformes o símbolos de superhéroes famosos. No utiliza IA generativa.',privacy:'Sin texto libre ni publicación automática. Todo ocurre en el navegador.',success:'Imagen descargada!',error:'No se pudo generar la imagen.'},
it:{back:'← TORNA A CRUMB',title:'CRUMB HERO LAB',subtitle:'Crea il tuo CRUMB eroico o regale con abiti, poteri e accessori originali. Nessun testo libero.',preview:'✦ ANTEPRIMA DAL VIVO',local:'PRIVATO · NEL BROWSER',renderHint:'CRUMB ORIGINALE · NUOVI ABITI',sticker:'⬇ ADESIVO · TRASPARENTE',post:'⬇ POST X · QUADRATO',banner:'⬇ BANNER X · 3:1',vertical:'⬇ VERTICALE · 4:5',design:'✦ CREA IL TUO CRUMB',free:'GRATUITO',create:'Crea una leggenda.',step:'7 CONTROLLI',style:'01 · STILE EROE',outfit:'02 · ABITO',eyewear:'03 · OCCHIALI',accessory:'04 · POTERE / ACCESSORIO',pose:'05 · POSA',background:'06 · SFONDO',caption:'07 · FRASE APPROVATA',random:'⚡ NUOVO CRUMB',original:'DESIGN ORIGINALE.',originalDesc:'Il personaggio CRUMB con costumi ed effetti originali. Non copia simboli o uniformi di eroi famosi.',privacy:'Nessun testo libero e nessun caricamento pubblico. La creazione resta nel browser.',success:'Immagine scaricata!',error:'Impossibile generare l’immagine.'},
fr:{back:'← RETOUR À CRUMB',title:'ATELIER DES HÉROS CRUMB',subtitle:'Créez un héros CRUMB original avec des tenues, accessoires et décors. Pas de texte libre.',preview:'✦ APERÇU EN DIRECT',local:'PRIVÉ · DANS VOTRE NAVIGATEUR',renderHint:'CRUMB ORIGINAL · COSTUMES UNIQUES',sticker:'⬇ STICKER · TRANSPARENT',post:'⬇ POST X · CARRÉ',banner:'⬇ BANNIÈRE X · 3:1',vertical:'⬇ VERTICAL · 4:5',design:'✦ CRÉEZ VOTRE CRUMB',free:'GRATUIT',create:'Créez votre légende.',step:'7 OPTIONS',style:'01 · TYPE DE HÉROS',outfit:'02 · TENUE',eyewear:'03 · LUNETTES',accessory:'04 · POUVOIR',pose:'05 · POSE',background:'06 · DÉCOR',caption:'07 · PHRASE APPROUVÉE',random:'⚡ NOUVEAU CRUMB',original:'CRÉATION ORIGINALE.',originalDesc:'Le CRUMB original reçoit des tenues uniques. Aucun symbole ou costume célèbre n’est copié.',privacy:'Pas de texte libre ni de publication automatique. Tout reste dans le navigateur.',success:'Image enregistrée !',error:'Impossible de créer l’image.'},
zh:{back:'← 返回 CRUMB',title:'CRUMB 英雄实验室',subtitle:'打造原创 CRUMB 英雄！选择服装、眼镜、动作与背景，不开放自由输入文字。',preview:'✦ 实时预览',local:'仅在浏览器中处理',renderHint:'官方 CRUMB 形象 · 原创装扮',sticker:'⬇ 透明贴纸',post:'⬇ X 正方形图片',banner:'⬇ X 横幅 · 3:1',vertical:'⬇ 竖版 · 4:5',design:'✦ 设计你的 CRUMB',free:'免费 · 无生成费用',create:'打造传奇。',step:'7 项设计选项',style:'01 · 英雄类型',outfit:'02 · 服装',eyewear:'03 · 眼镜',accessory:'04 · 超能力和配件',pose:'05 · 姿势',background:'06 · 背景',caption:'07 · 已审核文案',random:'⚡ 换一个 CRUMB',original:'原创设计。',originalDesc:'以 CRUMB 原始形象搭配原创配件，不复制知名英雄的标识或服装。不是 AI 图像生成。',privacy:'没有自由输入或自动公开分享。所有处理在浏览器中完成。',success:'图片已下载！',error:'图片生成失败。'},
hi:{back:'← CRUMB पर वापस',title:'CRUMB हीरो लैब',subtitle:'मूल CRUMB के लिए अपना हीरो लुक बनाएँ। कपड़े, चश्मे और बैकग्राउंड चुनें — बिना खुले टेक्स्ट के।',preview:'✦ लाइव प्रीव्यू',local:'आपके ब्राउज़र में निजी',renderHint:'मूल CRUMB · नए कॉस्ट्यूम',sticker:'⬇ पारदर्शी स्टिकर',post:'⬇ X स्क्वायर पोस्ट',banner:'⬇ X बैनर · 3:1',vertical:'⬇ वर्टिकल · 4:5',design:'✦ अपना CRUMB बनाएँ',free:'बिल्कुल मुफ़्त',create:'अपनी कहानी बनाएँ।',step:'7 विकल्प',style:'01 · हीरो शैली',outfit:'02 · कपड़े',eyewear:'03 · चश्मा',accessory:'04 · शक्ति',pose:'05 · पोज़',background:'06 · बैकग्राउंड',caption:'07 · स्वीकृत कैप्शन',random:'⚡ नया CRUMB',original:'मूल डिजाइन।',originalDesc:'मूल CRUMB के साथ नए कॉस्ट्यूम और प्रभाव। प्रसिद्ध नायकों के प्रतीक कॉपी नहीं किए जाते।',privacy:'खुला टेक्स्ट नहीं और स्वतः साझा नहीं होता। सब कुछ आपके ब्राउज़र में रहता है।',success:'चित्र डाउनलोड हुआ!',error:'चित्र बनाने में समस्या हुई।'},
ar:{back:'← العودة إلى CRUMB',title:'مختبر أبطال CRUMB',subtitle:'اصنع نسخة بطولية أصلية من CRUMB بالملابس والنظارات والخلفيات. دون كتابة نصوص حرة.',preview:'✦ معاينة مباشرة',local:'خاص · داخل المتصفح',renderHint:'شخصية CRUMB الأصلية · أزياء جديدة',sticker:'⬇ ملصق شفاف',post:'⬇ صورة X مربعة',banner:'⬇ غلاف X · 3:1',vertical:'⬇ صورة عمودية · 4:5',design:'✦ صمم CRUMB',free:'مجاني',create:'اصنع أسطورتك.',step:'7 خيارات',style:'01 · نوع البطل',outfit:'02 · الملابس',eyewear:'03 · النظارات',accessory:'04 · القوة أو الإكسسوار',pose:'05 · الوضعية',background:'06 · الخلفية',caption:'07 · عبارة معتمدة',random:'⚡ CRUMB جديد',original:'تصميم أصلي.',originalDesc:'نعتمد صورة CRUMB الأصلية مع أزياء جديدة دون نسخ شعارات الأبطال المعروفين.',privacy:'لا نصوص حرة ولا نشر تلقائي. كل شيء يحدث في المتصفح.',success:'تم تنزيل الصورة!',error:'تعذر إنشاء الصورة.'},
ru:{back:'← НАЗАД К CRUMB',title:'ЛАБОРАТОРИЯ ГЕРОЕВ CRUMB',subtitle:'Создайте оригинального героя CRUMB. Костюмы, очки, позы и фоны — без свободного текста.',preview:'✦ ПРЕДПРОСМОТР',local:'ЛОКАЛЬНО · В БРАУЗЕРЕ',renderHint:'ОРИГИНАЛЬНЫЙ CRUMB · НОВЫЕ КОСТЮМЫ',sticker:'⬇ СТИКЕР · ПРОЗРАЧНЫЙ',post:'⬇ ПОСТ X · КВАДРАТ',banner:'⬇ БАННЕР X · 3:1',vertical:'⬇ ВЕРТИКАЛЬ · 4:5',design:'✦ СОЗДАЙТЕ CRUMB',free:'БЕСПЛАТНО',create:'Создайте легенду.',step:'7 ПАРАМЕТРОВ',style:'01 · ТИП ГЕРОЯ',outfit:'02 · ОДЕЖДА',eyewear:'03 · ОЧКИ',accessory:'04 · СПОСОБНОСТЬ',pose:'05 · ПОЗА',background:'06 · ФОН',caption:'07 · ОДОБРЕННАЯ ФРАЗА',random:'⚡ НОВЫЙ CRUMB',original:'ОРИГИНАЛЬНЫЙ ОБРАЗ.',originalDesc:'Оригинальная фотография CRUMB дополняется новыми костюмами. Логотипы известных супергероев не копируются.',privacy:'Нет произвольных фраз и автоматических публикаций. Создание происходит в браузере.',success:'Изображение сохранено!',error:'Не удалось создать изображение.'}
};
let activeLang='en';
try{const query=new URLSearchParams(location.search).get('lang');const saved=localStorage.getItem('crumb_hero_lang');activeLang=dictionaries[query]?query:dictionaries[saved]?saved:'en'}catch(e){}
function localize(){
 const d=dictionaries[activeLang]||dictionaries.en;
 document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=d[el.dataset.t]||dictionaries.en[el.dataset.t]||el.textContent});
 document.documentElement.lang=activeLang==='pt'?'pt-BR':activeLang;
}
fields.forEach(k=>{const el=$(k);choices[k].forEach(pair=>{const o=document.createElement('option');o.value=pair[0];o.textContent=pair[1];el.append(o)});el.addEventListener('change',renderPreview)});
$('language').value=activeLang;
$('language').addEventListener('change',e=>{activeLang=e.target.value;try{localStorage.setItem('crumb_hero_lang',activeLang)}catch(_){}localize()});
localize();
const artColors=()=>colors[$('style').value]||colors.speed;
function randSeed(){let s=2166136261;fields.forEach(key=>{const v=$(key).value;for(let j=0;j<v.length;j++){s^=v.charCodeAt(j);s=Math.imul(s,16777619)}});return s>>>0}
function randomUnit(seed){seed=(Math.imul(seed^seed>>>15,1|seed))>>>0;seed=(Math.imul(seed^seed>>>7,61|seed))>>>0;return ((seed^seed>>>14)>>>0)/4294967296}
function roundRect(c,x,y,w,h,r,fill){c.beginPath();c.roundRect(x,y,w,h,r);if(fill)c.fill();else c.stroke()}
function traceCrumb(c){
 c.beginPath();c.moveTo(171,180);
 c.bezierCurveTo(158,159,173,136,203,125);
 c.bezierCurveTo(234,105,263,103,291,113);
 c.bezierCurveTo(313,112,347,121,364,136);
 c.bezierCurveTo(389,139,398,157,408,181);
 c.bezierCurveTo(417,201,434,234,443,258);
 c.bezierCurveTo(454,281,463,314,450,338);
 c.bezierCurveTo(449,360,420,369,391,375);
 c.bezierCurveTo(368,384,325,385,300,383);
 c.bezierCurveTo(269,382,206,378,180,370);
 c.bezierCurveTo(159,361,168,335,168,305);
 c.bezierCurveTo(167,269,174,230,171,180);c.closePath();
 // Thin legs form part of the alpha mask, not the photographic background.
 c.moveTo(236,367);c.lineTo(264,370);c.lineTo(251,412);c.lineTo(239,447);c.lineTo(238,470);c.lineTo(233,527);c.lineTo(225,542);c.lineTo(220,530);c.lineTo(227,473);c.lineTo(234,438);c.lineTo(236,367);c.closePath();
 c.moveTo(349,372);c.lineTo(368,367);c.lineTo(376,405);c.lineTo(384,448);c.lineTo(374,528);c.lineTo(363,537);c.lineTo(363,523);c.lineTo(371,453);c.lineTo(361,405);c.lineTo(349,372);c.closePath();
}
function polygon(c,points,color){c.fillStyle=color;c.beginPath();points.forEach((p,i)=>{if(i===0)c.moveTo(p[0],p[1]);else c.lineTo(p[0],p[1])});c.closePath();c.fill()}
function polyStroke(c,points,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.beginPath();points.forEach((p,i)=>{if(i===0)c.moveTo(p[0],p[1]);else c.lineTo(p[0],p[1])});c.stroke()}
function drawBackground(c,w,h,mode,palette,seed){
 const [primary,secondary,bright]=palette;
 if(mode==='sticker')return;
 const type=$('background').value;
 let bg=c.createLinearGradient(0,0,w,h);
 const start=(type==='royal')?'#1d1226':(type==='frost')?'#13242c':'#080a0f';
 const end=(type==='fire')?'#33130d':(type==='galaxy')?'#17102d':'#20110b';
 bg.addColorStop(0,start);bg.addColorStop(1,end);c.fillStyle=bg;c.fillRect(0,0,w,h);
 const R=Math.min(w,h);
 const g=c.createRadialGradient(w*.51,h*.49,R*.07,w*.51,h*.49,R*.7);
 g.addColorStop(0,secondary+'65');g.addColorStop(.45,primary+'34');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,w,h);
 c.save();
 c.strokeStyle=secondary+'45';c.lineWidth=Math.max(2,R/240);
 if(type==='energy'||type==='thunder'){for(let i=0;i<7;i++){c.beginPath();c.arc(w*.5,h*.48,R*(.22+i*.065),-Math.PI*.72,Math.PI*.72);c.stroke()}}
 if(type==='city'||type==='royal'){
  c.fillStyle='#080b11c7';
  for(let i=0;i<22;i++){const bw=w/22+2;const height=h*(.13+.3*randomUnit(seed+i*31));const x=i*(w/22);c.fillRect(x,h-height,bw,height)}
  c.fillStyle=secondary+'70';for(let i=0;i<85;i++){const x=randomUnit(seed+i*97)*w;const y=h*.6+randomUnit(seed+i*103)*h*.4;c.fillRect(x,y,2,5)}
 }
 if(type==='galaxy'||type==='frost'||type==='none'){
  for(let i=0;i<100;i++){const x=randomUnit(seed+i*919)*w,y=randomUnit(seed+i*601)*h;c.globalAlpha=.18+.65*randomUnit(seed+i*513);c.fillStyle=i%4===0?secondary:'#fff7e4';c.beginPath();c.arc(x,y,R*(i%12===0?.005:.0013),0,Math.PI*2);c.fill()}c.globalAlpha=1;
 }
 if(type==='fire'||type==='thunder'||type==='frost'){
  for(let i=0;i<13;i++){const x=randomUnit(seed+i*151)*w,y=randomUnit(seed+i*73)*h;polyStroke(c,[[x,y],[x+R*.045,y-R*.09],[x+R*.01,y-R*.02],[x+R*.065,y-R*.14]],secondary+'80',Math.max(2,R/250))}
 }
 if(type==='none'){c.strokeStyle='#90682a55';c.strokeRect(R*.04,R*.04,w-R*.08,h-R*.08)}
 c.restore();
 const vign=c.createRadialGradient(w/2,h/2,R*.15,w/2,h/2,Math.max(w,h)*.8);vign.addColorStop(0,'#00000000');vign.addColorStop(1,'#000000aa');c.fillStyle=vign;c.fillRect(0,0,w,h);
}
function energy(c,palette,seed){
 const [primary,secondary]=palette;
 c.save();
 c.strokeStyle=secondary;c.lineWidth=4;c.globalAlpha=.55;c.shadowColor=secondary;c.shadowBlur=18;
 c.beginPath();c.ellipse(310,330,220,270,-.11,0,Math.PI*2);c.stroke();
 for(let i=0;i<18;i++){
  const a=(Math.PI*2*i/18)+randomUnit(seed+i)*.3;const x=310+Math.cos(a)*225,y=320+Math.sin(a)*285;
  c.fillStyle=i%2?secondary:primary;c.globalAlpha=.5+randomUnit(seed+i+20)*.35;c.beginPath();c.arc(x,y,2+randomUnit(seed+i+40)*4,0,Math.PI*2);c.fill()
 }
 c.restore();
}
function behind(c,palette){
 const [primary,secondary]=palette;
 const accessory=$('accessory').value,outfit=$('outfit').value;
 c.save();
 if(outfit==='cape'||outfit==='robe'||outfit==='suit'||outfit==='armor'){
  const g=c.createLinearGradient(175,185,460,515);g.addColorStop(0,primary);g.addColorStop(.6,'#140b23');g.addColorStop(1,secondary);
  polygon(c,[[193,274],[126,316],[62,519],[193,485],[422,491],[528,529],[474,320],[398,267]],g);
  polyStroke(c,[[62,519],[193,485],[422,491],[528,529]],secondary+'a1',5);
 }
 if(accessory==='wings'){
  c.shadowColor=secondary;c.shadowBlur=12;
  polygon(c,[[220,255],[103,170],[62,193],[117,281],[32,245],[83,344],[24,358],[189,405]],primary+'cf');
  polygon(c,[[398,254],[503,168],[545,188],[486,287],[560,250],[515,354],[576,361],[434,405]],primary+'cf');
  polyStroke(c,[[32,358],[180,401],[220,255]],secondary,8);polyStroke(c,[[575,361],[437,400],[399,255]],secondary,8)
 }
 c.restore()
}
function outfit(c,palette){
 const [primary,secondary,bright]=palette;const outfit=$('outfit').value;
 if(outfit==='classic')return;
 c.save();
 c.shadowColor='#000000aa';c.shadowBlur=9;
 const fill=c.createLinearGradient(210,258,430,380);fill.addColorStop(0,secondary+'d9');fill.addColorStop(.34,primary+'ed');fill.addColorStop(.8,'#10101bef');fill.addColorStop(1,secondary+'e3');
 const base=[[205,281],[254,265],[293,295],[322,294],[375,269],[426,280],[422,355],[382,375],[243,369],[201,358]];
 if(outfit==='dress'){
  polygon(c,[[252,301],[373,301],[394,357],[456,450],[174,450],[231,358]],fill);
  polygon(c,[[249,307],[309,333],[372,307],[355,364],[260,367]],primary+'c9');
  for(let x=206;x<441;x+=15)polyStroke(c,[[312,358],[x,446]],secondary+'55',1.8);
  polyStroke(c,[[240,329],[384,329]],'#ffdaed',4);
  c.fillStyle=bright;c.beginPath();c.arc(311,328,10,0,Math.PI*2);c.fill()
 }else if(outfit==='hoodie'){
  polygon(c,base,fill);polyStroke(c,[[234,277],[310,336],[393,282]],bright,9);
  polyStroke(c,[[307,333],[301,357]],'#fce8bd',2);polyStroke(c,[[322,333],[325,359]],'#fce8bd',2);
  roundRect(c,260,337,107,23,12,true)
 }else if(outfit==='robe'){
  polygon(c,[[248,270],[370,270],[427,360],[442,457],[180,457],[208,357]],fill);
  polyStroke(c,[[300,283],[295,458]],secondary,11);polyStroke(c,[[340,283],[345,458]],secondary,11);
  polygon(c,[[310,315],[333,351],[314,381],[293,349]],bright)
 }else if(outfit==='suit'){
  polygon(c,base,fill);
  polygon(c,[[275,281],[310,344],[320,306]],'#faecc8');
  polygon(c,[[359,280],[321,343],[322,307]],'#faecc8');
  polygon(c,[[311,302],[317,316],[312,357],[301,316]],'#0b0c14');polygon(c,[[317,316],[325,316],[337,352],[312,358]],secondary);
  roundRect(c,368,339,25,8,3,true)
 }else{
  polygon(c,base,fill);
  polygon(c,[[214,287],[255,266],[291,291],[288,348],[231,359]],primary);
  polygon(c,[[412,287],[371,266],[338,291],[341,348],[393,359]],primary);
  polyStroke(c,[[231,359],[310,345],[394,359]],secondary,7);
  polygon(c,[[298,294],[323,294],[329,325],[310,341],[292,324]],'#17171e');
  c.fillStyle=secondary;c.strokeStyle=bright;c.lineWidth=3;c.beginPath();c.arc(310,311,14,0,Math.PI*2);c.fill();c.stroke();
  c.fillStyle='#141012';c.textAlign='center';c.font='900 16px Cinzel,serif';c.fillText('C',310,317)
 }
 c.restore()
}
function eyewear(c,palette){
 const type=$('eyewear').value;if(type==='none')return;
 const [primary,secondary]=palette;c.save();c.shadowColor='#000d';c.shadowBlur=5;
 const eyes=[[276,258],[372,271]];
 if(type==='mask'){
  polygon(c,[[237,243],[285,236],[320,249],[359,249],[403,260],[400,294],[356,303],[317,278],[280,287],[238,278]],'#0b0f1ce0');
  polyStroke(c,[[238,243],[319,250],[403,260]],secondary,4);
  eyes.forEach(([x,y])=>{c.fillStyle='#b7f8fd7a';c.beginPath();c.ellipse(x,y,22,12,.1,0,Math.PI*2);c.fill()})
 }else if(type==='visor'){
  polygon(c,[[223,243],[412,257],[401,294],[221,279]],'#030712e8');
  polyStroke(c,[[222,245],[411,259]],secondary,5);
  polyStroke(c,[[243,267],[384,277]],'#ffffff70',3)
 }else{
  eyes.forEach(([x,y],i)=>{
   c.fillStyle=type==='shades'?'#06080edb':type==='cat'?'#3a1034ca':'#1320279c';
   c.strokeStyle=type==='cat'?secondary:secondary;c.lineWidth=5;
   c.beginPath();if(type==='cat'){c.moveTo(x-27,y-11);c.lineTo(x+23,y-14);c.lineTo(x+24,y+13);c.quadraticCurveTo(x,y+26,x-22,y+12);c.closePath()}else c.ellipse(x,y,27,19,i?.13:-.07,0,Math.PI*2);
   c.fill();c.stroke();
   polyStroke(c,[[x-15,y-9],[x+4,y-13]],'#ffffff94',2.5)
  });polyStroke(c,[[301,256],[332,259]],secondary,5);polyStroke(c,[[247,257],[222,254]],secondary,4);polyStroke(c,[[400,271],[419,272]],secondary,4)
 }
 c.restore()
}
function accessory(c,palette){
 const a=$('accessory').value;const [primary,secondary,bright]=palette;c.save();
 if(a==='crown'){
  c.shadowColor=secondary;c.shadowBlur=14;
  polygon(c,[[208,139],[217,82],[254,113],[299,56],[326,105],[377,68],[403,124],[418,111],[404,165],[216,162]],'#c98524');
  polyStroke(c,[[215,150],[408,154]],'#fff2a7',9);
  [249,311,364].forEach((x,i)=>{c.fillStyle=i===1?'#f9ab6e':secondary;c.beginPath();c.arc(x,140,9,0,Math.PI*2);c.fill()})
 }
 if(a==='shield'){
  c.shadowColor='#000b';c.shadowBlur=14;
  polygon(c,[[172,314],[253,335],[240,424],[191,463],[143,418],[134,333]],'#202632');
  polyStroke(c,[[172,314],[253,335],[240,424],[191,463],[143,418],[134,333],[172,314]],secondary,9);
  c.fillStyle=bright;c.textAlign='center';c.font='900 50px Cinzel,serif';c.fillText('C',191,409)
 }
 if(a==='staff'){polyStroke(c,[[460,210],[487,532]],'#bd8b4d',13);c.fillStyle=secondary;c.shadowColor=secondary;c.shadowBlur=19;c.beginPath();c.arc(459,199,30,0,Math.PI*2);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(453,192,7,0,Math.PI*2);c.fill()}
 if(a==='lightning'){c.shadowColor=secondary;c.shadowBlur=19;polygon(c,[[469,169],[417,279],[467,274],[432,389],[542,234],[482,252],[515,169]],secondary);polyStroke(c,[[464,187],[435,277],[468,273],[435,365]],bright,6)}
 if(a==='halo'){c.strokeStyle=secondary;c.lineWidth=11;c.shadowColor=secondary;c.shadowBlur=22;c.beginPath();c.ellipse(310,92,113,20,0,0,Math.PI*2);c.stroke()}
 c.restore()
}
function drawCaption(c,w,h,mode){
 const quote=captions[$('caption').value];if(!quote||mode==='sticker')return;
 const S=Math.min(w,h);const fontSize=Math.max(25,Math.min(51,S*.055));const margin=Math.min(75,S*.07);
 c.save();c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.font='900 '+fontSize+'px Impact,Arial Black,Inter,sans-serif';c.lineWidth=Math.max(5,fontSize*.15);c.strokeStyle='#05080fe6';c.fillStyle='#fff5db';c.shadowColor='#000b';c.shadowBlur=8;
 const words=quote.split(/\s+/),maxWidth=w-margin*2;const lines=[],one=[];
 for(const word of words){const test=[...one,word].join(' ');if(c.measureText(test).width>maxWidth&&one.length){lines.push(one.join(' '));one.length=0}one.push(word)}if(one.length)lines.push(one.join(' '));
 const y0=h-(lines.length*fontSize*1.1+margin);
 lines.forEach((line,i)=>{let yy=y0+i*fontSize*1.1;c.strokeText(line,w/2,yy,maxWidth);c.fillText(line,w/2,yy,maxWidth)});c.restore()
}
function render(c,w,h,mode){
 c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,w,h);
 const seed=randSeed(),palette=artColors();drawBackground(c,w,h,mode,palette,seed);
 const size=Math.min(w,h);const scale=size/1000*1.62;
 c.save();c.translate(w/2,h/2-(mode==='banner'?0:size*.04));c.scale(scale,scale);
 const pose=$('pose').value;
 if(pose==='charge')c.rotate(-.13);
 if(pose==='flight')c.rotate(-.45);
 c.translate(-310,-314);
 energy(c,palette,seed);
 behind(c,palette);
 c.save();
 c.shadowColor=palette[1];c.shadowBlur=30;
 c.fillStyle='#241309';traceCrumb(c);c.fill();c.restore();
 c.save();traceCrumb(c);c.clip();
 if(photo.complete&&photo.naturalWidth>0)c.drawImage(photo,0,0,600,600);
 else{c.fillStyle='#a95b18';c.fillRect(160,100,300,450)}
 c.restore();
 outfit(c,palette);eyewear(c,palette);accessory(c,palette);
 c.restore();
 if(mode!=='sticker'){
  c.save();c.fillStyle='#ffcc88c9';c.font='bold '+Math.round(Math.max(12,size*.021))+'px "JetBrains Mono",monospace';c.textAlign='left';c.fillText('CRUMB HERO LAB / $CRUMB',Math.max(16,size*.035),Math.max(22,size*.055));
  c.textAlign='right';c.fillText('#'+seed.toString(16).toUpperCase().padStart(8,'0'),w-Math.max(16,size*.035),Math.max(22,size*.055));c.restore()
 }
 drawCaption(c,w,h,mode)
}
function renderPreview(){
 const hash=randSeed();$('designCode').textContent='#CRUMB-'+hash.toString(16).toUpperCase().padStart(8,'0');
 $('combos').textContent='8 × 7 × 6 × 7 × 3 × 8 × 11 = 620,928 ORIGINAL COMBINATIONS';
 if(photo.complete&&photo.naturalWidth){render(ctx,canvas.width,canvas.height,'square')}
}
photo.addEventListener('load',renderPreview);photo.addEventListener('error',()=>{$('designCode').textContent='IMAGE LOAD ERROR'});
function toast(message){let t=document.querySelector('.toast');if(t)t.remove();t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=message;document.body.append(t);setTimeout(()=>{if(t.isConnected)t.remove()},3300)}
let working=false;
function download(kind,w,h){
 if(working)return;working=true;const b=$(kind);const old=b.disabled;b.disabled=true;
 try{
  const out=document.createElement('canvas');out.width=w;out.height=h;const o=out.getContext('2d',{alpha:true});
  render(o,w,h,kind==='sticker'?'sticker':kind);
  const link=document.createElement('a');link.download='CRUMB-'+$('style').value+'-'+kind+'-'+randSeed().toString(16)+'.png';link.href=out.toDataURL('image/png');document.body.append(link);link.click();link.remove();
  toast((dictionaries[activeLang]||dictionaries.en).success)
 }catch(e){console.error('CRUMB export failure',e);toast((dictionaries[activeLang]||dictionaries.en).error)}
 finally{working=false;b.disabled=old}
}
$('sticker').addEventListener('click',()=>download('sticker',512,512));
$('post').addEventListener('click',()=>download('post',1200,1200));
$('banner').addEventListener('click',()=>download('banner',1500,500));
$('vertical').addEventListener('click',()=>download('vertical',1080,1350));
$('shuffle').addEventListener('click',()=>{
 const before=fields.map(k=>$(k).value).join('|');
 for(let attempts=0;attempts<5;attempts++){fields.forEach(k=>{const arr=choices[k];$(k).value=arr[Math.floor(Math.random()*arr.length)][0]});if(fields.map(k=>$(k).value).join('|')!==before)break}
 renderPreview()
});
renderPreview();
})();
