/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                LGU PORTAL 16 💎
            PREMIUM RAIL ENGINE
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
                ENGINE FLAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let sliderTicking = false;
let navTicking = false;


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

    return firstCard.offsetWidth + 24;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function scrollNext(){

    chaptersTrack.scrollBy({

        left:getScrollAmount(),

        behavior:'smooth'

    });

}

function scrollPrev(){

    chaptersTrack.scrollBy({

        left:-getScrollAmount(),

        behavior:'smooth'

    });

}


/* BUTTON EVENTS */

nextBtn?.addEventListener(
    'click',
    scrollNext
);

prevBtn?.addEventListener(
    'click',
    scrollPrev
);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CENTER STABILIZER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function stabilizeSliderPosition(){

    const firstCard =
        document.querySelector('.chapter-card');

    if(!firstCard) return;

    const cardWidth =
        firstCard.offsetWidth;

    const dynamicPadding =
        Math.max(
            (window.innerWidth - cardWidth) / 2,
            20
        );

    chaptersTrack.style.paddingLeft =
        `${dynamicPadding}px`;

    chaptersTrack.style.paddingRight =
        `${dynamicPadding}px`;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ACTIVE CENTER CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function updateCenteredCard(){

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

        card.classList.remove(
            'active-card'
        );

        if(normalized < 0.18){

            card.classList.add(
                'active-card'
            );

        }

        const scale =
            1 - (normalized * 0.05);

        const translateY =
            normalized * 10;

        const opacity =
            1 - (normalized * 0.12);

        card.style.transform =
            `translateY(${translateY}px) scale(${scale})`;

        card.style.opacity =
            opacity;

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

chaptersTrack?.addEventListener(

    'scroll',

    ()=>{

        if(!sliderTicking){

            requestAnimationFrame(()=>{

                updateCenteredCard();

                sliderTicking = false;

            });

            sliderTicking = true;

        }

    },

    { passive:true }

);

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

openAI?.addEventListener(

    'click',

    openAIModal

);


/* CLOSE BACKDROP */

closeAI?.addEventListener(

    'click',

    closeAIModal

);


/* CLOSE BUTTON */

closeModalBtn?.addEventListener(

    'click',

    closeAIModal

);


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
            FADE ANIMATION SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const observerOptions = {

    threshold:0.14

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
            NAVBAR SCROLL EFFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function handleNavbarScroll(){

    if(window.scrollY > 40){

        floatingNav.classList.add(
            'nav-scrolled'
        );

    }else{

        floatingNav.classList.remove(
            'nav-scrolled'
        );

    }

}


/* OPTIMIZED NAVBAR SCROLL */

window.addEventListener(

    'scroll',

    ()=>{

        if(!navTicking){

            requestAnimationFrame(()=>{

                handleNavbarScroll();

                navTicking = false;

            });

            navTicking = true;

        }

    },

    { passive:true }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MOBILE STABILIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

if(isMobileView()){

    chaptersTrack.style.scrollBehavior =
        'smooth';

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            PERFORMANCE CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(

    'orientationchange',

    ()=>{

        setTimeout(()=>{

            stabilizeSliderPosition();

            updateCenteredCard();

        },120);

    }

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                FINAL INIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(

`
LGU PORTAL 16 💎
PREMIUM RAIL PATCH READY
SMOOTHNESS SYSTEM ACTIVE
`

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                END OF JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */