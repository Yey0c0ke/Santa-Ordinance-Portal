/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            LGU LEGAL ENGINE 💎
        AUTO ADAPTIVE AI CORE v1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                GLOBAL MEMORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.legalKnowledge = [];


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            EXTRACT ACCORDIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function extractLegalAccordions(){

    const accordions =
        document.querySelectorAll(
            '.accordion'
        );

    accordions.forEach((accordion)=>{

        const header =
            accordion.querySelector(
                '.accordion-header'
            );

        const ordinanceText =
            accordion.querySelector(
                '.ordinance-text'
            );

        const explanation =
            accordion.querySelector(
                '.explanation p'
            );

        if(
            !header ||
            !ordinanceText
        ) return;

        const fullHeader =
            header.innerText.trim();

        const splitHeader =
            fullHeader.split('—');

        const section =
            splitHeader[0]?.trim() || '';

        const title =
            splitHeader[1]?.trim() || '';

        const ordinance =
            ordinanceText.innerText.trim();

        const explanationText =
            explanation
            ?
            explanation.innerText.trim()
            :
            '';

        window.legalKnowledge.push({

            type:'ordinance',

            chapter:
                document.title,

            section,

            title,

            ordinance,

            explanation:
                explanationText,

            searchableText:
                `
                ${section}
                ${title}
                ${ordinance}
                ${explanationText}
                `
                .toLowerCase()

        });

    });

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            EXTRACT DEFINITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function extractDefinitions(){

    const definitionCards =
        document.querySelectorAll(
            '.definition-card'
        );

    definitionCards.forEach((card)=>{

        const title =
            card.querySelector('h4');

        const description =
            card.querySelector('p');

        if(
            !title ||
            !description
        ) return;

        window.legalKnowledge.push({

            type:'definition',

            chapter:
                document.title,

            title:
                title.innerText.trim(),

            definition:
                description.innerText.trim(),

            searchableText:
                `
                ${title.innerText}
                ${description.innerText}
                `
                .toLowerCase()

        });

    });

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SEARCH ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function searchLegalKnowledge(query){

    if(!query) return [];

    const cleanQuery =
        query.toLowerCase().trim();

    const queryWords =
        cleanQuery.split(' ');

    const scoredResults = [];

    window.legalKnowledge.forEach((item)=>{

        let score = 0;

        queryWords.forEach((word)=>{

            if(
                item.searchableText.includes(word)
            ){

                score += 10;

            }

        });

        if(score > 0){

            scoredResults.push({

                ...item,
                score

            });

        }

    });

    scoredResults.sort(

        (a,b)=> b.score - a.score

    );

    return scoredResults;

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            RESPONSE GENERATOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function generateAIResponse(results){

    if(results.length === 0){

        return `
            <div class="ai-empty">
                No matching ordinance found.
            </div>
        `;

    }

    return results.slice(0,5).map((item)=>{

        return `

        <div class="ai-result-card">

            <span class="ai-result-type">
                ${
                    item.section
                    ||
                    item.type
                }
            </span>

            <h3 class="ai-result-title">
                ${item.title}
            </h3>

            <p class="ai-result-text">
                ${
                    item.ordinance
                    ||
                    item.definition
                    ||
                    ''
                }
            </p>

            ${
                item.explanation
                ?
                `
                <div class="ai-result-explanation">

                    ${item.explanation}

                </div>
                `
                :
                ''
            }

        </div>

        `;

    }).join('');

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            INITIALIZE LEGAL ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function initializeLegalEngine(){

    extractLegalAccordions();

    extractDefinitions();

    console.log(
        'LGU LEGAL KNOWLEDGE:',
        window.legalKnowledge
    );

}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                AUTO START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener(

    'DOMContentLoaded',

    initializeLegalEngine

);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                DEBUG TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

window.testLegalSearch =
function(query){

    const results =
        searchLegalKnowledge(query);

    console.log(results);

    return results;

};


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ENGINE READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

console.log(`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        LGU LEGAL ENGINE 💎
        AUTO AI ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`);