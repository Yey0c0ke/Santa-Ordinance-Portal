/* =========================
CENTRAL MUNICIPAL KNOWLEDGE
========================= */

const municipalKnowledge = [

    {

        id:'chapter1',

        title:
            'General Provisions',

        keywords:[

            'administration',
            'governance',
            'office',
            'committee',
            'barangay',
            'municipal structure',
            'administrative',
            'codal',
            'ordinance meaning'

        ],

        responses:[

            `Chapter I focuses on the
            foundational rules and legal principles
            used throughout the municipal
            ordinance system.

            It explains how ordinances
            are interpreted,
            applied,
            and organized within the municipality.`,

            `Chapter I serves as the
            legal foundation of the ordinance system.

            It contains important rules on:
            ordinance interpretation,
            legal terminology,
            and municipal governance procedures.`

        ]

    },

    {

        id:'chapter1-definitions',

        title:
            'Article C — Definitions',

        keywords:[

            'definition',
            'define',
            'meaning',
            'permit',
            'license',
            'tax',
            'business',
            'profession',
            'revenue',
            'motor vehicle'

        ],

        responses:[

            `The official legal definitions
            used throughout the ordinance system
            can be found in
            Article C of Chapter I.

            These definitions help explain
            terms related to:
            permits,
            taxation,
            businesses,
            revenues,
            and municipal activities.

            For example,
            a business permit allows
            a commercial establishment
            to legally operate within
            the municipality.`,

            `Article C contains the
            legal terminology used
            throughout the LGU ordinance system.

            This includes definitions involving:
            permits,
            taxes,
            regulated businesses,
            professions,
            and municipal authority.

            For example,
            taxation refers to charges collected
            to support local governance
            and public services.`

        ]

    },

        {

        id:'chapter1-construction',

        title:
            'Article B — Rules of Construction',

        keywords:[

            'construction',
            'interpretation',
            'rules',
            'legal terminology',
            'undefined words'

        ],

        responses:[

            `Article B explains how
            municipal ordinances are interpreted
            within the LGU legal system.

            If a legal term is not directly defined,
            it may still be interpreted
            using legal usage,
            recognized references,
            and existing laws.

            For example,
            municipal authorities may rely
            on Philippine legal references
            when interpreting undefined terminology.`,

            `Rules of Construction help ensure
            that municipal ordinances
            are interpreted consistently.

            When an ordinance contains
            unclear or undefined wording,
            legal references and existing laws
            may be used for clarification.`

        ]

    },

    {

        id:'chapter2',

        title:
            'Revenue and Fiscal Administration',

        keywords:[

            'tax',
            'taxation',
            'budget',
            'appropriation',
            'fiscal',
            'collection',
            'government fees',
            'municipal income'

        ],

        responses:[

            `Taxation concerns are generally handled
            under Chapter II on
            Revenue and Fiscal Administration.

            These provisions involve:
            collections,
            municipal revenue,
            appropriations,
            and local fiscal governance.

            For example,
            business taxes and permit fees
            help support municipal operations
            and public services.`,

            `Chapter II focuses on
            municipal taxation systems
            and fiscal administration.

            This includes:
            local collections,
            government charges,
            appropriations,
            and revenue management.`

        ]

    },

    {

        id:'chapter3',

        title:
            'Public Services and Social Welfare',

        keywords:[

            'public service',
            'scholarship',
            'pwd',
            'solo parent',
            'social welfare',
            'education',
            'assistance',
            'benefits'

        ],

        responses:[

            `Chapter III focuses on
            public services
            and social welfare programs.

            This may include:
            scholarships,
            educational assistance,
            PWD support,
            and municipal welfare programs.`,

            `Public welfare concerns
            are commonly addressed
            under Chapter III.

            These ordinances support
            community services,
            social assistance,
            and public benefit systems.`

        ]

    },

        {

        id:'chapter4',

        title:
            'Health and Environmental Protection',

        keywords:[

            'health',
            'sanitation',
            'environment',
            'waste',
            'pollution',
            'cleanliness',
            'public safety'

        ],

        responses:[

            `Chapter IV focuses on
            sanitation,
            environmental protection,
            and public health regulations.

            These ordinances help maintain
            cleanliness,
            public safety,
            and environmental standards
            within the municipality.`,

            `Health and environmental concerns
            are commonly governed
            under Chapter IV.

            This may include regulations involving:
            waste management,
            sanitation,
            pollution control,
            and public safety measures.`

        ]

    }

];

/* =========================
AI MEMORY STATE
========================= */

let conversationMemory = {

    lastTopic:null,

    lastChapter:null

};

/* =========================
NORMALIZE TEXT
========================= */

function normalizeText(text){

    return text
        .toLowerCase()
        .trim();

}

/* =========================
RANDOM RESPONSE PICKER
========================= */

function pickResponse(responses){

    return responses[
        Math.floor(
            Math.random() *
            responses.length
        )
    ];

}

/* =========================
FIND KNOWLEDGE MATCH
========================= */

