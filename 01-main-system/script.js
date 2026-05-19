// ======================================================
//                 YEYO 💎
//     LGU PORTAL 15 • IOS SYSTEM ENGINE
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

<img
src="./phts/balayili.png"
class="chapter-building"
loading="lazy"
decoding="async"
>

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

carouselCardWidth = 320;

return;
}

const style =
window.getComputedStyle(chaptersTrack);

const gap =
parseFloat(style.columnGap || style.gap || 24);

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

// ======================================================
// DRAG SYSTEM
// ======================================================

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
(startX - currentX) * 1.08;

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

}

// ======================================================
// SNAP
// ======================================================

function snapToNearestCard(){

updateCarouselMetrics();

const index =
Math.round(
chaptersTrack.scrollLeft
/
carouselCardWidth
);

goToCard(index);

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

const target =
cards[activeIndex];

const trackRect =
chaptersTrack.getBoundingClientRect();

const cardRect =
target.getBoundingClientRect();

const offset =
(cardRect.left - trackRect.left)
-
((trackRect.width / 2)
-
(cardRect.width / 2));

chaptersTrack.scrollBy({

left:offset,

behavior:"smooth"

});

updateActiveCard();

}

// ======================================================
// ACTIVE CARD
// ======================================================

function updateActiveCard(){

const cards =
document.querySelectorAll(".chapter-card");

if(!cards.length) return;

const trackCenter =
chaptersTrack.getBoundingClientRect().left
+
(chaptersTrack.offsetWidth / 2);

let closestCard = null;

let closestDistance = Infinity;

cards.forEach((card,index)=>{

const rect =
card.getBoundingClientRect();

const cardCenter =
rect.left + (rect.width / 2);

const distance =
Math.abs(trackCenter - cardCenter);

card.classList.remove("active");

if(distance < closestDistance){

closestDistance = distance;

closestCard = card;

activeIndex = index;

}

});

if(closestCard){

closestCard.classList.add("active");

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
// AI SYSTEM
// ======================================================

function initializeAI(){

if(!aiPanel) return;

// OPEN

const openAI = ()=>{

aiPanel.classList.add("active");

document.body.style.overflow = "hidden";

setTimeout(()=>{

aiInput?.focus();

},120);

};

// CLOSE

const closeAI = ()=>{

aiPanel.classList.remove("active");

document.body.style.overflow = "";

};

// BUTTONS

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

// OUTSIDE CLICK

document.addEventListener(
"click",
(event)=>{

const clickedInside =
aiPanel.contains(event.target)
||
floatingAi.contains(event.target)
||
aiButton.contains(event.target);

if(
!clickedInside
&&
aiPanel.classList.contains("active")
){

closeAI();

}

}
);

// ESCAPE

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

// SEND

sendAi?.addEventListener(
"click",
sendMessage
);

// ENTER

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
// SEND MESSAGE
// ======================================================

function sendMessage(){

const text =
aiInput.value.trim();

if(!text) return;

addMessage(text,"user");

aiInput.value = "";

setTimeout(()=>{

generateResponse(text);

},360);

}

// ======================================================
// ADD MESSAGE
// ======================================================

function addMessage(text,type){

const div =
document.createElement("div");

div.className =
`ai-message ${
type === "user"
? "ai-user"
: ""
}`;

// SAFE RENDER

div.innerHTML =
sanitizeHTML(text);

aiMessages.appendChild(div);

requestAnimationFrame(()=>{

aiMessages.scrollTop =
aiMessages.scrollHeight;

});

}

// ======================================================
// SANITIZE
// ======================================================

function sanitizeHTML(input){

const temp =
document.createElement("div");

temp.textContent = input;

return temp.innerHTML
.replace(/\n/g,"<br>");

}

// ======================================================
// LEGAL AI ENGINE
// ======================================================

function generateResponse(input){

const lower =
input.toLowerCase();

let response =
`
<b>LGU PORTAL 15</b>
<br><br>

Legal ordinance information unavailable.
`;

const responses = [

{
keywords:[
"tax",
"taxation",
"fees",
"revenue"
],

response:`
<b>Chapter III — Revenue and Taxation</b>
<br><br>

Municipal taxation provisions regulate local revenue systems, lawful fee collection, fiscal enforcement, and ordinance-based taxation authority.
`
},

{
keywords:[
"permit",
"business",
"license"
],

response:`
<b>Chapter VII — Business Regulations</b>
<br><br>

This chapter governs municipal permits, business licensing, compliance requirements, and regulated commercial operations.
`
},

{
keywords:[
"traffic",
"parking",
"vehicle",
"transportation"
],

response:`
<b>Chapter VIII — Traffic and Transportation</b>
<br><br>

Traffic ordinances regulate vehicle movement, parking enforcement, transportation systems, and municipal road safety.
`
},

{
keywords:[
"definitions",
"general",
"construction"
],

response:`
<b>Chapter I — General Provisions</b>
<br><br>

Article C contains foundational legal definitions, ordinance interpretation principles, and statutory construction rules.
`
},

{
keywords:[
"sanitation",
"health",
"waste"
],

response:`
<b>Chapter V — Health and Sanitation</b>
<br><br>

This chapter governs sanitation systems, public cleanliness standards, health compliance measures, and waste regulation.
`
},

{
keywords:[
"safety",
"emergency",
"public safety"
],

response:`
<b>Chapter IV — Public Safety</b>
<br><br>

Public safety provisions regulate emergency response systems, municipal protection measures, and community safety enforcement.
`
}

];

responses.forEach((item)=>{

const matched =
item.keywords.some(
(keyword)=>
lower.includes(keyword)
);

if(matched){

response =
item.response;

}

});

addMessage(response,"ai");

}

// ======================================================
// REVEAL ANIMATIONS
// ======================================================

function initializeRevealAnimations(){

revealObserver =
new IntersectionObserver(

(entries)=>{

entries.forEach((entry)=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}else{

entry.target.classList.remove("show");

}

});

},

{
threshold:0.12
}

);

reinitializeRevealObserver();

}

// ======================================================
// REINITIALIZE OBSERVER
// ======================================================

function reinitializeRevealObserver(){

if(!revealObserver) return;

document
.querySelectorAll(
".about-card, .contacts-card, .chapter-card"
)
.forEach((element)=>{

revealObserver.observe(element);

});

}

// ======================================================
// RESIZE HANDLER
// ======================================================

function initializeResizeHandler(){

window.addEventListener(
"resize",
debounce(()=>{

updateCarouselMetrics();

snapActiveCard();

},160)
);

}

// ======================================================
// SNAP ACTIVE
// ======================================================

function snapActiveCard(){

goToCard(activeIndex);

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

},180);

}
);

