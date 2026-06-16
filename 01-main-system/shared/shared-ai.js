/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHARED AI — MUNICIPAL ASSISTANT
Injected on every page. Persists conversation across navigations.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

(function(){

/* ─── INJECT CSS ─── */

(function injectCSS(){
  const id = 'shared-ai-css';
  if(document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
:root{
  --ai-bg:#06110b;
  --ai-text:#f6fff8;
  --ai-text-sec:rgba(240,255,245,.72);
  --ai-text-soft:rgba(240,255,245,.48);
  --ai-emerald:#34d399;
  --ai-emerald-soft:rgba(52,211,153,.14);
  --ai-glass:rgba(14,24,18,.72);
  --ai-border:rgba(255,255,255,.06);
  --ai-motion:cubic-bezier(.22,.61,.36,1);
  --ai-motion-soft:cubic-bezier(.16,1,.3,1);
}

@keyframes aiPulse{
  0%{transform:scale(.7);opacity:.8}
  100%{transform:scale(1.8);opacity:0}
}
@keyframes cursorBlink{
  0%,100%{opacity:1}
  50%{opacity:0}
}
@keyframes messageIn{
  from{opacity:0;transform:translateY(16px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes typingBounce{
  0%,80%,100%{transform:translateY(0);opacity:.4}
  40%{transform:translateY(-6px);opacity:1}
}
@keyframes pillFloat{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-3px)}
}

.ai-pill-wrap{
  position:fixed;bottom:24px;right:24px;z-index:999999;
  pointer-events:none;
  will-change:transform;
}
.ai-floating-pill{
  position:relative;pointer-events:auto;
  display:inline-flex;align-items:center;gap:10px;
  border:none;cursor:pointer;padding:14px 22px;border-radius:999px;
  background:linear-gradient(135deg,rgba(52,211,153,.92),rgba(16,185,129,.96));
  color:#06110b;font-size:.88rem;font-weight:660;
  font-family:'Inter',sans-serif;
  box-shadow:0 4px 24px rgba(52,211,153,.3),0 0 0 1px rgba(255,255,255,.08);
  transition:transform .42s var(--ai-motion-soft),box-shadow .42s var(--ai-motion-soft),opacity .42s var(--ai-motion-soft);
  -webkit-tap-highlight-color:transparent;user-select:none;
  animation:pillFloat 4s ease-in-out infinite;
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
}
.ai-floating-pill:hover{
  transform:translateY(-4px) scale(1.05);
  box-shadow:0 12px 40px rgba(52,211,153,.5),0 0 0 1px rgba(255,255,255,.16);
}
.ai-floating-pill:active{transform:scale(.97)}
.ai-floating-pill.hidden{opacity:0;pointer-events:none;transform:translateY(12px) scale(.92);animation:none}

.ai-pill-dot{
  width:10px;height:10px;border-radius:50%;
  background:currentColor;opacity:.9;
  flex-shrink:0;
}

.ai-unread-badge{
  position:absolute;top:-4px;right:-4px;width:14px;height:14px;
  border-radius:50%;background:var(--ai-emerald);
  border:2px solid #06110b;
  box-shadow:0 0 12px rgba(52,211,153,.6);
  display:none;pointer-events:none;
}
.ai-unread-badge.visible{display:block}

.ai-panel{
  position:fixed;bottom:24px;right:24px;z-index:999999;
  width:420px;height:560px;max-height:calc(100vh - 48px);
  display:flex;flex-direction:column;border-radius:34px;
  overflow:hidden;
  background:linear-gradient(180deg,rgba(13,22,17,.96),rgba(8,14,11,.98));
  border:1px solid rgba(255,255,255,.06);
  box-shadow:0 24px 80px rgba(0,0,0,.40);
  transform:translateY(20px) scale(.94);opacity:0;pointer-events:none;
  transition:transform .42s var(--ai-motion-soft),opacity .42s var(--ai-motion-soft);
}
.ai-panel.active{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}
.ai-panel.minimized{transform:translateY(40px) scale(.88);opacity:0;pointer-events:none}
.ai-panel.maximized{width:480px;height:680px}

.ai-panel-top{
  display:flex;align-items:center;justify-content:space-between;
  padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.05);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
}
.ai-panel-title{display:flex;align-items:center;gap:12px}
.ai-panel-controls{display:flex;align-items:center;gap:6px}
.ai-ctrl-btn{
  border:none;cursor:pointer;width:32px;height:32px;border-radius:50%;
  display:grid;place-items:center;
  background:rgba(255,255,255,.06);color:rgba(240,255,245,.7);
  transition:transform .24s var(--ai-motion-soft),background .24s var(--ai-motion-soft),color .24s var(--ai-motion-soft);
}
.ai-ctrl-btn:hover{background:rgba(255,255,255,.12);color:#fff;transform:scale(1.08)}
.ai-ctrl-btn:active{transform:scale(.92)}
.ai-status-wrap{position:relative;width:14px;height:14px}
.ai-status-dot{position:absolute;inset:0;border-radius:50%;background:var(--ai-emerald);z-index:2}
.ai-status-pulse{position:absolute;inset:-5px;border-radius:50%;background:rgba(52,211,153,.22);animation:aiPulse 2s linear infinite}

.ai-panel-title h3{font-size:1rem;color:#f6fff8}
.ai-panel-title p{margin-top:4px;color:var(--ai-text-sec);font-size:.82rem}

.ai-body{position:relative;flex:1;display:flex;flex-direction:column;min-height:0}

.ai-conversation{
  position:relative;flex:1;overflow-y:auto;overflow-x:hidden;
  display:flex;flex-direction:column;gap:16px;
  padding:22px 22px 18px;scroll-behavior:smooth;overscroll-behavior:contain;
}
.ai-conversation::-webkit-scrollbar{width:8px}
.ai-conversation::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:999px}

.ai-stream-cursor{
  display:inline-block;width:2px;height:1.1em;
  background:var(--ai-emerald);margin-left:2px;
  vertical-align:text-bottom;animation:cursorBlink .8s step-end infinite;border-radius:1px
}

.ai-message{
  display:flex;align-items:flex-end;gap:12px;max-width:78%;
  animation:messageIn .42s var(--ai-motion-soft);
}
.ai-message-user{align-self:flex-end;flex-direction:row-reverse}
.ai-avatar{flex-shrink:0;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:.76rem;font-weight:700;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.05)}
.ai-bubble{position:relative;padding:16px 18px;border-radius:24px;line-height:1.75;font-size:.95rem;letter-spacing:.2px;overflow:hidden}
.ai-message-ai .ai-bubble{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.04)}
.ai-message-user .ai-bubble{background:rgba(52,211,153,.14);border:1px solid rgba(52,211,153,.18)}
.ai-bubble p{margin:0;white-space:pre-wrap}
.ai-bubble p+p{margin-top:12px}
.ai-bubble ul{margin:8px 0;padding-left:20px;list-style:disc}
.ai-bubble li{margin:4px 0}
.ai-bubble h2,.ai-bubble h3,.ai-bubble h4{margin:16px 0 8px;line-height:1.3}
.ai-bubble h2{font-size:1.2rem}
.ai-bubble h3{font-size:1.1rem}
.ai-bubble h4{font-size:1rem}
.ai-bubble pre{margin:12px 0;padding:16px;border-radius:16px;background:rgba(0,0,0,.3);overflow-x:auto;font-size:.86rem;line-height:1.5}
.ai-bubble code{font-family:monospace;font-size:.88rem;background:rgba(255,255,255,.06);padding:2px 6px;border-radius:6px}
.ai-bubble pre code{background:none;padding:0}
.ai-bubble strong{color:rgba(52,211,153,.9)}

@keyframes shineMove{
  from{transform:translateX(-120%)}
  to{transform:translateX(120%)}
}

.ai-typing{display:flex;align-items:center;gap:6px;min-height:20px}
.ai-typing span{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.62);animation:typingBounce 1s infinite ease-in-out}
.ai-typing span:nth-child(2){animation-delay:.12s}
.ai-typing span:nth-child(3){animation-delay:.24s}

.ai-message-actions{display:flex;gap:8px;margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,.06)}
.ai-action-btn{
  border:none;cursor:pointer;padding:5px 10px;border-radius:8px;
  background:rgba(255,255,255,.05);color:rgba(240,255,245,.65);
  font-size:.7rem;font-family:'Inter',sans-serif;font-weight:520;
  transition:background .2s,color .2s;
  -webkit-tap-highlight-color:transparent;
}
.ai-action-btn:hover{background:rgba(255,255,255,.10);color:rgba(240,255,245,.9)}
.ai-action-btn:active{transform:scale(.94)}
.ai-stop-btn{color:rgba(255,120,110,.8);font-weight:600}
.ai-stop-btn:hover{background:rgba(255,80,70,.15)!important;color:rgba(255,80,70,.95)!important}

.ai-suggestions{
  display:flex;flex-wrap:wrap;gap:10px;padding:4px 22px 18px;
  flex-shrink:0;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;
}
.ai-suggestions::-webkit-scrollbar{display:none}
.suggestion-chip{
  border:none;cursor:pointer;flex-shrink:0;padding:10px 16px;border-radius:999px;
  font-size:.84rem;background:rgba(255,255,255,.07);color:rgba(240,255,245,.85);
  border:1px solid rgba(255,255,255,.06);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  transition:background .24s,transform .24s,border .24s;
  -webkit-tap-highlight-color:transparent;font-family:'Inter',sans-serif;
}
.suggestion-chip:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.10);transform:translateY(-1px)}
.suggestion-chip:active{transform:scale(.96)}

.ai-input-shell{
  padding:0 22px 22px;border-top:1px solid rgba(255,255,255,.05);
  background:linear-gradient(to top,rgba(8,14,11,.98),rgba(8,14,11,.82));
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
}
.ai-input-wrap{display:flex;align-items:center;gap:12px;margin-top:18px}
.ai-input{
  flex:1;width:100%;border:none;outline:none;
  padding:18px 22px;min-height:56px;max-height:160px;border-radius:20px;
  font-family:'Inter',sans-serif;resize:none;line-height:1.5;
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.04);
  color:#fff;font-size:.96rem;
  transition:border .32s,background .32s,box-shadow .32s;
}
.ai-input::placeholder{color:rgba(255,255,255,.42)}
.ai-input:focus{background:rgba(255,255,255,.08);border-color:rgba(52,211,153,.24);box-shadow:0 0 0 4px rgba(52,211,153,.08)}
.ai-send-btn{
  position:relative;overflow:hidden;border:none;cursor:pointer;
  min-width:120px;height:56px;padding:0 24px;border-radius:18px;flex-shrink:0;
  background:rgba(255,255,255,.94);color:#08110d;font-weight:760;
  transition:transform .32s,box-shadow .32s,opacity .32s;
}
.ai-send-btn:hover{transform:translateY(-2px)}
.ai-send-btn:active{transform:scale(.98)}
.send-label{position:relative;z-index:2}
.send-glow{position:absolute;inset:0;background:radial-gradient(circle at center,rgba(255,255,255,.48),transparent 68%);opacity:0;transition:opacity .32s}
.ai-send-btn:hover .send-glow{opacity:1}
.ai-footer-note{margin-top:14px;padding-left:4px;font-size:.78rem;color:var(--ai-text-soft);letter-spacing:.3px}

.ai-welcome-header{padding:16px 20px 4px;flex-shrink:0}
.ai-welcome-greeting{font-size:.88rem;color:var(--ai-text-sec);margin-bottom:6px}
.ai-welcome-name{font-size:1.2rem;font-weight:750;letter-spacing:-.3px;line-height:1.2;color:#f6fff8}
.ai-welcome-sub{margin-top:4px;font-size:.9rem;color:var(--ai-text-sec)}

@media(max-width:768px){
  .ai-pill-wrap{bottom:16px;right:16px}
  .ai-panel{width:94%;height:90vh;border-radius:28px;bottom:16px;right:16px}
  .ai-panel.maximized{width:calc(100% - 32px);height:85vh;max-height:none}
  .ai-floating-pill{padding:12px 18px;font-size:.84rem}
  .ai-conversation{padding:20px 18px 20px}
  .ai-message{max-width:100%}
  .ai-input-wrap{flex-direction:column;align-items:stretch}
  .ai-send-btn{width:100%}
  .ai-panel-top{padding:16px 18px}
  .ai-panel-title h3{font-size:.92rem}
  .ai-panel-title p{font-size:.76rem}
  .ai-suggestions{padding:4px 18px 18px}
  .ai-input-shell{padding:0 18px 20px}
}
@media(max-width:600px){
  .ai-pill-wrap{bottom:12px;right:12px}
  .ai-panel{width:calc(100% - 20px);max-width:none;height:70vh;max-height:500px;bottom:12px;right:12px;border-radius:26px}
  .ai-floating-pill{padding:10px 16px;font-size:.80rem}
  .ai-conversation{padding:16px}
  .ai-suggestions{padding:0 16px 16px;gap:8px;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;justify-content:flex-start}
  .ai-suggestions::-webkit-scrollbar{display:none}
  .suggestion-chip{padding:8px 14px;font-size:.78rem;flex-shrink:0}
  .ai-input-shell{padding:0 16px 16px}
  .ai-input{padding:12px 14px;min-height:44px;font-size:.86rem}
  .ai-send-btn{min-width:80px;height:44px;font-size:.84rem}
  .ai-message{max-width:96%;padding:12px 14px;font-size:.86rem}
  .ai-message-actions{gap:6px}
  .ai-action-btn{padding:4px 10px;font-size:.7rem}
}
@media(max-width:480px){
  .ai-pill-wrap{bottom:12px;right:12px}
  .ai-panel{width:100%;height:65vh;max-height:480px;bottom:0;right:0;border-radius:24px 24px 0 0;border-bottom:none}
  .ai-panel.maximized{height:85vh;max-height:none}
  .ai-panel-top{padding:14px 16px}
  .ai-ctrl-btn{width:28px;height:28px}
  .ai-welcome-header{padding:12px 16px 2px}
  .ai-welcome-greeting{font-size:.8rem}
  .ai-welcome-name{font-size:1.1rem}
  .ai-welcome-sub{font-size:.82rem}
  .ai-floating-pill{padding:10px 16px;font-size:.78rem}
}
@media(min-width:769px) and (max-width:1024px){
  .ai-panel{width:380px;height:520px}
  .ai-panel.maximized{width:440px;height:600px}
}
@media(min-width:1025px) and (max-width:1366px){
  .ai-panel{width:400px;height:540px}
  .ai-panel.maximized{width:460px;height:640px}
}
/* 390px – iPhone 14 Pro */
@media(max-width:390px){
  .ai-pill-wrap{bottom:10px;right:10px}
  .ai-panel{width:100%;height:60vh;max-height:440px;bottom:0;right:0;border-radius:22px 22px 0 0}
  .ai-floating-pill{padding:8px 14px;font-size:.76rem}
  .ai-pill-dot{width:8px;height:8px}
  .ai-panel-top{padding:12px 14px}
  .ai-ctrl-btn{width:26px;height:26px}
  .ai-welcome-header{padding:10px 14px 2px}
  .ai-welcome-greeting{font-size:.76rem}
  .ai-welcome-name{font-size:1rem}
  .ai-welcome-sub{font-size:.78rem}
  .ai-conversation{padding:14px;gap:12px}
  .ai-suggestions{padding:0 14px 14px;gap:6px;flex-wrap:nowrap;overflow-x:auto}
  .suggestion-chip{padding:6px 12px;font-size:.74rem}
  .ai-input-shell{padding:0 14px 14px}
  .ai-input{padding:10px 12px;min-height:40px;font-size:.82rem}
  .ai-send-btn{min-width:64px;height:40px;font-size:.8rem;padding:0 16px}
  .ai-message{max-width:98%;padding:10px 12px;font-size:.82rem}
}
/* 412px – large Android */
@media(min-width:391px) and (max-width:412px){
  .ai-pill-wrap{bottom:12px;right:12px}
  .ai-panel{width:100%;height:62vh;max-height:460px;bottom:0;right:0;border-radius:24px 24px 0 0}
  .ai-floating-pill{padding:9px 15px;font-size:.78rem}
  .ai-pill-dot{width:9px;height:9px}
  .ai-welcome-header{padding:11px 15px 2px}
  .ai-welcome-greeting{font-size:.78rem}
  .ai-welcome-name{font-size:1.05rem}
  .ai-welcome-sub{font-size:.8rem}
}
/* 820px – iPad Air landscape */
@media(min-width:769px) and (max-width:820px){
  .ai-pill-wrap{bottom:20px;right:20px}
  .ai-panel{width:360px;height:500px;border-radius:30px}
  .ai-panel.maximized{width:420px;height:580px}
}
`;
  document.head.appendChild(style);
})();

const STORAGE_KEY = 'lgu_ai_conversation';
const STATE_KEY = 'lgu_ai_state';

/* ─── INJECT HTML ─── */

function injectAI(){

  if(document.getElementById('aiPill')) return;

  const html = `
<div class="ai-pill-wrap" id="aiPillWrap">
<button class="ai-floating-pill" id="aiPill" type="button" aria-label="Open Municipal Assistant">
  <span class="ai-unread-badge" id="aiUnreadBadge"></span>
  <span class="ai-pill-dot"></span>
  Municipal Assistant
</button>
</div>

<div class="ai-panel" id="aiPanel" aria-hidden="true">
  <div class="ai-panel-top">
    <div class="ai-panel-title">
      <div class="ai-status-wrap">
        <div class="ai-status-dot"></div>
        <div class="ai-status-pulse"></div>
      </div>
      <div>
        <h3 id="aiTitle">Municipal Assistant</h3>
        <p>Helping Citizens & LGU Personnel</p>
      </div>
    </div>
    <div class="ai-panel-controls">
      <button class="ai-ctrl-btn ai-maximize-btn" id="maximizeAI" type="button" aria-label="Maximize">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="2" y="2" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/>
          <rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none" opacity=".4"/>
        </svg>
      </button>
      <button class="ai-ctrl-btn ai-minimize-btn" id="minimizeAI" type="button" aria-label="Minimize">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="5.5" width="10" height="1.5" rx=".75" fill="currentColor"/>
        </svg>
      </button>
      <button class="ai-ctrl-btn ai-close-btn" id="closeAI" type="button" aria-label="Close AI">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
  <div class="ai-body">
    <div class="ai-conversation" id="aiConversation">
      <div class="ai-welcome-header" id="aiWelcome">
        <div class="ai-welcome-greeting">👋 Welcome!</div>
        <div class="ai-welcome-name">Municipal Assistant</div>
        <div class="ai-welcome-sub">How can I help you today?</div>
      </div>
    </div>
    <div class="ai-suggestions" id="aiSuggestions">
      <button class="suggestion-chip" type="button">Ordinances</button>
      <button class="suggestion-chip" type="button">Permits</button>
      <button class="suggestion-chip" type="button">Tax</button>
      <button class="suggestion-chip" type="button">Services</button>
      <button class="suggestion-chip" type="button">Business</button>
      <button class="suggestion-chip" type="button">Governance</button>
    </div>
    <div class="ai-input-shell">
      <div class="ai-input-wrap">
        <textarea class="ai-input" id="aiInput" placeholder="Ask Municipal Assistant..." rows="1"></textarea>
        <button class="ai-send-btn" id="sendAI" type="button" aria-label="Send Message">
          <span class="send-label">Send</span>
          <span class="send-glow"></span>
        </button>
      </div>
      <div class="ai-footer-note">Municipal legal informational assistant</div>
    </div>
  </div>
</div>`;

  const frag = document.createRange().createContextualFragment(html);
  document.body.appendChild(frag);
}

/* ─── STATE ─── */

let isPanelOpen = false;
let isBusy = false;
let abortController = null;
let conversationHistory = [];
let lastMessage = '';
let lastResponse = '';
let streamingEl = null;
let streamingText = '';
let hasStreamed = false;
let thinkingEl = null;
let cursorEl = null;

function saveState(){
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
    sessionStorage.setItem(STATE_KEY, JSON.stringify({
      lastMessage,
      lastResponse,
      isPanelOpen
    }));
  } catch(e){}
}

function loadState(){
  try {
    const convo = sessionStorage.getItem(STORAGE_KEY);
    if(convo) conversationHistory = JSON.parse(convo);
    const state = sessionStorage.getItem(STATE_KEY);
    if(state){
      const s = JSON.parse(state);
      lastMessage = s.lastMessage || '';
      lastResponse = s.lastResponse || '';
    }
  } catch(e){}
}

function clearState(){
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STATE_KEY);
    conversationHistory = [];
    lastMessage = '';
    lastResponse = '';
  } catch(e){}
}

/* ─── DOM REFS ─── */

let aiPanel, aiPill, aiPillWrap, aiConversation, aiInput, sendAI, closeAI, minimizeAI, maximizeAI, aiUnreadBadge, aiWelcome, aiSuggestions;
let suggestionChips = [];

function cacheDOM(){
  aiPanel = document.getElementById('aiPanel');
  aiPillWrap = document.getElementById('aiPillWrap');
  aiPill = document.getElementById('aiPill');
  aiConversation = document.getElementById('aiConversation');
  aiInput = document.getElementById('aiInput');
  sendAI = document.getElementById('sendAI');
  closeAI = document.getElementById('closeAI');
  minimizeAI = document.getElementById('minimizeAI');
  maximizeAI = document.getElementById('maximizeAI');
  aiUnreadBadge = document.getElementById('aiUnreadBadge');
  aiWelcome = document.getElementById('aiWelcome');
  aiSuggestions = document.getElementById('aiSuggestions');
  suggestionChips = [...document.querySelectorAll('.suggestion-chip')];
}

/* ─── HELPERS ─── */

function escapeHtml(text){
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

function scrollConversation(){
  if(!aiConversation) return;
  requestAnimationFrame(() => {
    aiConversation.scrollTop = aiConversation.scrollHeight;
  });
}

function sanitizeHTML(text){
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

function renderMarkdown(text){
  if(!text) return '';
  let html = sanitizeHTML(text);
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<br><\/li>/g, '</li>');
  html = html.replace(/<\/ul><br>/g, '</ul>');
  html = html.replace(/<\/ul><p>/g, '</ul><p>');
  html = html.replace(/<p><ul>/g, '<ul>');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');
  html = html.replace(/<p><li>/g, '<li>');
  html = html.replace(/<\/li><\/p>/g, '</li>');
  return html;
}

/* ─── MESSAGES ─── */

function createMessage({ type='ai', text='' }){
  const wrapper = document.createElement('div');
  wrapper.className = `ai-message ai-message-${type}`;
  const avatar = document.createElement('div');
  avatar.className = 'ai-avatar';
  avatar.textContent = type === 'ai' ? 'MA' : 'You';
  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  const paragraph = document.createElement('p');
  paragraph.innerHTML = renderMarkdown(escapeHtml(text));
  bubble.appendChild(paragraph);
  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  aiConversation.appendChild(wrapper);
  scrollConversation();
  return { wrapper, bubble, paragraph };
}

function createThinkingMessage(){
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-message ai-message-ai ai-thinking-message';
  wrapper.id = 'aiThinkingMsg';
  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  const typing = document.createElement('div');
  typing.className = 'ai-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  bubble.appendChild(typing);
  wrapper.appendChild(bubble);
  aiConversation.appendChild(wrapper);
  scrollConversation();
  return wrapper;
}

/* ─── STREAMING ─── */

function addStopButton(wrapper){
  const bubble = wrapper.querySelector('.ai-bubble');
  if(!bubble) return;
  let existing = bubble.querySelector('.ai-stop-btn');
  if(existing) existing.remove();
  const btn = document.createElement('button');
  btn.className = 'ai-action-btn ai-stop-btn';
  btn.textContent = '■ Stop';
  btn.addEventListener('click', function(){
    if(abortController){
      abortController.abort();
      abortController = null;
    }
    if(cursorEl) cursorEl.remove();
    this.textContent = 'Stopped';
    this.disabled = true;
    setTimeout(() => this.remove(), 1200);
    isBusy = false;
  });
  bubble.appendChild(btn);
}

function removeStopButton(wrapper){
  const btn = wrapper?.querySelector('.ai-stop-btn');
  if(btn) btn.remove();
}

function addMessageActions(wrapper, text){
  const bubble = wrapper.querySelector('.ai-bubble');
  if(!bubble) return;
  let existing = bubble.querySelector('.ai-message-actions');
  if(existing) existing.remove();
  const actions = document.createElement('div');
  actions.className = 'ai-message-actions';
  const copyBtn = document.createElement('button');
  copyBtn.className = 'ai-action-btn';
  copyBtn.textContent = 'Copy';
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    });
  });
  const regenBtn = document.createElement('button');
  regenBtn.className = 'ai-action-btn';
  regenBtn.textContent = 'Regenerate';
  regenBtn.addEventListener('click', () => {
    if(isBusy || !lastMessage) return;
    const msgs = aiConversation.querySelectorAll('.ai-message-ai');
    if(msgs.length > 0) msgs[msgs.length - 1].remove();
    aiInput.value = lastMessage;
    sendMessage();
  });
  actions.appendChild(copyBtn);
  actions.appendChild(regenBtn);
  bubble.appendChild(actions);
}

/* ─── API ─── */

function sendChatMessage(message, { onChunk, onComplete, onError }){
  const controller = new AbortController();
  abortController = controller;

  fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: conversationHistory }),
    signal: controller.signal
  })
  .then(async (response) => {
    if(!response.ok){
      const text = await response.text().catch(() => '');
      throw new Error(text || `Server error: ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    function processResult({ done, value }){
      if(done) return;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for(const line of lines){
        const trimmed = line.trim();
        if(trimmed.startsWith('data: ')){
          try {
            const data = JSON.parse(trimmed.slice(6));
            if(data.chunk){
              fullText += data.chunk;
              onChunk(data.chunk, fullText);
            }
            if(data.done){
              conversationHistory.push({ role: 'user', parts: [{ text: message }] });
              conversationHistory.push({ role: 'model', parts: [{ text: data.fullText || fullText }] });
              saveState();
              onComplete(data.fullText || fullText);
            }
            if(data.error){
              onError(new Error(data.error));
            }
          } catch(e){}
        }
      }
      return reader.read().then(processResult);
    }
    return reader.read().then(processResult);
  })
  .catch(err => {
    if(err.name === 'AbortError'){
      onComplete('');
    } else {
      onError(err);
    }
  });

  return controller;
}

