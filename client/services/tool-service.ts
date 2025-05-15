import api from '@/lib/api';
import { PromptRequest, Tool, ToolResponse } from '@/types/tool';

// Sample tools data
const tools: Tool[] = [
  {
    id: 'explain-code',
    name: 'Explain Code',
    description: 'Get a clear explanation of what your code does',
    icon: 'code',
    placeholderPrompt: 'function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}',
  },
  {
    id: 'fix-bug',
    name: 'Fix Bug',
    description: 'Identify and fix issues in your code',
    icon: 'bug',
    placeholderPrompt: 'function sortArray(arr) {\n  for(let i = 0; i < arr.length; i++) {\n    for(let j = 0; j < arr.length; j++) {\n      if(arr[i] < arr[j]) {\n        let temp = arr[i];\n        arr[i] = arr[j];\n        arr[j] = temp;\n      }\n    }\n  }\n}',
  },
  {
    id: 'generate-regex',
    name: 'Generate Regex',
    description: 'Create regular expressions for your needs',
    icon: 'code-2',
    placeholderPrompt: 'Create a regex to validate email addresses',
  },
];

// Sample history data
const requestHistory: PromptRequest[] = [
  {
    id: '1',
    toolId: 'explain-code',
    prompt: 'function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}',
    response: 'This function calculates the total price of all items in an array. It uses the `reduce` method to iterate over each item, adding its price to the accumulating sum.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: '2',
    toolId: 'fix-bug',
    prompt: 'function sortArray(arr) {\n  for(let i = 0; i < arr.length; i++) {\n    for(let j = 0; j < arr.length; j++) {\n      if(arr[i] < arr[j]) {\n        let temp = arr[i];\n        arr[i] = arr[j];\n        arr[j] = temp;\n      }\n    }\n  }\n}',
    response: 'There are two issues with your code:\n\n1. The inner loop should start from j = i + 1 to avoid unnecessary comparisons\n2. You\'re not returning the sorted array\n\nHere\'s the fixed version:\n\n```javascript\nfunction sortArray(arr) {\n  for(let i = 0; i < arr.length; i++) {\n    for(let j = i + 1; j < arr.length; j++) {\n      if(arr[i] > arr[j]) {\n        let temp = arr[i];\n        arr[i] = arr[j];\n        arr[j] = temp;\n      }\n    }\n  }\n  return arr;\n}\n```',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: '3',
    toolId: 'generate-regex',
    prompt: 'Create a regex to validate email addresses',
    response: 'Here\'s a regex pattern for basic email validation:\n\n```\n^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\n```\n\nThis pattern validates:\n- Username: Letters, numbers, and special characters like dots, underscores, percent signs, plus signs, or hyphens\n- @ symbol\n- Domain: Letters, numbers, dots, or hyphens\n- TLD: At least 2 letters after the last dot',
    createdAt: new Date().toISOString(), // today
  },
];

export const toolService = {
  async getTools(): Promise<Tool[]> {
    // In a real implementation, this would call the backend API
    // For now, we'll use the sample data
    
    // Uncomment below when backend is ready
    const response = await api.get('api/tools');
    return response.data;
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tools);
      }, 500);
    });
  },
  
  async getToolById(id: string): Promise<Tool | undefined> {
    // In a real implementation, this would call the backend API
    // For now, we'll use the sample data
    
    // Uncomment below when backend is ready
    // const response = await api.get(`/tools/${id}`);
    // return response.data;
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tools.find(tool => tool.id === id));
      }, 500);
    });
  },
  
  async submitPrompt(toolId: string, prompt: string): Promise<ToolResponse> {
    // In a real implementation, this would call the backend API
    // For now, we'll use simulated responses
    
    // Uncomment below when backend is ready
    const response = await api.post(`/api/tools/${toolId}/prompt`, { prompt });
    return response.data;
    
    // Mock implementation with tool-specific responses
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     let response;
        
    //     switch (toolId) {
    //       case 'explain-code':
    //         response = `This code ${prompt.includes('function') ? 'defines a function' : 'is a'} that ${prompt.includes('reduce') ? 'uses the reduce method to calculate a sum' : 'performs some operations'}.`;
    //         break;
    //       case 'fix-bug':
    //         response = `There are a few issues with your code:\n\n1. ${prompt.includes('for') ? 'Your loop could be optimized' : 'You might want to add error handling'}\n2. ${prompt.includes('if') ? 'Your conditional logic could be improved' : 'Consider adding validation'}\n\nHere's the fixed version:\n\n\`\`\`javascript\n${prompt.replace(/arr\[i\]/g, 'arr[j]').replace(/arr\[j\]/g, 'arr[i]')}\n\`\`\``;
    //         break;
    //       case 'generate-regex':
    //         response = `Here's a regex pattern for your needs:\n\n\`\`\`\n${prompt.includes('email') ? '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' : '\\b[A-Z0-9._%+-]+\\b'}\n\`\`\`\n\nThis pattern validates the requirements you specified.`;
    //         break;
    //       default:
    //         response = "I've processed your prompt and here's the response.";
    //     }
        
    //     resolve({ response });
    //   }, 1000);
    // });
  },
  
  async getRequestHistory(): Promise<PromptRequest[]> {
    // In a real implementation, this would call the backend API
    // For now, we'll use the sample data
    
    // Uncomment below when backend is ready
    const userL = localStorage.getItem('user');
    // const user = userL ? JSON.parse(userL) : null;
    const user = userL ? JSON.parse(userL) : null;
    console.log(user.email);
    // if (!user)
    //   return ;

   const response = await api.post('/api/tools/history', {
  email: user.email,
});
console.log("my list=> ",response.data);
return response.data;

    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(requestHistory);
      }, 500);
    });
  },
};