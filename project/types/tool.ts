export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  placeholderPrompt: string;
}

export interface PromptRequest {
  id: string;
  toolId: string;
  prompt: string;
  response: string;
  createdAt: string;
}

export interface ToolResponse {
  response: string;
}