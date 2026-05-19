/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 YEYO 💎
      TEMPORARILY CLOSED • IOS JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const reloadBtn = document.getElementById('reloadBtn');

/* REFRESH BUTTON */

reloadBtn.addEventListener('click', () => {

    reloadBtn.innerHTML = 'Refreshing...';

    reloadBtn.style.opacity = '.7';

    setTimeout(() => {

        location.reload();

    }, 700);

});

/* TITLE CHANGE */

const originalTitle = document.title;

window.addEventListener('blur', () => {

    document.title = '⚠️ System Offline';

});

window.addEventListener('focus', () => {

    document.title = originalTitle;

});

/* FLOATING EFFECT */

const card = document.querySelector('.card');

document.addEventListener('mousemove', (e) => {

    const x = (window.innerWidth / 2 - e.pageX) / 35;
    const y = (window.innerHeight / 2 - e.pageY) / 35;

    card.style.transform =
    `rotateY(${x}deg) rotateX(${-y}deg)`;

});

/* RESET POSITION */

document.addEventListener('mouseleave', () => {

    card.style.transform =
    'rotateY(0deg) rotateX(0deg)';

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 YEYO 💎
               END OF JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */