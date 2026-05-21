/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CHAPTER III • SCRIPT.JS
        PART 1 — FOUNDATION
        LGU PORTAL 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SELECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const legalCards =
    document.querySelectorAll('.legal-card');

const legalModals =
    document.querySelectorAll('.legal-modal');

const closeButtons =
    document.querySelectorAll('.close-modal');

const body =
    document.body;


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACTIVE MODAL STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let activeModal = null;


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            OPEN MODAL FUNCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function openModal(modalId){

    const modal =
        document.getElementById(modalId);

    if(!modal) return;

    modal.classList.add('active');

    body.classList.add('modal-open');

    activeModal = modal;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CLOSE MODAL FUNCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeModal(modal){

    if(!modal) return;

    modal.classList.remove('active');

    body.classList.remove('modal-open');

    activeModal = null;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CARD CLICK EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    card.addEventListener('click',()=>{

        const modalId =
            card.dataset.modal;

        openModal(modalId);

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CLOSE BUTTON EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

closeButtons.forEach(button=>{

    button.addEventListener('click',()=>{

        const modal =
            button.closest('.legal-modal');

        closeModal(modal);

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BACKDROP CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach(modal=>{

    modal.addEventListener('click',(e)=>{

        if(e.target === modal){

            closeModal(modal);

        }

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ESCAPE KEY SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener('keydown',(e)=>{

    if(e.key === 'Escape' && activeModal){

        closeModal(activeModal);

    }

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TOUCH STABILIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    card.addEventListener(
        'touchstart',
        ()=>{},
        { passive:true }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MODAL SCROLL RESET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function resetModalScroll(modal){

    const scrollContainer =
        modal.querySelector('.modal-scroll');

    if(scrollContainer){

        scrollContainer.scrollTop = 0;

    }

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        RESET SCROLL ON OPEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    card.addEventListener('click',()=>{

        const modalId =
            card.dataset.modal;

        const modal =
            document.getElementById(modalId);

        if(modal){

            resetModalScroll(modal);

        }

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFE VIEWPORT HEIGHT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function setViewportHeight(){

    const vh =
        window.innerHeight * 0.01;

    document.documentElement
        .style
        .setProperty('--vh',`${vh}px`);

}

setViewportHeight();

window.addEventListener(
    'resize',
    setViewportHeight
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            IOS SAFE FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    'orientationchange',
    ()=>{

        setTimeout(()=>{

            setViewportHeight();

        },300);

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            GPU RENDER BOOST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.querySelectorAll(
    '.glass'
).forEach(el=>{

    el.style.transform =
        'translateZ(0)';

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            END PART 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        PART 2 — ACCORDION ENGINE
        CHAPTER III 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACCORDION SELECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const accordions =
    document.querySelectorAll('.accordion');


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TOGGLE ACCORDION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function toggleAccordion(accordion){

    const content =
        accordion.querySelector(
            '.accordion-content'
        );

    const isActive =
        accordion.classList.contains(
            'active'
        );

    if(isActive){

        closeAccordion(
            accordion,
            content
        );

    }else{

        openAccordion(
            accordion,
            content
        );

    }

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            OPEN ACCORDION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function openAccordion(
    accordion,
    content
){

    accordion.classList.add('active');

    content.style.maxHeight =
        content.scrollHeight + 'px';

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CLOSE ACCORDION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeAccordion(
    accordion,
    content
){

    accordion.classList.remove('active');

    content.style.maxHeight = null;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACCORDION EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

accordions.forEach(accordion=>{

    const header =
        accordion.querySelector(
            '.accordion-header'
        );

    const content =
        accordion.querySelector(
            '.accordion-content'
        );

    header.addEventListener('click',()=>{

        toggleAccordion(accordion);

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        AUTO RECALCULATE HEIGHT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function refreshAccordionHeights(){

    accordions.forEach(accordion=>{

        if(
            accordion.classList.contains(
                'active'
            )
        ){

            const content =
                accordion.querySelector(
                    '.accordion-content'
                );

            content.style.maxHeight =
                content.scrollHeight + 'px';

        }

    });

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            WINDOW RESIZE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    'resize',
    refreshAccordionHeights
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ORIENTATION CHANGE SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    'orientationchange',
    ()=>{

        setTimeout(()=>{

            refreshAccordionHeights();

        },400);

    }
);


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
        { passive:true }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SMOOTH OPEN EFFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

accordions.forEach(accordion=>{

    accordion.addEventListener(
        'transitionend',
        ()=>{

            refreshAccordionHeights();

        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFE OVERFLOW FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

accordions.forEach(accordion=>{

    const content =
        accordion.querySelector(
            '.accordion-content'
        );

    content.style.willChange =
        'max-height';

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        PREVENT DOUBLE TAP ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let accordionLock = false;

accordions.forEach(accordion=>{

    const header =
        accordion.querySelector(
            '.accordion-header'
        );

    header.addEventListener('click',()=>{

        if(accordionLock) return;

        accordionLock = true;

        setTimeout(()=>{

            accordionLock = false;

        },180);

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            END PART 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    PART 3 — ADVANCED UX SYSTEM
    CHAPTER III 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PREVENT BODY SHIFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function getScrollbarWidth(){

    return window.innerWidth -
        document.documentElement.clientWidth;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            LOCK BODY SCROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function lockBodyScroll(){

    const scrollbarWidth =
        getScrollbarWidth();

    body.style.overflow = 'hidden';

    body.style.paddingRight =
        `${scrollbarWidth}px`;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            UNLOCK BODY SCROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function unlockBodyScroll(){

    body.style.overflow = '';

    body.style.paddingRight = '';

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ENHANCED OPEN MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function enhancedOpenModal(modalId){

    const modal =
        document.getElementById(modalId);

    if(!modal) return;

    lockBodyScroll();

    modal.classList.add('active');

    body.classList.add('modal-open');

    activeModal = modal;

    requestAnimationFrame(()=>{

        refreshAccordionHeights();

    });

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ENHANCED CLOSE MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function enhancedCloseModal(modal){

    if(!modal) return;

    modal.classList.remove('active');

    unlockBodyScroll();

    body.classList.remove('modal-open');

    activeModal = null;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            REBIND CARD EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    card.replaceWith(card.cloneNode(true));

});

const refreshedCards =
    document.querySelectorAll('.legal-card');

refreshedCards.forEach(card=>{

    card.addEventListener('click',()=>{

        const modalId =
            card.dataset.modal;

        enhancedOpenModal(modalId);

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        REBIND CLOSE BUTTON EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document
.querySelectorAll('.close-modal')
.forEach(button=>{

    button.addEventListener('click',()=>{

        const modal =
            button.closest('.legal-modal');

        enhancedCloseModal(modal);

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            REBIND BACKDROP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach(modal=>{

    modal.addEventListener('click',(e)=>{

        if(e.target === modal){

            enhancedCloseModal(modal);

        }

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ESCAPE KEY UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener('keydown',(e)=>{

    if(
        e.key === 'Escape' &&
        activeModal
    ){

        enhancedCloseModal(activeModal);

    }

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            AUTO CLOSE ON RESIZE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let previousWidth =
    window.innerWidth;

window.addEventListener('resize',()=>{

    const currentWidth =
        window.innerWidth;

    const difference =
        Math.abs(
            currentWidth -
            previousWidth
        );

    if(difference > 140){

        refreshAccordionHeights();

    }

    previousWidth =
        currentWidth;

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FOCUS TRAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener('keydown',(e)=>{

    if(
        e.key !== 'Tab' ||
        !activeModal
    ) return;

    const focusable =
        activeModal.querySelectorAll(
            'button,[href],input,textarea,select'
        );

    if(!focusable.length) return;

    const first =
        focusable[0];

    const last =
        focusable[
            focusable.length - 1
        ];

    if(
        e.shiftKey &&
        document.activeElement === first
    ){

        e.preventDefault();

        last.focus();

    }else if(
        !e.shiftKey &&
        document.activeElement === last
    ){

        e.preventDefault();

        first.focus();

    }

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SCROLL SHADOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document
.querySelectorAll('.modal-scroll')
.forEach(scrollArea=>{

    scrollArea.addEventListener(
        'scroll',
        ()=>{

            const modal =
                scrollArea.closest(
                    '.modal-content'
                );

            if(scrollArea.scrollTop > 8){

                modal.classList.add(
                    'scrolled'
                );

            }else{

                modal.classList.remove(
                    'scrolled'
                );

            }

        },
        { passive:true }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            RAF PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let ticking = false;

function optimizedResize(){

    if(!ticking){

        window.requestAnimationFrame(()=>{

            refreshAccordionHeights();

            ticking = false;

        });

        ticking = true;

    }

}

window.addEventListener(
    'resize',
    optimizedResize
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFE PASSIVE EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    'touchstart',
    ()=>{},
    { passive:true }
);

window.addEventListener(
    'touchmove',
    ()=>{},
    { passive:true }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            IOS MODAL FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document
.querySelectorAll('.modal-scroll')
.forEach(scrollArea=>{

    scrollArea.style.webkitOverflowScrolling =
        'touch';

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SAFE CLICK DELAY FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document
.querySelectorAll('button')
.forEach(button=>{

    button.style.touchAction =
        'manipulation';

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            END PART 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    PART 4 — CINEMATIC INTERACTIONS
    CHAPTER III 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CARD PARALLAX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const motionCards =
    document.querySelectorAll('.legal-card');

motionCards.forEach(card=>{

    card.addEventListener('mousemove',(e)=>{

        if(window.innerWidth < 769) return;

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

        const rotateX =
            ((y - centerY) / 18) * -1;

        const rotateY =
            (x - centerX) / 18;

        card.style.transform =

            `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-6px)
            `;

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            RESET CARD TRANSFORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

motionCards.forEach(card=>{

    card.addEventListener('mouseleave',()=>{

        card.style.transform = '';

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CARD FOCUS GLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

motionCards.forEach(card=>{

    card.addEventListener('mouseenter',()=>{

        card.style.zIndex = '2';

    });

    card.addEventListener('mouseleave',()=>{

        card.style.zIndex = '';

    });

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            HERO REVEAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const hero =
    document.querySelector('.hero');

if(hero){

    hero.animate(

        [

            {
                opacity:0,
                transform:
                    'translateY(20px)'
            },

            {
                opacity:1,
                transform:
                    'translateY(0)'
            }

        ],

        {
            duration:700,
            easing:
                'cubic-bezier(.22,1,.36,1)',
            fill:'forwards'
        }

    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CARD REVEAL SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const revealObserver =
    new IntersectionObserver(

    entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add(
                    'card-visible'
                );

            }

        });

    },

    {
        threshold:0.08
    }

);

motionCards.forEach(card=>{

    revealObserver.observe(card);

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            INJECT REVEAL STYLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const revealStyle =
document.createElement('style');

revealStyle.innerHTML = `

.legal-card{

    opacity:0;

    transform:
        translateY(30px);

}

.legal-card.card-visible{

    opacity:1;

    transform:
        translateY(0);

    transition:

        opacity 0.6s ease,

        transform 0.6s
        cubic-bezier(.22,1,.36,1);

}

`;

document.head.appendChild(
    revealStyle
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            STAGGER REVEAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

motionCards.forEach((card,index)=>{

    card.style.transitionDelay =
        `${index * 40}ms`;

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MODAL OPEN ANIMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalModals.forEach(modal=>{

    modal.addEventListener(
        'transitionend',
        ()=>{

            if(
                modal.classList.contains(
                    'active'
                )
            ){

                const firstAccordion =
                    modal.querySelector(
                        '.accordion'
                    );

                if(firstAccordion){

                    firstAccordion.style.opacity =
                        '1';

                }

            }

        }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SCROLL PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document
.querySelectorAll('.modal-scroll')
.forEach(scrollArea=>{

    const progress =
        document.createElement('div');

    progress.className =
        'scroll-progress';

    scrollArea.appendChild(progress);

    scrollArea.addEventListener(
        'scroll',
        ()=>{

            const scrollTop =
                scrollArea.scrollTop;

            const scrollHeight =
                scrollArea.scrollHeight -
                scrollArea.clientHeight;

            const percent =
                (scrollTop / scrollHeight) * 100;

            progress.style.width =
                `${percent}%`;

        },
        { passive:true }
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PROGRESS STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const progressStyle =
document.createElement('style');

progressStyle.innerHTML = `

.scroll-progress{

    position:sticky;

    top:0;

    left:0;

    width:0;

    height:2px;

    background:

        linear-gradient(
            to right,
            #3b82f6,
            #7c3aed
        );

    z-index:5;

    border-radius:999px;

}

`;

document.head.appendChild(
    progressStyle
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MEMORY CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
    'beforeunload',
    ()=>{

        revealObserver.disconnect();

    }
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PERFORMANCE MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const isLowEndDevice =

    navigator.hardwareConcurrency &&
    navigator.hardwareConcurrency <= 4;

if(isLowEndDevice){

    document.body.classList.add(
        'reduced-effects'
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            REDUCED EFFECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const reducedStyle =
document.createElement('style');

reducedStyle.innerHTML = `

.reduced-effects .legal-card{

    backdrop-filter:none !important;

    -webkit-backdrop-filter:none !important;

}

.reduced-effects .orb{

    display:none !important;

}

`;

document.head.appendChild(
    reducedStyle
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FINAL READY LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(

    `
    ━━━━━━━━━━━━━━━━━━━━━━━
        CHAPTER III READY
           LGU PORTAL 💎
    ━━━━━━━━━━━━━━━━━━━━━━━
    `
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                END PART 4
        CHAPTER III JS COMPLETE 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */