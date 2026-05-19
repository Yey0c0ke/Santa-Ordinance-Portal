/* =========================================
   ACCORDION SYSTEM
========================================= */

const accordions =
document.querySelectorAll(
    ".accordion"
);

accordions.forEach((accordion) => {

    accordion.addEventListener(
        "click",
        function () {

            this.classList.toggle(
                "active"
            );

            const panel =
            this.nextElementSibling;

            if (
                panel.style.maxHeight
            ) {

                panel.style.maxHeight =
                null;

            } else {

                panel.style.maxHeight =
                panel.scrollHeight + "px";

            }

        }
    );

});

/* =========================================
   AUTO OPEN HASH LINKS
========================================= */

window.addEventListener(
    "load",
    () => {

        const hash =
        window.location.hash;

        if(hash){

            const target =
            document.querySelector(
                hash
            );

            if(target){

                const accordion =
                target.querySelector(
                    ".accordion"
                );

                const panel =
                accordion.nextElementSibling;

                accordion.classList.add(
                    "active"
                );

                panel.style.maxHeight =
                panel.scrollHeight + "px";

                setTimeout(() => {

                    target.scrollIntoView({

                        behavior:"smooth",
                        block:"start"

                    });

                },300);

            }

        }

    }
);

/* =========================================
   READING PROGRESS
========================================= */

const readingProgress =
document.getElementById(
    "readingProgress"
);

window.addEventListener(
    "scroll",
    () => {

        const scrollTop =
        document.documentElement.scrollTop;

        const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

        const progress =
        (scrollTop / scrollHeight) * 100;

        readingProgress.style.width =
        progress + "%";

    }
);

/* =========================================
   SEARCH SYSTEM
========================================= */

const ordinanceSearch =
document.getElementById(
    "ordinanceSearch"
);

const articleCards =
document.querySelectorAll(
    ".article-card"
);

ordinanceSearch.addEventListener(
    "keyup",
    () => {

        const searchValue =
        ordinanceSearch.value.toLowerCase();

        articleCards.forEach((card) => {

            const text =
            card.innerText.toLowerCase();

            if (
                text.includes(searchValue)
            ) {

                card.style.display =
                "block";

            } else {

                card.style.display =
                "none";

            }

        });

    }
);

/* =========================================
   COPY LINK SYSTEM
========================================= */

const copyButtons =
document.querySelectorAll(
    ".copy-link"
);

copyButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const target =
            button.dataset.target;

            const url =
            window.location.origin +
            window.location.pathname +
            "#" +
            target;

            navigator.clipboard.writeText(
                url
            );

            button.innerText =
            "Copied!";

            button.style.background =
            "#28c76f";

            button.style.color =
            "white";

            setTimeout(() => {

                button.innerText =
                "Copy Link";

                button.style.background =
                "";

                button.style.color =
                "";

            },2000);

        }
    );

});

/* =========================================
   AUTO ACTIVE SIDEBAR
========================================= */

const sections =
document.querySelectorAll(
    ".article-card"
);

const navLinks =
document.querySelectorAll(
    ".sidebar ul li a"
);

window.addEventListener(
    "scroll",
    () => {

        let current =
        "";

        sections.forEach((section) => {

            const sectionTop =
            section.offsetTop;

            if (
                pageYOffset >=
                sectionTop - 220
            ) {

                current =
                section.getAttribute("id");

            }

        });

        navLinks.forEach((link) => {

            link.classList.remove(
                "active-link"
            );

            if (
                link.getAttribute("href") ===
                "#" + current
            ) {

                link.classList.add(
                    "active-link"
                );

            }

        });

    }
);

/* =========================================
   ARTICLE REVEAL ANIMATION
========================================= */

const revealCards =
document.querySelectorAll(
    ".article-card"
);

function revealOnScroll(){

    revealCards.forEach((card) => {

        const windowHeight =
        window.innerHeight;

        const revealTop =
        card.getBoundingClientRect().top;

        if(
            revealTop <
            windowHeight - 100
        ){

            card.classList.add(
                "show-card"
            );

        }

    });

}

window.addEventListener(
    "scroll",
    revealOnScroll
);

revealOnScroll();

/* =========================================
   LEGAL TERM HIGHLIGHT
========================================= */

const strongTerms =
document.querySelectorAll(
    ".section-block strong"
);

strongTerms.forEach((term) => {

    term.style.color =
    "#003ea8";

    term.style.fontWeight =
    "700";

});

/* =========================================
   SMOOTH SIDEBAR NAVIGATION
========================================= */

navLinks.forEach((link) => {

    link.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            const targetId =
            link.getAttribute(
                "href"
            );

            const target =
            document.querySelector(
                targetId
            );

            if(target){

                const accordion =
                target.querySelector(
                    ".accordion"
                );

                const panel =
                accordion.nextElementSibling;

                accordion.classList.add(
                    "active"
                );

                panel.style.maxHeight =
                panel.scrollHeight + "px";

                target.scrollIntoView({

                    behavior:"smooth",
                    block:"start"

                });

            }

        }
    );

});