/* ─── SEND ─── */

function sendMessage(){
  if(isBusy || !aiInput) return;
  const message = aiInput.value.trim();
  if(!message) return;

  lastMessage = message;
  isBusy = true;
  hasStreamed = false;
  streamingText = '';
  streamingEl = null;
  cursorEl = null;

  if(aiWelcome) aiWelcome.style.display = 'none';

  createMessage({ type:'user', text: message });
  aiInput.value = '';
  aiInput.style.height = 'auto';

  thinkingEl = createThinkingMessage();

  const controller = sendChatMessage(message, {
    onChunk: (chunk, fullText) => {
      if(!hasStreamed){
        hasStreamed = true;
        if(thinkingEl) thinkingEl.remove();
        const result = createMessage({ type:'ai', text:'' });
        streamingEl = result;
        streamingText = fullText;
        result.paragraph.innerHTML = renderMarkdown(fullText);
        cursorEl = document.createElement('span');
        cursorEl.className = 'ai-stream-cursor';
        result.paragraph.appendChild(cursorEl);
        addStopButton(result.wrapper);
      } else if(streamingEl){
        streamingText = fullText;
        streamingEl.paragraph.innerHTML = renderMarkdown(fullText);
        streamingEl.paragraph.appendChild(cursorEl);
        scrollConversation();
      }
    },
    onComplete: (text) => {
      if(cursorEl) cursorEl.remove();
      if(!hasStreamed){
        if(thinkingEl) thinkingEl.remove();
        if(text){
          const result = createMessage({ type:'ai', text });
          lastResponse = text;
          addMessageActions(result.wrapper, text);
          conversationHistory.push({ role: 'user', parts: [{ text: message }] });
          conversationHistory.push({ role: 'model', parts: [{ text }] });
          saveState();
        }
      } else if(streamingEl){
        lastResponse = streamingText || text;
        removeStopButton(streamingEl.wrapper);
        addMessageActions(streamingEl.wrapper, lastResponse);
      }
      isBusy = false;
    },
    onError: () => {
      if(cursorEl) cursorEl.remove();
      if(thinkingEl) thinkingEl.remove();
      if(!hasStreamed){
        createMessage({ type:'ai', text:'Connection error. Please try again.' });
      }
      isBusy = false;
    }
  });
}

