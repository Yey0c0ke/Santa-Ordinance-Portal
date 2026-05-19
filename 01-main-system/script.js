const chaptersData = [

{
number:"I",
title:"General Provisions",
image:"./phts/coverphoto.png",
file:"./chapters/chapter1/index.html",
keywords:["general","provisions","ordinance"]
},

{
number:"II",
title:"Administrative Matters",
image:"./phts/coverphoto.png",
file:"./chapters/chapter2/index.html",
keywords:["administrative","government"]
},

{
number:"III",
title:"Revenue and Taxation",
image:"./phts/coverphoto.png",
file:"./chapters/chapter3/index.html",
keywords:["tax","taxation","revenue","fees"]
},

{
number:"IV",
title:"Public Safety",
image:"./phts/coverphoto.png",
file:"./chapters/chapter4/index.html",
keywords:["safety","emergency","security"]
},

{
number:"V",
title:"Health and Sanitation",
image:"./phts/coverphoto.png",
file:"./chapters/chapter5/index.html",
keywords:["health","sanitation","garbage"]
},

{
number:"VI",
title:"Environmental Management",
image:"./phts/coverphoto.png",
file:"./chapters/chapter6/index.html",
keywords:["environment","waste","pollution"]
},

{
number:"VII",
title:"Business Regulations",
image:"./phts/coverphoto.png",
file:"./chapters/chapter7/index.html",
keywords:["business","permit","commercial"]
},

{
number:"VIII",
title:"Traffic and Transportation",
image:"./phts/coverphoto.png",
file:"./chapters/chapter8/index.html",
keywords:["traffic","vehicle","parking"]
},

{
number:"IX",
title:"Public Utilities",
image:"./phts/coverphoto.png",
file:"./chapters/chapter9/index.html",
keywords:["utilities","water","electricity"]
},

{
number:"X",
title:"Penal Provisions",
image:"./phts/coverphoto.png",
file:"./chapters/chapter10/index.html",
keywords:["penalty","violation","fine"]
},

{
number:"XI",
title:"Final Provisions",
image:"./phts/coverphoto.png",
file:"./chapters/chapter11/index.html",
keywords:["final","effectivity"]
}

];

const chaptersTrack = document.getElementById("chaptersTrack");
const searchInput = document.getElementById("searchInput");
const loadingScreen = document.getElementById("loadingScreen");
const currentYear = document.getElementById("currentYear");
const scrollLeft = document.getElementById("scrollLeft");
const scrollRight = document.getElementById("scrollRight");
const navbar = document.getElementById("navbar");

const aiButton = document.getElementById("aiButton");
const floatingAi = document.getElementById("floatingAi");
const aiPanel = document.getElementById("aiPanel");
const closeAi = document.getElementById("closeAi");
const sendAi = document.getElementById("sendAi");
const aiInput = document.getElementById("aiInput");
const aiMessages = document.getElementById("aiMessages");

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

function renderChapters(chapters){

chaptersTrack.innerHTML = "";

chapters.forEach((chapter)=>{

const card = document.createElement("a");

card.className = "chapter-card glass";

card.href = chapter.file;

card.innerHTML = `

<img
src="${chapter.image}"
class="chapter-image"
loading="lazy"
decoding="async"
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

chapter.number
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

function initializeYear(){

currentYear.textContent =
new Date().getFullYear();

}

function initializeCarousel(){

const getCardWidth = ()=>{

const card =
document.querySelector(".chapter-card");

return card
? card.offsetWidth + 18
: 320;

};

scrollRight.addEventListener(
"click",
()=>{

chaptersTrack.scrollBy({
left:getCardWidth(),
behavior:"smooth"
});

}
);

scrollLeft.addEventListener(
"click",
()=>{

chaptersTrack.scrollBy({
left:-getCardWidth(),
behavior:"smooth"
});

}
);

}

function initializeNavbar(){

let ticking = false;

window.addEventListener(
"scroll",
()=>{

if(!ticking){

window.requestAnimationFrame(()=>{

if(window.scrollY > 40){

navbar.classList.add("scrolled");

}else{

navbar.classList.remove("scrolled");

}

ticking = false;

});

ticking = true;

}

},
{ passive:true }
);

}

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

function sendMessage(){

const text =
aiInput.value.trim();

if(!text) return;

addMessage(text,"user");

aiInput.value = "";

setTimeout(()=>{

generateResponse(text);

},350);

}

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

requestAnimationFrame(()=>{

aiMessages.scrollTop =
aiMessages.scrollHeight;

});

}

function generateResponse(input){

const lower =
input.toLowerCase();

let response =
"Legal ordinance information unavailable.";

const ordinanceMap = [

{
keywords:["business","permit","commercial"],
response:"<b>Chapter VII</b><br>Business Regulations"
},

{
keywords:["traffic","parking","vehicle"],
response:"<b>Chapter VIII</b><br>Traffic and Transportation"
},

{
keywords:["penalty","violation","fine"],
response:"<b>Chapter X</b><br>Penal Provisions"
},

{
keywords:["health","sanitation","garbage"],
response:"<b>Chapter V</b><br>Health and Sanitation"
},

{
keywords:["tax","taxation","fees"],
response:"<b>Chapter III</b><br>Revenue and Taxation"
}

];

ordinanceMap.forEach((item)=>{

item.keywords.forEach((keyword)=>{

if(lower.includes(keyword)){

response =
item.response;

}

});

});

addMessage(response,"ai");

}

console.log(`
========================================
LGU PORTAL 15 💎
OPTIMIZED PRESERVED SYSTEM
========================================
`);