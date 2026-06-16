require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProvider } = require('./server/ai-provider');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

let provider;
try {
  provider = createProvider();
  console.log('AI provider initialized: gemini');
} catch (err) {
  console.warn('Warning: AI provider not initialized. Start with GEMINI_API_KEY set.');
  console.warn(err.message);
}

app.post('/api/chat/stream', async (req, res) => {
  if (!provider) {
    return res.status(503).json({ error: 'AI provider not configured. Set GEMINI_API_KEY.' });
  }

  const { message, history = [] } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const messages = [
    ...history,
    { role: 'user', parts: [{ text: message }] }
  ];

  let fullText = '';
  let streamEnded = false;

  const endStream = () => {
    if (streamEnded) return;
    streamEnded = true;
    if (!res.writableEnded) {
      res.end();
    }
  };

  req.on('close', endStream);

  try {
    await provider.generateContentStream(messages, {
      onChunk: (chunk) => {
        fullText += chunk;
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }
      },
      onComplete: (text) => {
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ done: true, fullText: text })}\n\n`);
        }
        endStream();
      },
      onError: (error) => {
        if (fullText) {
          if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
          }
        } else {
          if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ error: error.message || 'AI response failed' })}\n\n`);
          }
        }
        endStream();
      }
    });
  } catch (err) {
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);
    }
    endStream();
  }
});

app.post('/api/chat', async (req, res) => {
  if (!provider) {
    return res.status(503).json({ error: 'AI provider not configured. Set GEMINI_API_KEY.' });
  }

  const { message, history = [] } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const messages = [
    ...history,
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const response = await provider.generateContent(messages);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'AI response failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: 'LGU PORTAL 19',
    provider: provider ? 'gemini' : 'unconfigured',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  });
});

app.listen(PORT, () => {
  console.log(`\n  LGU PORTAL 19 — Municipal Assistant API`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health\n`);
});