function findKnowledgeMatch(text){

    const normalized =
        normalizeText(text);

    for(

        const entry of
        municipalKnowledge

    ){

        const matched =

            entry.keywords.some(

                keyword =>

                    normalized.includes(
                        keyword
                    )

            );

        if(matched){

            return entry;

        }

    }

    return null;

}

/* =========================
FOLLOWUP SUGGESTIONS
========================= */

function generateFollowup(topic){

    const followups = {

        permit:[

            '• business permits',
            '• licensing requirements',
            '• municipal clearances'

        ],

        tax:[

            '• business taxation',
            '• municipal collections',
            '• local revenue systems'

        ],

        definition:[

            '• ordinance terminology',
            '• legal interpretation',
            '• rules of construction'

        ],

        construction:[

            '• ordinance interpretation',
            '• undefined legal terms',
            '• codal consistency'

        ]

    };

    if(
        followups[topic]
    ){

        return `

You may also ask about:

${followups[topic].join('\n')}

        `;

    }

    return '';

}

/* =========================
BASE RESPONSE ENGINE
========================= */

function generateBaseResponse(message){

    const normalized =
        normalizeText(message);

    const knowledge =
        findKnowledgeMatch(
            normalized
        );

    if(knowledge){

        conversationMemory.lastTopic =
        knowledge.id;

        conversationMemory.lastChapter =
        knowledge.title;

        const response =

            pickResponse(
                knowledge.responses
            );

        return response;

    }

    if(

        normalized.includes('hello') ||

        normalized.includes('hi')

    ){

        return `

Hello.

I can help explain:
municipal ordinances,
permits,
taxation,
legal definitions,
and ordinance interpretation.

You may also ask about
specific chapters
or municipal regulations.

        `;

    }

    if(

        normalized.includes('thank')

    ){

        return `

You're welcome.

If you'd like,
you may also ask about:
ordinance definitions,
permits,
taxation,
or municipal procedures.

        `;

    }

    if(

        normalized.includes('ordinance')

    ){

        return `

Municipal ordinances are organized
into codified chapters
within the LGU PORTAL system.

Each chapter focuses on
specific areas such as:
governance,
taxation,
public services,
health regulations,
and municipal administration.

        `;

    }

        if(

        conversationMemory.lastTopic

    ){

        return `

I couldn't find a direct ordinance match
for that yet.

However,
your previous topic involved:

${conversationMemory.lastChapter}

You may continue asking
related ordinance questions
for more specific guidance.

        `;

    }

    return `

I couldn't find a direct ordinance match
for that question yet.

Try asking about:

• permits
• taxation
• ordinance definitions
• legal interpretation
• public services
• sanitation
• municipal governance

    `;

}

/* =========================
ADVANCED CONTEXT ENGINE
========================= */

function generateAdvancedContext(message){

    const normalized =
        normalizeText(message);

    if(

        normalized.includes('permit')

    ){

        return `

A permit is an official authorization
issued by the municipality
allowing a regulated activity
or operation.

For example,
a business permit allows
a commercial establishment
to legally operate within
the municipality.

${generateFollowup('permit')}

        `;

    }

    if(

        normalized.includes('tax')

    ){

        return `

Taxes are charges collected
by the municipality
to support public services
and local government operations.

For example,
business taxes and permit fees
may help fund:
public infrastructure,
sanitation programs,
and municipal services.

${generateFollowup('tax')}

        `;

    }

    if(

        normalized.includes('definition')

    ){

        return `

The official legal definitions
used throughout the ordinance system
can be found in
Article C of Chapter I.

These definitions help explain
municipal terminology involving:
permits,
taxation,
business activities,
and local governance.

${generateFollowup('definition')}

        `;

    }

        if(

        normalized.includes('construction')

    ){

        return `

Rules of Construction explain
how municipal ordinances
are interpreted within
the LGU legal system.

If a legal term is unclear
or not directly defined,
existing laws and legal references
may still be used for interpretation.

For example,
municipal authorities may rely
on recognized legal usage
when interpreting undefined wording.

${generateFollowup('construction')}

        `;

    }

    return null;

}

/* =========================
FINAL RESPONSE ENGINE
========================= */

const originalGenerateResponse =
generateBaseResponse;

generateResponse = function(message){

    const advanced =
        generateAdvancedContext(
            message
        );

    if(advanced){

        return advanced;

    }

    return originalGenerateResponse(
        message
    );

};

/* =========================
AI THINKING DELAY
========================= */

function calculateThinkingDelay(text){

    return Math.min(

        1800,

        500 + (text.length * 8)

    );

}

/* =========================
SYSTEM READY
========================= */

console.log(`

━━━━━━━━━━━━━━━━━━━━━━━━━━
LGU MUNICIPAL AI READY
━━━━━━━━━━━━━━━━━━━━━━━━━━

`);

console.log(

    "Central ordinance intelligence connected"

);

console.log(

    "Humanized municipal assistant active"

);