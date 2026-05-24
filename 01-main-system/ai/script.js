/* =========================
DOM
========================= */

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
ADD USER MESSAGE
========================= */

function addUserMessage(message){

    if(!aiConversation) return;

    const msg =
        document.createElement('div');

    msg.className =
        'ai-message ai-message-user';

    msg.innerHTML =
        `<p>${message}</p>`;

    aiConversation.appendChild(msg);

    scrollConversation();

}

/* =========================
ADD AI MESSAGE
========================= */

function addAIMessage(message){

    if(!aiConversation) return;

    const msg =
        document.createElement('div');

    msg.className =
        'ai-message ai-message-ai';

    msg.innerHTML =
        `<p>${message}</p>`;

    aiConversation.appendChild(msg);

    scrollConversation();

}

/* =========================
SCROLL CHAT
========================= */

function scrollConversation(){

    if(!aiConversation) return;

    requestAnimationFrame(()=>{

        aiConversation.scrollTop =

            aiConversation.scrollHeight;

    });

}

/* =========================
SEND MESSAGE
========================= */

function sendMessage(){

    if(!aiInput) return;

    const message =
        aiInput.value.trim();

    if(!message) return;

    addUserMessage(message);

    aiInput.value = '';

    setTimeout(()=>{

        const response =

            generateResponse(
                message
            );

        addAIMessage(
            response
        );

    },260);

}

sendAI?.addEventListener(

    'click',

    sendMessage

);

aiInput?.addEventListener(

    'keydown',

    (e)=>{

        if(e.key === 'Enter'){

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

                if(!aiInput) return;

                aiInput.value =

                    chip.textContent.trim();

                sendMessage();

            }

        );

    }

);