const cards=document.querySelectorAll('.legal-card');
const modals=document.querySelectorAll('.legal-modal');

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODAL OPEN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

cards.forEach(card=>{

card.addEventListener('click',()=>{

const modal=document.getElementById(
card.dataset.modal
);

if(modal){

modal.classList.add('active');

document.body.style.overflow='hidden';

}

});

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODAL CLOSE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document
.querySelectorAll('.close-modal')
.forEach(button=>{

button.addEventListener('click',()=>{

button
.closest('.legal-modal')
.classList.remove('active');

document.body.style.overflow='auto';

});

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLICK OUTSIDE CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

modals.forEach(modal=>{

modal.addEventListener('click',e=>{

if(e.target===modal){

modal.classList.remove('active');

document.body.style.overflow='auto';

}

});

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCAPE KEY CLOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener('keydown',e=>{

if(e.key==='Escape'){

modals.forEach(modal=>{

modal.classList.remove('active');

});

document.body.style.overflow='auto';

}

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCORDION SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document
.querySelectorAll('.accordion-header')
.forEach(header=>{

header.addEventListener('click',()=>{

const item=
header.parentElement;

const content=
item.querySelector(
'.accordion-content'
);

const active=
item.classList.contains(
'active'
);

document
.querySelectorAll(
'.accordion-item'
)
.forEach(other=>{

other.classList.remove(
'active'
);

other.querySelector(
'.accordion-content'
).style.maxHeight=null;

});

if(!active){

item.classList.add(
'active'
);

content.style.maxHeight=
content.scrollHeight+'px';

}

});

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CARD PARALLAX EFFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

cards.forEach(card=>{

card.addEventListener(
'mousemove',
e=>{

const rect=
card.getBoundingClientRect();

const x=
e.clientX-rect.left;

const y=
e.clientY-rect.top;

const centerX=
rect.width/2;

const centerY=
rect.height/2;

const rotateX=
((y-centerY)/24)*-1;

const rotateY=
(x-centerX)/24;

card.style.transform=`
perspective(900px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
translateY(-6px)
`;

}

);

card.addEventListener(
'mouseleave',
()=>{

card.style.transform=`
perspective(900px)
rotateX(0deg)
rotateY(0deg)
translateY(0px)
`;

}

);

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERSECTION OBSERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const observer=
new IntersectionObserver(

entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add(
'visible'
);

}

});

},

{
threshold:.12
}

);

document
.querySelectorAll('.legal-card')
.forEach(card=>{

observer.observe(card);

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WINDOW LOAD EFFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener('load',()=>{

setTimeout(()=>{

document.body.classList.add(
'loaded'
);

},120);

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODAL SCROLL RESET
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

const scroll=
modal.querySelector(
'.modal-scroll'
);

if(scroll){

scroll.scrollTop=0;

}

}

}

);

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFORMANCE SAFE PARALLAX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

let ticking=false;

window.addEventListener(
'mousemove',
e=>{

if(!ticking){

window.requestAnimationFrame(()=>{

const x=
e.clientX/
window.innerWidth;

const y=
e.clientY/
window.innerHeight;

const orb1=
document.querySelector(
'.orb1'
);

const orb2=
document.querySelector(
'.orb2'
);

if(orb1){

orb1.style.transform=`
translate(
${x*16}px,
${y*16}px
)
`;

}

if(orb2){

orb2.style.transform=`
translate(
${x*-16}px,
${y*-16}px
)
`;

}

ticking=false;

});

ticking=true;

}

}

);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SMOOTH HERO PARALLAX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const hero=
document.querySelector(
'.hero'
);

window.addEventListener(
'scroll',
()=>{

if(hero){

const scrollY=
window.scrollY;

hero.style.transform=`
translateY(${scrollY*0.02}px)
`;

}

}

);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAFE RESIZE RECALCULATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.addEventListener(
'resize',
()=>{

document
.querySelectorAll(
'.accordion-item.active'
)
.forEach(item=>{

const content=
item.querySelector(
'.accordion-content'
);

content.style.maxHeight=
content.scrollHeight+'px';

});

}

);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IOS TOUCH OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document
.querySelectorAll(
'.legal-card'
)
.forEach(card=>{

card.addEventListener(
'touchstart',
()=>{

card.style.transition=
'transform .25s ease';

},
{
passive:true
}
);

});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCROLL RESTORATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.history.scrollRestoration=
'manual';