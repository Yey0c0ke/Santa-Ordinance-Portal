// ======================================================
//                 YEYO 💎
//      LGU PORTAL 16 • MAIN ENGINE
// ======================================================

// ======================================================
// CHAPTER DATA
// ======================================================

const chaptersData = [

{
number:"I",
title:"General Provisions",
image:"./phts/coverphoto.png",
file:"./chapters/chapter1/index.html",
keywords:[
"general",
"definitions",
"rules",
"construction",
"scope"
]
},

{
number:"II",
title:"Administrative Matters",
image:"./phts/coverphoto.png",
file:"./chapters/chapter2/index.html",
keywords:[
"administrative",
"government"
]
},

{
number:"III",
title:"Revenue and Taxation",
image:"./phts/coverphoto.png",
file:"./chapters/chapter3/index.html",
keywords:[
"tax",
"revenue",
"fees"
]
},

{
number:"IV",
title:"Public Safety",
image:"./phts/coverphoto.png",
file:"./chapters/chapter4/index.html",
keywords:[
"safety",
"emergency"
]
},

{
number:"V",
title:"Health and Sanitation",
image:"./phts/coverphoto.png",
file:"./chapters/chapter5/index.html",
keywords:[
"health",
"sanitation"
]
},

{
number:"VI",
title:"Environmental Management",
image:"./phts/coverphoto.png",
file:"./chapters/chapter6/index.html",
keywords:[
"environment",
"waste"
]
},

{
number:"VII",
title:"Business Regulations",
image:"./phts/coverphoto.png",
file:"./chapters/chapter7/index.html",
keywords:[
"business",
"permit"
]
},

{
number:"VIII",
title:"Traffic and Transportation",
image:"./phts/coverphoto.png",
file:"./chapters/chapter8/index.html",
keywords:[
"traffic",
"vehicle",
"parking"
]
},

{
number:"IX",
title:"Public Utilities",
image:"./phts/coverphoto.png",
file:"./chapters/chapter9/index.html",
keywords:[
"utilities",
"water"
]
},

{
number:"X",
title:"Penal Provisions",
image:"./phts/coverphoto.png",
file:"./chapters/chapter10/index.html",
keywords:[
"penalty",
"violation"
]
},

{
number:"XI",
title:"Final Provisions",
image:"./phts/coverphoto.png",
file:"./chapters/chapter11/index.html",
keywords:[
"final",
"effectivity"
]
}

];

// ======================================================
// ELEMENTS
// ======================================================

const chaptersTrack =
document.getElementById("chaptersTrack");

const searchInput =
document.getElementById("searchInput");

const loadingScreen =
document.getElementById("loadingScreen");

const currentYear =
document.getElementById("currentYear");

const navbar =
document.getElementById("navbar");

const scrollLeftButton =
document.getElementById("scrollLeft");

const scrollRightButton =
document.getElementById("scrollRight");

const aiButton =
document.getElementById("aiButton");

const floatingAi =
document.getElementById("floatingAi");

const aiPanel =
document.getElementById("aiPanel");

const closeAi =
document.getElementById("closeAi");

const sendAi =
document.getElementById("sendAi");

const aiInput =
document.getElementById("aiInput");

const aiMessages =
document.getElementById("aiMessages");

// ======================================================
// GLOBALS
// ======================================================

let isDragging = false;

let startX = 0;

let scrollStart = 0;

let activeIndex = 0;

let revealObserver;

let carouselTimeout;

// ======================================================
// INIT
// ======================================================

document.addEventListener(
"DOMContentLoaded",
()=>{

renderChapters(chaptersData);

initializeLoading();

initializeYear();

initializeNavbar();

initializeCarousel();

initializeSearch();

initializeAI();

initializeSuggestions();

initializeRevealAnimations();

initializeResizeHandler();

preloadCriticalImages();

}
);

// ======================================================
// RENDER CHAPTERS
// ======================================================

function renderChapters(chapters){

chaptersTrack.innerHTML = "";

chapters.forEach((chapter,index)=>{

const card =
document.createElement("a");

card.className =
"chapter-card glass";

card.href =
chapter.file;

card.dataset.index =
index;

card.innerHTML = `

<img
src="${chapter.image}"
class="chapter-image"
loading="lazy"
decoding="async"
onerror="this.src='./phts/coverphoto.png'"
>

<div class="chapter-overlay"></div>

<div class="chapter-content">

<div class="chapter-roman">
CHAPTER ${chapter.number}
</div>

<h2 class="chapter-title">
${chapter.title}
</h2>

</div>

`;

chaptersTrack.appendChild(card);

});

requestAnimationFrame(()=>{

chaptersTrack.scrollLeft = 0;

activeIndex = 0;

updateActiveCard();

});

}

// ======================================================
// CAROUSEL
// ======================================================

function initializeCarousel(){

if(!chaptersTrack) return;

// ARROWS

scrollRightButton?.addEventListener(
"click",
()=>{

goToCard(activeIndex + 1);

}
);

scrollLeftButton?.addEventListener(
"click",
()=>{

goToCard(activeIndex - 1);

}
);

// SCROLL

chaptersTrack.addEventListener(
"scroll",
handleCarouselScroll,
{
passive:true
}
);

// DRAG

chaptersTrack.addEventListener(
"mousedown",
startDrag
);

chaptersTrack.addEventListener(
"touchstart",
startDrag,
{
passive:true
}
);

window.addEventListener(
"mousemove",
dragMove,
{
passive:false
}
);

window.addEventListener(
"touchmove",
dragMove,
{
passive:false
}
);

window.addEventListener(
"mouseup",
endDrag
);

window.addEventListener(
"touchend",
endDrag
);

}

// ======================================================
// START DRAG
// ======================================================

function startDrag(event){

isDragging = true;

chaptersTrack.classList.add("dragging");

startX =
event.type.includes("mouse")
? event.pageX
: event.touches[0].clientX;

scrollStart =
chaptersTrack.scrollLeft;

}

// ======================================================
// DRAG MOVE
// ======================================================

function dragMove(event){

if(!isDragging) return;

event.preventDefault();

const currentX =
event.type.includes("mouse")
? event.pageX
: event.touches[0].clientX;

const movement =
(startX - currentX) * 1.04;

chaptersTrack.scrollLeft =
scrollStart + movement;

}

// ======================================================
// END DRAG
// ======================================================

function endDrag(){

if(!isDragging) return;

isDragging = false;

chaptersTrack.classList.remove("dragging");

snapToNearestCard();

}

// ======================================================
// HANDLE SCROLL
// ======================================================

function handleCarouselScroll(){

window.requestAnimationFrame(()=>{

detectActiveCard();

});

clearTimeout(carouselTimeout);

carouselTimeout =
setTimeout(()=>{

snapToNearestCard();

},120);

}

// ======================================================
// DETECT ACTIVE CARD
// ======================================================

function detectActiveCard(){

const cards =
document.querySelectorAll(".chapter-card");

if(!cards.length) return;

const trackCenter =
chaptersTrack.scrollLeft
+
(chaptersTrack.offsetWidth / 2);

let closestIndex = 0;

let closestDistance = Infinity;

cards.forEach((card,index)=>{

const cardCenter =
card.offsetLeft
+
(card.offsetWidth / 2);

const distance =
Math.abs(trackCenter - cardCenter);

if(distance < closestDistance){

closestDistance = distance;

closestIndex = index;

}

});

activeIndex = closestIndex;

updateActiveCard();

}

// ======================================================
// SNAP
// ======================================================

function snapToNearestCard(){

const cards =
document.querySelectorAll(".chapter-card");

if(!cards.length) return;

centerCard(cards[activeIndex]);

}

// ======================================================
// CENTER CARD
// ======================================================

function centerCard(card){

if(!card) return;

const targetPosition =

card.offsetLeft
-
(
(chaptersTrack.offsetWidth / 2)
-
(card.offsetWidth / 2)
);

chaptersTrack.scrollTo({

left:targetPosition,

behavior:"smooth"

});

}

// ======================================================
// GO TO CARD
// ======================================================

function goToCard(index){

const cards =
document.querySelectorAll(".chapter-card");

if(!cards.length) return;

activeIndex =
Math.max(
0,
Math.min(
index,
cards.length - 1
)
);

centerCard(cards[activeIndex]);

updateActiveCard();

}

// ======================================================
// UPDATE ACTIVE
// ======================================================

function updateActiveCard(){

const cards =
document.querySelectorAll(".chapter-card");

cards.forEach((card,index)=>{

card.classList.remove("active");

if(index === activeIndex){

card.classList.add("active");

}

});

}

// ======================================================
// SEARCH
// ======================================================

function initializeSearch(){

if(!searchInput) return;

searchInput.addEventListener(
"input",
debounce((event)=>{

const query =
event.target.value
.toLowerCase()
.trim();

if(query === ""){

renderChapters(chaptersData);

return;

}

const filtered =
chaptersData.filter((chapter)=>{

const titleMatch =
chapter.title
.toLowerCase()
.includes(query);

const keywordMatch =
chapter.keywords.some(
(keyword)=>
keyword.includes(query)
);

return (
titleMatch ||
keywordMatch
);

});

renderChapters(filtered);

},120)
);

}

// ======================================================
// DEBOUNCE
// ======================================================

function debounce(callback,delay=120){

let timeout;

return(...args)=>{

clearTimeout(timeout);

timeout = setTimeout(()=>{

callback(...args);

},delay);

};

}

// ======================================================
// LOADING
// ======================================================

function initializeLoading(){

window.addEventListener(
"load",
()=>{

setTimeout(()=>{

loadingScreen?.classList.add("hide");

},700);

}
);

}