// ======================================================
// TOUCH MOMENTUM FIX
// ======================================================

chaptersTrack?.addEventListener(
"touchend",
()=>{

setTimeout(()=>{

snapToNearestCard();

},120);

},
{
passive:true
}
);

// ======================================================
// KEYBOARD NAVIGATION
// ======================================================

window.addEventListener(
"keydown",
(event)=>{

const aiOpened =
aiPanel.classList.contains("active");

if(aiOpened) return;

if(event.key === "ArrowRight"){

goToCard(activeIndex + 1);

}

if(event.key === "ArrowLeft"){

goToCard(activeIndex - 1);

}

}
);

// ======================================================
// IOS SCROLL SHADOW
// ======================================================

window.addEventListener(
"scroll",
()=>{

const scrollTop =
window.scrollY;

document.body.style.setProperty(
"--scroll-opacity",
Math.min(scrollTop / 400,1)
);

},
{
passive:true
}
);

// ======================================================
// PERFORMANCE
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

preloadCriticalImages();

// ======================================================
// PREVENT DOUBLE TAP ZOOM IOS
// ======================================================

let lastTouchEnd = 0;

document.addEventListener(
"touchend",
(event)=>{

const now = Date.now();

if(now - lastTouchEnd <= 300){

event.preventDefault();

}

lastTouchEnd = now;

},
{
passive:false
}
);

// ======================================================
// SMOOTH SECTION LINKS
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
// SYSTEM LOG
// ======================================================

console.log(`

========================================
LGU PORTAL 15 💎
PRESERVED FOUNDATION ACTIVE
IOS SYSTEM ACTIVE
STABILIZED CAROUSEL ACTIVE
LEGALOS ENGINE ACTIVE
RESPONSIVE ENGINE ACTIVE
========================================

`);

// ======================================================
// END SYSTEM
// ======================================================