// ======================================================
//                 YEYO 💎
//     LGU PORTAL 16 • IOS SYSTEM ENGINE
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

const scrollLeft =
document.getElementById("scrollLeft");

const scrollRight =
document.getElementById("scrollRight");

const navbar =
document.getElementById("navbar");

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

let carouselCardWidth = 0;

let isDragging = false;

let startX = 0;

let scrollLeftStart = 0;

let activeIndex = 0;

let revealObserver;

let scrollTimeout;

// ======================================================
// INIT
// ======================================================

document.addEventListener(
"DOMContentLoaded",
()=>{

renderChapters(chaptersData);

initializeSearch();

initializeLoading();

initializeYear();

initializeNavbar();

initializeCarousel();

initializeAI();

initializeSuggestions();

initializeRevealAnimations();

initializeResizeHandler();

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
"chapter-card glass semantic-card";

card.href =
chapter.file;

card.setAttribute(
"data-index",
index
);

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

updateCarouselMetrics();

updateActiveCard();

reinitializeRevealObserver();

}

// ======================================================
// UPDATE METRICS
// ======================================================

function updateCarouselMetrics(){

const firstCard =
document.querySelector(".chapter-card");

if(!firstCard){

carouselCardWidth = 340;

return;
}

const style =
window.getComputedStyle(chaptersTrack);

const gap =
parseFloat(style.gap || 24);

carouselCardWidth =
firstCard.offsetWidth + gap;

}

// ======================================================
// IOS CAROUSEL
// ======================================================

function initializeCarousel(){

if(!chaptersTrack) return;

scrollRight.addEventListener(
"click",
()=>{

goToCard(activeIndex + 1);

}
);

scrollLeft.addEventListener(
"click",
()=>{

goToCard(activeIndex - 1);

}
);

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
// DRAG START
// ======================================================

function startDrag(event){

isDragging = true;

chaptersTrack.classList.add("dragging");

startX =
event.type.includes("mouse")
? event.pageX
: event.touches[0].clientX;

scrollLeftStart =
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

const walk =
(startX - currentX) * 1.05;

chaptersTrack.scrollLeft =
scrollLeftStart + walk;

}

// ======================================================
// DRAG END
// ======================================================

function endDrag(){

if(!isDragging) return;

isDragging = false;

chaptersTrack.classList.remove("dragging");

snapToNearestCard();

}

// ======================================================
// SCROLL
// ======================================================

function handleCarouselScroll(){

window.requestAnimationFrame(()=>{

updateActiveCard();

});

clearTimeout(scrollTimeout);

scrollTimeout =
setTimeout(()=>{

snapToNearestCard();

},120);

}

// ======================================================
// SNAP
// ======================================================

function snapToNearestCard(){

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

centerCard(cards[activeIndex]);

}

// ======================================================
// CENTER CARD
// ======================================================

function centerCard(card){

if(!card) return;

const targetScroll =
card.offsetLeft
-
(
(chaptersTrack.offsetWidth / 2)
-
(card.offsetWidth / 2)
);

chaptersTrack.scrollTo({

left:targetScroll,

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
// ACTIVE CARD
// ======================================================

function updateActiveCard(){

const cards =
document.querySelectorAll(".chapter-card");

if(!cards.length) return;

cards.forEach((card)=>{

card.classList.remove("active");

});

const activeCard =
cards[activeIndex];

if(activeCard){

activeCard.classList.add("active");

}

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

loadingScreen.classList.add("hide");

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

navbar.classList.add("scrolled");

}else{

navbar.classList.remove("scrolled");

}

},
{
passive:true
}
);

}

// ======================================================
// AUTO CENTER FIRST CARD
// ======================================================

window.addEventListener(
"load",
()=>{

setTimeout(()=>{

updateCarouselMetrics();

goToCard(0);

},220);

}
);

// ======================================================
// SYSTEM LOG
// ======================================================

console.log(`

========================================
LGU PORTAL 16 💎
IOS QUALITY ACTIVE
STABLE CAROUSEL ACTIVE
CENTER SNAP ACTIVE
COVERPHOTO SYSTEM ACTIVE
========================================

`);