// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER I
// LGU PORTAL 17
// CINEMATIC LEGAL SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBAL ELEMENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const legalCards =
document.querySelectorAll(".legal-card");

const modals =
document.querySelectorAll(".legal-modal");

const closeButtons =
document.querySelectorAll(".close-modal");

const cardsRail =
document.getElementById("cardsRail");

const prevBtn =
document.querySelector(".rail-prev");

const nextBtn =
document.querySelector(".rail-next");


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACTIVE CARD SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function updateActiveCard(){

    if(!cardsRail) return;

    const railCenter =
    cardsRail.scrollLeft +
    (cardsRail.offsetWidth / 2);

    legalCards.forEach((card)=>{

        const cardCenter =
        card.offsetLeft +
        (card.offsetWidth / 2);

        const distance =
        Math.abs(railCenter - cardCenter);

        if(distance < 220){

            card.classList.add("active-card");

        }

        else{

            card.classList.remove("active-card");

        }

    });

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RAIL BUTTONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if(nextBtn){

    nextBtn.addEventListener(
    "click",
    ()=>{

        cardsRail.scrollBy({

            left:420,
            behavior:"smooth"

        });

    }
    );

}

if(prevBtn){

    prevBtn.addEventListener(
    "click",
    ()=>{

        cardsRail.scrollBy({

            left:-420,
            behavior:"smooth"

        });

    }
    );

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RAIL SCROLL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if(cardsRail){

    cardsRail.addEventListener(
    "scroll",
    ()=>{

        window.requestAnimationFrame(
        updateActiveCard
        );

    },
    { passive:true }
    );

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OPEN MODALS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

legalCards.forEach((card)=>{

    card.addEventListener(
    "click",
    ()=>{

        const modalId =
        card.dataset.modal;

        const modal =
        document.getElementById(modalId);

        if(!modal) return;

        // CLOSE OTHER MODALS

        modals.forEach((item)=>{

            item.classList.remove("active");

        });

        // OPEN TARGET

        modal.classList.add("active");

        // BODY LOCK

        document.body.style.overflow =
        "hidden";

        // RESET SCROLL

        const scrollArea =
        modal.querySelector(".modal-scroll");

        if(scrollArea){

            scrollArea.scrollTop = 0;

        }

        // UPDATE PROGRESS

        updateProgress(modal);

    }
    );

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLOSE ALL MODALS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function closeAllModals(){

    modals.forEach((modal)=>{

        modal.classList.remove("active");

    });

    document.body.style.overflow =
    "auto";

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLOSE BUTTONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

closeButtons.forEach((button)=>{

    button.addEventListener(
    "click",
    closeAllModals
    );

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLICK OUTSIDE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

modals.forEach((modal)=>{

    modal.addEventListener(
    "click",
    (e)=>{

        if(
            e.target.classList.contains(
            "modal-backdrop"
            )
        ){

            closeAllModals();

        }

    }
    );

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ESC CLOSE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener(
"keydown",
(e)=>{

    if(e.key === "Escape"){

        closeAllModals();

    }

}
);


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZE ACTIVE CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

window.addEventListener(
"load",
()=>{

    updateActiveCard();

}
);


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESIZE RECALCULATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

window.addEventListener(
"resize",
()=>{

    updateActiveCard();

},
{ passive:true }
);


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SYSTEM LOG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log(`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER I
LGU PORTAL 17
CINEMATIC LEGAL SYSTEM ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SMART ACCORDION SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const accordionHeaders =
document.querySelectorAll(".accordion-header");


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLOSE ACCORDIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function closeAccordion(accordion){

    accordion.classList.remove("active");

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OPEN ACCORDION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function openAccordion(accordion){

    accordion.classList.add("active");

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACCORDION CLICK ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

accordionHeaders.forEach((header)=>{

    header.addEventListener(
    "click",
    ()=>{

        const currentAccordion =
        header.parentElement;

        const modalScroll =
        currentAccordion.closest(".modal-scroll");

        if(!modalScroll) return;

        const allAccordions =
        modalScroll.querySelectorAll(".accordion");

        // CLOSE OTHER ACCORDIONS

        allAccordions.forEach((accordion)=>{

            if(accordion !== currentAccordion){

                closeAccordion(accordion);

            }

        });

        // TOGGLE CURRENT

        currentAccordion.classList.toggle("active");

        // AUTO SCROLL

        setTimeout(()=>{

            currentAccordion.scrollIntoView({

                behavior:"smooth",
                block:"start"

            });

        },250);

    }
    );

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// READING PROGRESS SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function updateProgress(modal){

    if(!modal) return;

    const scrollArea =
    modal.querySelector(".modal-scroll");

    const progressBar =
    modal.querySelector(".reader-progress-bar");

    if(!scrollArea || !progressBar) return;

    const scrollTop =
    scrollArea.scrollTop;

    const scrollHeight =
    scrollArea.scrollHeight -
    scrollArea.clientHeight;

    const progress =
    (scrollTop / scrollHeight) * 100;

    progressBar.style.width =
    `${progress}%`;

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL TRACKERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

modals.forEach((modal)=>{

    const scrollArea =
    modal.querySelector(".modal-scroll");

    if(!scrollArea) return;

    scrollArea.addEventListener(
    "scroll",
    ()=>{

        window.requestAnimationFrame(
        ()=>{

            updateProgress(modal);

        });

    },
    { passive:true }
    );

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACTIVE READER STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setReaderState(){

    modals.forEach((modal)=>{

        const scrollArea =
        modal.querySelector(".modal-scroll");

        if(!scrollArea) return;

        const sections =
        scrollArea.querySelectorAll(".accordion");

        sections.forEach((section)=>{

            const rect =
            section.getBoundingClientRect();

            if(
                rect.top < 300 &&
                rect.bottom > 200
            ){

                section.classList.add(
                "reading-active"
                );

            }

            else{

                section.classList.remove(
                "reading-active"
                );

            }

        });

    });

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRACK ACTIVE SECTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

modals.forEach((modal)=>{

    const scrollArea =
    modal.querySelector(".modal-scroll");

    if(!scrollArea) return;

    scrollArea.addEventListener(
    "scroll",
    ()=>{

        window.requestAnimationFrame(
        setReaderState
        );

    },
    { passive:true }
    );

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOUCH MOMENTUM STABILIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let isDragging = false;

if(cardsRail){

    cardsRail.addEventListener(
    "touchstart",
    ()=>{

        isDragging = true;

    },
    { passive:true }
    );

    cardsRail.addEventListener(
    "touchend",
    ()=>{

        isDragging = false;

        updateActiveCard();

    },
    { passive:true }
    );

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MODAL OPEN ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function animateModalOpen(modal){

    if(!modal) return;

    const reader =
    modal.querySelector(".fullscreen-reader");

    if(!reader) return;

    reader.animate(

        [
            {
                opacity:0,
                transform:"translateY(20px) scale(.98)"
            },

            {
                opacity:1,
                transform:"translateY(0px) scale(1)"
            }

        ],

        {
            duration:420,
            easing:"cubic-bezier(.22,.61,.36,1)"
        }

    );

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APPLY OPEN ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

legalCards.forEach((card)=>{

    card.addEventListener(
    "click",
    ()=>{

        const modalId =
        card.dataset.modal;

        const modal =
        document.getElementById(modalId);

        setTimeout(()=>{

            animateModalOpen(modal);

        },50);

    }
    );

});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACTIVE READING VISUAL STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function applyReadingEffects(){

    const activeSections =
    document.querySelectorAll(
    ".reading-active"
    );

    activeSections.forEach((section)=>{

        section.style.transform =
        "translateY(-2px)";

        section.style.transition =
        "all .35s cubic-bezier(.22,.61,.36,1)";

    });

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL DEPTH EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

modals.forEach((modal)=>{

    const scrollArea =
    modal.querySelector(".modal-scroll");

    const header =
    modal.querySelector(".reader-header");

    if(!scrollArea || !header) return;

    scrollArea.addEventListener(
    "scroll",
    ()=>{

        const scrollTop =
        scrollArea.scrollTop;

        if(scrollTop > 10){

            header.style.background =
            "rgba(7,17,34,0.72)";

            header.style.backdropFilter =
            "blur(24px)";

            header.style.borderBottom =
            "1px solid rgba(255,255,255,0.08)";

        }

        else{

            header.style.background =
            "rgba(255,255,255,0.06)";

            header.style.borderBottom =
            "1px solid rgba(255,255,255,0.06)";

        }

    },
    { passive:true }
    );

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CARD PARALLAX EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

legalCards.forEach((card)=>{

    card.addEventListener(
    "mousemove",
    (e)=>{

        if(window.innerWidth < 992) return;

        const rect =
        card.getBoundingClientRect();

        const x =
        e.clientX - rect.left;

        const y =
        e.clientY - rect.top;

        const centerX =
        rect.width / 2;

        const centerY =
        rect.height / 2;

        const rotateY =
        ((x - centerX) / centerX) * 4;

        const rotateX =
        ((centerY - y) / centerY) * 4;

        card.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-6px)
        `;

    }
    );

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESET CARD POSITION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

legalCards.forEach((card)=>{

    card.addEventListener(
    "mouseleave",
    ()=>{

        if(card.classList.contains(
        "active-card"
        )){

            card.style.transform = `
            scale(1.02)
            translateY(-6px)
            `;

        }

        else{

            card.style.transform =
            "";

        }

    }
    );

});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SNAP CORRECTION SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let snapTimeout;

if(cardsRail){

    cardsRail.addEventListener(
    "scroll",
    ()=>{

        clearTimeout(snapTimeout);

        snapTimeout =
        setTimeout(()=>{

            updateActiveCard();

        },120);

    },
    { passive:true }
    );

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GPU ACCELERATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function enableGPUAcceleration(){

    const animatedElements =
    document.querySelectorAll(`

        .legal-card,
        .meta-card,
        .overview-card,
        .definition-card,
        .accordion,
        .framework-item,
        .ai-explanation-card

    `);

    animatedElements.forEach((element)=>{

        element.style.transform +=
        " translateZ(0)";

        element.style.backfaceVisibility =
        "hidden";

    });

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IOS RENDER STABILIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function stabilizeIOS(){

    const isIOS =
    /iPad|iPhone|iPod/.test(
    navigator.userAgent
    );

    if(!isIOS) return;

    document.body.style.webkitFontSmoothing =
    "antialiased";

    document.body.style.webkitOverflowScrolling =
    "touch";

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PERFORMANCE OPTIMIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function optimizePerformance(){

    let ticking = false;

    window.addEventListener(
    "scroll",
    ()=>{

        if(!ticking){

            window.requestAnimationFrame(
            ()=>{

                applyReadingEffects();

                ticking = false;

            });

            ticking = true;

        }

    },
    { passive:true }
    );

}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZE SYSTEMS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

window.addEventListener(
"load",
()=>{

    // ACTIVE CARD

    updateActiveCard();

    // GPU

    enableGPUAcceleration();

    // IOS FIX

    stabilizeIOS();

    // PERFORMANCE

    optimizePerformance();

    // READING EFFECTS

    applyReadingEffects();

    console.log(`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER I INITIALIZED
LGU PORTAL 17 ACTIVE
CINEMATIC LEGAL SYSTEM READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`);

}
);


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FINAL SAFETY RESET
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

window.addEventListener(
"beforeunload",
()=>{

    document.body.style.overflow =
    "auto";

}
);