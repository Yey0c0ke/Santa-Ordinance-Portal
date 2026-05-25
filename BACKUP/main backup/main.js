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

/* =========================
AI DOM
========================= */

const aiModal =
document.getElementById(
    'aiModal'
);

const aiBackdrop =
document.getElementById(
    'aiBackdrop'
);

const openAI =
document.getElementById(
    'openAI'
);

const closeAI =
document.getElementById(
    'closeAI'
);

const aiConversation =
document.getElementById(
    'aiConversation'
);

const aiInput =
document.getElementById(
    'aiInput'
);

const sendAI =
document.getElementById(
    'sendAI'
);

const suggestionChips =
[
    ...document.querySelectorAll(
        '.suggestion-chip'
    )
];

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

const aiState = {

    busy:false,

    memory:{

        lastQuestion:null,

        lastResponse:null,

        topic:null

    }

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

        if(
            aiModal?.classList.contains(
                'active'
            )
        ){

            if(e.key === 'Escape'){

                closeAIModal();

            }

            return;

        }

        if(e.key === 'ArrowRight'){

            nextCard();

        }

        if(e.key === 'ArrowLeft'){

            prevCard();

        }

    }

);

/* =========================
INITIALIZE RAIL
========================= */

window.addEventListener(

    'load',

    ()=>{

        requestAnimationFrame(()=>{

            scrollToIndex(
                0,
                false
            );

        });

    }

);

/* =========================
AI MODAL
========================= */

function openAIModal(){

    if(!aiModal) return;

    aiModal.classList.add(
        'active'
    );

    aiModal.setAttribute(
        'aria-hidden',
        'false'
    );

    document.body.classList.add(
        'ai-open'
    );

    setTimeout(()=>{

        aiInput?.focus();

    },220);

}

function closeAIModal(){

    if(!aiModal) return;

    aiModal.classList.remove(
        'active'
    );

    aiModal.setAttribute(
        'aria-hidden',
        'true'
    );

    document.body.classList.remove(
        'ai-open'
    );

}

openAI?.addEventListener(
    'click',
    openAIModal
);

closeAI?.addEventListener(
    'click',
    closeAIModal
);

aiBackdrop?.addEventListener(
    'click',
    closeAIModal
);

/* CONTINUE NEXT PART */

/* =========================
AI HELPERS
========================= */

function scrollConversation(){

    if(!aiConversation) return;

    requestAnimationFrame(()=>{

        aiConversation.scrollTop =

            aiConversation.scrollHeight;

    });

}

function sanitizeHTML(text){

    const div =
        document.createElement('div');

    div.textContent = text;

    return div.innerHTML;

}

/* =========================
CREATE MESSAGE
========================= */

function createMessage({

    type = 'ai',

    text = ''

}){

    const wrapper =
        document.createElement('div');

    wrapper.className =

        `ai-message ai-message-${type}`;

    const avatar =
        document.createElement('div');

    avatar.className =
        'ai-avatar';

    avatar.textContent =

        type === 'ai'
        ? 'AI'
        : 'YOU';

    const bubble =
        document.createElement('div');

    bubble.className =
        'ai-bubble';

    const paragraph =
        document.createElement('p');

    paragraph.innerHTML =
        sanitizeHTML(text);

    bubble.appendChild(
        paragraph
    );

    wrapper.appendChild(
        avatar
    );

    wrapper.appendChild(
        bubble
    );

    aiConversation.appendChild(
        wrapper
    );

    scrollConversation();

    return {

        wrapper,
        paragraph

    };

}

/* =========================
TYPEWRITER
========================= */

async function streamText(

    element,
    text,
    speed = 10

){

    return new Promise((resolve)=>{

        let index = 0;

        function frame(){

            if(index >= text.length){

                resolve();

                return;

            }

            element.innerHTML +=

                sanitizeHTML(
                    text.charAt(index)
                );

            index++;

            scrollConversation();

            setTimeout(
                frame,
                speed
            );

        }

        frame();

    });

}

/* =========================
THINKING MESSAGE
========================= */

function createThinkingMessage(){

    const wrapper =
        document.createElement('div');

    wrapper.className =
        'ai-message ai-message-ai';

    const avatar =
        document.createElement('div');

    avatar.className =
        'ai-avatar';

    avatar.textContent =
        'AI';

    const bubble =
        document.createElement('div');

    bubble.className =
        'ai-bubble';

    const typing =
        document.createElement('div');

    typing.className =
        'ai-typing';

    typing.innerHTML =

        `
        <span></span>
        <span></span>
        <span></span>
        `;

    bubble.appendChild(
        typing
    );

    wrapper.appendChild(
        avatar
    );

    wrapper.appendChild(
        bubble
    );

    aiConversation.appendChild(
        wrapper
    );

    scrollConversation();

    return wrapper;

}

