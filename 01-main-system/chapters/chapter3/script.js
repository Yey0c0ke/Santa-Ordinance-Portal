/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CHAPTER III • SCRIPT.JS
        STABLE PERFORMANCE VERSION
        LGU PORTAL 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SELECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const legalCards =
    document.querySelectorAll('.legal-card');

const legalModals =
    document.querySelectorAll('.legal-modal');

const closeButtons =
    document.querySelectorAll('.close-modal');

const accordions =
    document.querySelectorAll('.accordion');

const body =
    document.body;


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACTIVE MODAL STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let activeModal = null;


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFE VIEWPORT HEIGHT
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


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            RESIZE ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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
            IOS ORIENTATION FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    'orientationchange',
    ()=>{

        setTimeout(()=>{

            setViewportHeight();

        },250);

    },
    {
        passive:true
    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            IOS DEVICE DETECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function isiOS(){

    return /iPhone|iPad|iPod/i.test(
        navigator.userAgent
    );

}

if(isiOS()){

    document.body.classList.add(
        'ios-device'
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BODY SCROLL LOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function lockBodyScroll(){

    body.classList.add(
        'modal-open'
    );

    body.style.overflow =
        'hidden';

}

function unlockBodyScroll(){

    body.classList.remove(
        'modal-open'
    );

    body.style.overflow =
        '';

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            RESET MODAL SCROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function resetModalScroll(modal){

    const scrollContainer =
        modal.querySelector(
            '.modal-scroll'
        );

    if(scrollContainer){

        scrollContainer.scrollTop = 0;

    }

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                CLOSE ALL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeAllModals(){

    legalModals.forEach(modal=>{

        modal.classList.remove(
            'active'
        );

    });

    unlockBodyScroll();

    activeModal = null;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                OPEN MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function openModal(modalId){

    const modal =
        document.getElementById(
            modalId
        );

    if(!modal) return;

    closeAllModals();

    resetModalScroll(modal);

    modal.classList.add(
        'active'
    );

    lockBodyScroll();

    activeModal = modal;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                CLOSE MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeModal(modal){

    if(!modal) return;

    modal.classList.remove(
        'active'
    );

    unlockBodyScroll();

    activeModal = null;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CARD CLICK ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    card.addEventListener(
        'click',
        ()=>{

            const modalId =
                card.dataset.modal;

            if(!modalId) return;

            openModal(modalId);

        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TOUCH STABILIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    card.addEventListener(
        'touchstart',
        ()=>{},
        {
            passive:true
        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CLOSE BUTTON ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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
            OUTSIDE CLICK CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach(modal=>{

    modal.addEventListener(
        'click',
        (event)=>{

            if(event.target === modal){

                closeModal(modal);

            }

        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ESC CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener(
    'keydown',
    (event)=>{

        if(
            event.key === 'Escape'
            &&
            activeModal
        ){

            closeModal(activeModal);

        }

    }
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACCORDION ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CLOSE ACCORDION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeAccordion(accordion){

    if(!accordion) return;

    const content =
        accordion.querySelector(
            '.accordion-content'
        );

    accordion.classList.remove(
        'active'
    );

    content.style.maxHeight =
        null;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            OPEN ACCORDION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function openAccordion(accordion){

    if(!accordion) return;

    const content =
        accordion.querySelector(
            '.accordion-content'
        );

    accordion.classList.add(
        'active'
    );

    requestAnimationFrame(()=>{

        content.style.maxHeight =
            content.scrollHeight + 'px';

    });

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CLOSE SIBLING ACCORDIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeSiblingAccordions(
    currentAccordion
){

    const parentModal =
        currentAccordion.closest(
            '.modal-scroll'
        );

    if(!parentModal) return;

    const siblingAccordions =
        parentModal.querySelectorAll(
            '.accordion'
        );

    siblingAccordions.forEach(
        accordion=>{

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
            ACCORDION EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

accordions.forEach(accordion=>{

    const header =
        accordion.querySelector(
            '.accordion-header'
        );

    header.addEventListener(
        'click',
        ()=>{

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

            }else{

                openAccordion(
                    accordion
                );

            }

        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TOUCH SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

accordions.forEach(accordion=>{

    const header =
        accordion.querySelector(
            '.accordion-header'
        );

    header.addEventListener(
        'touchstart',
        ()=>{},
        {
            passive:true
        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            GPU RENDER BOOST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.querySelectorAll(
    '.glass'
).forEach(el=>{

    el.style.transform =
        'translateZ(0)';

    el.style.backfaceVisibility =
        'hidden';

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFE MODAL CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function hasActiveModal(){

    return document.querySelector(
        '.legal-modal.active'
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            RESIZE STABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    'resize',
    ()=>{

        const activeModal =
            hasActiveModal();

        if(activeModal){

            lockBodyScroll();

        }

    },
    {
        passive:true
    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MOBILE STABILIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach(modal=>{

    modal.addEventListener(
        'touchmove',
        event=>{

            const modalScroll =
                modal.querySelector(
                    '.modal-scroll'
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
            SAFE CLICK PREVENTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener(
    'dragstart',
    event=>{

        event.preventDefault();

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PERFORMANCE READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER III INITIALIZED
STABLE PERFORMANCE BUILD
LGU PORTAL 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            END OF FILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */