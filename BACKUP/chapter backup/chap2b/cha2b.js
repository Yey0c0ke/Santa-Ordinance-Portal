/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOM CACHE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const body =
    document.body;

const legalCards =
    document.querySelectorAll(
        '.legal-card'
    );

const modals =
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

const floatingGlow =
    document.querySelector(
        '.floating-glow'
    );


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(

    'load',

    ()=>{

        setTimeout(()=>{

            body.classList.add(
                'ready'
            );

        },500);

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CARD EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    card.addEventListener(

        'click',

        ()=>{

            const modalId =
                card.dataset.modal;

            openModal(
                modalId
            );

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

            closeModal(
                modal
            );

        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKDROP CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

modals.forEach(modal=>{

    modal.addEventListener(

        'click',

        event=>{

            if(
                event.target === modal
            ){

                closeModal(
                    modal
                );

            }

        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESC KEY CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener(

    'keydown',

    event=>{

        if(
            event.key === 'Escape'
        ){

            modals.forEach(modal=>{

                if(
                    modal.classList.contains(
                        'active'
                    )
                ){

                    closeModal(
                        modal
                    );

                }

            });

        }

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCORDION ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function closeAccordion(
    accordion
){

    accordion.classList.remove(
        'active'
    );

}


function openAccordion(
    accordion
){

    accordion.classList.add(
        'active'
    );

    requestAnimationFrame(()=>{

        accordion.scrollIntoView({

            behavior:'smooth',
            block:'nearest'

        });

    });

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


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCORDION EVENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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
IOS SMOOTH SCROLL ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const modalScrolls =
    document.querySelectorAll(
        '.modal-scroll'
    );

modalScrolls.forEach(scrollArea=>{

    let isTicking = false;

    scrollArea.addEventListener(

        'scroll',

        ()=>{

            if(!isTicking){

                window.requestAnimationFrame(()=>{

                    isTicking = false;

                });

                isTicking = true;

            }

        },

        {
            passive:true
        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAGNETIC CARD MOTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

legalCards.forEach(card=>{

    card.addEventListener(

        'mousemove',

        event=>{

            if(
                window.innerWidth < 900
            ) return;

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left;

            const y =
                event.clientY -
                rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -4;

            const rotateY =
                ((x - centerX) / centerX) * 4;

            card.style.transform =

                `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
                scale(1.015)
                `;

        }

    );

    card.addEventListener(

        'mouseleave',

        ()=>{

            card.style.transform =
                '';

        }

    );

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOATING GLOW FOLLOWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

if(window.innerWidth > 900){

    document.addEventListener(

        'mousemove',

        event=>{

            if(!floatingGlow) return;

            window.requestAnimationFrame(()=>{

                floatingGlow.style.transform =

                    `
                    translate3d(
                        ${event.clientX}px,
                        ${event.clientY}px,
                        0
                    )
                    `;

            });

        },

        {
            passive:true
        }

    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOBILE TOUCH FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

modals.forEach(modal=>{

    const scrollArea =
        modal.querySelector(
            '.modal-scroll'
        );

    if(!scrollArea) return;

    scrollArea.addEventListener(

        'touchstart',

        ()=>{},

        {
            passive:true
        }

    );

    scrollArea.addEventListener(

        'touchmove',

        ()=>{},

        {
            passive:true
        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCROLL RESTORATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

modals.forEach(modal=>{

    modal.addEventListener(

        'transitionend',

        ()=>{

            if(
                !modal.classList.contains(
                    'active'
                )
            ){

                const scrollArea =
                    modal.querySelector(
                        '.modal-scroll'
                    );

                if(scrollArea){

                    scrollArea.scrollTo({

                        top:0,
                        behavior:'smooth'

                    });

                }

            }

        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCORDION AUTO SCROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function smoothAccordionScroll(){ return; }


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IOS MOMENTUM SCROLL LOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let currentScrollY = 0;

function lockBodyScroll(){

    currentScrollY =
        window.scrollY;

    body.style.position =
        'fixed';

    body.style.top =
        `-${currentScrollY}px`;

    body.style.left =
        '0';

    body.style.right =
        '0';

    body.style.width =
        '100%';

}


function unlockBodyScroll(){

    body.style.position =
        '';

    body.style.top =
        '';

    body.style.left =
        '';

    body.style.right =
        '';

    body.style.width =
        '';

    window.scrollTo(

        0,
        currentScrollY

    );

}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UPDATED MODAL ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function openModal(
    modalId
){

    const modal =
        document.getElementById(
            modalId
        );

    if(!modal) return;

    modal.classList.add(
        'active'
    );

    lockBodyScroll();

}


function closeModal(
    modal
){

    modal.classList.remove(
        'active'
    );

    unlockBodyScroll();

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SMART RESIZE ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let resizeTimer;

window.addEventListener(

    'resize',

    ()=>{

        clearTimeout(
            resizeTimer
        );

        resizeTimer =
            setTimeout(()=>{

                modals.forEach(modal=>{

                    const scrollArea =
                        modal.querySelector(
                            '.modal-scroll'
                        );

                    if(scrollArea){

                        scrollArea.style.willChange =
                            'auto';

                        requestAnimationFrame(()=>{

                            scrollArea.style.willChange =
                                'scroll-position';

                        });

                    }

                });

            },180);

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFORMANCE BOOST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const observer =
    new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    entry.target.style.opacity =
                        '1';

                    entry.target.style.transform =
                        'translateY(0)';

                }

            });

        },

        {
            threshold:.08
        }

    );


document.querySelectorAll(

    '.legal-card, \
     .committee-card, \
     .definition-card'

).forEach(element=>{

    element.style.opacity =
        '0';

    element.style.transform =
        'translateY(30px)';

    element.style.transition =

        'opacity .7s var(--motion-smooth), \
         transform .7s var(--motion-smooth)';

    observer.observe(
        element
    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(

`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Municipal Legal Operating System
Chapter II Initialized
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL READY STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

setTimeout(()=>{

    document.body.classList.add(
        'system-ready'
    );

},600);