import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

const PROVIDER = process.env.AI_PROVIDER || 'gemini';

function buildSystemPrompt(mode, context, style, language) {
  const langInstruction = language === 'filipino'
    ? 'Respond in Filipino. Use formal but friendly tone.'
    : language === 'taglish'
      ? 'Respond in Taglish (naturally mix Filipino and English). Use conversational tone.'
      : 'Respond in English. Use warm conversational tone.';

  if (mode === 'legal' && context) {
    return `You are the Municipal Assistant for Santa, Ilocos Sur, powered by KOS (Knowledge Operating System). You are a helpful municipal officer assistant.

OFFICIAL ORDINANCE INFORMATION PROVIDED BELOW — YOU MUST BASE YOUR RESPONSE ONLY ON THIS INFORMATION.

RULES:
- Do NOT invent or fabricate any legal provisions, citations, fees, penalties, sections, or definitions.
- Preserve the exact legal meaning, citations, and references from the provided information.
- Rewrite the information in a natural, citizen-friendly way.
- If the information does not fully answer the question, acknowledge this and suggest the user contact the relevant municipal office.
- Be warm and conversational like a real municipal officer assisting a citizen.
- If no official information is provided below, do not guess — say you need to check the municipal records.

OFFICIAL ORDINANCE INFORMATION:
${context}

${langInstruction}`;
  }

  return `You are the Municipal Assistant for Santa, Ilocos Sur, powered by KOS (Knowledge Operating System). You are a helpful, friendly municipal officer assistant.

RULES:
- Answer questions conversationally and naturally.
- If asked about municipal ordinances, laws, or regulations, provide general information only — never invent specific provisions, fees, or penalties.
- Suggest the user ask about specific ordinances for accurate legal information.
- Be warm and approachable like a real municipal officer.
- ${langInstruction}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { query, context, mode, conversation, style, language, emotion } = req.body || {};

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const systemPrompt = buildSystemPrompt(mode || 'general', context, style, language);

    let response;
    switch (PROVIDER) {
      case 'gemini':
        response = await callGemini(systemPrompt, query, conversation || []);
        break;
      case 'openai':
        response = await callOpenAI(systemPrompt, query, conversation || []);
        break;
      case 'claude':
        response = await callClaude(systemPrompt, query, conversation || []);
        break;
      case 'openrouter':
        response = await callOpenRouter(systemPrompt, query, conversation || []);
        break;
      default:
        response = await callGemini(systemPrompt, query, conversation || []);
    }

    return res.status(200).json({ response, provider: PROVIDER });
  } catch (e) {
    console.error('AI Provider Error:', e);
    return res.status(200).json({ response: null, provider: PROVIDER, error: 'AI service unavailable' });
  }
}

async function callGemini(systemPrompt, query, conversation) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] }
  });

  const history = conversation.slice(-10).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(query);
  return result.response.text();
}

async function callOpenAI(systemPrompt, query, conversation) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversation.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: query }
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 1024
  });

  return completion.choices[0]?.message?.content || '';
}

async function callClaude(systemPrompt, query, conversation) {
  const messages = conversation.slice(-10).map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  messages.push({ role: 'user', content: query });

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-latest',
      system: systemPrompt,
      messages,
      max_tokens: 1024
    })
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Claude API error: ${err}`);
  }

  const data = await resp.json();
  return data.content?.[0]?.text || '';
}

async function callOpenRouter(systemPrompt, query, conversation) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversation.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: query }
  ];

  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://santamunicipalassistant.vercel.app',
      'X-Title': 'Municipal Assistant'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-preview-04-17',
      messages,
      max_tokens: 1024
    })
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`OpenRouter API error: ${err}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || '';
}
