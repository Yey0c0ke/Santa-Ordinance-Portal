/* =========================
   KOS — KNOWLEDGE OPERATING SYSTEM
   Municipal Legal Intelligence Engine
   v1.3.0 — Conversational Intelligence
   ========================= */

/* =========================
   KOS ROOT NAMESPACE
   ========================= */

const KOS = {
  version: '1.3.0',
  status: 'initializing',
  data: [],
  index: null,
  pageContext: { chapter: null, article: null, section: null, page: null, topic: null },
  memory: {
    lastTopic: null,
    lastChapter: null,
    lastArticle: null,
    lastSection: null,
    lastDefinition: null,
    lastOrdinance: null,
    conversation: [],
    style: 'auto',
    usedOpenings: [],
    usedEndings: [],
    usedTransitions: [],
    usedSuggestions: [],
    followUpCount: 0
  },
  synonyms: {
    'garbage': ['waste', 'refuse', 'solid waste', 'trash', 'rubbish', 'discard', 'litter'],
    'waste': ['garbage', 'refuse', 'solid waste', 'trash', 'rubbish', 'discard'],
    'trash': ['garbage', 'waste', 'refuse', 'rubbish', 'litter'],
    'refuse': ['garbage', 'waste', 'trash', 'solid waste'],
    'solid waste': ['garbage', 'waste', 'refuse', 'trash'],
    'business': ['trade', 'commerce', 'enterprise', 'commercial', 'mercantile', 'establishment'],
    'tax': ['revenue', 'levy', 'assessment', 'impost', 'duty', 'fee', 'charge'],
    'permit': ['license', 'clearance', 'authorization', 'certificate', 'approval'],
    'license': ['permit', 'clearance', 'authorization', 'certificate'],
    'fine': ['penalty', 'surcharge', 'fee penalty', 'administrative fine'],
    'penalty': ['fine', 'surcharge', 'administrative penalty', 'sanction'],
    'nuisance': ['annoyance', 'irritation', 'disturbance', 'offense', 'public nuisance'],
    'health': ['sanitation', 'hygiene', 'medical', 'public health', 'cleanliness'],
    'fee': ['charge', 'impost', 'levy', 'collection', 'tax'],
    'construction': ['building', 'infrastructure', 'development', 'erection', 'structure'],
    'zoning': ['land use', 'planning', 'development control', 'urban planning'],
    'barangay': ['village', 'community', 'barrio', 'locality'],
    'permit requirements': ['requirements', 'documents', 'needs', 'prerequisites', 'compliance'],
    'ordinance': ['code', 'regulation', 'rule', 'law', 'provision', 'statute', 'resolution'],
    'mayor': ['municipal mayor', 'chief executive', 'local executive'],
    'vice mayor': ['vice-mayor', 'presiding officer', 'vice mayor'],
    'sangguniang bayan': ['sb', 'council', 'legislative body', 'municipal council', 'sanggunian'],
    'municipal': ['local', 'town', 'city', 'municipality'],
    'definition': ['meaning', 'interpretation', 'construction', 'term'],
    'assessment': ['valuation', 'appraisal', 'evaluation', 'tax assessment'],
    'municipal office': ['office', 'department', 'agency', 'unit', 'division'],
    'scholarship': ['educational assistance', 'financial aid', 'student grant'],
    'peso': ['public employment service office', 'employment', 'job facilitation'],
    'pleb': ["people's law enforcement board", 'law enforcement board', 'complaint board'],
    'drug testing': ['drug test', 'substance abuse', 'narcotics testing'],
    'travel order': ['official travel', 'travel authorization', 'travel'],
    'ethical standards': ['ethics', 'conduct', 'code of conduct', 'moral standards'],
    'transparency': ['accountability', 'openness', 'disclosure', 'public access'],
    'seal': ['official seal', 'municipal seal', 'logo', 'symbol'],
    'legal assistance': ['legal aid', 'legal fund', 'legal support'],
    'conflict of interest': ['interest conflict', 'bias', 'partiality']
  },
  typoMap: {},
  loadingMessages: [
    'Pag-iisip...',
    'Binabasa ang ordinansa...',
    'Sinusuri ang mga probisyon...',
    'Naghahanap ng mga kaugnay na batas...',
    'Iniintindi ang tanong...',
    'Naghahanda ng sagot...',
    'Thinking...',
    'Reading the Municipal Code...',
    'Searching provisions...',
    'Cross-referencing ordinances...',
    'Understanding your question...',
    'Preparing your answer...'
  ]
};

/* =========================
   LEVENSHTEIN DISTANCE
   ========================= */

function kosLevenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/* =========================
   1. KNOWLEDGE LOADER
   ========================= */

KOS.knowledgeLoader = {
  loaded: false,
  loadCallbacks: [],

  onLoad(callback) {
    if (this.loaded) {
      callback();
      return;
    }
    this.loadCallbacks.push(callback);
  },

  async loadAll() {
    const jsonFiles = [
      'database/json/municipal-code.json',
      'database/json/chapter1.json',
      'database/json/chapter2.json',
      'database/json/chapter3.json'
    ];

    const allData = [];

    for (const file of jsonFiles) {
      try {
        const resp = await fetch(file);
        if (!resp.ok) continue;
        const data = await resp.json();
        if (Array.isArray(data)) {
          allData.push(...data);
        } else {
          allData.push(data);
        }
      } catch (e) {
        continue;
      }
    }

    if (allData.length === 0) {
      this.loaded = true;
      for (const cb of this.loadCallbacks) {
        try { cb(); } catch (e) {}
      }
      return;
    }

    KOS.data = allData;
    KOS.indexEngine.buildIndex();
    this.loaded = true;

    for (const cb of this.loadCallbacks) {
      try { cb(); } catch (e) {}
    }
  }
};

/* =========================
   2. LEGAL INDEX ENGINE
   ========================= */

KOS.indexEngine = {
  index: {
    sections: [],
    definitions: [],
    keywords: {},
    chapters: {},
    articles: {}
  },

  buildIndex() {
    this.index = { sections: [], definitions: [], keywords: {}, chapters: {}, articles: {} };

    for (const chapter of KOS.data) {
      const chNum = chapter.chapter;
      const chKey = `chapter ${chNum}`;
      this.index.chapters[chNum] = chapter;

      for (const article of chapter.articles) {
        const artKey = `${chNum}${article.letter}`;
        this.index.articles[artKey] = { ...article, chapter: chNum };

        if (article.sections) {
          for (const section of article.sections) {
            const entry = {
              sectionId: section.id,
              title: section.title,
              content: section.content,
              chapter: chNum,
              article: article.letter,
              articleTitle: article.title
            };
            this.index.sections.push(entry);

            const text = `${section.title} ${section.content} ${article.title}`.toLowerCase();
            const words = text.split(/[\s,.;:()]+/).filter(w => w.length > 2);
            for (const word of words) {
              if (!this.index.keywords[word]) this.index.keywords[word] = [];
              const exists = this.index.keywords[word].some(e => e.sectionId === section.id);
              if (!exists) this.index.keywords[word].push(entry);
            }

            if (section.definitions) {
              for (const [term, def] of Object.entries(section.definitions)) {
                const defEntry = {
                  term,
                  definition: def,
                  sectionId: section.id,
                  chapter: chNum,
                  article: article.letter,
                  articleTitle: article.title
                };
                this.index.definitions.push(defEntry);

                const defWords = `${term} ${def}`.toLowerCase().split(/[\s,.;:()]+/).filter(w => w.length > 2);
                for (const w of defWords) {
                  if (!this.index.keywords[w]) this.index.keywords[w] = [];
                  const exists = this.index.keywords[w].some(e => e.term === term && e.sectionId === section.id);
                  if (!exists) this.index.keywords[w].push(defEntry);
                }
              }
            }
          }
        }
      }
    }
  }
};

/* =========================
   3. LANGUAGE ENGINE
   ========================= */

KOS.languageEngine = {
  filipinoWords: new Set([
    'ang', 'ng', 'sa', 'ay', 'ito', 'iyon', 'sila', 'kami', 'tayo',
    'ako', 'ikaw', 'kayo', 'siya', 'po', 'opo', 'oo', 'hindi', 'wala',
    'may', 'meron', 'para', 'mga', 'maging', 'kung', 'kapag', 'pag',
    'dito', 'doon', 'roon', 'saan', 'bakit', 'paano', 'kailan', 'sino',
    'ano', 'alin', 'magkano', 'ilan', 'gaano', 'at', 'o', 'pero', 'ngunit',
    'kasi', 'dahil', 'kaya', 'upang', 'nang', 'na', 'naman', 'din', 'rin',
    'lang', 'lamang', 'pa', 'pala', 'ba', 'kaya', 'yung', 'nung', 'sana',
    'pwedeng', 'pwede', 'maaari', 'kailangan', 'dapat', 'gusto', 'ayaw',
    'alam', 'tingin', 'sabi', 'gawa', 'hanap', 'tanong', 'sagot',
    'malaman', 'maunawaan', 'intindihin', 'unawain',
    'municipal', 'munisipyo', 'bayan', 'barangay', 'kapitan',
    'konsehal', 'alkalde', 'bise alkalde', 'opisina', 'kagawad',
    'ordinansa', 'batas', 'kasunduan', 'regulasyon', 'tuntunin',
    'pahintulot', 'permiso', 'lisensya', 'business', 'negosyo',
    'pwesto', 'tinda', 'benta', 'presyo', 'halaga', 'bayad',
    'multa', 'parusa', 'kompyansa', 'sakay', 'biyahe', 'kalsada',
    'basura', 'kalat', 'dumi', 'linis', 'malinis', 'kapaligiran',
    'kalusugan', 'sakit', 'gamot', 'ospital', 'health', 'doktor',
    'nars', 'dentista', 'buntis', 'bata', 'matanda', 'tao', 'mamayan',
    'serbisyo', 'tulong', 'sustento', 'benepisyo', 'pensyon',
    'senior', 'pwd', 'may kapansanan', 'edukasyon', 'aral', 'eskwela',
    'iskolar', 'iskolarship', 'pasok', 'klase', 'guro',
    'estudyante', 'mag-aaral', 'trabaho', 'empleyo', 'empleyado',
    'opisyal', 'gobyerno', 'pamahalaan', 'lokal', 'probinsya',
    'munisipalidad', 'rehiyon', 'pilipinas', 'ncr', 'ilocos',
    'ilocos sur', 'santa', 'santa ilocos sur',
    'anu-ano', 'magkano', 'ilan', 'gaano', 'kailan', 'sino', 'saan', 'bakit',
    'ano ba', 'paano ba', 'pwede ba', 'maaari ba', 'mayroon ba',
    'wala bang', 'meron bang', 'alam mo ba', 'tanong ko lang',
    'paki-explain', 'paki-english', 'tagalog', 'filipino', 'english',
    'pakisabi', 'pakitingin', 'pakisuyo', 'pakibigay', 'salamat',
    'walang anuman', 'magandang', 'umaga', 'tanghali', 'hapon', 'gabi',
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'musta', 'kamusta', 'okay', 'sige', 'cge', 'ge', 'wait', 'sandali',
    'teka', 'hintay', 'makinig', 'dinggin', 'pakinggan', 'ulitin',
    'paulit', 'muli', 'isa pa', 'kuya', 'ate', 'maam', 'sir', 'mamsir',
    'nga', 'po', 'opo', 'ho', 'oho'
  ]),

  detect(query) {
    const lower = query.toLowerCase().trim();
    let filipinoCount = 0;
    let englishCount = 0;
    const words = lower.split(/\s+/).filter(w => w.length > 1);

    for (const word of words) {
      if (this.filipinoWords.has(word)) {
        filipinoCount++;
      } else {
        englishCount++;
      }
    }

    const total = filipinoCount + englishCount;
    if (total === 0) return 'english';

    const ratio = filipinoCount / total;
    if (ratio > 0.35) return 'filipino';
    if (ratio > 0.1) return 'taglish';
    return 'english';
  }
};

