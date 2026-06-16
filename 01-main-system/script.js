/* =========================
DOM
========================= */

const chaptersTrack =
document.getElementById(
    'chaptersTrack'
);

const chapterCards =
[
    ...document.querySelectorAll(
        '.chapter-card'
    )
];

const prevBtn =
document.getElementById(
    'prevBtn'
);

const nextBtn =
document.getElementById(
    'nextBtn'
);

/*

AI handled by shared/shared-ai.js

*/

/* =========================
GLOBAL STATE
========================= */

const railState = {

    activeIndex:0,

    isSnapping:false,

    snapFrame:null,

    scrollEndTimer:null,

    userScrolling:false

};

/* =========================
RAIL HELPERS
========================= */

function clamp(value,min,max){

    return Math.max(
        min,
        Math.min(value,max)
    );

}

function getCardCenter(card){

    return (

        card.offsetLeft +

        (
            card.offsetWidth / 2
        )

    );

}

function getTrackCenter(){

    return (

        chaptersTrack.scrollLeft +

        (
            chaptersTrack.clientWidth / 2
        )

    );

}

/* =========================
UPDATE CARD STATES
========================= */

function updateCardStates(){

    chapterCards.forEach(

        (card,index)=>{

            card.classList.remove(

                'active',
                'near',
                'left-side',
                'right-side'

            );

            if(
                index ===
                railState.activeIndex
            ){

                card.classList.add(
                    'active'
                );

            }

            else if(

                Math.abs(

                    index -
                    railState.activeIndex

                ) === 1

            ){

                card.classList.add(
                    'near'
                );

            }

            if(
                index <
                railState.activeIndex
            ){

                card.classList.add(
                    'left-side'
                );

            }

            if(
                index >
                railState.activeIndex
            ){

                card.classList.add(
                    'right-side'
                );

            }

        }

    );

}

/* =========================
FIND CLOSEST CARD
========================= */

function findClosestCardIndex(){

    const trackCenter =
        getTrackCenter();

    let closestIndex = 0;

    let closestDistance =
        Infinity;

    chapterCards.forEach(

        (card,index)=>{

            const cardCenter =
                getCardCenter(card);

            const distance =
                Math.abs(

                    trackCenter -
                    cardCenter

                );

            if(
                distance <
                closestDistance
            ){

                closestDistance =
                    distance;

                closestIndex =
                    index;

            }

        }

    );

    return closestIndex;

}

/* =========================
SCROLL TO INDEX
========================= */

function scrollToIndex(
    index,
    smooth = true
){

    railState.activeIndex =

        clamp(

            index,
            0,
            chapterCards.length - 1

        );

    updateCardStates();

    const targetCard =
        chapterCards[
            railState.activeIndex
        ];

    if(!targetCard) return;

    const targetLeft =

        getCardCenter(targetCard)

        -

        (
            chaptersTrack.clientWidth / 2
        );

    railState.isSnapping = true;

    chaptersTrack.scrollTo({

        left:targetLeft,

        behavior:
            smooth
            ? 'smooth'
            : 'auto'

    });

    clearTimeout(
        railState.scrollEndTimer
    );

    railState.scrollEndTimer =

        setTimeout(()=>{

            railState.isSnapping =
                false;

        },420);

}

/* =========================
BUTTONS
========================= */

function nextCard(){

    scrollToIndex(
        railState.activeIndex + 1
    );

}

function prevCard(){

    scrollToIndex(
        railState.activeIndex - 1
    );

}

nextBtn?.addEventListener(
    'click',
    nextCard
);

prevBtn?.addEventListener(
    'click',
    prevCard
);

/* =========================
TRACK SCROLL
========================= */

let scrollRAF = null;

chaptersTrack?.addEventListener(

    'scroll',

    ()=>{

        if(
            railState.isSnapping
        ) return;

        if(scrollRAF){

            cancelAnimationFrame(
                scrollRAF
            );

        }

        scrollRAF =

            requestAnimationFrame(()=>{

                const closest =
                    findClosestCardIndex();

                if(
                    closest !==
                    railState.activeIndex
                ){

                    railState.activeIndex =
                        closest;

                    updateCardStates();

                }

            });

        clearTimeout(
            railState.scrollEndTimer
        );

        railState.scrollEndTimer =

            setTimeout(()=>{

                scrollToIndex(
                    railState.activeIndex
                );

            },140);

    },

    { passive:true }

);

/* =========================
KEYBOARD SUPPORT
========================= */

window.addEventListener(

    'keydown',

    (e)=>{

        if(e.key === 'ArrowRight'){

            nextCard();

        }

        if(e.key === 'ArrowLeft'){

            prevCard();

        }

    }

);

/*

AI handled by shared/shared-ai.js

*/

/* =========================
RESIZE RECENTER
========================= */

let resizeTimer = null;

window.addEventListener(

    'resize',

    ()=>{

        clearTimeout(
            resizeTimer
        );

        resizeTimer =

            setTimeout(()=>{

                scrollToIndex(

                    railState.activeIndex,

                    false

                );

            },120);

    }

);

/* =========================
TOUCH MOMENTUM STABILIZER
========================= */

let touchStartX = 0;

let touchEndX = 0;

chaptersTrack?.addEventListener(

    'touchstart',

    (e)=>{

        touchStartX =
            e.changedTouches[0].screenX;

    },

    { passive:true }

);

chaptersTrack?.addEventListener(

    'touchend',

    (e)=>{

        touchEndX =
            e.changedTouches[0].screenX;

        const diff =

            touchStartX -
            touchEndX;

        const verticalMovement =

            Math.abs(

                e.changedTouches[0].clientY

            );

        if(
            Math.abs(diff) < 40
        ){

            return;

        }

        if(diff > 0){

            scrollToIndex(
                railState.activeIndex + 1
            );

        }

        else{

            scrollToIndex(
                railState.activeIndex - 1
            );

        }

    },

    { passive:true }

);

/* =========================
FOCUS ACCESSIBILITY
========================= */

chapterCards.forEach(

    (card,index)=>{

        card.addEventListener(

            'click',

            ()=>{

                if(

                    index !==
                    railState.activeIndex

                ){

                    scrollToIndex(index);

                }

            }

        );

    }

);

/* =========================
SAFE SCROLL RECOVERY
========================= */

document.addEventListener(

    'visibilitychange',

    ()=>{

        if(
            document.hidden
        ) return;

        requestAnimationFrame(()=>{

            scrollToIndex(

                railState.activeIndex,

                false

            );

        });

    }

);

/* =========================
SYSTEM LOGO
========================= */

console.log(`

━━━━━━━━━━━━━━━━━━━━━━━━━━
LGU PORTAL 19 READY
━━━━━━━━━━━━━━━━━━━━━━━━━━

`);

/* =========================
PAGE TRANSITION ENGINE
========================= */

document.body.classList.add(
    'page-enter'
);

window.addEventListener(

    'load',

    ()=>{

        requestAnimationFrame(()=>{

            document.body.classList.add(
                'system-ready'
            );

            chapterCards.forEach(

                (card,index)=>{

                    card.style.transitionDelay =

                        `${index * 40}ms`;

                }

            );

        });

    }

);

const transitionLinks =

    document.querySelectorAll(
        '.page-transition'
    );

transitionLinks.forEach(link=>{

    link.addEventListener(

        'click',

        event=>{

            const href =

                link.getAttribute(
                    'href'
                );

            if(
                !href ||
                href.startsWith('#')
            ) return;

            event.preventDefault();

            document.body.classList.add(
                'page-exit'
            );

            setTimeout(()=>{

                window.location.href =
                    href;

            },380);

        }

    );

});