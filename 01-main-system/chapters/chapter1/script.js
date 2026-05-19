const scrollTopBtn =
document.getElementById("scrollTopBtn");

window.addEventListener(
"scroll",
()=>{

if(window.scrollY > 400){

scrollTopBtn.style.opacity = "1";

}else{

scrollTopBtn.style.opacity = "0";

}

},
{
passive:true
}
);

scrollTopBtn.addEventListener(
"click",
()=>{

window.scrollTo({

top:0,
behavior:"smooth"

});

}
);

console.log(`
========================================
CHAPTER I
GENERAL PROVISIONS
LGU PORTAL 15 LEGAL SYSTEM
========================================
`);