/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                YEYO 💎
        LGU PORTAL 16 • MAIN JS
      MOBILE STABILITY PATCH VERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                DOM REFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const chaptersTrack =
    document.getElementById('chaptersTrack');

const prevBtn =
    document.getElementById('prevBtn');

const nextBtn =
    document.getElementById('nextBtn');

const aiModal =
    document.getElementById('aiModal');

const openAI =
    document.getElementById('openAI');

const closeAI =
    document.getElementById('closeAI');

const closeModalBtn =
    document.getElementById('closeModalBtn');

const chapterCards =
    document.querySelectorAll('.chapter-card');

const floatingNav =
    document.querySelector('.floating-nav');


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                DEVICE DETECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function isMobileView(){

    return window.innerWidth <= 768;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SLIDER ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function getScrollAmount(){

    const firstCard =
        document.querySelector('.chapter-card');

    if(!firstCard) return 320;

    const cardWidth =
        firstCard.offsetWidth;

    const computedStyle =
        window.getComputedStyle(chaptersTrack);

    const gap =
        parseInt(
            computedStyle.columnGap ||
            computedStyle.gap ||
            24
        );

    return cardWidth + gap;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function scrollNext(){

    const scrollAmount =
        getScrollAmount();

    chaptersTrack.scrollBy({

        left:scrollAmount,

        behavior:'smooth'

    });

}


function scrollPrev(){

    const scrollAmount =
        getScrollAmount();

    chaptersTrack.scrollBy({

        left:-scrollAmount,

        behavior:'smooth'

    });

}


/* BUTTON EVENTS */

if(nextBtn){

    nextBtn.addEventListener(

        'click',

        scrollNext

    );

}

if(prevBtn){

    prevBtn.addEventListener(

        'click',

        scrollPrev

    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                CENTER STABILIZER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function stabilizeSliderPosition(){

    if(!chaptersTrack) return;

    const firstCard =
        document.querySelector('.chapter-card');

    if(!firstCard) return;

    const cardWidth =
        firstCard.offsetWidth;

    let dynamicPadding;

    if(isMobileView()){

        dynamicPadding =
            16;

    }else{

        dynamicPadding =
            Math.max(
                (window.innerWidth - cardWidth) / 2,
                22
            );

    }

    chaptersTrack.style.paddingLeft =
        `${dynamicPadding}px`;

    chaptersTrack.style.paddingRight =
        `${dynamicPadding}px`;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ACTIVE CENTER CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function updateCenteredCard(){

    if(!chaptersTrack) return;

    const center =
        window.innerWidth / 2;

    chapterCards.forEach((card)=>{

        const rect =
            card.getBoundingClientRect();

        const cardCenter =
            rect.left + rect.width / 2;

        const distance =
            Math.abs(center - cardCenter);

        const normalized =
            Math.min(
                distance / (window.innerWidth * 0.5),
                1
            );

        /* MOBILE ENGINE */

        if(isMobileView()){

            const scale =
                1 - (normalized * 0.04);

            const translateY =
                normalized * 8;

            const opacity =
                1 - (normalized * 0.10);

            card.style.transform =
                `translateY(${translateY}px) scale(${scale})`;

            card.style.opacity =
                opacity;

            card.style.filter =
                `blur(0px)`;

            card.style.zIndex =
                Math.round(100 - distance);

            card.style.boxShadow =
                `
                0 12px 28px rgba(0,0,0,0.24)
                `;

            return;

        }

        /* DESKTOP ENGINE */

        const scale =
            1 - (normalized * 0.12);

        const translateY =
            normalized * 30;

        const blur =
            normalized * 1.4;

        const opacity =
            1 - (normalized * 0.40);

        card.style.transform =
            `translateY(${translateY}px) scale(${scale})`;

        card.style.opacity =
            opacity;

        card.style.filter =
            `blur(${blur}px)`;

        card.style.zIndex =
            Math.round(100 - distance);

        if(normalized < 0.18){

            card.style.boxShadow =
                `
                0 34px 80px rgba(0,0,0,0.46),
                0 0 50px rgba(37,99,235,0.16)
                `;

        }else{

            card.style.boxShadow =
                `
                0 16px 38px rgba(0,0,0,0.30)
                `;

        }

    });

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                INITIALIZE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(

    'load',

    ()=>{

        stabilizeSliderPosition();

        updateCenteredCard();

    }

);


/* RESIZE */

window.addEventListener(

    'resize',

    ()=>{

        stabilizeSliderPosition();

        updateCenteredCard();

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TRACK SCROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let ticking = false;
let snapTimeout;

if(chaptersTrack){

    chaptersTrack.addEventListener(

        'scroll',

        ()=>{

            if(!ticking){

                window.requestAnimationFrame(()=>{

                    updateCenteredCard();

                    ticking = false;

                });

                ticking = true;

            }

            /* MOBILE:
               NO FORCED SNAP
            */

            if(isMobileView()) return;

            clearTimeout(snapTimeout);

            snapTimeout = setTimeout(()=>{

                const center =
                    window.innerWidth / 2;

                let closestCard = null;

                let closestDistance = Infinity;

                chapterCards.forEach((card)=>{

                    const rect =
                        card.getBoundingClientRect();

                    const cardCenter =
                        rect.left + rect.width / 2;

                    const distance =
                        Math.abs(center - cardCenter);

                    if(distance < closestDistance){

                        closestDistance =
                            distance;

                        closestCard =
                            card;

                    }

                });

                if(closestCard){

                    closestCard.scrollIntoView({

                        behavior:'smooth',

                        inline:'center',

                        block:'nearest'

                    });

                }

            },100);

        },

        { passive:true }

    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                AI MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function openAIModal(){

    aiModal.classList.add('active');

    document.body.style.overflow =
        'hidden';

}


function closeAIModal(){

    aiModal.classList.remove('active');

    document.body.style.overflow =
        '';

}


/* OPEN */

if(openAI){

    openAI.addEventListener(

        'click',

        openAIModal

    );

}


/* CLOSE BACKDROP */

if(closeAI){

    closeAI.addEventListener(

        'click',

        closeAIModal

    );

}


/* CLOSE BUTTON */

if(closeModalBtn){

    closeModalBtn.addEventListener(

        'click',

        closeAIModal

    );

}


/* ESC KEY */

document.addEventListener(

    'keydown',

    (e)=>{

        if(e.key === 'Escape'){

            closeAIModal();

        }

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                FADE ANIMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const observerOptions = {

    threshold:0.15

};


const fadeObserver = new IntersectionObserver(

    (entries)=>{

        entries.forEach((entry)=>{

            if(entry.isIntersecting){

                entry.target.classList.add(
                    'show-element'
                );

            }

        });

    },

    observerOptions

);


/* OBSERVE CHAPTERS */

chapterCards.forEach((card)=>{

    card.classList.add(
        'fade-element'
    );

    fadeObserver.observe(card);

});


/* OBSERVE INFO CARDS */

document.querySelectorAll('.info-card')
.forEach((card)=>{

    card.classList.add(
        'fade-element'
    );

    fadeObserver.observe(card);

});


/* OBSERVE AI PANEL */

const aiPanel =
    document.querySelector('.ai-panel');

if(aiPanel){

    aiPanel.classList.add(
        'fade-element'
    );

    fadeObserver.observe(aiPanel);

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                NAVBAR EFFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function handleNavbarScroll(){

    const currentScroll =
        window.scrollY;

    if(currentScroll > 40){

        floatingNav.classList.add(
            'nav-scrolled'
        );

    }else{

        floatingNav.classList.remove(
            'nav-scrolled'
        );

    }

}


/* OPTIMIZED SCROLL */

window.addEventListener(

    'scroll',

    ()=>{

        if(!ticking){

            window.requestAnimationFrame(()=>{

                handleNavbarScroll();

                ticking = false;

            });

            ticking = true;

        }

    },

    { passive:true }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                BUTTON FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.querySelectorAll('button')
.forEach((button)=>{

    button.addEventListener(

        'mousedown',

        ()=>{

            if(
                !button.classList.contains(
                    'disabled-btn'
                )
            ){

                button.style.transform =
                    'scale(0.97)';

            }

        }

    );

    button.addEventListener(

        'mouseup',

        ()=>{

            button.style.transform =
                '';

        }

    );

    button.addEventListener(

        'mouseleave',

        ()=>{

            button.style.transform =
                '';

        }

    );

});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                PERFORMANCE INIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(

`
LGU PORTAL 16 💎
MOBILE STABILITY PATCH READY
`

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                END OF JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */