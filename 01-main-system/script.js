// ======================================================
// LGU PORTAL 15 💎
// PRESERVED + STABILIZED MAIN SYSTEM
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
// INIT
// ======================================================

document.addEventListener(
"DOMContentLoaded",
()=>{

renderChapters(chaptersData);

initializeSearch();

initializeLoading();

initializeYear();

initializeCarousel();

initializeNavbar();

initializeAI();

initializeSuggestions();

}
);

// ======================================================
// RENDER CHAPTERS
// ======================================================

function renderChapters(chapters){

chaptersTrack.innerHTML = "";

chapters.forEach((chapter)=>{

const card =
document.createElement("a");

card.className =
"chapter-card glass semantic-card";

card.href =
chapter.file;

card.innerHTML = `

<img
src="${chapter.image}"
class="chapter-image"
loading="lazy"
decoding="async"
onerror="this.src='./phts/balayili.png'"
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

}

// ======================================================
// STABILIZED CAROUSEL
// ======================================================

function initializeCarousel(){

const scrollAmount = ()=>{

const firstCard =
document.querySelector(".chapter-card");

if(!firstCard) return 320;

const gap = 18;

return firstCard.offsetWidth + gap;

};

scrollRight.addEventListener(
"click",
()=>{

chaptersTrack.scrollBy({

left:scrollAmount(),
behavior:"smooth"

});

}
);

scrollLeft.addEventListener(
"click",
()=>{

chaptersTrack.scrollBy({

left:-scrollAmount(),
behavior:"smooth"

});

}
);

let isDown = false;
let startX;
let scrollLeftStart;

chaptersTrack.addEventListener(
"touchstart",
()=>{

chaptersTrack.style.scrollBehavior = "smooth";

},
{
passive:true
}
);

chaptersTrack.addEventListener(
"mousedown",
(e)=>{

isDown = true;

startX = e.pageX;

scrollLeftStart =
chaptersTrack.scrollLeft;

}
);

window.addEventListener(
"mouseup",
()=>{

isDown = false;

}
);

chaptersTrack.addEventListener(
"mousemove",
(e)=>{

if(!isDown) return;

e.preventDefault();

const walk =
(startX - e.pageX) * 1.1;

chaptersTrack.scrollLeft =
scrollLeftStart + walk;

}
);

}

// ======================================================
// SEARCH
// ======================================================

function initializeSearch(){

searchInput.addEventListener(
"input",
(e)=>{

const query =
e.target.value
.toLowerCase()
.trim();

if(query === ""){

renderChapters(chaptersData);

return;

}

const filtered =
chaptersData.filter((chapter)=>{

return(

chapter.title
.toLowerCase()
.includes(query)

||

chapter.keywords.some(
(keyword)=>
keyword.includes(query)
)

);

});

renderChapters(filtered);

}
);

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

currentYear.textContent =
new Date().getFullYear();

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
// AI
// ======================================================

function initializeAI(){

const openAI = ()=>{

aiPanel.classList.add("active");

};

const closeAI = ()=>{

aiPanel.classList.remove("active");

};

aiButton.addEventListener(
"click",
openAI
);

floatingAi.addEventListener(
"click",
openAI
);

closeAi.addEventListener(
"click",
closeAI
);

sendAi.addEventListener(
"click",
sendMessage
);

aiInput.addEventListener(
"keydown",
(e)=>{

if(e.key === "Enter"){

sendMessage();

}

}
);

}

// ======================================================
// AI SUGGESTIONS
// ======================================================

function initializeSuggestions(){

document
.querySelectorAll(".suggestion-chip")
.forEach((chip)=>{

chip.addEventListener(
"click",
()=>{

aiInput.value =
chip.textContent;

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

},300);

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

div.innerHTML = text;

aiMessages.appendChild(div);

aiMessages.scrollTop =
aiMessages.scrollHeight;

}

// ======================================================
// AI KNOWLEDGE
// ======================================================

function generateResponse(input){

const lower =
input.toLowerCase();

let response =
"Legal ordinance information unavailable.";

if(
lower.includes("tax")
){

response = `
<b>Chapter I — Definitions</b><br><br>

Tax refers to an enforced monetary contribution imposed by law to support governmental operations and public services.
`;

}

if(
lower.includes("permit")
){

response = `
<b>Chapter I — License or Permit</b><br><br>

A permit is a legal authorization granted by competent authority allowing regulated activity or occupation.
`;

}

if(
lower.includes("business")
){

response = `
<b>Chapter VII — Business Regulations</b><br><br>

This chapter governs business permits, licensing, and municipal commercial regulation.
`;

}

if(
lower.includes("traffic")
){

response = `
<b>Chapter VIII — Traffic and Transportation</b><br><br>

This chapter governs municipal traffic management and transportation regulation.
`;

}

if(
lower.includes("definitions")
){

response = `
<b>Chapter I — General Provisions</b><br><br>

Article C contains foundational legal definitions used throughout the Code of General Ordinances.
`;

}

addMessage(response,"ai");

}

console.log(`
========================================
LGU PORTAL 15 💎
PRESERVED SYSTEM ACTIVE
========================================
`);