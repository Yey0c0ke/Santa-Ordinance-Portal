/* =========================
   KOS AI PROVIDER ABSTRACTION LAYER
   Routes queries to the configured AI provider
   via Vercel Serverless Function (/api/chat)
   ========================= */

window.KOS_AI = {
  endpoint: '/api/chat',

  async enhance({ query, context, mode, style, language, emotion }) {
    if (!query) {
      console.log('[KOS-AI-PROVIDER] No query provided');
      return null;
    }

    try {
      const conversation = (KOS.memory.conversation || []).slice(-6).map(entry => [
        { role: 'user', content: entry.query },
        { role: 'assistant', content: entry.response }
      ]).flat();

      console.log('[KOS-AI-PROVIDER] Sending request to /api/chat');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const resp = await fetch(this.endpoint, {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          context: context || null,
          mode: mode || 'general',
          conversation,
          style: style || 'citizen',
          language: language || 'english',
          emotion: emotion || 'neutral'
        })
      });

      clearTimeout(timeout);

      if (!resp.ok) {
        console.error('[KOS-AI-PROVIDER] API response not ok:', resp.status, resp.statusText);
        return null;
      }

      const data = await resp.json();

      if (data.error || !data.response) {
        console.error('[KOS-AI-PROVIDER] API error:', data.error || 'No response');
        return null;
      }

      console.log('[KOS-AI-PROVIDER] Got response:', data.response.substring(0, 100) + '...');
      return data.response;
    } catch (e) {
      console.error('[KOS-AI-PROVIDER] Fetch error:', e.message, e.stack);
      return null;
    }
  }
};