/* =========================
LEGAL RESPONSE ENGINE
========================= */

function generateResponse(message){

    const lower =
        message.toLowerCase();

    aiState.memory.lastQuestion =
        message;

    /* =========================
    BUSINESS
    ========================= */

    if(

        lower.includes('permit') ||

        lower.includes('business')

    ){

        aiState.memory.topic =
            'business';

        return `Business permit requirements typically include:

• Barangay clearance
• DTI or SEC registration
• Valid identification
• Community tax certificate
• Occupancy clearance
• Fire safety clearance

Requirements may vary depending on municipal classification and business category.`;

    }

    /* =========================
    TAX
    ========================= */

    if(

        lower.includes('tax') ||

        lower.includes('revenue')

    ){

        aiState.memory.topic =
            'taxation';

        return `Municipal taxation systems may include:

• Business taxes
• Regulatory fees
• Franchise taxes
• Service charges
• Local revenue assessments

Tax computations and schedules are usually governed under revenue and fiscal administration ordinances.`;

    }

    /* =========================
    PUBLIC SERVICES
    ========================= */

    if(

        lower.includes('service') ||

        lower.includes('welfare') ||

        lower.includes('assistance')

    ){

        aiState.memory.topic =
            'services';

        return `Municipal public services may include:

• Social welfare assistance
• Senior citizen support
• PWD programs
• Scholarship assistance
• Health and sanitation services
• Community protection programs

Specific eligibility requirements depend on local ordinances and municipal implementation policies.`;

    }

    /* =========================
    CHAPTERS
    ========================= */

    if(

        lower.includes('chapter')

    ){

        return `The LGU PORTAL currently organizes municipal codification into 12 primary chapters covering governance, taxation, welfare, business regulation, infrastructure, labor, public safety, and final legal provisions.`;

    }

    /* =========================
    DEFAULT
    ========================= */

    return `Municipal legal interpretation may depend on specific ordinances, administrative provisions, and chapter classifications.

Please provide additional details regarding the ordinance, permit, taxation concern, or municipal topic you want clarified.`;

}

/* =========================
THINKING DELAY
========================= */

function calculateThinkingDelay(message){

    const base = 420;

    return Math.min(

        1400,

        base +

        (
            message.length * 4
        )

    );

}

/* =========================
SEND MESSAGE
========================= */

async function sendMessage(){

    if(
        aiState.busy
    ) return;

    const message =
        aiInput?.value.trim();

    if(!message) return;

    aiState.busy = true;

    createMessage({

        type:'user',

        text:message

    });

    aiInput.value = '';

    const thinking =
        createThinkingMessage();

    const response =
        generateResponse(
            message
        );

    const delay =
        calculateThinkingDelay(
            response
        );

    setTimeout(async ()=>{

        thinking.remove();

        const aiMsg =
            createMessage({

                type:'ai',

                text:''

            });

        await streamText(

            aiMsg.paragraph,

            response,

            8

        );

        aiState.memory.lastResponse =
            response;

        aiState.busy = false;

    },delay);

}

/* CONTINUE NEXT PART */

/* =========================
SEND EVENTS
========================= */

sendAI?.addEventListener(

    'click',

    sendMessage

);

aiInput?.addEventListener(

    'keydown',

    (e)=>{

        if(
            e.key === 'Enter'
        ){

            e.preventDefault();

            sendMessage();

        }

    }

);

/* =========================
SUGGESTION CHIPS
========================= */

suggestionChips.forEach(

    chip=>{

        chip.addEventListener(

            'click',

            ()=>{

                if(
                    aiState.busy
                ) return;

                const text =

                    chip.textContent.trim();

                aiInput.value =
                    text;

                sendMessage();

            }

        );

    }

);

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
SMOOTH OPENING SEQUENCE
========================= */

window.addEventListener(

    'load',

    ()=>{

        document.body.classList.add(
            'system-ready'
        );

        setTimeout(()=>{

            chapterCards.forEach(

                (card,index)=>{

                    card.style.transitionDelay =

                        `${index * 40}ms`;

                }

            );

        },120);

    }

);

/* =========================
SYSTEM READY
========================= */

console.log(`

━━━━━━━━━━━━━━━━━━━━━━━━━━
LGU PORTAL 18 READY
━━━━━━━━━━━━━━━━━━━━━━━━━━

`);

console.log(

    'Cinematic rail engine active'

);

console.log(

    'Municipal AI stabilized'

);

console.log(

    'Motion synchronization initialized'

);

console.log(

    'LGU legal intelligence online'

);