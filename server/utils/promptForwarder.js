// This is the implementation of the AI prompt forwarder using DeepSeek AI
const fetch = require('node-fetch');

// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_KEY || "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";
const SITE_URL = process.env.SITE_URL || 'https://promptforge.dev';
const SITE_NAME = 'PromptForge';

// Tool-specific prompt templates
const toolPrompts = {
  'explain-code': (code) => `Explain this code in detail, focusing on what it does and how it works:\n\n${code}`,
  'fix-bug': (code) => `Analyze this code for bugs and potential improvements. Provide a detailed explanation of the issues and show the corrected version:\n\n${code}`,
  'generate-regex': (prompt) => `Create a regular expression pattern for the following requirement. Explain how the regex works and provide examples:\n\n${prompt}`,
};

// Process prompts using DeepSeek AI
const processPrompt = async (toolId, prompt) => {
  try {
    if (!OPENROUTER_API_KEY) {
      console.warn('OPENROUTER_API_KEY not set, using mock responses');
      // return getMockResponse(toolId, prompt);
      return ("you cannnot access api");
    }

    const formattedPrompt = toolPrompts[toolId](prompt);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1:free",
        "messages": [
          {
            "role": "system",
            "content": "You are an expert developer assistant. Provide clear, detailed, and accurate responses to coding questions."
          },
          {
            "role": "user",
            "content": formattedPrompt
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error processing prompt:', error);
    return getMockResponse(toolId, prompt);
  }
};

// Fallback mock responses when API is not available
const getMockResponse = (toolId, prompt) => {
  const responses = {
    'explain-code': `This code ${prompt.includes('function') ? 'defines a function' : 'is a'} that ${prompt.includes('reduce') ? 'uses the reduce method to calculate a sum' : 'performs some operations'}.\n\n${prompt.includes('reduce') ? 'It uses the reduce array method to iterate over each item in the array, accumulating a sum of the item prices.' : 'It appears to be manipulating data in some way, possibly transforming or calculating values.'}`,
    
    'fix-bug': `There are a few issues with your code:\n\n1. ${prompt.includes('for') ? 'Your loop could be optimized for better performance.' : 'Consider adding error handling.'}\n2. ${prompt.includes('if') ? 'Your conditional logic could be improved.' : 'Input validation might be needed.'}\n\nHere's the corrected version:\n\n\`\`\`javascript\n${prompt}\n\`\`\``,
    
    'generate-regex': `Here's a regex pattern for your needs:\n\n\`\`\`\n${prompt.includes('email') ? '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' : '\\b[A-Za-z0-9_]+\\b'}\n\`\`\`\n\nThis pattern validates the specified requirements.`
  };

  return responses[toolId] || "I've analyzed your prompt and here's the response.";
};

module.exports = {
  processPrompt,
};