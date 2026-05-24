/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER I • MUNICIPAL LEGAL OS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const body =
document.body;

const legalCards =
document.querySelectorAll(
    '.legal-card'
);

const legalModals =
document.querySelectorAll(
    '.legal-modal'
);

const closeButtons =
document.querySelectorAll(
    '.close-modal'
);

const accordionHeaders =
document.querySelectorAll(
    '.accordion-header'
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIEWPORT FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function setViewportHeight(){

    const vh =
        window.innerHeight * 0.01;

    document.documentElement
        .style
        .setProperty(
            '--vh',
            `${vh}px`
        );

}

setViewportHeight();

window.addEventListener(

    'resize',

    ()=>{

        requestAnimationFrame(()=>{

            setViewportHeight();

        });

    },

    {
        passive:true
    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BODY LOCK SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function lockBody(){

    body.style.overflow =
        'hidden';

}

function unlockBody(){

    body.style.overflow =
        '';

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODAL ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeAllModals(){

    legalModals.forEach(modal=>{

        modal.classList.remove(
            'active'
        );

    });

    unlockBody();

}

function openModal(modalId){

    const modal =
        document.getElementById(
            modalId
        );

    if(!modal) return;

    closeAllModals();

    modal.classList.add(
        'active'
    );

    lockBody();

}

function closeModal(modal){

    if(!modal) return;

    modal.classList.remove(
        'active'
    );

    unlockBody();

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CARD EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    let startX = 0;
    let startY = 0;
    let moved = false;

    card.addEventListener(

        'touchstart',

        event=>{

            startX =
                event.touches[0].clientX;

            startY =
                event.touches[0].clientY;

            moved = false;

        },

        {
            passive:true
        }

    );

    card.addEventListener(

        'touchmove',

        event=>{

            const moveX =
                Math.abs(

                    event.touches[0].clientX
                    - startX

                );

            const moveY =
                Math.abs(

                    event.touches[0].clientY
                    - startY

                );

            if(

                moveX > 8
                ||
                moveY > 8

            ){

                moved = true;

            }

        },

        {
            passive:true
        }

    );

    card.addEventListener(

        'touchend',

        ()=>{

            if(moved) return;

            const modalId =
                card.dataset.modal;

            openModal(modalId);

        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLOSE BUTTON EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

closeButtons.forEach(button=>{

    button.addEventListener(

        'click',

        ()=>{

            const modal =
                button.closest(
                    '.legal-modal'
                );

            closeModal(modal);

        }

    );

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTSIDE MODAL CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach(modal=>{

    modal.addEventListener(

        'click',

        event=>{

            if(event.target === modal){

                closeModal(modal);

            }

        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCAPE KEY SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener(

    'keydown',

    event=>{

        if(event.key === 'Escape'){

            closeAllModals();

        }

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCORDION ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeAccordion(accordion){

    accordion.classList.remove(
        'active'
    );

}

function openAccordion(accordion){

    accordion.classList.add(
        'active'
    );

}

function closeSiblingAccordions(
    currentAccordion
){

    const parent =
        currentAccordion.closest(
            '.modal-scroll'
        );

    if(!parent) return;

    const accordions =
        parent.querySelectorAll(
            '.accordion'
        );

    accordions.forEach(accordion=>{

        if(
            accordion !== currentAccordion
        ){

            closeAccordion(
                accordion
            );

        }

    });

}

accordionHeaders.forEach(header=>{

    header.addEventListener(

        'click',

        ()=>{

            const accordion =
                header.parentElement;

            const isActive =
                accordion.classList.contains(
                    'active'
                );

            closeSiblingAccordions(
                accordion
            );

            if(isActive){

                closeAccordion(
                    accordion
                );

            }

            else{

                openAccordion(
                    accordion
                );

            }

        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESET STATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(

    'pageshow',

    ()=>{

        closeAllModals();

        unlockBody();

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(

`
Municipal Legal Operating System
Chapter I Initialized
`

);