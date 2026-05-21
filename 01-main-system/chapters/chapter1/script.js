const legalCards =
document.querySelectorAll(".legal-card");

const legalModals =
document.querySelectorAll(".legal-modal");

const closeButtons =
document.querySelectorAll(".close-modal");

function lockBodyScroll(){

document.body.style.overflow =
"hidden";

}

function unlockBodyScroll(){

document.body.style.overflow =
"auto";

}

function closeAllModals(){

legalModals.forEach((modal)=>{

modal.classList.remove("active");

});

unlockBodyScroll();

}

function openModal(modalId){

const modal =
document.getElementById(modalId);

if(!modal) return;

closeAllModals();

modal.classList.add("active");

lockBodyScroll();

}

legalCards.forEach((card)=>{

card.addEventListener(
"click",
()=>{

const modalId =
card.dataset.modal;

openModal(modalId);

}
);

});

closeButtons.forEach((button)=>{

button.addEventListener(
"click",
closeAllModals
);

});

legalModals.forEach((modal)=>{

modal.addEventListener(
"click",
(event)=>{

if(event.target === modal){

closeAllModals();

}

}
);

});

document.addEventListener(
"keydown",
(event)=>{

if(event.key === "Escape"){

closeAllModals();

}

}
);

const accordionHeaders =
document.querySelectorAll(
".accordion-header"
);

accordionHeaders.forEach((header)=>{

header.addEventListener(
"click",
()=>{

const accordion =
header.parentElement;

const parent =
accordion.closest(".modal-scroll");

const siblings =
parent.querySelectorAll(".accordion");

siblings.forEach((item)=>{

if(item !== accordion){

item.classList.remove("active");

}

});

accordion.classList.toggle(
"active"
);

}
);

});

console.log(`

━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER I INITIALIZED
LGU PORTAL 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━

`);