/* =========================
   4. INTENT ENGINE
   ========================= */

KOS.intentEngine = {
  legalKeywords: [
    'permit', 'license', 'clearance', 'tax', 'fee', 'penalty', 'fine',
    'violation', 'nuisance', 'barangay', 'ordinance', 'regulation',
    'section', 'article', 'chapter', 'provision', 'municipal',
    'ordinansa', 'batas', 'multa', 'parusa', 'permiso', 'lisensya',
    'pahintulot', 'regulasyon', 'ordinance', 'code', 'statute',
    'definition', 'define', 'meaning', 'office', 'department',
    'mayor', 'council', 'sanggunian', 'official', 'government',
    'business', 'construction', 'building', 'zoning', 'health',
    'sanitation', 'market', 'vendor', 'stall', 'scholarship',
    'peso', 'waste', 'garbage', 'seal', 'transparency',
    'accountability', 'ethics', 'conduct', 'conflict of interest',
    'legal assistance', 'pleb', 'drug testing', 'travel order',
    'assessment', 'valuation', 'revenue', 'collection', 'impose',
    'levy', 'duty', 'charge', 'compliance', 'requirement',
    'document', 'prerequisite', 'application', 'registration',
    'renewal', 'grace period', 'surcharge', 'interest',
    'administrative', 'appeal', 'grievance', 'complaint',
    'enforcement', 'implement', 'execute', 'adopt', 'approve',
    'certify', 'notarize', 'attest', 'obligation', 'prohibited',
    'shall', 'must', 'required', 'mandatory', 'voluntary',
    'governance', 'legislative', 'executive', 'administrative',
    'afd', 'trust fund', 'special account', 'appropriation',
    'budget', 'fiscal', 'annual', 'financial', 'accounting',
    'audit', 'disbursement', 'procurement', 'bidding', 'contract',
    'employment', 'appointment', 'compensation', 'benefit',
    'leave', 'retirement', 'resignation', 'removal', 'discipline',
    'graft', 'corruption', 'anti-red tape', 'solid waste',
    'segregation', 'collection', 'disposal', 'recycling',
    'environment', 'ecological', 'fishery', 'aquatic',
    'slaughter', 'meat', 'food', 'sanitary', 'inspection'
  ],

  greetingPatterns: [
    /^(hello|hi|hey|good\s*(morning|afternoon|evening|day)|greetings|musta|kamusta|magandang)/i,
    /^(good\s*(day|evening|morning|afternoon)|magandang\s+(umaga|tanghali|hapon|gabi))/i,
    /^(how are you|kamusta|musta|what's up|sup|hey there)/i,
    /^(thank|thanks|salamat|maraming salamat|thanks po)/i,
    /^(bye|goodbye|paalam|sige|bye bye|see you|see ya)/i
  ],

  detect(query) {
    const lower = query.toLowerCase().trim();

    for (const pattern of this.greetingPatterns) {
      if (pattern.test(query)) return 'greeting';
    }

    if (/^(bye|goodbye|paalam|sige bye|see you)/i.test(query)) return 'farewell';

    if (/^(thank|thanks|salamat)/i.test(query)) return 'thanks';

    for (const kw of this.legalKeywords) {
      if (lower.includes(kw)) return 'legal';
    }

    if (/^(what|how|can|could|would|will|is|are|do|does|did|tell|explain|describe|define|show|list|give|find|search)/i.test(query)) {
      return 'legal';
    }

    return 'general';
  }
};

/* =========================
   5. SEMANTIC SEARCH ENGINE
   ========================= */

KOS.searchEngine = {
  expandTerms(term) {
    const lower = term.toLowerCase().trim();
    const expanded = new Set();
    expanded.add(lower);

    if (KOS.synonyms[lower]) {
      for (const syn of KOS.synonyms[lower]) {
        expanded.add(syn);
      }
    }

    for (const [key, syns] of Object.entries(KOS.synonyms)) {
      if (syns.includes(lower)) {
        expanded.add(key);
        for (const syn of syns) {
          expanded.add(syn);
        }
      }
    }

    return [...expanded];
  },

  typoCorrect(word) {
    const keys = Object.keys(KOS.indexEngine.index.keywords);
    let best = word;
    let bestDist = 2;

    for (const key of keys) {
      const dist = kosLevenshtein(word.toLowerCase(), key);
      if (dist < bestDist) {
        bestDist = dist;
        best = key;
      }
    }

    return best;
  },

  search(query) {
    const results = { sections: [], definitions: [], score: 0 };
    const lower = query.toLowerCase().trim();
    const queryWords = lower.split(/\s+/).filter(w => w.length > 2);
    const allQueryTerms = [];

    for (const w of queryWords) {
      const expanded = this.expandTerms(w);
      allQueryTerms.push(...expanded);
      const corrected = this.typoCorrect(w);
      if (corrected !== w) {
        const correctedExpanded = this.expandTerms(corrected);
        allQueryTerms.push(...correctedExpanded);
      }
    }

    const uniqueTerms = [...new Set(allQueryTerms)];
    const idx = KOS.indexEngine.index;

    const scoredSections = [];
    for (const section of idx.sections) {
      let score = 0;
      const haystack = `${section.sectionId} ${section.title} ${section.content} ${section.articleTitle}`.toLowerCase();
      for (const term of uniqueTerms) {
        if (haystack.includes(term)) {
          score += term.length;
        }
      }
      if (score > 0) {
        scoredSections.push({ ...section, score });
      }
    }
    scoredSections.sort((a, b) => b.score - a.score);
    results.sections = scoredSections.slice(0, 5);

    const scoredDefs = [];
    for (const def of idx.definitions) {
      let score = 0;
      const haystack = `${def.term} ${def.definition} ${def.articleTitle}`.toLowerCase();
      for (const term of uniqueTerms) {
        if (haystack.includes(term)) {
          score += term.length;
        }
      }
      if (score > 0) {
        scoredDefs.push({ ...def, score });
      }
    }
    scoredDefs.sort((a, b) => b.score - a.score);
    results.definitions = scoredDefs.slice(0, 5);

    results.score = results.sections.reduce((sum, s) => sum + s.score, 0) +
                    results.definitions.reduce((sum, d) => sum + d.score, 0);

    return results;
  },

  searchByChapter(chapterNum) {
    const idx = KOS.indexEngine.index;
    const chapterSections = idx.sections.filter(s => s.chapter === chapterNum);
    const chapterDefs = idx.definitions.filter(d => d.chapter === chapterNum);
    return { sections: chapterSections.slice(0, 10), definitions: chapterDefs.slice(0, 10), score: chapterSections.length + chapterDefs.length };
  }
};

/* =========================
   6. CONTEXT MEMORY ENGINE
   ========================= */

KOS.contextEngine = {
  update(query, response, pageCtx) {
    KOS.memory.conversation.push({ query, response, timestamp: Date.now() });
    if (KOS.memory.conversation.length > 30) {
      KOS.memory.conversation.shift();
    }
    if (pageCtx) {
      KOS.pageContext = { ...KOS.pageContext, ...pageCtx };
    }
  },

  resolveFollowUp(query) {
    const lower = query.toLowerCase().trim();

    if (/^(ano|what|sino|who|saan|where|kailan|when|bakit|why|paano|how)\b/.test(lower)) {
      if (KOS.memory.lastTopic) return KOS.memory.lastTopic;
    }

    const followUpWords = ['it', 'its', 'that', 'this', 'those', 'they', 'them', 'what', 'the office', 'the penalties', 'the penalty', 'the permit', 'the fee', 'the tax', 'the ordinance', 'the chapter', 'the article', 'the section', 'the definition', 'that ordinance', 'that section', 'that article', 'that chapter', 'dito', 'doon', 'roon', 'sila', 'kanila', 'nito', 'niyan', 'noon', 'yun', 'yan'];

    const isFollowUp = followUpWords.some(w => {
      if (lower === w) return true;
      if (lower.startsWith(w + ' ') || lower.startsWith(w + "'s ")) return true;
      if (lower.startsWith('what about') || lower.startsWith('what is the')) return true;
      return false;
    });

    if (!isFollowUp) return null;

    if (KOS.memory.lastTopic) return KOS.memory.lastTopic;

    const lastConv = KOS.memory.conversation[KOS.memory.conversation.length - 1];
    if (lastConv) {
      if (lower.includes('penalty') || lower.includes('penalties') || lower.includes('multa') || lower.includes('parusa')) {
        return `penalty for ${KOS.memory.lastTopic || lastConv.query}`;
      }
      if (lower.includes('fee') || lower.includes('bayad')) {
        return `fee for ${KOS.memory.lastTopic || lastConv.query}`;
      }
      if (lower.includes('office') || lower.includes('department') || lower.includes('opisina')) {
        return `office responsible for ${KOS.memory.lastTopic || lastConv.query}`;
      }
      if (lower.includes('definition') || lower.includes('define') || lower.includes('ano ang') || lower.includes('what is')) {
        return KOS.memory.lastDefinition || lastConv.query;
      }
      return lastConv.query;
    }

    return null;
  },

  getRelevantContext(query) {
    const context = {};
    const lower = query.toLowerCase();

    if (lower.includes('chapter') && KOS.memory.lastChapter) {
      context.lastChapter = KOS.memory.lastChapter;
    }
    if (lower.includes('article') && KOS.memory.lastArticle) {
      context.lastArticle = KOS.memory.lastArticle;
    }
    if (lower.includes('section') && KOS.memory.lastSection) {
      context.lastSection = KOS.memory.lastSection;
    }

    return context;
  }
};

/* =========================
   7. KNOWLEDGE GRAPH
   ========================= */

KOS.knowledgeGraph = {
  nodes: [],

  build() {
    this.nodes = [];
    const idx = KOS.indexEngine.index;

    for (const def of idx.definitions) {
      this.nodes.push({
        type: 'definition',
        id: def.term.toLowerCase(),
        label: def.term,
        chapter: def.chapter,
        article: def.article
      });
    }

    for (const section of idx.sections) {
      this.nodes.push({
        type: 'section',
        id: section.sectionId,
        label: section.title,
        chapter: section.chapter,
        article: section.article,
        content: section.content.slice(0, 100)
      });
    }

    for (const [chNum, chapter] of Object.entries(idx.chapters)) {
      this.nodes.push({
        type: 'chapter',
        id: `ch${chNum}`,
        label: chapter.title,
        chapter: parseInt(chNum)
      });
    }
  },

  findConnections(query) {
    if (this.nodes.length === 0) this.build();
    const lower = query.toLowerCase();
    const connected = { definitions: [], sections: [], chapters: [] };

    for (const node of this.nodes) {
      if (node.type === 'definition' && (lower.includes(node.label.toLowerCase()) || KOS.synonyms[node.label.toLowerCase()]?.some(s => lower.includes(s)))) {
        connected.definitions.push(node);
      }
      if (node.type === 'section' && (lower.includes(node.label.toLowerCase()) || lower.includes(node.id.toLowerCase()))) {
        connected.sections.push(node);
      }
    }

    const pageCtx = KOS.pageContext;
    if (pageCtx.chapter) {
      const chSections = this.nodes.filter(n => n.chapter === pageCtx.chapter && n.type === 'section');
      connected.sections.push(...chSections.slice(0, 5));
    }

    return connected;
  }
};

/* =========================
   8. CROSS REFERENCE ENGINE
   ========================= */

KOS.crossReferenceEngine = {
  findRelated(query, results) {
    const related = {
      chapters: new Set(),
      articles: new Set(),
      sections: new Set(),
      definitions: new Set(),
      terms: new Set()
    };

    for (const section of results.sections) {
      related.chapters.add(section.chapter);
      related.articles.add(`${section.chapter}${section.article}`);
      related.sections.add(section.sectionId);
    }

    for (const def of results.definitions) {
      related.definitions.add(def.term);
      related.chapters.add(def.chapter);
      related.articles.add(`${def.chapter}${def.article}`);
    }

    const lower = query.toLowerCase();
    const idx = KOS.indexEngine.index;

    for (const def of idx.definitions) {
      const termMatch = lower.includes(def.term.toLowerCase()) ||
        KOS.synonyms[def.term.toLowerCase()]?.some(s => lower.includes(s));
      if (termMatch) {
        related.definitions.add(def.term);
      }
    }

    const pluralForm = lower.replace(/s$/, '');
    for (const def of idx.definitions) {
      if (pluralForm.includes(def.term.toLowerCase())) {
        related.definitions.add(def.term);
      }
    }

    const pageCtx = KOS.pageContext;
    if (pageCtx.chapter) {
      related.chapters.add(pageCtx.chapter);
    }

    return {
      chapters: [...related.chapters],
      articles: [...related.articles],
      sections: [...related.sections],
      definitions: [...related.definitions]
    };
  }
};

/* =========================
   9. CITATION ENGINE
   ========================= */

KOS.citationEngine = {
  format(section) {
    if (!section) return null;
    const parts = [];
    const ch = section.chapter || section.sectionId?.match(/^(\d+)/)?.[1];
    if (ch) parts.push(`Chapter ${ch}`);
    if (section.articleTitle) parts.push(`Article ${section.articleTitle.replace('Article ', '')}`);
    if (section.sectionId) parts.push(`Section ${section.sectionId}`);
    if (section.title) parts.push(`— ${section.title}`);
    return parts.join(', ');
  },

  formatDef(definition) {
    if (!definition) return null;
    const parts = [];
    if (definition.chapter) parts.push(`Chapter ${definition.chapter}`);
    if (definition.articleTitle) parts.push(definition.articleTitle);
    if (definition.sectionId) parts.push(`Section ${definition.sectionId}`);
    return parts.join(', ');
  },

  fullCitation(result) {
    const citations = [];
    for (const section of result.sections) {
      citations.push(this.format(section));
    }
    for (const def of result.definitions) {
      citations.push(this.formatDef(def));
    }
    return [...new Set(citations)];
  }
};

/* =========================
   10. CONFIDENCE ENGINE
   ========================= */

KOS.confidenceEngine = {
  score(result, query) {
    if (!result || !result.results) return { level: 'low', value: 0, reason: 'No results' };

    const searchScore = result.results.score || 0;
    const hasSections = result.results.sections && result.results.sections.length > 0;
    const hasDefs = result.results.definitions && result.results.definitions.length > 0;
    const citations = result.citations || [];

    let confidence = 0;

    if (searchScore > 100) confidence += 40;
    else if (searchScore > 50) confidence += 30;
    else if (searchScore > 20) confidence += 20;
    else if (searchScore > 0) confidence += 10;

    if (hasSections) confidence += 25;
    if (hasDefs) confidence += 20;
    if (citations.length > 0) confidence += 15;

    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const matchCount = queryWords.filter(w => {
      const idx = KOS.indexEngine.index;
      return idx.keywords[w] || KOS.synonyms[w];
    }).length;
    if (matchCount > 2) confidence += Math.min(matchCount * 5, 15);

    confidence = Math.min(confidence, 100);

    let level = 'low';
    if (confidence >= 70) level = 'high';
    else if (confidence >= 40) level = 'medium';

    return {
      level,
      value: confidence,
      reason: level === 'high' ? 'Strong municipal ordinance match found'
            : level === 'medium' ? 'Partial match in municipal database'
            : 'Insufficient indexed ordinance data'
    };
  }
};

/* =========================
   11. STYLE ENGINE
   ========================= */

KOS.styleEngine = {
  detect(query, mode) {
    const lower = query.toLowerCase();

    if (/^summarize|^summary|in short|briefly|tldr|in summary|to summarize|give me the short|short answer/.test(lower)) {
      return 'summary';
    }
    if (/explain like|citizen|simple terms|plain english|simpleng|madaling|dali lang|simple explanation/.test(lower)) {
      return 'citizen';
    }
    if (/legal basis|legal provision|jurisprudence|as provided|pursuant to|under section|under article|under chapter|by authority of/.test(lower)) {
      return 'legal';
    }
    if (/step by step|guide me|walk me through|process|procedure|how to|application|requirements/.test(lower)) {
      return 'educational';
    }
    if (/tell me a story|narrative|scenario|kwento|story|imaginary|situation|example scenario/.test(lower)) {
      return 'narrative';
    }

    if (mode === 'general') return 'casual';
    if (mode === 'legal' && lower.length < 30) return 'summary';
    if (mode === 'legal' && lower.includes('explain')) return 'citizen';
    if (mode === 'legal' && (lower.includes('process') || lower.includes('how'))) return 'educational';

    return 'citizen';
  }
};

/* =========================
   12. CREATIVE EXPLANATION ENGINE
   ========================= */

KOS.creativeEngine = {
  generateNarrative(query, results, crossRefs, citations) {
    if (results.score === 0) return null;

    const section = results.sections[0];
    const def = results.definitions[0];
    const lower = query.toLowerCase();

    if (def && !section) {
      return this.definitionStory(def, crossRefs);
    }
    if (section) {
      return this.sectionScenario(query, section, results, crossRefs, citations);
    }

    return null;
  },

  definitionStory(def, crossRefs) {
    const parts = [];
    parts.push(KOS.naturalEngine.getOpening('definition'));
    parts.push('');
    parts.push(`Under the Code of General Ordinances of Santa, Ilocos Sur, "${def.term}" refers to ${def.definition.charAt(0).toLowerCase() + def.definition.slice(1)}.`);
    parts.push('');

    const idx = KOS.indexEngine.index;
    const related = idx.definitions.filter(d =>
      d.term !== def.term && crossRefs.definitions.includes(d.term)
    ).slice(0, 2);

    if (related.length > 0) {
      const conj = KOS.naturalEngine.pickRandom(['and', 'as well as', 'along with']);
      parts.push(`In practice, this is closely related to other terms defined in the same code, such as **${related.map(r => r.term).join(` ${conj} `)}**. Together, these definitions establish the legal framework for understanding municipal regulations on this subject.`);
      parts.push('');
    }

    parts.push(`> ${KOS.citationEngine.formatDef(def)}`);

    return parts.join('\n');
  },

  sectionScenario(query, section, results, crossRefs, citations) {
    const parts = [];
    const lower = query.toLowerCase();

    const isPenalty = lower.includes('penalty') || lower.includes('fine') || lower.includes('multa') || lower.includes('violation');
    const isPermit = lower.includes('permit') || lower.includes('license') || lower.includes('clearance') || lower.includes('application');

    const storyIntro = KOS.storyEngine.generateIntro(query, section, results);

    if (storyIntro) {
      parts.push(storyIntro);
      parts.push('');
    }

    const pageRef = KOS.naturalEngine.getPageContextOpening();
    if (pageRef && Math.random() < 0.22) {
      parts.push(pageRef);
      parts.push('');
    }

    if (isPenalty) {
      parts.push(KOS.naturalEngine.getOpening('penalty'));
      parts.push('');
      parts.push(`Under **${section.sectionId} — ${section.title}**, ${section.content}`);
      parts.push('');
      const penaltyDetail = KOS.naturalEngine.pickRandom([
        `In practical terms, this means that any person found violating this provision may face administrative sanctions, fines, or other penalties as prescribed by law and municipal ordinances. The exact penalty depends on the nature and severity of the violation.`,
        `What does this mean on the ground? Any resident or business owner who fails to comply with this provision may be subject to the corresponding fines and sanctions. The municipality takes these matters seriously to ensure the welfare of the community.`,
        `To put it simply — violating this provision carries consequences. The municipal government has established these penalties to encourage compliance and maintain order within the community.`
      ]);
      parts.push(penaltyDetail);
    } else if (isPermit) {
      parts.push(KOS.naturalEngine.getOpening('permit'));
      parts.push('');
      parts.push(`Under **${section.sectionId} — ${section.title}**, ${section.content}`);
      parts.push('');
      const permitAdvice = KOS.naturalEngine.pickRandom([
        `Applicants should coordinate with the appropriate municipal office for the complete requirements and fee schedule. It is advisable to secure all necessary documents before applying to avoid delays in processing.`,
        `For those planning to apply, it is recommended to visit the relevant municipal office early in the process. Having all your documents ready beforehand can make the application smoother and faster.`
      ]);
      parts.push(permitAdvice);
    } else {
      parts.push(KOS.naturalEngine.getOpening('default'));
      parts.push('');
      parts.push(section.content);
    }

    if (crossRefs.definitions.length > 0) {
      parts.push('');
      const trans = KOS.naturalEngine.getTransition('crossRef');
      parts.push(`${trans} ${crossRefs.definitions.slice(0, 3).map(t => `**${t}**`).join(', ')}.`);
    }

    if (citations.length > 0) {
      parts.push('');
      parts.push(KOS.naturalEngine.getTransition('citation'));
      for (const c of citations.slice(0, 2)) {
        parts.push(`> ${c}`);
      }
    }

    const ending = KOS.naturalEngine.getEnding();
    if (ending) {
      parts.push('');
      parts.push(ending);
    }

    return parts.join('\n');
  }
};

/* =========================
   13. EMOTION ENGINE
   ========================= */

KOS.emotionEngine = {
  detect(query, mode, lang) {
    const lower = query.toLowerCase().trim();

    if (/confused|naintindihan|hindi ko maintindihan|nalilito|lost|don't understand|diko gets|hindi gets|paulit|repeat|uli|explain again|again please|pasensya|sorry|pero ano nga|paano nga ulit|what do you mean|clarify/.test(lower)) {
      return 'confused';
    }

    if (/need|urgent|quick|fast|short|agad|madali|bilis|now|today|asap|pronto|dali dali|right away|mabilis lang/.test(lower)) {
      return 'hurried';
    }

    if (/curious|wonder|interesting|fascinating|tell me more|paano kaya|ano kaya|bakit kaya|interesado|gusto kong malaman|curious lang/.test(lower)) {
      return 'curious';
    }

    if (/research|study|legal basis|provision|citation|section \d|article \w|jurisprudence|reference|source|based on|pursuant|according to|where can i find|ano ang sabi/.test(lower)) {
      return 'researching';
    }

    if (/teach|educate|guide|learn|understand|lesson|turo|aral|paliwanag|gabay|intindi|explain step by step|ano ang proseso|paano ba/.test(lower)) {
      return 'learning';
    }

    if (/ano ba|paano ba|pwede ba|seryoso|talaga|hala|ay|naku|grabe|susmaryosep|diyos ko|talaga po/.test(lower)) {
      return 'curious';
    }

    return 'neutral';
  },

  adaptStyle(emotion, currentStyle) {
    switch (emotion) {
      case 'confused':
        return 'citizen';
      case 'hurried':
        return 'summary';
      case 'curious':
        return currentStyle === 'legal' ? 'educational' : currentStyle;
      case 'researching':
        return 'legal';
      case 'learning':
        return 'educational';
      default:
        return currentStyle;
    }
  },

  adaptLength(emotion) {
    switch (emotion) {
      case 'hurried': return 'short';
      case 'confused': return 'detailed';
      case 'learning': return 'detailed';
      case 'curious': return 'detailed';
      case 'researching': return 'detailed';
      default: return 'balanced';
    }
  }
};

/* =========================
   14. STORYTELLING ENGINE
   ========================= */

KOS.storyEngine = {
  scenarios: {
    waste: [
      `Picture a typical morning in one of the barangays of Santa. A resident steps out of their home and places a bag of mixed waste by the roadside — leftover food, plastic wrappers, old newspapers, all in one bag. This simple act, repeated across many households, is exactly the kind of situation that municipal environmental ordinances seek to address.`,
      `Imagine a homeowner who, for years, has been dumping yard waste and household garbage into the nearby creek. Every rainy season, the creek overflows, and the community bears the consequences. Situations like this are why the municipality has established clear solid waste management regulations.`,
      `Think about a small sari-sari store owner in the poblacion who accumulates cardboard boxes, plastic bottles, and food containers every day. Without proper segregation, these would all end up in the municipal dump. The ordinance on ecological solid waste management was designed precisely for scenarios like this.`
    ],
    nuisance: [
      `Consider a resident who operates a small videoke machine well past midnight, disturbing the peace of an entire neighborhood. The sound travels across several houses, affecting families with young children and elderly members. This common situation is exactly the kind of nuisance that municipal ordinances address.`,
      `Imagine a property owner who allows their vacant lot to become overgrown with weeds, attracting rodents and mosquitoes. The neighbors have complained multiple times, but nothing has changed. This is precisely the scenario contemplated by municipal nuisance regulations.`,
      `Think about a household that regularly burns their garbage in the backyard. The smoke spreads across the community, affecting neighbors who have respiratory conditions. This is the kind of public nuisance that the municipality has clear rules about.`
    ],
    business: [
      `Imagine a resident of Santa who has saved enough money to open a small convenience store near the public market. They have the location, the inventory, and the determination. But before they can open their doors, they need to navigate the municipal permitting process. This is where the ordinance on business permits and licensing comes into play.`,
      `Picture a local entrepreneur who wants to expand their food stall into a full restaurant. They have been operating informally for years, but now they want to do things properly. The municipal code provides the roadmap for this transition through its business regulation provisions.`
    ],
    permit: [
      `Think about a family planning to build their dream home on a lot they own in Santa. They have saved for years, hired a contractor, and picked out the design. But before the first foundation can be laid, the municipal code requires certain permits and clearances to ensure the construction is safe and compliant.`,
      `Consider a small business owner who has been operating without a permit, unsure of where to start. They worry about the penalties but also want to operate legitimately. The municipal ordinance provides a clear path forward for situations exactly like this.`
    ],
    penalty: [
      `Imagine receiving a notice from the municipal government informing you that your property is in violation of a local ordinance. Perhaps it is an unregistered business, an unauthorized structure, or an unpaid fee. The notice outlines the penalty, and now you need to understand what it means and what your options are.`,
      `Think about a barangay captain who has been warning residents about an ordinance violation for months, but some continue to disregard the rules. Eventually, the municipality must enforce the penalty provisions to ensure compliance and fairness for everyone.`
    ],
    tax: [
      `Every year, business owners and property holders in Santa receive notices about local taxes and fees. For many, understanding what is owed, when it is due, and where to pay can be confusing. The municipal tax ordinance was created to make this process clear and transparent for everyone.`,
      `Consider a newly registered business owner who is encountering municipal taxes for the first time. They understand the need to contribute to local revenue, but the different types of taxes and fees can be overwhelming. The tax provisions in the municipal code are designed to clarify these obligations.`
    ],
    definition: [
      `Legal terms can sometimes feel like a different language. When the municipal code uses a word like "nuisance" or "permit," it carries a specific legal meaning that may differ from everyday usage. Let me clarify what these terms mean under the ordinances of Santa.`,
      `In everyday conversation, we use many words casually. But in a legal document like the Municipal Code, each term has a precise meaning. Understanding these definitions is the first step to understanding your rights and obligations under local law.`
    ],
    general: [
      `Here is what the Municipal Code of Santa, Ilocos Sur says on this matter.`,
      `Let me share what I have found in the ordinances of Santa regarding your question.`,
      `I have searched the municipal database for information relevant to your inquiry. Here is what the Code provides.`
    ]
  },

  generateIntro(query, section, results) {
    const lower = query.toLowerCase();
    let scenarioPool = null;

    if (/basura|garbage|waste|trash|solid waste|segregation|recycle|ecological|environment|dump|collect|disposal/.test(lower)) {
      scenarioPool = this.scenarios.waste;
    } else if (/nuisance|annoy|disturb|noise|videoke|smoke|burning|stench|odor/.test(lower)) {
      scenarioPool = this.scenarios.nuisance;
    } else if (/negosyo|business|entrepreneur|tindahan|store|shop|commercial|enterprise/.test(lower)) {
      scenarioPool = this.scenarios.business;
    } else if (/permit|license|clearance|application|approve|registration|renew/.test(lower)) {
      scenarioPool = this.scenarios.permit;
    } else if (/penalty|fine|multa|violation|sanction|surcharge|parusa/.test(lower)) {
      scenarioPool = this.scenarios.penalty;
    } else if (/tax|revenue|fee|bayad|buwis|assessment|collection/.test(lower)) {
      scenarioPool = this.scenarios.tax;
    } else if (/define|definition|meaning|ano ang|what is|terminology|terms/.test(lower)) {
      scenarioPool = this.scenarios.definition;
    }

    if (!scenarioPool) return null;
    return KOS.naturalEngine.pickRandom(scenarioPool);
  }
};

/* =========================
   15. NATURAL LANGUAGE ENGINE
   ========================= */

KOS.naturalEngine = {
  acknowledgements: [
    `I understand your concern.`,
    `That is a common question.`,
    `Let us walk through it together.`,
    `I see what you are asking.`,
    `Good question. Let me look into that.`,
    `Naiintindihan ko ang iyong tanong.`,
    `I understand what you need.`,
    `That is an important concern.`
  ],

  openings: {
    citizen: [
      `Magandang tanong.`,
      `Sa madaling paliwanag...`,
      `Kung ordinaryong sitwasyon ang pag-uusapan...`,
      `Isipin natin ito.`,
      `Sa pananaw ng isang ordinaryong mamamayan...`,
      `In simple terms...`,
      `Let me explain this in a straightforward way.`,
      `Here is how this works in everyday terms.`,
      `Think of it this way.`,
      `Let us look at this from a practical perspective.`,
      `The simplest way to understand this is...`,
      `Here is what this means for you.`
    ],
    legal: [
      `Ayon sa municipal ordinance...`,
      `Under the Code of General Ordinances...`,
      `Pursuant to the applicable provisions...`,
      `As provided in the Municipal Code...`,
      `The ordinance states that...`,
      `According to the regulations in place...`
    ],
    educational: [
      `Let me walk you through this step by step.`,
      `Para mas madaling maintindihan, hatiin natin ito.`,
      `I will explain this gradually, starting with the basics.`,
      `Here is a structured explanation to help you understand.`,
      `This ordinance exists because...`,
      `Let us break this down into manageable parts.`
    ],
    narrative: [
      `Isipin natin ang isang sitwasyon.`,
      `Here is a scenario that might feel familiar.`,
      `Imagine this situation...`,
      `Picture this common example from everyday life...`
    ],
    definition: [
      `Let me explain this term in a simple way.`,
      `Here is what this term means under the municipal code.`,
      `Sa madaling salita, ito ang ibig sabihin ng terminong ito.`,
      `This term has a specific meaning in the context of municipal ordinances.`
    ],
    penalty: [
      `So what happens if someone violates this provision?`,
      `Ano ang mangyayari kung lumabag sa probisyong ito?`,
      `Let me explain the consequences of non-compliance.`,
      `Here is what the ordinance says about penalties.`
    ],
    permit: [
      `How does this work in practice for someone applying?`,
      `Paano ito gumagana para sa isang aplikante?`,
      `Here is what you need to know about the process.`,
      `Let me explain how this process works on the ground.`
    ],
    default: [
      `Let me share what I found in the municipal code.`,
      `Here is what the ordinance provides on this matter.`,
      `Ayon sa talaan ng mga ordinansa ng Santa...`,
      `Based on the indexed provisions of the Municipal Code...`
    ]
  },

  endings: {
    citizen: [
      `If you would like, I can explain this more simply.`,
      `Would you like a practical example of how this works?`,
      `I can summarize this in one sentence if that helps.`,
      `Would you like to know more about the related provisions?`,
      `I can also explain this from a citizen's perspective.`
    ],
    legal: [
      `Would you like the full legal citation for this provision?`,
      `I can provide the exact reference if you need it for official purposes.`,
      `Would you like to see the related sections and articles?`,
      `I can also show related municipal regulations on this topic.`
    ],
    educational: [
      `If you would like a simpler explanation, just let me know.`,
      `I can explain the next step in this process if you are ready.`,
      `Is there a particular part you would like me to explain further?`
    ],
    summary: [
      `In short, that is the key point of this provision.`,
      `That covers the most important aspect of your question.`,
      `I hope this brief explanation helps.`
    ],
    default: [
      `I hope this information helps you understand the applicable ordinance.`,
      `If you need more details on any part, feel free to ask.`,
      `Is there anything else about the municipal code you would like to know?`
    ]
  },

  transitions: {
    crossRef: [
      `Other terms defined in the same code include`,
      `This is connected to other provisions such as`,
      `Related definitions under the same chapter include`,
      `The code also defines related terms like`,
      `Other key terms that relate to this include`
    ],
    citation: [
      `For reference, here is the legal citation:`,
      `The exact provision can be found at:`,
      `Here is where this appears in the Municipal Code:`,
      `You can find this under the following reference:`
    ],
    example: [
      `For example,`,
      `To illustrate,`,
      `Here is a concrete example:`,
      `Consider this scenario:`
    ],
    conclusion: [
      `In summary,`,
      `To put it all together,`,
      `So to recap,`,
      `In short,`
    ]
  },

  pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  pickUnused(arr, usedTracker, maxLen) {
    const available = arr.filter(item => !usedTracker.includes(item));
    if (available.length === 0) {
      usedTracker.length = 0;
      return this.pickRandom(arr);
    }
    const chosen = this.pickRandom(available);
    usedTracker.push(chosen);
    if (usedTracker.length > (maxLen || 5)) {
      usedTracker.shift();
    }
    return chosen;
  },

  getOpening(type) {
    const pool = this.openings[type] || this.openings.default;
    let opening = this.pickUnused(pool, KOS.memory.usedOpenings, 6);

    const isFollowUp = (KOS.memory.followUpCount || 0) > 0;
    const ackChance = isFollowUp ? 0.15 : 0.3;
    if (Math.random() < ackChance) {
      const ack = this.pickUnused(this.acknowledgements, KOS.memory.usedAcknowledgements || (KOS.memory.usedAcknowledgements = []), 4);
      opening = ack + ' ' + opening.charAt(0).toLowerCase() + opening.slice(1);
    }

    return opening;
  },

  getPageContextOpening() {
    const ctx = KOS.pageContext;
    if (!ctx || !ctx.page) return null;

    const refs = [];

    if (ctx.chapter && ctx.topic) {
      refs.push(`Since you are currently viewing Chapter ${ctx.chapter} on ${ctx.topic},`);
      refs.push(`As you explore Chapter ${ctx.chapter} — ${ctx.topic},`);
    } else if (ctx.chapter) {
      refs.push(`Since you are in Chapter ${ctx.chapter},`);
    }

    if (ctx.article) {
      refs.push(`Regarding the article you are reading on ${ctx.article},`);
    }

    if (ctx.section) {
      refs.push(`The section you are viewing relates to this —`);
    }

    if (refs.length === 0) return null;

    return this.pickRandom(refs);
  },

  getEnding(style) {
    const pool = this.endings[style] || this.endings.default;
    return this.pickUnused(pool, KOS.memory.usedEndings, 5);
  },

  getTransition(type) {
    const pool = this.transitions[type] || this.transitions.example;
    return this.pickUnused(pool, KOS.memory.usedTransitions, 4);
  },

  varySentence(text) {
    let result = text;
    const variations = {
      'This means': ['This means', 'What this means is', 'In effect', 'Practically speaking'],
      'For example': ['For example', 'To illustrate', 'Consider this', 'Take this scenario'],
      'In addition': ['In addition', 'Moreover', 'Furthermore', 'Additionally', 'Beyond that'],
      'However': ['However', 'On the other hand', 'Nevertheless', 'That said', 'At the same time'],
      'Therefore': ['Therefore', 'Thus', 'Consequently', 'As a result', 'Because of this'],
      'For instance': ['For instance', 'As an example', 'To give you an idea'],
      'Specifically': ['Specifically', 'In particular', 'More precisely', 'To be exact'],
      'Generally': ['Generally', 'In general', 'As a rule', 'Typically', 'Ordinarily']
    };

    for (const [base, alts] of Object.entries(variations)) {
      const regex = new RegExp('\\b' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
      if (regex.test(result)) {
        const alt = this.pickRandom(alts);
        result = result.replace(regex, alt);
        break;
      }
    }

    return result;
  },

  restructureForRhythm(text) {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    if (paragraphs.length < 2) return text;

    const result = [];
    for (let i = 0; i < paragraphs.length; i++) {
      result.push(paragraphs[i]);

      if (i < paragraphs.length - 1) {
        const nextLen = paragraphs[i + 1].length;
        if (nextLen > 200) {
          result.push('');
        }
      }
    }

    return result.join('\n\n');
  },

  shouldTrimResponse(emotion) {
    return emotion === 'hurried';
  },

  getResponseLength(query, emotion) {
    const len = query.split(/\s+/).length;

    if (emotion === 'hurried') return 'short';
    if (emotion === 'confused') return 'detailed';
    if (emotion === 'learning') return 'detailed';

    if (len < 4) return 'short';
    if (len < 10) return 'balanced';
    return 'detailed';
  },

  extractTopic(query) {
    const words = query.split(/\s+/);
    if (words.length <= 5) return query;
    return words.slice(0, 5).join(' ') + '...';
  },

  getConversationReference() {
    const mem = KOS.memory;
    if (!mem.lastTopic || mem.conversation.length < 2) return null;

    const prevQuery = mem.conversation[mem.conversation.length - 2]?.query;
    if (!prevQuery) return null;
    if (prevQuery === mem.lastTopic) return null;

    const refs = [
      `Earlier we talked about ${prevQuery} —`,
      `This also relates to what we discussed about ${prevQuery}.`,
      `As you mentioned earlier regarding ${prevQuery},`,
      `Building on our earlier discussion about ${prevQuery},`
    ];

    return this.pickUnused(refs, KOS.memory.usedReferences || (KOS.memory.usedReferences = []), 4);
  },

  detectTopicChange(query) {
    const lastTopic = KOS.memory.lastTopic;
    if (!lastTopic) return null;

    const lower = query.toLowerCase().trim();
    const lastLower = lastTopic.toLowerCase().trim();

    const lastWords = new Set(lastLower.split(/\s+/).filter(w => w.length > 3));
    const queryWords = lower.split(/\s+/).filter(w => w.length > 3);
    let overlap = 0;
    for (const w of queryWords) {
      if (lastWords.has(w)) overlap++;
    }

    const topicChanged = overlap === 0 && queryWords.length > 0 && lastWords.size > 0;

    if (!topicChanged) return null;

    const transitions = [
      `Now let us look at your question about ${query}.`,
      `Sure, let us switch topics.`,
      `Let me look into that instead.`,
      `Now, regarding your question about ${this.extractTopic(query)} —`
    ];

    return this.pickRandom(transitions);
  }
};

/* =========================
   16. RESPONSE COMPOSER
   ========================= */

KOS.responseComposer = {
  compose(query, result, mode, style, lang, emotion, clarifying) {
    const confidence = KOS.confidenceEngine.score(result, query);
    const hasData = result.hasResults || (result.results && result.results.score > 0);

    if (mode === 'greeting') {
      return this.greetingResponse(lang);
    }
    if (mode === 'farewell') {
      return this.farewellResponse(lang);
    }
    if (mode === 'thanks') {
      return this.thanksResponse(lang);
    }

    if (mode === 'general') {
      return this.generalResponse(query, lang, result);
    }

    if (clarifying && !hasData) {
      return this.clarifyingResponse(clarifying);
    }

    if (!hasData) {
      return this.noLegalDataResponse(query, lang);
    }

    return this.legalResponse(query, result, style, lang, confidence, emotion);
  },

  greetingResponse(lang) {
    const greetings = {
      filipino: [
        `Magandang araw po! Ako ang **Municipal Assistant**, ang inyong virtual na katulong para sa mga ordinansa ng Bayan ng Santa, Ilocos Sur. Paano po ako makakatulong sa inyo ngayong araw na ito?`,
        `Magandang araw! Ang **Municipal Assistant** po ito, handang tumulong sa inyong mga katanungan tungkol sa mga batas at ordinansa ng ating bayan. Ano po ang maitutulong ko?`
      ],
      taglish: [
        `Magandang araw! I'm the **Municipal Assistant**, your virtual guide to the ordinances of Santa, Ilocos Sur. Paano ako makakatulong sa iyo?`,
        `Hey there! **Municipal Assistant** here, ready to help you with the ordinances of Santa. Ano ang kailangan mo?`
      ],
      english: [
        `Good day! I'm the **Municipal Assistant**, your virtual guide to the Code of General Ordinances of Santa, Ilocos Sur. How may I assist you today?`,
        `Hello! I'm the **Municipal Assistant**, here to help you navigate the municipal ordinances of Santa, Ilocos Sur. What can I help you with?`
      ]
    };

    const pool = greetings[lang] || greetings.english;
    return KOS.naturalEngine.pickRandom(pool);
  },

  farewellResponse(lang) {
    const farewells = {
      filipino: [
        `Salamat po sa paggamit ng Municipal Assistant! Kung may kailangan pa po kayo, nandito lang po ako. Magandang araw po!`,
        `Maraming salamat po! Huwag po kayong mag-atubiling bumalik kung may katanungan pa kayo tungkol sa mga ordinansa ng Santa. Ingat po!`
      ],
      taglish: [
        `Salamat sa paggamit ng Municipal Assistant! Kung may kailangan ka pa, nandito lang ako. Have a great day!`,
        `Thanks for chatting! If you need anything else about the ordinances, just hit me up. Take care!`
      ],
      english: [
        `Thank you for using the Municipal Assistant! If you need anything else, I'll be right here. Have a great day!`,
        `It was my pleasure helping you. If you have more questions about the ordinances of Santa, feel free to come back anytime. Take care!`
      ]
    };

    const pool = farewells[lang] || farewells.english;
    return KOS.naturalEngine.pickRandom(pool);
  },

  thanksResponse(lang) {
    const thanks = {
      filipino: [
        `Walang anuman po! Kung may iba pa po kayong katanungan tungkol sa mga ordinansa ng Santa, huwag po kayong mag-atubiling magtanong.`,
        `Salamat din po! Nandito lang ako para sa inyo. Anumang katanungan tungkol sa ating bayan, handa akong sumagot.`
      ],
      taglish: [
        `Walang anuman! If you have more questions about the ordinances, just let me know.`,
        `No problem at all! Happy to help. Anything else about the municipal code you'd like to know?`
      ],
      english: [
        `You're welcome! If you have any more questions about the ordinances of Santa, feel free to ask.`,
        `Happy to help! If there is anything else you need, I'm just a message away.`
      ]
    };

    const pool = thanks[lang] || thanks.english;
    return KOS.naturalEngine.pickRandom(pool);
  },

  generalResponse(query, lang, result) {
    const lower = query.toLowerCase();

    if (/who are you|what are you|sino ka|ano ka/.test(lower)) {
      const responses = {
        filipino: `Ako ang **Municipal Assistant**, isang municipal legal intelligence system na pinapagana ng **KOS (Knowledge Operating System)**. Ang trabaho ko ay tulungan kayong maunawaan ang mga ordinansa at regulasyon ng Bayan ng Santa, Ilocos Sur.`,
        taglish: `I'm the **Municipal Assistant**, a municipal legal intelligence system powered by **KOS**. Ang trabaho ko ay tulungan kayo sa mga ordinansa ng Santa, Ilocos Sur.`,
        english: `I'm the **Municipal Assistant**, a municipal legal intelligence system powered by **KOS (Knowledge Operating System)**. I'm here to help you understand the ordinances and regulations of Santa, Ilocos Sur.`
      };
      return responses[lang] || responses.english;
    }

    if (/what can you do|help|tulong|ano kaya/.test(lower)) {
      const pools = {
        filipino: `Makakatulong ako sa inyo sa mga sumusunod:
• Paghahanap ng mga ordinansa at regulasyon ng munisipyo
• Pagpapaliwanag ng mga legal na termino at kahulugan
• Pagbibigay ng impormasyon tungkol sa mga pahintulot, buwis, at bayarin
• Pagsagot sa mga katanungan tungkol sa mga opisina at serbisyo ng munisipyo
• Pagpapaliwanag ng mga regulasyon sa barangay
• Pagbibigay ng mga sipi mula sa Kodigo ng mga Ordinansa

Magtanong lamang tungkol sa anumang bagay may kinalaman sa mga ordinansa ng Bayan ng Santa, Ilocos Sur!`,
        english: `I can help you with:
• Searching municipal ordinances and regulations
• Explaining legal terms and definitions
• Providing information on permits, taxes, and fees
• Answering questions about municipal offices and services
• Explaining barangay regulations
• Providing citations from the Code of General Ordinances

Just ask me anything about the ordinances of Santa, Ilocos Sur!`
      };
      return pools[lang] || pools.english;
    }

    if (/how are you|kamusta/.test(lower)) {
      return KOS.naturalEngine.pickRandom([
        `I'm doing well, thank you! I'm fully loaded with the municipal code and ready to help. What can I assist you with?`,
        `Doing great! I've got the entire Code of General Ordinances indexed and ready. How can I help you today?`,
        `All systems running smoothly here. I'm ready to answer your questions about the ordinances of Santa. What would you like to know?`
      ]);
    }

    const defResponse = {
      filipino: `Ako ang **Municipal Assistant**, pinapagana ng **KOS**. Dalubhasa ako sa pagsagot ng mga katanungan tungkol sa Kodigo ng mga Ordinansa ng Bayan ng Santa, Ilocos Sur. Maaari mo akong tanungin tungkol sa mga pahintulot, buwis, kahulugan, opisina, multa, at iba pang bagay tungkol sa ating munisipyo.`,
      taglish: `I'm the **Municipal Assistant**, powered by **KOS**. I specialize in answering questions about the Code of General Ordinances of Santa, Ilocos Sur. You can ask me about permits, taxes, definitions, offices, penalties, and other municipal matters.`,
      english: `I'm the **Municipal Assistant**, powered by **KOS**. I specialize in answering questions about the Code of General Ordinances of Santa, Ilocos Sur. You can ask me about permits, taxes, definitions, offices, penalties, and other municipal matters. How can I help you today?`
    };

    return defResponse[lang] || defResponse.english;
  },

  noLegalDataResponse(query, lang) {
    const lower = query.toLowerCase();

    for (const [keywords, response] of Object.entries(KOS.legalReasoningEngine.fallbackResponses)) {
      if (keywords.split('|').some(k => lower.includes(k))) {
        return response;
      }
    }

    if (lang !== 'english') {
      return `**Municipal Legal Intelligence**

Paumanhin, ngunit wala akong nakitang tiyak na probisyon ng munisipyo na tumutugma sa iyong katanungan sa aming database ng mga ordinansa ng Bayan ng Santa, Ilocos Sur.

Maaari mong subukan ang mga sumusunod:
• Muling ibalangkas ang iyong tanong
• Gumamit ng mas simpleng mga salita
• Magtanong tungkol sa isang partikular na kabanata, artikulo, o seksyon
• Sumangguni sa isang partikular na paksa tulad ng mga pahintulot, buwis, o mga kahulugan`;
    }

    return `**Municipal Legal Intelligence**

I could not find a specific municipal provision matching your query in the indexed Code of General Ordinances of Santa, Ilocos Sur.

Please try:
• Rephrasing your question
• Using simpler terms
• Asking about a specific chapter, article, or section
• Referencing a specific topic such as permits, taxation, definitions, or public services

You may also browse the municipal chapters directly from the LGU Portal home screen.`;
  },

  legalResponse(query, result, style, lang, confidence, emotion) {
    let hasCreative = KOS.creativeEngine.generateNarrative(query, result, result.crossRefs, result.citations);

    const topicChange = KOS.naturalEngine.detectTopicChange(query);
    const convRef = KOS.naturalEngine.getConversationReference();

    if (topicChange && Math.random() < 0.4 && style !== 'summary') {
      const wrap = `**${topicChange}**\n\n`;
      if (hasCreative) {
        hasCreative = wrap + hasCreative;
      }
    }

    if (convRef && Math.random() < 0.18 && style !== 'summary' && !style !== 'legal') {
      const wrap = `${convRef}\n\n`;
      if (hasCreative) {
        hasCreative = wrap + hasCreative;
      }
    }

    if (style === 'narrative' && hasCreative) {
      return hasCreative;
    }

    const adaptedStyle = emotion ? KOS.emotionEngine.adaptStyle(emotion, style) : style;

    if (adaptedStyle === 'summary') {
      return this.summaryStyle(query, result);
    }
    if (adaptedStyle === 'legal') {
      return this.legalStyle(query, result);
    }
    if (adaptedStyle === 'educational') {
      return this.educationalStyle(query, result);
    }

    return this.citizenStyle(query, result, hasCreative, convRef, topicChange);
  },

  clarifyingResponse(clarifying) {
    return clarifying;
  },

  citizenStyle(query, result, creative, convRef, topicChange) {
    if (creative) return creative;

    const parts = [];

    if (convRef && Math.random() < 0.18) {
      parts.push(convRef);
      parts.push('');
    } else if (topicChange && Math.random() < 0.4) {
      parts.push(`**${topicChange}**`);
      parts.push('');
    }

    const pageRef = KOS.naturalEngine.getPageContextOpening();
    if (pageRef && Math.random() < 0.22) {
      parts.push(pageRef);
      parts.push('');
    }

    if (result.definitions.length > 0) {
      const def = result.definitions[0];
      parts.push(KOS.naturalEngine.getOpening('definition'));
      parts.push('');
      parts.push(`${def.definition}`);
      const cite = KOS.citationEngine.formatDef(def);
      if (cite) parts.push(`> ${cite}`);
      parts.push('');
    }

    if (result.sections.length > 0) {
      const section = result.sections[0];
      parts.push(KOS.naturalEngine.getOpening('default'));
      parts.push('');
      parts.push(`**${section.sectionId} — ${section.title}**`);
      parts.push('');
      parts.push(section.content);
      const cite = KOS.citationEngine.format(section);
      if (cite) parts.push(`> ${cite}`);
    }

    if (result.citations.length > 0) {
      parts.push('');
      parts.push(KOS.naturalEngine.getTransition('citation'));
      for (const c of result.citations) {
        parts.push(`• ${c}`);
      }
    }

    const ending = KOS.naturalEngine.getEnding('citizen');
    if (ending) {
      parts.push('');
      parts.push(ending);
    }

    return parts.join('\n');
  },

  legalStyle(query, result) {
    const parts = [];

    if (result.definitions.length > 0) {
      parts.push('**Legal Definition**\n');
      for (const def of result.definitions.slice(0, 3)) {
        parts.push(`**${def.term}** — ${def.definition}`);
        const cite = KOS.citationEngine.formatDef(def);
        if (cite) parts.push(`> ${cite}`);
        parts.push('');
      }
    }

    if (result.sections.length > 0) {
      for (const section of result.sections.slice(0, 3)) {
        parts.push(`**${section.sectionId} — ${section.title}**`);
        parts.push(section.content);
        const cite = KOS.citationEngine.format(section);
        if (cite) parts.push(`> ${cite}`);
        parts.push('');
      }
    }

    if (result.citations.length > 0) {
      parts.push('**Applicable Citations**\n');
      for (const c of result.citations) {
        parts.push(`• ${c}`);
      }
    }

    const ending = KOS.naturalEngine.getEnding('legal');
    if (ending) {
      parts.push('');
      parts.push(ending);
    }

    return parts.join('\n');
  },

  educationalStyle(query, result) {
    const parts = [];

    const pageRef = KOS.naturalEngine.getPageContextOpening();
    if (pageRef && Math.random() < 0.22) {
      parts.push(pageRef);
      parts.push('');
    }

    parts.push(KOS.naturalEngine.getOpening('educational'));
    parts.push('');

    if (result.definitions.length > 0) {
      parts.push('**Step 1 — Understanding the Terms**\n');
      for (const def of result.definitions.slice(0, 2)) {
        parts.push(`• **${def.term}**: ${def.definition}`);
      }
      parts.push('');
    }

    if (result.sections.length > 0) {
      parts.push('**Step 2 — Legal Framework**\n');
      for (const section of result.sections.slice(0, 3)) {
        parts.push(`• **${section.sectionId}** (${section.title}): ${section.content}`);
      }
      parts.push('');
    }

    if (result.citations.length > 0) {
      parts.push('**Step 3 — Applicable References**\n');
      for (const c of result.citations) {
        parts.push(`• ${c}`);
      }
      parts.push('');
    }

    if (result.crossRefs?.definitions?.length > 0) {
      const trans = KOS.naturalEngine.getTransition('crossRef');
      parts.push('**Related Information**\n');
      parts.push(`${trans} ${result.crossRefs.definitions.slice(0, 3).map(t => `**${t}**`).join(', ')}.`);
    }

    const ending = KOS.naturalEngine.getEnding('educational');
    if (ending) {
      parts.push('');
      parts.push(ending);
    }

    return parts.join('\n');
  },

  summaryStyle(query, result) {
    const parts = [];

    if (result.definitions.length > 0) {
      const def = result.definitions[0];
      parts.push(`**${def.term}**: ${def.definition}`);
    }

    if (result.sections.length > 0) {
      const section = result.sections[0];
      parts.push(`**${section.sectionId} (${section.title})**: ${section.content}`);
    }

    if (result.citations.length > 0) {
      parts.push(`Ref: ${result.citations.slice(0, 2).join('; ')}`);
    }

    const ending = KOS.naturalEngine.getEnding('summary');
    if (ending) {
      parts.push('');
      parts.push(ending);
    }

    return parts.join('\n\n');
  }
};

/* =========================
   17. LEGAL REASONING ENGINE
   ========================= */

KOS.legalReasoningEngine = {
  clarifyingQuestions: {
    'permit': ['Are you referring to a business permit, building permit, or another type of permit?'],
    'license': ['Are you referring to a business license, a professional license, or another type of license?'],
    'tax': ['Are you asking about business tax, real property tax, or community tax?'],
    'fee': ['Are you asking about a regulatory fee, a service fee, or a market fee?'],
    'fine': ['Are you asking about a specific violation penalty or general fine information?'],
    'penalty': ['Are you asking about a specific violation or general penalty provisions?'],
    'nuisance': ['Are you referring to a specific type of nuisance, such as noise, smoke, or property?'],
    'market': ['Are you asking about market stall rental, vendor fees, or market regulations?'],
    'barangay': ['Are you asking about barangay clearance, barangay officials, or barangay ordinances?'],
    'office': ['Are you looking for a specific municipal office or department head information?'],
    'scholarship': ['Are you asking about the municipal scholarship program requirements or application process?']
  },

  getClarifyingQuery(query) {
    const lower = query.toLowerCase().trim();
    const words = lower.split(/\s+/);

    if (words.length > 5) return null;

    for (const [keyword, questions] of Object.entries(this.clarifyingQuestions)) {
      if (lower === keyword || lower.startsWith(keyword + ' ') || lower.endsWith(' ' + keyword)) {
        return questions[0];
      }
    }

    return null;
  },

  formatKOSContext(results, crossRefs, citations) {
    const parts = [];

    if (results.sections && results.sections.length > 0) {
      const s = results.sections[0];
      const ch = s.chapter || s.sectionId?.match(/^(\d+)/)?.[1];
      if (ch) {
        parts.push(`Chapter: ${ch}${s.article ? ', Article: ' + s.article : ''}`);
      }
    }

    if (results.definitions && results.definitions.length > 0) {
      parts.push('\nMatching Definitions:');
      results.definitions.slice(0, 5).forEach(d => {
        parts.push(`• "${d.term}" — ${d.definition || d.content || ''}`);
      });
    }

    if (results.sections && results.sections.length > 0) {
      parts.push('\nMatching Sections:');
      results.sections.slice(0, 5).forEach(s => {
        parts.push(`• ${s.sectionId} (${s.title || ''}) — ${s.content || ''}`);
      });
    }

    if (citations && citations.length > 0) {
      parts.push('\nReferences:');
      citations.slice(0, 5).forEach(c => parts.push(`• ${c}`));
    }

    if (crossRefs && crossRefs.definitions && crossRefs.definitions.length > 0) {
      parts.push('\nRelated Terms:');
      parts.push(crossRefs.definitions.slice(0, 5).join(', '));
    }

    if (crossRefs && crossRefs.sections && crossRefs.sections.length > 0) {
      parts.push('\nRelated Provisions:');
      crossRefs.sections.slice(0, 5).forEach(s => {
        parts.push(`• ${s.sectionId} — ${s.title || s.content?.slice(0, 80) || ''}`);
      });
    }

    return parts.join('\n').trim();
  },

  async enhanceWithAI(query, mode, results, crossRefs, citations, style, lang, emotion) {
    if (!window.KOS_AI) {
      console.log('[KOS] AI provider not available');
      return null;
    }

    try {
      if (mode === 'legal' && results && results.score > 0) {
        const context = this.formatKOSContext(results, crossRefs, citations);
        if (!context) {
          console.log('[KOS] No context to enhance');
          return null;
        }
        console.log('[KOS] Enhancing legal query with context:', context.substring(0, 200) + '...');
        return await window.KOS_AI.enhance({
          query, context, mode: 'legal', style, language: lang, emotion
        });
      }

      if (mode === 'general') {
        console.log('[KOS] Enhancing general query');
        return await window.KOS_AI.enhance({
          query, context: null, mode: 'general', style, language: lang, emotion
        });
      }

      return null;
    } catch (e) {
      console.error('[KOS] AI enhancement failed:', e.message);
      return null;
    }
  },

  async process(query) {
    const lang = KOS.languageEngine.detect(query);
    const intent = KOS.intentEngine.detect(query);
    const style = KOS.styleEngine.detect(query, intent === 'legal' ? 'legal' : 'general');
    const emotion = KOS.emotionEngine.detect(query, intent, lang);

    const mode = (intent === 'greeting' || intent === 'farewell' || intent === 'thanks' || intent === 'general')
      ? 'general' : 'legal';

    const resolvedQuery = mode === 'legal' ? (KOS.contextEngine.resolveFollowUp(query) || query) : query;

    const results = mode === 'legal' ? KOS.searchEngine.search(resolvedQuery) : { sections: [], definitions: [], score: 0 };

    const crossRefs = mode === 'legal' ? KOS.crossReferenceEngine.findRelated(resolvedQuery, results) : { chapters: [], articles: [], sections: [], definitions: [] };

    const citations = mode === 'legal' ? KOS.citationEngine.fullCitation(results) : [];

    const confidence = KOS.confidenceEngine.score(results, resolvedQuery);

    KOS.memory.followUpCount = KOS.contextEngine.resolveFollowUp(query) ? (KOS.memory.followUpCount || 0) + 1 : 0;

    const clarifying = mode === 'legal' && confidence.level === 'low' ? this.getClarifyingQuery(query) : null;

    KOS.memory.lastClarifying = clarifying || null;

    const localResponse = KOS.responseComposer.compose(query, { results, crossRefs, citations, hasResults: results.score > 0 }, mode, style, lang, emotion, clarifying);

    const aiResponse = await this.enhanceWithAI(query, mode, results, crossRefs, citations, style, lang, emotion);

    const response = aiResponse || localResponse;

    if (mode === 'legal') {
      this.updateMemory(resolvedQuery, results, response);
    }

    return {
      query: resolvedQuery,
      originalQuery: query,
      response,
      results,
      crossRefs,
      citations,
      hasResults: results.score > 0,
      confidence,
      mode,
      style,
      language: lang,
      emotion,
      clarifying
    };
  },

  updateMemory(query, results, response) {
    KOS.memory.lastTopic = query;

    if (results.sections.length > 0) {
      KOS.memory.lastChapter = results.sections[0].chapter;
      KOS.memory.lastArticle = `${results.sections[0].chapter}${results.sections[0].article}`;
      KOS.memory.lastSection = results.sections[0].sectionId;
    }

    if (results.definitions.length > 0) {
      KOS.memory.lastDefinition = results.definitions[0].term;
    }
  },

  fallbackResponses: {
    'permit|business|license': `**Business Permits and Licensing**

Business permit requirements in the Municipality of Santa, Ilocos Sur typically include:
• Barangay Clearance
• DTI or SEC Registration
• Community Tax Certificate
• Occupancy Clearance
• Fire Safety Clearance
• Sanitary Permit
• Building Permit (if applicable)
• Zoning Clearance

For specific fees and classifications, please consult the Municipal Treasury Office or the Business Permits and Licensing Division.

> Chapter I — General Provisions, Article C (Definitions) defines "License or Permit" as a right or permission granted by competent authority.`,

    'tax|revenue': `**Municipal Taxation and Revenue**

The Municipality of Santa, Ilocos Sur imposes local taxes and fees in accordance with Republic Act 7160 (Local Government Code of 1991). These may include:
• Business Taxes
• Regulatory Fees
• Service Charges
• Franchise Taxes
• Community Tax
• Real Property Tax (administered by the Provincial Government)

> Chapter I — Article C defines "Tax" as an enforced monetary contribution levied by lawmaking authority for governmental purposes. "Fee" means a charge fixed by law or ordinance for regulation or inspection of business activity.`,

    'penalty|fine|violation': `**Penalties and Violations**

Under the Code of General Ordinances of Santa, Ilocos Sur:
• **Violation** — any act or omission contrary to municipal ordinances, rules or regulations.
• Penalties may include administrative fines, surcharges, and other sanctions as provided in specific ordinances.
• Chapter III, Article G provides that violations of ethical standards and conduct rules may result in administrative, civil, and criminal liabilities.

For specific penalty amounts, please refer to the applicable ordinance chapter.`,

    'service|welfare|assistance|scholar': `**Municipal Public Services and Social Welfare**

The Municipality of Santa provides various public services and social welfare programs:
• **Social Welfare Assistance** — through the MSWDO
• **Scholarship Programs** — educational assistance for qualified students
• **Senior Citizen Benefits** — as provided by law and local ordinances
• **PWD Programs** — support for persons with disabilities
• **PESO** — employment facilitation and labor market information (Chapter III, Article L)
• **Health Services** — through the Municipal Health Office

> Chapter III — Public Officials, Governance and Administrative Framework`,

    'office|department|head of': `**Municipal Offices and Department Heads**

The Municipality of Santa, Ilocos Sur has the following municipal offices:
• Office of the Municipal Mayor
• Office of the Sangguniang Bayan
• Municipal Treasury Office
• Municipal Assessor's Office
• Municipal Planning and Development Office (MPDC)
• Municipal Engineering Office
• Municipal Health Office
• Municipal Social Welfare and Development Office (MSWDO)
• Municipal Civil Registrar
• Municipal Accounting Office
• Municipal Budget Office

> Chapter III, Article H — Department Heads`,

    'barangay|brgy': `**Barangay Regulations**

Under the Code of General Ordinances:
• "Barangay" means the basic political unit which serves as the primary planning and implementing unit of government policies (Chapter I, Article C — Definitions).
• Barangay clearance is typically required for business permit applications.
• The Liga ng mga Barangay President serves as an ex-officio member of the Sangguniang Bayan (Chapter II, Article A).

For specific barangay ordinances, please contact your barangay hall.`,

    'market|vend|stall': `**Market Fees and Vending Regulations**

The Municipality of Santa regulates market operations and vending activities through applicable ordinances. Market fees may include:
• Stall rentals
• Vendor fees
• Market entrance fees
• Tipping fees
• Other regulatory charges

For specific fee schedules, please consult the Municipal Treasury Office or the Market Administrator.`,

    'definition|define|meaning|ano ang|what is': `**Definition Reference**

Under the Code of General Ordinances of Santa, Ilocos Sur, terms are defined in Chapter I, Article C (Definitions). This article provides the legal meaning of terms used throughout the code.

Please specify which term you would like me to define. Common defined terms include:
• License or Permit
• Tax
• Fee
• Nuisance
• Barangay
• Municipal Officer
• And many others`
  }
};

/* =========================
   18. SMART FOLLOW-UP SUGGESTIONS
   ========================= */

KOS.suggestionEngine = {
  suggestionPools: {
    citizen: [
      'Would you like a simpler explanation?',
      'Would you like a practical example of how this works?',
      'I can summarize this in one sentence if that helps.',
      'Would you like to know the related definitions?'
    ],
    legal: [
      'Would you like the full legal citation?',
      'Would you like to see the related sections?',
      'I can provide the exact provision reference.',
      'Would you like the penalties for this violation?'
    ],
    educational: [
      'Would you like a step-by-step guide?',
      'I can explain the process in detail.',
      'Would you like to know the requirements?',
      'Shall I walk you through the procedure?'
    ],
    exploring: [
      'What are the penalties for this?',
      'Which office handles this?',
      'Tell me more about this topic.',
      'Explain this further.',
      'What are the requirements?'
    ],
    quick: [
      'Search Ordinance',
      'Business Permit',
      'Local Taxes',
      'Municipal Offices'
    ]
  },

  generate(query, result) {
    const suggestions = [];
    const lower = query.toLowerCase();
    const emotion = result.emotion || 'neutral';

    const usedBefore = KOS.memory.usedSuggestions || [];

    const poolKey = emotion === 'hurried' ? 'quick'
      : result.style === 'legal' ? 'legal'
      : result.style === 'educational' ? 'educational'
      : 'exploring';

    if (result.definitions && result.definitions.length > 0) {
      const def = result.definitions[0];
      const penaltyQ = `What is the penalty for ${def.term}?`;
      if (!usedBefore.includes(penaltyQ)) {
        suggestions.push(penaltyQ);
      }
      const officeQ = `Which office handles ${def.term}?`;
      if (!usedBefore.includes(officeQ)) {
        suggestions.push(officeQ);
      }
    }

    if (result.sections && result.sections.length > 0) {
      const section = result.sections[0];
      if (section.chapter) {
        const otherProv = `Other provisions in Chapter ${section.chapter}`;
        if (!usedBefore.includes(otherProv)) {
          suggestions.push(otherProv);
        }
      }
    }

    if (result.crossRefs?.definitions?.length > 0) {
      const defQ = `Define ${result.crossRefs.definitions[0]}`;
      if (!usedBefore.includes(defQ)) {
        suggestions.push(defQ);
      }
    }

    const pageCtx = KOS.pageContext;
    if (pageCtx.chapter && !lower.includes(`chapter ${pageCtx.chapter}`)) {
      const chQ = `Explain Chapter ${pageCtx.chapter}`;
      if (!usedBefore.includes(chQ)) {
        suggestions.push(chQ);
      }
    }

    const pool = this.suggestionPools[poolKey] || this.suggestionPools.exploring;
    for (const s of pool) {
      if (suggestions.length >= 4) break;
      if (!usedBefore.includes(s) && !suggestions.includes(s)) {
        suggestions.push(s);
      }
    }

    if (suggestions.length < 2) {
      const defaults = pageCtx.chapter
        ? ['Explain this Chapter', 'Important Sections', 'Common Violations', 'Related Ordinances']
        : ['Search Ordinance', 'Business Permit', 'Local Taxes', 'Municipal Offices'];
      for (const d of defaults) {
        if (suggestions.length >= 4) break;
        if (!suggestions.includes(d)) suggestions.push(d);
      }
    }

    const finalSuggestions = [...new Set(suggestions)].slice(0, 6);

    KOS.memory.usedSuggestions = usedBefore.concat(finalSuggestions).slice(-20);

    return finalSuggestions;
  }
};

/* =========================
   19. AUTO-LOADER
   ========================= */

KOS.autoLoader = {
  async loadNewFiles() {
    try {
      const resp = await fetch('database/json/');
      const text = await resp.text();
      const jsonMatches = text.matchAll(/href="([^"]+\.json)"/g);
      for (const match of jsonMatches) {
        const file = match[1];
        if (file === 'municipal-code.json' || file === 'chapter1.json' || file === 'chapter2.json' || file === 'chapter3.json') continue;
        try {
          const fresp = await fetch(`database/json/${file}`);
          if (fresp.ok) {
            const data = await fresp.json();
            if (Array.isArray(data)) {
              KOS.data.push(...data);
            } else {
              KOS.data.push(data);
            }
          }
        } catch (e) {}
      }
      KOS.indexEngine.buildIndex();
    } catch (e) {}
  }
};

/* =========================
   INITIALIZE KOS
   ========================= */

KOS.initialize = function() {
  this.status = 'loading';
  this.knowledgeLoader.loadAll();
};

/* =========================
   EXPOSE KOS GLOBALLY
   ========================= */

window.KOS = KOS;

/* =========================
   AI BACKEND API
   ========================= */

const AI_API_BASE = '/api';

let conversationHistory = [];
let abortController = null;

function addToHistory(role, text) {
  conversationHistory.push({ role, parts: [{ text }] });
}

function clearHistory() {
  conversationHistory = [];
}

function getHistory() {
  return conversationHistory;
}

function sendChatMessage(message, { onChunk, onComplete, onError }) {
  abortController = new AbortController();

  const payload = {
    message,
    history: conversationHistory
  };

  fetch(`${AI_API_BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: abortController.signal
  })
  .then(async (response) => {
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || `Server error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    function processResult({ done, value }) {
      if (done) {
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.chunk) {
              fullText += data.chunk;
              onChunk(data.chunk, fullText);
            }
            if (data.done) {
              addToHistory('user', message);
              addToHistory('model', data.fullText || fullText);
              onComplete(data.fullText || fullText);
            }
            if (data.error) {
              onError(new Error(data.error));
            }
          } catch (e) {
            /* skip malformed chunk */
          }
        }
      }

      return reader.read().then(processResult);
    }

    return reader.read().then(processResult);
  })
  .catch(err => {
    if (err.name === 'AbortError') {
      onComplete('');
    } else {
      onError(err);
    }
  });

  return abortController;
}

function cancelChat() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

async function generateResponse(message) {
  try {
    const response = await fetch(`${AI_API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: conversationHistory
      })
    });
    const data = await response.json();
    if (data.response) {
      addToHistory('user', message);
      addToHistory('model', data.response);
      return data.response;
    }
    throw new Error(data.error || 'Unknown error');
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      return 'I\'m having trouble connecting to my systems. Please make sure the server is running.\n\nRun: npm start';
    }
    return `I apologize, but I encountered an error. Please try again.`;
  }
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━
LGU MUNICIPAL AI READY
━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
console.log("AI engine connected to backend API");