// ======================================================
// YEAR
// ======================================================

function initializeYear(){

if(currentYear){

currentYear.textContent =
new Date().getFullYear();

}

}

// ======================================================
// NAVBAR
// ======================================================

function initializeNavbar(){

window.addEventListener(
"scroll",
()=>{

if(window.scrollY > 40){

navbar?.classList.add("scrolled");

}else{

navbar?.classList.remove("scrolled");

}

},
{
passive:true
}
);

}

// ======================================================
// AI PANEL
// ======================================================

function initializeAI(){

if(!aiPanel) return;

const openAI = ()=>{

aiPanel.classList.add("active");

document.body.style.overflow = "hidden";

setTimeout(()=>{

aiInput?.focus();

},120);

};

const closeAI = ()=>{

aiPanel.classList.remove("active");

document.body.style.overflow = "";

};

aiButton?.addEventListener(
"click",
openAI
);

floatingAi?.addEventListener(
"click",
openAI
);

closeAi?.addEventListener(
"click",
closeAI
);

document.addEventListener(
"click",
(event)=>{

const insidePanel =
aiPanel.contains(event.target)
||
floatingAi.contains(event.target)
||
aiButton.contains(event.target);

if(
!insidePanel
&&
aiPanel.classList.contains("active")
){

closeAI();

}

}
);

window.addEventListener(
"keydown",
(event)=>{

if(
event.key === "Escape"
&&
aiPanel.classList.contains("active")
){

closeAI();

}

}
);

sendAi?.addEventListener(
"click",
sendMessage
);

aiInput?.addEventListener(
"keydown",
(event)=>{

if(event.key === "Enter"){

sendMessage();

}

}
);

}

// ======================================================
// AI MESSAGE
// ======================================================

function sendMessage(){

const text =
aiInput.value.trim();

if(!text) return;

addMessage(text,"user");

aiInput.value = "";

setTimeout(()=>{

addMessage(
"LGU PORTAL 16 AI Assistant is active.",
"ai"
);

},300);

}

function addMessage(text,type){

const message =
document.createElement("div");

message.className =
`ai-message ${
type === "user"
? "ai-user"
: ""
}`;

message.innerHTML = text;

aiMessages.appendChild(message);

requestAnimationFrame(()=>{

aiMessages.scrollTop =
aiMessages.scrollHeight;

});

}

// ======================================================
// SUGGESTIONS
// ======================================================

function initializeSuggestions(){

document
.querySelectorAll(".suggestion-chip")
.forEach((chip)=>{

chip.addEventListener(
"click",
()=>{

aiInput.value =
chip.textContent.trim();

sendMessage();

}
);

});

}

// ======================================================
// REVEAL
// ======================================================

function initializeRevealAnimations(){

revealObserver =
new IntersectionObserver(

(entries)=>{

entries.forEach((entry)=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},
{
threshold:0.12
}

);

reinitializeRevealObserver();

}

function reinitializeRevealObserver(){

if(!revealObserver) return;

document
.querySelectorAll(
".chapter-card, .contacts-card"
)
.forEach((element)=>{

revealObserver.observe(element);

});

}

// ======================================================
// RESIZE
// ======================================================

function initializeResizeHandler(){

window.addEventListener(
"resize",
debounce(()=>{

snapToNearestCard();

},160)
);

}

// ======================================================
// PRELOAD
// ======================================================

function preloadCriticalImages(){

const images = [

"./phts/balayili.png",
"./phts/coverphoto.png",
"./phts/logo.png"

];

images.forEach((src)=>{

const image =
new Image();

image.src = src;

});

}

// ======================================================
// SMOOTH LINKS
// ======================================================

document
.querySelectorAll('a[href^="#"]')
.forEach((anchor)=>{

anchor.addEventListener(
"click",
(event)=>{

const targetId =
anchor.getAttribute("href");

const target =
document.querySelector(targetId);

if(!target) return;

event.preventDefault();

target.scrollIntoView({

behavior:"smooth",
block:"start"

});

}
);

});

// ======================================================
// PAGE TRANSITION
// ======================================================

document.addEventListener(
"click",
(event)=>{

const link =
event.target.closest("a");

if(
!link ||
link.target === "_blank" ||
link.href.includes("#")
) return;

event.preventDefault();

document.body.style.transition =
"opacity .28s ease";

document.body.style.opacity = "0";

setTimeout(()=>{

window.location.href =
link.href;

},240);

}
);

// ======================================================
// SYSTEM LOG
// ======================================================

console.log(`

========================================
LGU PORTAL 16 💎
FINAL IOS ENGINE ACTIVE
PREMIUM CAROUSEL ACTIVE
CENTER SNAP ACTIVE
MOBILE IOS ACTIVE
AI PANEL ACTIVE
========================================

`);

// ======================================================
// END SYSTEM
// ======================================================