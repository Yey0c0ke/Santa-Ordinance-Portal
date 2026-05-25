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

const pageLoader =
document.querySelector(
    '.page-loader'
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let activeModal = null;

let bodyLocked = false;


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIEWPORT ENGINE
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
BODY LOCK ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function lockBody(){

    if(bodyLocked) return;

    body.style.overflow =
        'hidden';

    bodyLocked = true;

}

function unlockBody(){

    body.style.overflow = '';

    bodyLocked = false;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODAL ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeAllModals(){

    legalModals.forEach(modal=>{

        modal.classList.remove(
            'active'
        );

        modal.setAttribute(
            'aria-hidden',
            'true'
        );

    });

    activeModal = null;

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

    modal.setAttribute(
        'aria-hidden',
        'false'
    );

    activeModal = modal;

    lockBody();

}

function closeModal(modal){

    if(!modal) return;

    modal.classList.remove(
        'active'
    );

    modal.setAttribute(
        'aria-hidden',
        'true'
    );

    activeModal = null;

    unlockBody();

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CARD INTERACTION ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    let startX = 0;

    let startY = 0;

    let moved = false;

    let touchStarted = false;

    /* MOBILE / TOUCH */

    card.addEventListener(

        'touchstart',

        event=>{

            const touch =
                event.touches[0];

            startX = touch.clientX;

            startY = touch.clientY;

            moved = false;

            touchStarted = true;

        },

        {
            passive:true
        }

    );

    card.addEventListener(

    'touchmove',

    event=>{

        if(!touchStarted) return;

        const touch =
            event.touches[0];

        const deltaX =
            Math.abs(
                touch.clientX - startX
            );

        const deltaY =
            Math.abs(
                touch.clientY - startY
            );

        if(deltaY > 6){

            moved = true;

            return;

        }

        if(deltaX > 12){

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

            if(moved){

                touchStarted = false;

                return;

            }

            const modalId =
                card.dataset.modal;

            openModal(modalId);

            touchStarted = false;

        },

        {
            passive:true
        }

    );

    /* DESKTOP */

    card.addEventListener(

        'click',

        ()=>{

            if(window.innerWidth <= 768){

                return;

            }

            const modalId =
                card.dataset.modal;

            openModal(modalId);

        }

    );

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODAL CLOSE EVENTS
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
BACKDROP CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach(modal=>{

    modal.addEventListener(

        'click',

        event=>{

            if(
                event.target === modal
            ){

                closeModal(modal);

            }

        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCAPE KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener(

    'keydown',

    event=>{

        if(
            event.key === 'Escape'
        ){

            closeAllModals();

        }

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SMOOTH ACCORDION ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function collapseAccordion(accordion){

    const content =
        accordion.querySelector(
            '.accordion-content'
        );

    if(!content) return;

    content.style.height =
        `${content.scrollHeight}px`;

    requestAnimationFrame(()=>{

        content.style.height =
            '0px';

    });

    accordion.classList.remove(
        'active'
    );

}

function expandAccordion(accordion){

    const content =
        accordion.querySelector(
            '.accordion-content'
        );

    if(!content) return;

    accordion.classList.add(
        'active'
    );

    content.style.height =
        'auto';

    const fullHeight =
        content.scrollHeight;

    content.style.height =
        '0px';

    requestAnimationFrame(()=>{

        content.style.height =
            `${fullHeight}px`;

    });

    content.addEventListener(

        'transitionend',

        function handler(){

            if(
                accordion.classList.contains(
                    'active'
                )
            ){

                content.style.height =
                    'auto';

            }

            content.removeEventListener(
                'transitionend',
                handler
            );

        }

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
            accordion !== currentAccordion &&
            accordion.classList.contains(
                'active'
            )
        ){

            collapseAccordion(
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

                collapseAccordion(
                    accordion
                );

            }

            else{

                expandAccordion(
                    accordion
                );

            }

        }

    );

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOCUS STABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(

    'pageshow',

    ()=>{

        closeAllModals();

        unlockBody();

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAFE VIEWPORT RECALC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(

    'orientationchange',

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
PAGE LOADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(

    'load',

    ()=>{

        if(!pageLoader) return;

        requestAnimationFrame(()=>{

            pageLoader.style.opacity =
                '0';

            pageLoader.style.visibility =
                'hidden';

        });

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCROLL RESTORATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

if(
    'scrollRestoration'
    in history
){

    history.scrollRestoration =
        'manual';

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAFETY RESET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(

    'blur',

    ()=>{

        legalCards.forEach(card=>{

            card.style.transform = '';

        });

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IOS MOMENTUM REFINEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const modalScrolls =
document.querySelectorAll(
    '.modal-scroll'
);

modalScrolls.forEach(scroll=>{

    let isTicking = false;

    scroll.addEventListener(

        'scroll',

        ()=>{

            if(isTicking) return;

            isTicking = true;

            requestAnimationFrame(()=>{

                scroll.style.willChange =
                    'scroll-position';

                clearTimeout(
                    scroll._scrollTimeout
                );

                scroll._scrollTimeout =
                    setTimeout(()=>{

                        scroll.style.willChange =
                            'auto';

                    },120);

                isTicking = false;

            });

        },

        {
            passive:true
        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(

`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Municipal Legal Operating System
Chapter I Initialized
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

);