/* ─── PANEL CONTROLS ─── */

function openAIPanel(){
  if(!aiPanel) return;
  aiPanel.classList.add('active');
  aiPanel.classList.remove('minimized');
  aiPanel.setAttribute('aria-hidden', 'false');
  if(aiPill) aiPill.classList.add('hidden');
  if(aiUnreadBadge) aiUnreadBadge.classList.remove('visible');
  isPanelOpen = true;
  saveState();
  setTimeout(() => { if(aiInput) aiInput.focus(); }, 300);
}

function closeAIPanel(){
  if(!aiPanel) return;
  aiPanel.classList.remove('active', 'minimized');
  aiPanel.setAttribute('aria-hidden', 'true');
  if(aiPill) aiPill.classList.remove('hidden');
  if(aiUnreadBadge) aiUnreadBadge.classList.remove('visible');
  isPanelOpen = false;
  saveState();
}

function minimizeAIPanel(){
  if(!aiPanel) return;
  aiPanel.classList.toggle('minimized');
  if(aiPanel.classList.contains('minimized')){
    if(aiPill) aiPill.classList.remove('hidden');
  } else {
    if(aiPill) aiPill.classList.add('hidden');
    setTimeout(() => { if(aiInput) aiInput.focus(); }, 300);
  }
  saveState();
}

