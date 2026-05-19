const legalCards =
document.querySelectorAll(".legal-card");

const modals =
document.querySelectorAll(".legal-modal");

const closeButtons =
document.querySelectorAll(".close-modal");

// ======================================
// OPEN MODALS
// ======================================

legalCards.forEach((card)=>{

card.addEventListener(
"click",
()=>{

const modalId =
card.dataset.modal;

const modal =
document.getElementById(modalId);

if(!modal) return;

// CLOSE OTHER MODALS FIRST

modals.forEach((item)=>{

item.classList.remove("active");

});

// OPEN TARGET

modal.classList.add("active");

document.body.style.overflow =
"hidden";

}
);

});

// ======================================
// CLOSE ALL MODALS
// ======================================

function closeAllModals(){

modals.forEach((modal)=>{

modal.classList.remove("active");

});

document.body.style.overflow =
"auto";

}

// ======================================
// CLOSE BUTTONS
// ======================================

closeButtons.forEach((button)=>{

button.addEventListener(
"click",
closeAllModals
);

});

// ======================================
// CLICK OUTSIDE
// ======================================

modals.forEach((modal)=>{

modal.addEventListener(
"click",
(e)=>{

if(e.target === modal){

closeAllModals();

}

}
);

});

// ======================================
// ESC CLOSE
// ======================================

document.addEventListener(
"keydown",
(e)=>{

if(e.key === "Escape"){

closeAllModals();

}

}
);

// ======================================
// GLOBAL ACCORDION SYSTEM
// ONLY ONE OPEN
// ======================================

document
.querySelectorAll(".accordion-header")
.forEach((header)=>{

header.addEventListener(
"click",
()=>{

const currentAccordion =
header.parentElement;

const parentModal =
currentAccordion.closest(".modal-scroll");

// CLOSE ALL ACCORDIONS
// INSIDE CURRENT MODAL ONLY

parentModal
.querySelectorAll(".accordion")
.forEach((accordion)=>{

if(accordion !== currentAccordion){

accordion.classList.remove("active");

}

});

// TOGGLE CURRENT

currentAccordion.classList.toggle("active");

}
);

});

console.log(`
========================================
CHAPTER I
LEGAL READER ACTIVE
GLOBAL ACCORDION SYSTEM ACTIVE
========================================
`);