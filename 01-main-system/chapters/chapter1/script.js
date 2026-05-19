const legalCards =
document.querySelectorAll(".legal-card");

const modals =
document.querySelectorAll(".legal-modal");

const closeButtons =
document.querySelectorAll(".close-modal");

const accordions =
document.querySelectorAll(".accordion");

// OPEN MODALS

legalCards.forEach((card)=>{

card.addEventListener(
"click",
()=>{

const modalId =
card.dataset.modal;

const modal =
document.getElementById(modalId);

modal.classList.add("active");

document.body.style.overflow =
"hidden";

}
);

});

// CLOSE BUTTONS

closeButtons.forEach((button)=>{

button.addEventListener(
"click",
()=>{

modals.forEach((modal)=>{

modal.classList.remove("active");

});

document.body.style.overflow =
"auto";

}
);

});

// CLOSE OUTSIDE

modals.forEach((modal)=>{

modal.addEventListener(
"click",
(e)=>{

if(e.target === modal){

modal.classList.remove("active");

document.body.style.overflow =
"auto";

}

}
);

});

// ACCORDIONS

accordions.forEach((accordion)=>{

const header =
accordion.querySelector(".accordion-header");

header.addEventListener(
"click",
()=>{

accordion.classList.toggle("active");

}
);

});

console.log(`
========================================
CHAPTER I
GENERAL PROVISIONS
LEGAL ACCORDION SYSTEM ACTIVE
========================================
`);