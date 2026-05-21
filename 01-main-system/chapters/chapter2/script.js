/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CHAPTER II • SCRIPT.JS
        PART 1 — MODAL ENGINE
        LGU PORTAL 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const legalCards =
document.querySelectorAll(".legal-card");

const legalModals =
document.querySelectorAll(".legal-modal");

const closeButtons =
document.querySelectorAll(".close-modal");


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BODY SCROLL SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function lockBodyScroll(){

    document.body.classList.add(
        "modal-open"
    );

    document.body.style.overflow =
        "hidden";

}

function unlockBodyScroll(){

    document.body.classList.remove(
        "modal-open"
    );

    document.body.style.overflow =
        "auto";

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                CLOSE ALL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeAllModals(){

    legalModals.forEach((modal)=>{

        modal.classList.remove(
            "active"
        );

    });

    unlockBodyScroll();

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                OPEN MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function openModal(modalId){

    const modal =
    document.getElementById(modalId);

    if(!modal) return;

    closeAllModals();

    modal.classList.add(
        "active"
    );

    lockBodyScroll();

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CARD CLICK ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach((card)=>{

    card.addEventListener(
        "click",
        ()=>{

            const modalId =
            card.dataset.modal;

            if(!modalId) return;

            openModal(modalId);

        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CLOSE BUTTON ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

closeButtons.forEach((button)=>{

    button.addEventListener(
        "click",
        closeAllModals
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            OUTSIDE CLICK CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ESC CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener(
    "keydown",
    (event)=>{

        if(event.key === "Escape"){

            closeAllModals();

        }

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MOBILE TOUCH FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach((modal)=>{

    modal.addEventListener(
        "touchmove",
        (event)=>{

            const modalScroll =
            modal.querySelector(
                ".modal-scroll"
            );

            if(!modalScroll) return;

            if(
                modalScroll.scrollHeight >
                modalScroll.clientHeight
            ){

                event.stopPropagation();

            }

        },
        {
            passive:true
        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            IOS MODAL STABILIZER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function isiOS(){

    return /iPhone|iPad|iPod/i.test(
        navigator.userAgent
    );

}

if(isiOS()){

    document.body.classList.add(
        "ios-device"
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACTIVE MODAL CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function hasActiveModal(){

    return document.querySelector(
        ".legal-modal.active"
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFE RESIZE ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    "resize",
    ()=>{

        const activeModal =
        hasActiveModal();

        if(activeModal){

            lockBodyScroll();

        }

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            DEBUG SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER II INITIALIZED
MODAL ENGINE ACTIVE
LGU PORTAL 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        PART 2 — ACCORDION ENGINE
        CHAPTER II 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACCORDION ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const accordions =
document.querySelectorAll(".accordion");

const accordionHeaders =
document.querySelectorAll(
    ".accordion-header"
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CLOSE ACCORDIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeAccordion(accordion){

    if(!accordion) return;

    accordion.classList.remove(
        "active"
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            OPEN ACCORDION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function openAccordion(accordion){

    if(!accordion) return;

    accordion.classList.add(
        "active"
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CLOSE SIBLING ACCORDIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeSiblingAccordions(
    currentAccordion
){

    const parentModal =
    currentAccordion.closest(
        ".modal-scroll"
    );

    if(!parentModal) return;

    const siblingAccordions =
    parentModal.querySelectorAll(
        ".accordion"
    );

    siblingAccordions.forEach(
        (accordion)=>{

            if(
                accordion !==
                currentAccordion
            ){

                closeAccordion(
                    accordion
                );

            }

        }
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SCROLL TO ACCORDION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function scrollAccordionIntoView(
    accordion
){

    if(!accordion) return;

    setTimeout(()=>{

        accordion.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    },180);

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACCORDION CLICK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

accordionHeaders.forEach(
    (header)=>{

        header.addEventListener(
            "click",
            ()=>{

                const currentAccordion =
                header.parentElement;

                const isActive =
                currentAccordion.classList.contains(
                    "active"
                );

                closeSiblingAccordions(
                    currentAccordion
                );

                if(isActive){

                    closeAccordion(
                        currentAccordion
                    );

                }else{

                    openAccordion(
                        currentAccordion
                    );

                    scrollAccordionIntoView(
                        currentAccordion
                    );

                }

            }
        );

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TOUCH STABILIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

accordionHeaders.forEach(
    (header)=>{

        header.addEventListener(
            "touchstart",
            ()=>{

                header.style.transform =
                    "scale(0.995)";

            },
            {
                passive:true
            }
        );

        header.addEventListener(
            "touchend",
            ()=>{

                setTimeout(()=>{

                    header.style.transform =
                        "";

                },120);

            },
            {
                passive:true
            }
        );

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            LEGAL READER DEPTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function applyLegalReaderEffects(){

    accordions.forEach(
        (accordion,index)=>{

            accordion.style.transitionDelay =
                `${index * 0.02}s`;

        }
    );

}

applyLegalReaderEffects();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CONTENT SAFETY CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function normalizeAccordionHeight(){

    accordions.forEach(
        (accordion)=>{

            const content =
            accordion.querySelector(
                ".accordion-content"
            );

            if(!content) return;

            if(
                content.scrollHeight >
                4000
            ){

                content.style.maxHeight =
                    "6000px";

            }

        }
    );

}

normalizeAccordionHeight();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MODAL RESET ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach(
    (modal)=>{

        modal.addEventListener(
            "transitionend",
            ()=>{

                if(
                    !modal.classList.contains(
                        "active"
                    )
                ){

                    const modalAccordions =
                    modal.querySelectorAll(
                        ".accordion"
                    );

                    modalAccordions.forEach(
                        (accordion)=>{

                            closeAccordion(
                                accordion
                            );

                        }
                    );

                }

            }
        );

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ANDROID STABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function isAndroid(){

    return /Android/i.test(
        navigator.userAgent
    );

}

if(isAndroid()){

    document.body.classList.add(
        "android-device"
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            DEBUG LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCORDION ENGINE ACTIVE
LEGAL READER ONLINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        PART 3 — FINAL SYSTEMS
        CHAPTER II 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FADE IN ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const fadeElements =
document.querySelectorAll(

    ".legal-card, \
     .definition-card, \
     .hero, \
     .navbar"

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        INTERSECTION OBSERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const fadeObserver =
new IntersectionObserver(

    (entries)=>{

        entries.forEach((entry)=>{

            if(entry.isIntersecting){

                entry.target.classList.add(
                    "show"
                );

            }

        });

    },

    {
        threshold:0.12
    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            APPLY OBSERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

fadeElements.forEach((element)=>{

    element.classList.add(
        "fade-in"
    );

    fadeObserver.observe(
        element
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CARD INTERACTION FX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach((card)=>{

    card.addEventListener(
        "mousemove",
        (event)=>{

            if(window.innerWidth <= 768)
            return;

            const rect =
            card.getBoundingClientRect();

            const x =
            event.clientX - rect.left;

            const y =
            event.clientY - rect.top;

            const centerX =
            rect.width / 2;

            const centerY =
            rect.height / 2;

            const rotateX =
            ((y - centerY) / centerY) * -2;

            const rotateY =
            ((x - centerX) / centerX) * 2;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-4px)
            `;

        }
    );

    card.addEventListener(
        "mouseleave",
        ()=>{

            card.style.transform = "";

        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MOBILE TOUCH FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach((card)=>{

    card.addEventListener(
        "touchstart",
        ()=>{

            card.style.transform =
                "scale(0.985)";

        },
        {
            passive:true
        }
    );

    card.addEventListener(
        "touchend",
        ()=>{

            setTimeout(()=>{

                card.style.transform =
                    "";

            },120);

        },
        {
            passive:true
        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFE MODAL SCROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach((modal)=>{

    const modalScroll =
    modal.querySelector(
        ".modal-scroll"
    );

    if(!modalScroll) return;

    modalScroll.addEventListener(
        "touchmove",
        (event)=>{

            event.stopPropagation();

        },
        {
            passive:true
        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            VIEWPORT STABILIZER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function updateViewportHeight(){

    const vh =
    window.innerHeight * 0.01;

    document.documentElement.style.setProperty(
        "--vh",
        `${vh}px`
    );

}

updateViewportHeight();

window.addEventListener(
    "resize",
    updateViewportHeight
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PERFORMANCE OPTIMIZER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function reduceHeavyEffects(){

    if(window.innerWidth <= 768){

        document.body.classList.add(
            "mobile-device"
        );

    }

}

reduceHeavyEffects();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFE SCROLL RESTORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    "pageshow",
    ()=>{

        unlockBodyScroll();

        closeAllModals();

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACCESSIBILITY ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener(
    "keydown",
    (event)=>{

        if(event.key === "Tab"){

            document.body.classList.add(
                "keyboard-navigation"
            );

        }

    }
);

document.addEventListener(
    "mousedown",
    ()=>{

        document.body.classList.remove(
            "keyboard-navigation"
        );

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFETY FALLBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    "error",
    (event)=>{

        console.warn(
            "LGU PORTAL WARNING:",
            event.message
        );

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FINAL INITIALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function initializeChapter2(){

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER II FULLY LOADED
LEGISLATIVE SYSTEM ONLINE
LGU PORTAL 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

}

initializeChapter2();