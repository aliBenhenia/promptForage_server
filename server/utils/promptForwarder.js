// Enhanced AI Prompt Forwarder with Context-Rich Templates
const fetch = require('node-fetch');

// Use a secure environment variable for your API key
const OPENROUTER_API_KEY = process.env.OPENROUTER_KEY;
const SITE_URL = process.env.SITE_URL || 'https://promptforge.dev';
const SITE_NAME = 'PromptForge AI Assistant';

// Centralized, context-rich prompt templates for maximum value
const toolPrompts = {
  'explain-code': (code) => `
You are an expert software engineer and technical writer. Provide a comprehensive, step-by-step explanation of the following code snippet. Cover:

1. **Overall Purpose**: What problem does it solve?
2. **Key Components**: Describe each function, variable, and control flow.
3. **Behavior**: How data moves through the code.
4. **Edge Cases & Improvements**: Potential pitfalls and suggestions for optimization.

\`\`\`javascript
${code}
\`\`\`

Be concise but thorough, using bullet points and code examples where helpful.`,

  'fix-bug': (code) => `
You are a seasoned developer and code review expert. Analyze the following JavaScript code, identify any bugs, logical errors, or poor practices, and provide:

1. **List of Issues**: Numbered list explaining each defect or anti-pattern.
2. **Corrected Code**: A clean, refactored version with comments.
3. **Rationale**: Brief explanation of why each change improves the code.

Original Code:
\`\`\`javascript
${code}
\`\`\`

Please ensure the fixed version maintains original functionality but follows best practices and robust error handling.`,

  'generate-regex': (prompt) => `
You are a regex architect and educator. Craft a regular expression to satisfy the following requirements:

1. **Pattern Description**: A human-readable summary of what it matches.
2. **Regex Pattern**: The final expression enclosed in \`/…/\` or as a string literal.
3. **Component Breakdown**: Explain each part of the pattern.
4. **Test Examples**: Provide at least three examples that match and three that do not.

Requirement:
${prompt}

Ensure the regex is efficient and compatible with JavaScript.`,
};

// Process prompts using DeepSeek AI or fallback to mock
async function processPrompt(toolId, prompt) {
  console.log('Processing prompt:', OPENROUTER_API_KEY);
  if (!OPENROUTER_API_KEY) {
    console.warn('API key not set — using mock response');
    return getMockResponse(toolId, prompt);
  }

  const content = toolPrompts[toolId]?.(prompt);
  if (!content) {
    throw new Error(`Unknown toolId: ${toolId}`);
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Referer': SITE_URL,
        'X-Title': SITE_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          { role: 'system', content: 'You are an expert developer assistant.' },
          { role: 'user', content }
        ]
      })
    });
    if (!response.ok)
      throw new Error(`API request failed with status ${response.status}`);
    else if (response.status === 429)
      throw new Error('Rate limit exceeded. Please try again later.');
    else if (response.status === 500)
      throw new Error('Internal server error. Please try again later.');
    const data = await response.json();
    console.log('AI response:', data);
    return data.choices?.[0]?.message?.content || 'No response content';
  } catch (error) {
    console.error('Error calling AI API:', error);
    return getMockResponse(toolId, prompt);
  }
}

// Mock fallback responses
function getMockResponse(toolId, prompt) {
  return 'Mock response: AI service unavailable. Please provide a valid API key to get real results.';
}

module.exports = {
  processPrompt
};
