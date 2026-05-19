/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 YEYO 💎
            TEMPORARILY CLOSED JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const refreshBtn = document.getElementById('refreshBtn');

refreshBtn.addEventListener('click', () => {

    refreshBtn.innerHTML = 'Refreshing...';

    refreshBtn.style.opacity = '.7';

    setTimeout(() => {

        location.reload();

    }, 900);

});

/* DYNAMIC TITLE EFFECT */

const originalTitle = document.title;

window.addEventListener('blur', () => {

    document.title = '⚠️ System Offline';

});

window.addEventListener('focus', () => {

    document.title = originalTitle;

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 YEYO 💎
              END OF JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */