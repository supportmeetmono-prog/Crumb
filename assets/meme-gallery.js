
/* Four official CRUMB images: accessible, swipeable gallery with PNG downloads. */
(function(){
"use strict";
const root=document.getElementById("crumbDownloads");
if(!root)return;
const track=root.querySelector("#galleryTrack");
const slides=Array.from(root.querySelectorAll(".gallery-slide"));
const dots=Array.from(root.querySelectorAll("[data-gallery-dot]"));
const labels={
en:{eyebrow:"FREE CRUMB DOWNLOADS",title:"OFFICIAL MEME GALLERY",intro:"Swipe left or right to preview all four images. Download your favorite for free.",artwork:"OFFICIAL FREE ARTWORK",download:"↓ DOWNLOAD PNG",saving:"PREPARING PNG…",error:"Image download failed. Please try again.",prev:"Previous image",next:"Next image",show:"Show artwork",image:"CRUMB artwork",region:"Swipe through CRUMB artwork"},
es:{eyebrow:"DESCARGAS GRATIS DE CRUMB",title:"GALERÍA OFICIAL DE MEMES",intro:"Desliza a los lados para ver las cuatro imágenes antes de descargar tu favorita gratis.",artwork:"ARTE OFICIAL GRATIS",download:"↓ DESCARGAR PNG",saving:"PREPARANDO PNG…",error:"No se pudo descargar la imagen. Inténtalo de nuevo.",prev:"Imagen anterior",next:"Imagen siguiente",show:"Mostrar imagen",image:"Imagen de CRUMB",region:"Galería de imágenes de CRUMB"},
it:{eyebrow:"DOWNLOAD GRATUITI DI CRUMB",title:"GALLERIA MEME UFFICIALE",intro:"Scorri a destra o sinistra per vedere tutte e quattro le immagini prima di scaricarle gratis.",artwork:"ARTE UFFICIALE GRATUITA",download:"↓ SCARICA PNG",saving:"PREPARAZIONE PNG…",error:"Download non riuscito. Riprova.",prev:"Immagine precedente",next:"Immagine successiva",show:"Mostra immagine",image:"Immagine CRUMB",region:"Galleria immagini CRUMB"},
pt:{eyebrow:"IMAGENS GRÁTIS DO CRUMB",title:"GALERIA OFICIAL DE MEMES",intro:"Deslize para os lados para visualizar as quatro imagens antes de baixar sua favorita gratuitamente.",artwork:"ARTE OFICIAL GRATUITA",download:"↓ BAIXAR PNG",saving:"PREPARANDO PNG…",error:"Não foi possível baixar a imagem. Tente novamente.",prev:"Imagem anterior",next:"Próxima imagem",show:"Mostrar imagem",image:"Arte do CRUMB",region:"Galeria de artes do CRUMB"},
fr:{eyebrow:"IMAGES CRUMB GRATUITES",title:"GALERIE OFFICIELLE DE MÈMES",intro:"Faites glisser pour voir les quatre images avant de télécharger gratuitement votre préférée.",artwork:"VISUEL OFFICIEL GRATUIT",download:"↓ TÉLÉCHARGER PNG",saving:"PRÉPARATION PNG…",error:"Téléchargement impossible. Réessayez.",prev:"Image précédente",next:"Image suivante",show:"Afficher l'image",image:"Image CRUMB",region:"Galerie CRUMB"},
zh:{eyebrow:"免费下载 CRUMB 图片",title:"官方表情包图库",intro:"左右滑动预览全部四张图片，选择喜欢的图片免费下载。",artwork:"免费官方图片",download:"↓ 下载 PNG",saving:"正在准备 PNG…",error:"下载失败，请重试。",prev:"上一张",next:"下一张",show:"显示图片",image:"CRUMB 图片",region:"CRUMB 图片库"},
hi:{eyebrow:"मुफ़्त CRUMB चित्र",title:"आधिकारिक मीम गैलरी",intro:"चारों चित्र देखने के लिए बाएँ या दाएँ स्वाइप करें, फिर अपना पसंदीदा चित्र मुफ़्त डाउनलोड करें।",artwork:"मुफ़्त आधिकारिक चित्र",download:"↓ PNG डाउनलोड करें",saving:"PNG तैयार हो रहा है…",error:"डाउनलोड विफल रहा। फिर प्रयास करें।",prev:"पिछला चित्र",next:"अगला चित्र",show:"चित्र दिखाएँ",image:"CRUMB चित्र",region:"CRUMB चित्र गैलरी"},
ar:{eyebrow:"صور CRUMB المجانية",title:"معرض الميمات الرسمي",intro:"اسحب يمينًا أو يسارًا لمشاهدة الصور الأربع قبل تنزيل صورتك المفضلة مجانًا.",artwork:"فن رسمي مجاني",download:"↓ تنزيل PNG",saving:"جار تجهيز PNG…",error:"تعذر تنزيل الصورة. حاول مجددًا.",prev:"الصورة السابقة",next:"الصورة التالية",show:"عرض الصورة",image:"صورة CRUMB",region:"معرض صور CRUMB"},
ru:{eyebrow:"БЕСПЛАТНЫЕ ИЗОБРАЖЕНИЯ CRUMB",title:"ОФИЦИАЛЬНАЯ ГАЛЕРЕЯ МЕМОВ",intro:"Листайте влево или вправо, чтобы увидеть все четыре изображения перед бесплатным скачиванием.",artwork:"БЕСПЛАТНЫЙ АРТ",download:"↓ СКАЧАТЬ PNG",saving:"ГОТОВИМ PNG…",error:"Не удалось скачать изображение. Попробуйте снова.",prev:"Предыдущее изображение",next:"Следующее изображение",show:"Показать изображение",image:"Изображение CRUMB",region:"Галерея CRUMB"}
};
function words(){const l=(document.documentElement.lang||"en").toLowerCase().split("-")[0];return labels[l]||labels.en;}
function updateLanguage(){
 const w=words();
 root.querySelectorAll("[data-gallery-i18n]").forEach(el=>{if(!el.disabled)el.textContent=w[el.dataset.galleryI18n]||"";});
 root.querySelector("#galleryPrev").setAttribute("aria-label",w.prev);
 root.querySelector("#galleryNext").setAttribute("aria-label",w.next);
 track.setAttribute("aria-label",w.region);
 slides.forEach((slide,i)=>{slide.setAttribute("aria-label",w.image+" "+(i+1)+" / 4");slide.querySelector("img").alt=w.image+" "+(i+1);});
 dots.forEach((dot,i)=>dot.setAttribute("aria-label",w.show+" "+(i+1)));
}
function active(){let n=0,best=Infinity;const origin=slides[0].offsetLeft;slides.forEach((el,i)=>{const d=Math.abs(el.offsetLeft-origin-track.scrollLeft);if(d<best){best=d;n=i;}});return n;}
function go(i){const n=(i+slides.length)%slides.length;track.scrollTo({left:slides[n].offsetLeft-slides[0].offsetLeft,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}
function redraw(){const n=active();root.querySelector("#galleryCounter").textContent=String(n+1).padStart(2,"0")+" / 04";dots.forEach((d,i)=>d.setAttribute("aria-current",String(n===i)));}
root.querySelector("#galleryPrev").addEventListener("click",()=>go(active()-1));
root.querySelector("#galleryNext").addEventListener("click",()=>go(active()+1));
dots.forEach((dot,i)=>dot.addEventListener("click",()=>go(i)));
track.addEventListener("scroll",redraw,{passive:true});
track.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();go(active()+(e.key==="ArrowRight"?1:-1));}});
window.addEventListener("resize",redraw);
const select=document.getElementById("lang");if(select)select.addEventListener("change",()=>requestAnimationFrame(updateLanguage));
new MutationObserver(updateLanguage).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
root.querySelectorAll("[data-image-download]").forEach(button=>button.addEventListener("click",async()=>{
 if(button.disabled)return;
 const w=words();button.disabled=true;button.textContent=w.saving;
 try{
   const img=button.closest(".gallery-slide").querySelector("img");
   const source=new Image();
   source.decoding="async";
   source.src=img.currentSrc||img.src;
   if(!source.complete||!source.naturalWidth)await new Promise((resolve,reject)=>{source.onload=resolve;source.onerror=reject;});
   if(!source.naturalWidth)throw Error("Image unavailable");
   const canvas=document.createElement("canvas");canvas.width=source.naturalWidth;canvas.height=source.naturalHeight;
   canvas.getContext("2d").drawImage(source,0,0);
   const png=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));
   if(!png)throw Error("PNG conversion failed");
   const url=URL.createObjectURL(png);
   const a=document.createElement("a");a.href=url;a.download="CRUMB-Message-"+button.dataset.imageDownload+".png";
   document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),15000);
 }catch(e){
   alert(words().error);
 }finally{
   button.disabled=false;button.textContent=words().download;
 }
}));
updateLanguage();redraw();
})();
