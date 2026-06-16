/* =========================
   KOS CHAT — Municipal Assistant Interface
   Production Edition
   ========================= */

document.addEventListener('DOMContentLoaded', () => {

  const STORAGE_KEY = 'kos_conversation';
  const CTX_KEY = 'kos_page_context';

  const aiModal = document.getElementById('aiModal');
  const aiConversation = document.getElementById('aiConversation');
  const aiInput = document.getElementById('aiInput');
  const sendAI = document.getElementById('sendAI');
  const minAI = document.getElementById('minAI');
  const closeAI = document.getElementById('closeAI');
  const kosBubble = document.getElementById('kosBubble');

  let busy = false;
  let initialized = false;

  /* =========================
     PAGE CONTEXT DETECTION
     ========================= */

  function detectPageContext() {
    const ctx = { chapter: null, article: null, section: null, page: null, topic: null };
    const path = window.location.pathname;
    const url = window.location.href;
    const title = document.title || '';

    if (path.includes('index.html') || path.endsWith('/') || path.endsWith('LGU TESTER')) {
      ctx.page = 'home';
      ctx.topic = 'Municipal Code Overview';
      const heroTitle = document.querySelector('.hero-rail-text h2');
      if (heroTitle) ctx.topic = heroTitle.textContent.trim();
      return ctx;
    }

    if (path.includes('chapter1') || title.includes('Chapter I')) {
      ctx.chapter = 1;
      ctx.page = 'chapter';
      ctx.topic = 'General Provisions';
    } else if (path.includes('chapter2') || title.includes('Chapter II')) {
      ctx.chapter = 2;
      ctx.page = 'chapter';
      ctx.topic = 'Legislative Rules and Procedures';
    } else if (path.includes('chapter3') || title.includes('Chapter III')) {
      ctx.chapter = 3;
      ctx.page = 'chapter';
      ctx.topic = 'Public Officials';
    }

    const articleEl = document.querySelector('.article-title, .article-header, .article-heading');
    if (articleEl) {
      ctx.article = articleEl.textContent.trim();
    }

    const sectionEl = document.querySelector('.section-title, .section-header, .legal-card.active .card-title');
    if (sectionEl) {
      ctx.section = sectionEl.textContent.trim();
    }

    const h1 = document.querySelector('h1');
    if (h1 && !ctx.chapter) {
      const h1Text = h1.textContent.trim();
      const chMatch = h1Text.match(/Chapter\s+(I|II|III|IV|V|VI|VII|VIII|IX|X|\d+)/i);
      if (chMatch) {
        const roman = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 };
        ctx.chapter = roman[chMatch[1].toUpperCase()] || parseInt(chMatch[1]);
        ctx.page = 'chapter';
      }
    }

    KOS.pageContext = ctx;
    return ctx;
  }

  /* =========================
     PERSISTENCE
     ========================= */

  function saveConversation() {
    try {
      const data = { memory: KOS.memory, pageContext: KOS.pageContext, messages: [] };
      const msgEls = aiConversation?.querySelectorAll('.ai-message');
      if (msgEls) {
        for (const el of msgEls) {
          const type = el.classList.contains('ai-message-user') ? 'user' : 'ai';
          const textEl = el.querySelector('.ai-bubble p');
          if (textEl) {
            data.messages.push({ type, text: textEl.innerHTML });
          }
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function restoreConversation() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;
      const data = JSON.parse(saved);
      if (!data || !data.messages || data.messages.length === 0) return false;
      if (data.memory) {
        KOS.memory = data.memory;
      }
      for (const msg of data.messages) {
        const wrapper = document.createElement('div');
        wrapper.className = `ai-message ai-message-${msg.type}`;
        const avatar = document.createElement('div');
        avatar.className = 'ai-avatar';
        avatar.textContent = msg.type === 'ai' ? 'AI' : 'YOU';
        const bubble = document.createElement('div');
        bubble.className = 'ai-bubble';
        const p = document.createElement('p');
        p.innerHTML = msg.text;
        bubble.appendChild(p);
        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        aiConversation?.appendChild(wrapper);
      }
      scrollConversation();
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearConversation() {
    aiConversation.innerHTML = '<div class="ai-conversation-fade"></div>';
    KOS.memory.conversation = [];
    KOS.memory.lastTopic = null;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* =========================
     LOADING SCREEN
     ========================= */

  function showLoading() {
    let existing = document.querySelector('.kos-loading');
    if (existing) return;
    const overlay = document.createElement('div');
    overlay.className = 'kos-loading';
    overlay.innerHTML = `
      <div class="kos-loading-content">
        <div class="kos-loading-orb"></div>
        <div class="kos-loading-title">Municipal Assistant</div>
        <div class="kos-loading-subtitle">Powered by KOS</div>
        <div class="kos-loading-tagline">Knowledge Operating System</div>
        <div class="kos-loading-message" id="kosLoadingMsg">Loading Municipal Code...</div>
      </div>
    `;
    document.body.appendChild(overlay);

    let msgIdx = 0;
    const msgs = KOS.loadingMessages;
    const msgEl = overlay.querySelector('#kosLoadingMsg');
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % msgs.length;
      if (msgEl) msgEl.textContent = msgs[msgIdx];
    }, 1800);

    return { overlay, interval };
  }

  function hideLoading(loader) {
    if (!loader) return;
    clearInterval(loader.interval);
    loader.overlay.classList.add('kos-loading-hide');
    setTimeout(() => loader.overlay.remove(), 500);
  }

  /* =========================
     BUBBLE
     ========================= */

  function showBubble() {
    kosBubble?.classList.add('visible');
  }

  function hideBubble() {
    kosBubble?.classList.remove('visible');
  }

  /* =========================
     PAGE CONTEXT INDICATOR
     ========================= */

  function updatePageContext() {
    const ctx = KOS.pageContext;
    const existing = document.querySelector('.kos-page-context');
    if (existing) existing.remove();
    if (!ctx || !ctx.page) return;

    let label = '';
    if (ctx.chapter && ctx.topic) {
      label = `Chapter ${ctx.chapter} — ${ctx.topic}`;
    } else if (ctx.page === 'home') {
      label = 'Municipal Code Overview';
    } else {
      return;
    }

    const indicator = document.createElement('div');
    indicator.className = 'kos-page-context';
    indicator.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,.7)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> ${label}`;
    const suggestionsArea = document.querySelector('.ai-suggestions');
    if (suggestionsArea) {
      suggestionsArea.parentNode.insertBefore(indicator, suggestionsArea);
    }
  }

  /* =========================
     EMPTY STATE
     ========================= */

  function getContextSuggestions() {
    const ctx = KOS.pageContext;
    if (!ctx || !ctx.chapter) {
      return [
        { label: 'Search Ordinance', query: 'Search Ordinance' },
        { label: 'Business Permit', query: 'Business Permit' },
        { label: 'Local Taxes', query: 'Local Taxes' },
        { label: 'Public Safety', query: 'Public Safety' },
        { label: 'Definitions', query: 'Definitions' },
        { label: 'Municipal Offices', query: 'Municipal Offices' },
        { label: 'Market Fees', query: 'Market Fees' },
        { label: 'Barangay Regulations', query: 'Barangay Regulations' }
      ];
    }

    return [
      { label: 'Explain this Chapter', query: `Explain Chapter ${ctx.chapter}` },
      { label: 'Important Sections', query: `Important sections in Chapter ${ctx.chapter}` },
      { label: 'Common Violations', query: `Common violations in Chapter ${ctx.chapter}` },
      { label: 'Related Ordinances', query: `Related ordinances for Chapter ${ctx.chapter}` },
      { label: 'Search Ordinance', query: 'Search Ordinance' },
      { label: 'Definitions', query: 'Definitions' },
      { label: 'Municipal Offices', query: 'Municipal Offices' },
      { label: 'Market Fees', query: 'Market Fees' }
    ];
  }

  function showEmptyState() {
    const existing = document.querySelector('.kos-empty-state');
    if (existing) return;

    const emptyState = document.createElement('div');
    emptyState.className = 'kos-empty-state';

    const suggestions = getContextSuggestions();
    const chipsHtml = suggestions.map(s =>
      `<button class="kos-chip" data-query="${s.query}">${s.label}</button>`
    ).join('');

    emptyState.innerHTML = `
      <div class="kos-empty-title">Municipal Assistant</div>
      <div class="kos-empty-powered">Powered by KOS</div>
      <div class="kos-empty-desc">Ask anything about the Code of General Ordinances of the Municipality of Santa, Ilocos Sur.</div>
      <div class="kos-empty-chips">${chipsHtml}</div>
    `;

    const suggestionsArea = document.querySelector('.ai-suggestions');
    if (suggestionsArea) {
      suggestionsArea.style.display = 'none';
    }

    aiConversation?.appendChild(emptyState);

    emptyState.querySelectorAll('.kos-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        aiInput.value = query;
        sendChatMessage();
      });
    });
  }

  function hideEmptyState() {
    const es = document.querySelector('.kos-empty-state');
    if (es) es.remove();
    const suggestionsArea = document.querySelector('.ai-suggestions');
    if (suggestionsArea) suggestionsArea.style.display = '';
  }

  /* =========================
     SMART SUGGESTIONS
     ========================= */

  function showSmartSuggestions(suggestions) {
    const suggestionsArea = document.querySelector('.ai-suggestions');
    if (!suggestionsArea) return;
    suggestionsArea.innerHTML = '';
    suggestionsArea.style.display = '';

    for (const s of suggestions.slice(0, 10)) {
      const chip = document.createElement('button');
      chip.className = 'suggestion-chip';
      chip.type = 'button';
      chip.textContent = s;
      chip.addEventListener('click', () => {
        aiInput.value = s;
        sendChatMessage();
      });
      suggestionsArea.appendChild(chip);
    }
  }

  /* =========================
     CREATE MESSAGE
     ========================= */

  function createMessage({ type, text }) {
    const wrapper = document.createElement('div');
    wrapper.className = `ai-message ai-message-${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'ai-avatar';
    avatar.textContent = type === 'ai' ? 'AI' : 'YOU';

    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';

    const paragraph = document.createElement('p');
    paragraph.innerHTML = text.replace(/\n/g, '<br>');

    bubble.appendChild(paragraph);
    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    aiConversation.appendChild(wrapper);
    scrollConversation();

    return { wrapper, paragraph };
  }

  function scrollConversation() {
    requestAnimationFrame(() => {
      aiConversation.scrollTop = aiConversation.scrollHeight;
    });
  }

  /* =========================
     THINKING
     ========================= */

  const thinkingStates = [
    'Reading your question...',
    'Understanding context...',
    'Reviewing local ordinances...',
    'Connecting related provisions...',
    'Checking municipal references...',
    'Preparing a clear explanation...',
    'Thinking...'
  ];

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getThinkingSequence() {
    const shuffled = shuffleArray(thinkingStates);
    const always = 'Reading your question...';
    if (shuffled[0] !== always) {
      const idx = shuffled.indexOf(always);
      if (idx > 0) {
        shuffled[idx] = shuffled[0];
        shuffled[0] = always;
      }
    }
    return shuffled;
  }

  function createThinkingMessage() {
    const wrapper = document.createElement('div');
    wrapper.className = 'ai-message ai-message-ai';

    const avatar = document.createElement('div');
    avatar.className = 'ai-avatar';
    avatar.textContent = 'AI';

    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';

    const stateEl = document.createElement('div');
    stateEl.className = 'ai-thinking-state';
    stateEl.textContent = 'Thinking...';

    const typing = document.createElement('div');
    typing.className = 'ai-typing';
    typing.style.display = 'none';
    typing.innerHTML = '<span></span><span></span><span></span>';

    bubble.appendChild(stateEl);
    bubble.appendChild(typing);
    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    aiConversation.appendChild(wrapper);
    scrollConversation();

    let stateIdx = 0;
    let stateInterval = null;

    function startRotating() {
      const seq = getThinkingSequence();
      stateInterval = setInterval(() => {
        stateIdx = (stateIdx + 1) % seq.length;
        stateEl.textContent = seq[stateIdx];
      }, 900 + Math.floor(Math.random() * 300));
    }

    function stopRotating(showDots) {
      if (stateInterval) {
        clearInterval(stateInterval);
        stateInterval = null;
      }
      if (showDots) {
        stateEl.style.display = 'none';
        typing.style.display = 'flex';
      }
    }

    startRotating();

    return { wrapper, stateEl, typing, stopRotating };
  }

  /* =========================
     STREAM TEXT — PHRASE-BY-PHRASE
     ========================= */

  function getStreamSpeed(responseType, emotion) {
    if (responseType === 'short') return 2;
    if (responseType === 'fast') return 3;
    if (emotion === 'hurried') return 2;
    if (emotion === 'confused') return 7;
    if (emotion === 'learning') return 6;
    if (emotion === 'researching') return 5;
    if (responseType === 'long') return 6;
    return 4;
  }

  function tokenizeText(text) {
    const parts = [];
    const lines = text.split('\n');
    for (let li = 0; li < lines.length; li++) {
      if (li > 0) parts.push({ type: 'newline', value: '\n' });
      const words = lines[li].match(/\S+\s*/g) || [];
      for (const w of words) {
        parts.push({ type: 'word', value: w });
      }
    }
    return parts;
  }

  function shouldPauseBefore(text, nextWords) {
    const joined = (nextWords || '').toLowerCase().trim();
    if (/^for example|^to illustrate|^consider|^imagine|^picture|^think about/i.test(joined)) return 280;
    if (/^in practical|^what does this|^to put it|^applicants should|^for those planning/i.test(joined)) return 260;
    if (/^key terms|^related|^other terms|^the code also|^this is connected/i.test(joined)) return 220;
    if (/^reference|^citation|^the exact|^here is where|^you can find/i.test(joined)) return 300;
    if (/^in summary|^to recap|^in short|^so to recap/i.test(joined)) return 280;
    if (/^if you would|^would you like|^i can also|^i hope this|^is there anything/i.test(joined)) return 260;
    if (/^magandang|^sa madaling|^kung ordinaryo|^isipin|^sa pananaw/i.test(joined)) return 240;
    return 0;
  }

  const selfCorrections = [
    { prefix: '... actually,', suffix: 'to be more precise,' },
    { prefix: '... or rather,', suffix: 'more specifically,' },
    { prefix: '... let me rephrase,', suffix: 'put more simply,' },
    { prefix: '... in other words,', suffix: 'to put it differently,' }
  ];

  function applySelfCorrection(text) {
    if (Math.random() > 0.12) return text;
    const words = text.split(/\s+/);
    if (words.length < 20) return text;

    const midStart = Math.floor(words.length * 0.35);
    const midEnd = Math.floor(words.length * 0.65);
    const splitAt = midStart + Math.floor(Math.random() * (midEnd - midStart));

    const correction = selfCorrections[Math.floor(Math.random() * selfCorrections.length)];

    const before = words.slice(0, splitAt).join(' ');
    const after = words.slice(splitAt).join(' ');
    const afterLower = after.charAt(0).toLowerCase() + after.slice(1);

    return before + correction.prefix + ' ' + correction.suffix + ' ' + afterLower;
  }

  async function streamText(element, text, emotion, responseType) {
    const baseSpeed = getStreamSpeed(responseType, emotion);
    const corrected = applySelfCorrection(text);
    const tokens = tokenizeText(corrected);
    let buffer = '';
    let wordCount = 0;
    let pendingNewline = false;

    function flushBuffer() {
      if (buffer) {
        element.innerHTML += buffer;
        buffer = '';
      }
    }

    function appendHtml(html) {
      element.innerHTML += html;
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'newline') {
        flushBuffer();
        if (pendingNewline) {
          appendHtml('<br>');
        }
        pendingNewline = true;
        continue;
      }

      if (pendingNewline) {
        appendHtml('<br>');
        pendingNewline = false;
      }

      buffer += token.value;
      wordCount++;

      const nextTokens = tokens.slice(i + 1, i + 6).map(t => t.value).join(' ');
      const pBefore = shouldPauseBefore(null, nextTokens);

      if (pBefore > 0) {
        flushBuffer();
        scrollConversation();
        await new Promise(r => setTimeout(r, pBefore));
      } else if (wordCount >= 2 + Math.floor(Math.random() * 3)) {
        flushBuffer();
        scrollConversation();
        wordCount = 0;

        const trailing = token.value.trimEnd();
        let pause = 0;
        if (trailing.endsWith('.') || trailing.endsWith('!') || trailing.endsWith('?')) {
          pause = 60 + Math.floor(Math.random() * 80);
        } else if (trailing.endsWith(':') || trailing.endsWith(';')) {
          pause = 40 + Math.floor(Math.random() * 60);
        } else if (trailing.endsWith(',') || trailing.endsWith('—') || trailing.endsWith('–')) {
          pause = 20 + Math.floor(Math.random() * 30);
        }
        if (pause > 0) {
          await new Promise(r => setTimeout(r, pause));
        } else {
          await new Promise(r => setTimeout(r, baseSpeed + Math.floor(Math.random() * 3)));
        }
      }
    }

    flushBuffer();
    scrollConversation();
  }

  /* =========================
     ABOUT PANEL
     ========================= */

  function createAboutBtn() {
    const panelTop = document.querySelector('.ai-panel-top');
    if (!panelTop) return;
    if (document.querySelector('.kos-about-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'kos-about-btn';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'About');
    btn.innerHTML = 'ⓘ';
    panelTop.querySelector('.ai-close-btn')?.before(btn);

    btn.addEventListener('click', () => {
      const existing = document.querySelector('.kos-about-panel');
      if (existing) { existing.remove(); return; }

      const panel = document.createElement('div');
      panel.className = 'kos-about-panel';
      panel.innerHTML = `
        <div class="kos-about-content">
          <div class="kos-about-close">✕</div>
          <div class="kos-about-title">Municipal Assistant</div>
          <div class="kos-about-subtitle">Powered by KOS</div>
          <div class="kos-about-tagline">Knowledge Operating System</div>
          <div class="kos-about-desc">Local Municipal Legal Intelligence</div>
          <div class="kos-about-location">Municipality of Santa, Ilocos Sur</div>
          <div class="kos-about-note">Runs entirely from indexed municipal ordinances. Zero external APIs.</div>
        </div>
      `;
      document.querySelector('.ai-panel')?.appendChild(panel);

      panel.querySelector('.kos-about-close')?.addEventListener('click', () => panel.remove());
    });
  }

  /* =========================
     UPDATE HEADER
     ========================= */

  function updateHeader() {
    const titleEl = document.getElementById('aiTitle');
    if (titleEl) {
      titleEl.textContent = 'Municipal Assistant';
    }
    const subtitleEl = document.querySelector('.ai-panel-title p');
    if (subtitleEl) {
      subtitleEl.textContent = 'Powered by KOS';
    }
  }

  /* =========================
     PROCESS WITH KOS
     ========================= */

  async function processQuery(query) {
    hideEmptyState();
    console.log('[KOS-CHAT] Processing query:', query);
    try {
      const result = await KOS.legalReasoningEngine.process(query);
      console.log('[KOS-CHAT] Process result:', result);
      KOS.contextEngine.update(query, result.response, KOS.pageContext);
      const suggestions = KOS.suggestionEngine.generate(query, result);
      saveConversation();
      return { result, suggestions };
    } catch (e) {
      console.error('[KOS-CHAT] Error processing query:', e.message, e.stack);
      throw e;
    }
  }

  /* =========================
     SEND MESSAGE
     ========================= */

  async function sendChatMessage() {
    if (busy) return;
    const message = aiInput?.value.trim();
    if (!message) return;

    busy = true;
    hideEmptyState();

    createMessage({ type: 'user', text: message });
    aiInput.value = '';

    const isComplex = message.length > 80 || /\b(explain|describe|tell me|what are|what is the process|how does|ano ang|paano|bakit|sino)\b/i.test(message);

    const readingDelay = 200 + Math.floor(Math.random() * 300);
    const thinkDuration = isComplex
      ? 1500 + Math.floor(Math.random() * 1000)
      : 500 + Math.floor(Math.random() * 300);

    await new Promise(r => setTimeout(r, readingDelay));

    const thinking = createThinkingMessage();

    await new Promise(r => setTimeout(r, thinkDuration));

    try {
      const { result, suggestions } = await processQuery(message);
      console.log('[KOS-CHAT] Got result, response length:', result.response.length);

      thinking.stopRotating(true);

      await new Promise(r => setTimeout(r, 300 + Math.floor(Math.random() * 200)));

      thinking.wrapper.remove();

      const emotion = result.emotion || 'neutral';
      const responseLen = result.response.length;
      const responseType = responseLen < 100 ? 'short' : responseLen > 500 ? 'long' : 'medium';

      const aiMsg = createMessage({ type: 'ai', text: '' });
      await streamText(aiMsg.paragraph, result.response, emotion, responseType);

      if (suggestions.length > 0) {
        showSmartSuggestions(suggestions);
      }

      updatePageContext();
    } catch (e) {
      console.error('[KOS-CHAT] Error in sendChatMessage:', e.message, e.stack);
      thinking.wrapper.remove();
      createMessage({
        type: 'ai',
        text: 'I encountered an error processing your request. Please try again.'
      });
    }

    busy = false;
    saveConversation();
  }

  /* =========================
     OPEN / CLOSE
     ========================= */

  function openAssistant() {
    aiModal?.classList.add('active');
    aiModal?.classList.remove('minimized');
    hideBubble();
    setTimeout(() => aiInput?.focus(), 300);
    if (!initialized) {
      setTimeout(() => {
        const restored = restoreConversation();
        if (!restored) showEmptyState();
        initialized = true;
      }, 350);
    } else {
      updatePageContext();
    }
  }

  function closeAssistant() {
    aiModal?.classList.remove('active');
    aiModal?.classList.remove('minimized');
    showBubble();
    saveConversation();
  }

  function minimizeAssistant() {
    if (aiModal?.classList.contains('minimized')) {
      aiModal.classList.remove('minimized');
      hideBubble();
    } else {
      aiModal.classList.add('minimized');
  createAboutBtn();
  initDraggable();
  initQuickActions();
  initReadingCompanion();

  showBubble();
    }
  }

  /* =========================
     DRAGGABLE PANEL
     ========================= */

  function initDraggable() {
    const panel = document.querySelector('.ai-panel');
    const header = document.querySelector('.ai-panel-top');
    if (!panel || !header) return;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    let dragging = false;
    let startX, startY, origLeft, origTop;

    function getPosition() {
      try {
        const saved = localStorage.getItem('kos_panel_position');
        if (saved) {
          const pos = JSON.parse(saved);
          if (typeof pos.left === 'number' && typeof pos.top === 'number') {
            return pos;
          }
        }
      } catch (e) {}
      return null;
    }

    function setPosition(left, top) {
      try {
        localStorage.setItem('kos_panel_position', JSON.stringify({ left, top }));
      } catch (e) {}
    }

    function applyPosition() {
      const pos = getPosition();
      if (!pos) return;
      const maxX = window.innerWidth - panel.offsetWidth - 10;
      const maxY = window.innerHeight - panel.offsetHeight - 10;
      const left = Math.max(10, Math.min(pos.left, maxX));
      const top = Math.max(10, Math.min(pos.top, maxY));
      panel.style.position = 'fixed';
      panel.style.left = left + 'px';
      panel.style.top = top + 'px';
      aiModal.style.display = 'block';
    }

    function resetPosition() {
      panel.style.position = '';
      panel.style.left = '';
      panel.style.top = '';
      aiModal.style.display = '';
      try { localStorage.removeItem('kos_panel_position'); } catch (e) {}
    }

    header.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const rect = panel.getBoundingClientRect();
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = rect.left;
      origTop = rect.top;
      panel.classList.add('dragging');
      panel.style.position = 'fixed';
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      panel.style.bottom = 'auto';
      panel.style.right = 'auto';
      aiModal.style.display = 'block';
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = origLeft + dx;
      let newTop = origTop + dy;
      const maxX = window.innerWidth - panel.offsetWidth - 10;
      const maxY = window.innerHeight - panel.offsetHeight - 10;
      newLeft = Math.max(10, Math.min(newLeft, maxX));
      newTop = Math.max(10, Math.min(newTop, maxY));
      panel.style.left = newLeft + 'px';
      panel.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      panel.classList.remove('dragging');
      const rect = panel.getBoundingClientRect();
      setPosition(rect.left, rect.top);
    });

    header.addEventListener('dblclick', () => {
      resetPosition();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        resetPosition();
      }
    });

    window.resetPanelPosition = resetPosition;
    applyPosition();
  }

  /* =========================
     LONG PRESS QUICK ACTIONS
     ========================= */

  function initQuickActions() {
    let pressTimer = null;
    let longPressed = false;

    function showQuickActions() {
      const existing = document.querySelector('.kos-quick-actions');
      if (existing) return;

      const menu = document.createElement('div');
      menu.className = 'kos-quick-actions';

      const items = [
        { icon: '✕', label: 'New Conversation', desc: 'Clear chat history', action: () => {
          clearConversation();
          hideEmptyState();
          showEmptyState();
        }},
        { icon: 'ⓘ', label: 'About', desc: 'Municipal Assistant info', action: () => {
          const btn = document.querySelector('.kos-about-btn');
          if (btn) btn.click();
        }},
        { icon: '↺', label: 'Reset Position', desc: 'Reset panel to default', action: () => {
          if (window.resetPanelPosition) window.resetPanelPosition();
        }}
      ];

      menu.innerHTML = items.map((item, idx) => `
        <button class="kos-quick-item" data-idx="${idx}">
          <div class="kos-quick-icon">${item.icon}</div>
          <div>
            <div class="kos-quick-label">${item.label}</div>
            <div class="kos-quick-desc">${item.desc}</div>
          </div>
        </button>
      `).join('');

      document.body.appendChild(menu);

      menu.querySelectorAll('.kos-quick-item').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(btn.dataset.idx);
          items[idx].action();
          menu.remove();
        });
      });

      setTimeout(() => {
        function dismiss(e) {
          if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', dismiss);
            document.removeEventListener('touchstart', dismiss);
          }
        }
        document.addEventListener('click', dismiss);
        document.addEventListener('touchstart', dismiss);
      }, 50);
    }

    kosBubble?.addEventListener('mousedown', () => {
      longPressed = false;
      pressTimer = setTimeout(() => {
        longPressed = true;
        showQuickActions();
      }, 800);
    });

    kosBubble?.addEventListener('mouseup', () => {
      clearTimeout(pressTimer);
    });

    kosBubble?.addEventListener('mouseleave', () => {
      clearTimeout(pressTimer);
    });

    kosBubble?.addEventListener('touchstart', (e) => {
      longPressed = false;
      pressTimer = setTimeout(() => {
        longPressed = true;
        showQuickActions();
      }, 800);
    });

    kosBubble?.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
    });

    kosBubble?.addEventListener('touchmove', () => {
      clearTimeout(pressTimer);
    });
  }

  /* =========================
     READING COMPANION (IDLE SUGGESTIONS)
     ========================= */

  function initReadingCompanion() {
    let idleTimer = null;
    let companionChips = null;
    const IDLE_DELAY = 35000;

    function getIdleSuggestions() {
      const ctx = KOS.pageContext;
      if (!ctx || !ctx.chapter) return [];

      return [
        { label: 'Explain this section', query: `Explain Chapter ${ctx.chapter}` },
        { label: 'Summarize this page', query: `Summarize Chapter ${ctx.chapter}` },
        { label: 'Related provisions', query: `Related ordinances for Chapter ${ctx.chapter}` },
        { label: 'Common questions', query: `Common questions about Chapter ${ctx.chapter}` }
      ];
    }

    function showCompanionChips() {
      if (companionChips) removeCompanionChips();
      const suggestions = getIdleSuggestions();
      if (suggestions.length === 0) return;

      const chips = document.createElement('div');
      chips.className = 'kos-companion-chips';

      suggestions.forEach(s => {
        const chip = document.createElement('button');
        chip.className = 'kos-companion-chip';
        chip.textContent = s.label;
        chip.addEventListener('click', () => {
          removeCompanionChips();
          openAssistant();
          setTimeout(() => {
            aiInput.value = s.query;
            sendChatMessage();
          }, 400);
        });
        chips.appendChild(chip);
      });

      document.body.appendChild(chips);
      companionChips = chips;
    }

    function removeCompanionChips() {
      if (companionChips) {
        companionChips.remove();
        companionChips = null;
      }
    }

    function resetIdleTimer() {
      removeCompanionChips();
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!aiModal?.classList.contains('active') && kosBubble?.classList.contains('visible')) {
          const ctx = KOS.pageContext;
          if (ctx && ctx.page && ctx.page !== 'home') {
            showCompanionChips();
          }
        }
      }, IDLE_DELAY);
    }

    document.addEventListener('click', (e) => {
      if (companionChips && !companionChips.contains(e.target)) {
        removeCompanionChips();
      }
    });

    const observer = new MutationObserver(() => {
      resetIdleTimer();
    });

    observer.observe(aiConversation || document.body, { childList: true, subtree: true });

    resetIdleTimer();

    setInterval(() => {
      if (!companionChips && !aiModal?.classList.contains('active') && kosBubble?.classList.contains('visible')) {
        const ctx = KOS.pageContext;
        if (ctx && ctx.page && ctx.page !== 'home') {
          resetIdleTimer();
        }
      }
    }, 60000);
  }

  /* =========================
     EVENTS
     ========================= */

  kosBubble?.addEventListener('click', openAssistant);

  const openBtn = document.getElementById('openAI');
  if (openBtn) {
    openBtn.addEventListener('click', openAssistant);
  }

  window.closeAIModal = closeAssistant;
  window.sendMessage = sendChatMessage;

  minAI?.addEventListener('click', minimizeAssistant);
  closeAI?.addEventListener('click', closeAssistant);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aiModal?.classList.contains('active')) {
      closeAssistant();
    }
  });

  sendAI?.addEventListener('click', sendChatMessage);
  aiInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendChatMessage();
    }
  });

  /* =========================
     INIT
     ========================= */

  detectPageContext();

  const loader = showLoading();
  const msgEl = document.querySelector('#kosLoadingMsg');
  if (msgEl) msgEl.textContent = 'Preparing Municipal Intelligence...';

  KOS.initialize();

  KOS.knowledgeLoader.onLoad(() => {
    hideLoading(loader);
    KOS.status = 'ready';
    setTimeout(() => {
      KOS.autoLoader.loadNewFiles();
    }, 2000);
  });

  let failsafe = setTimeout(() => {
    hideLoading(loader);
    KOS.status = 'ready';
  }, 2000);

  const origHide = hideLoading;
  hideLoading = function(ldr) {
    clearTimeout(failsafe);
    origHide(ldr);
  };

  showBubble();

  console.log(`
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  KOS — Knowledge Operating System
  Municipal Legal Intelligence Engine
  Status: ${KOS.status}
  Version: ${KOS.version}
  Page: ${KOS.pageContext?.page || 'unknown'}
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