function maximizeAIPanel(){
  if(!aiPanel) return;
  aiPanel.classList.toggle('maximized');
}

/* ─── RESTORE CONVERSATION ─── */

function restoreConversation(){
  if(!aiConversation) return;
  for(const entry of conversationHistory){
    if(entry.role === 'user'){
      createMessage({ type:'user', text: entry.parts[0]?.text || '' });
    } else if(entry.role === 'model'){
      const result = createMessage({ type:'ai', text: entry.parts[0]?.text || '' });
      if(result && entry.parts[0]?.text){
        addMessageActions(result.wrapper, entry.parts[0].text);
      }
    }
  }
  if(conversationHistory.length > 0 && aiWelcome){
    aiWelcome.style.display = 'none';
  }
}

/* ─── EVENTS ─── */

function bindEvents(){
  const openAI = document.getElementById('openAI');
  if(openAI) openAI.addEventListener('click', openAIPanel);

  if(aiPill) aiPill.addEventListener('click', openAIPanel);
  if(closeAI) closeAI.addEventListener('click', closeAIPanel);
  if(minimizeAI) minimizeAI.addEventListener('click', minimizeAIPanel);
  if(maximizeAI) maximizeAI.addEventListener('click', maximizeAIPanel);
  if(sendAI) sendAI.addEventListener('click', sendMessage);

  if(aiInput){
    aiInput.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' && !e.shiftKey){
        e.preventDefault();
        sendMessage();
      }
    });
    aiInput.addEventListener('input', () => {
      aiInput.style.height = 'auto';
      aiInput.style.height = Math.min(aiInput.scrollHeight, 160) + 'px';
    });
  }

  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if(isBusy || !aiInput) return;
      aiInput.value = chip.textContent.trim();
      sendMessage();
    });
  });

  window.addEventListener('keydown', (e) => {
    if((e.ctrlKey || e.metaKey) && e.key === 'k'){
      e.preventDefault();
      if(isPanelOpen){ closeAIPanel(); } else { openAIPanel(); }
      return;
    }
    if(aiPanel?.classList.contains('active') && !aiPanel?.classList.contains('minimized')){
      if(e.key === 'Escape'){
        minimizeAIPanel();
        return;
      }
    }
  });

  /* Smart scroll drift */
  window.addEventListener('scroll', onScrollDrift, { passive: true });
}

/* ─── SMART SCROLL ANIMATION ─── */

let scrollDriftVelocity = 0;
let driftRafId = null;

function tickDrift(){
  scrollDriftVelocity *= 0.82;
  if(aiPillWrap && aiPill && !aiPill.classList.contains('hidden') && !aiPill.classList.contains('hidden')){
    if(Math.abs(scrollDriftVelocity) > 0.05){
      aiPillWrap.style.transform = `translateY(${scrollDriftVelocity}px)`;
      driftRafId = requestAnimationFrame(tickDrift);
      return;
    }
  }
  if(aiPillWrap) aiPillWrap.style.transform = '';
  driftRafId = null;
}

let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
function onScrollDrift(){
  const sy = window.scrollY;
  const delta = sy - lastScrollY;
  lastScrollY = sy;
  const target = Math.max(-5, Math.min(5, delta * 0.22));
  scrollDriftVelocity = target;
  if(!driftRafId) driftRafId = requestAnimationFrame(tickDrift);
}

/* ─── INIT ─── */

function init(){
  injectAI();
  cacheDOM();
  loadState();
  restoreConversation();
  bindEvents();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('pageshow', () => {
  cacheDOM();
  loadState();
  lastScrollY = window.scrollY;
});

})();
