const { GeminiAdapter } = require('./gemini-adapter');

class AIProvider {
  async generateContent(messages) {
    throw new Error('Not implemented');
  }
  async generateContentStream(messages, callbacks) {
    throw new Error('Not implemented');
  }
}

function createProvider() {
  const providerType = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  switch (providerType) {
    case 'gemini':
      return new GeminiAdapter(process.env.GEMINI_API_KEY);
    default:
      throw new Error(`Unknown AI provider: ${providerType}. Supported: gemini`);
  }
}

module.exports = { AIProvider, createProvider };
