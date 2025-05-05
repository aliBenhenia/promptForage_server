"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptForm } from "@/components/prompt-form"
import { ResponseDisplay } from "@/components/response-display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { submitPrompt } from "@/services/prompt-service"

const tools = [
  {
    id: "explain-code",
    name: "Explain Code",
    description: "Get a clear explanation of what your code does",
    placeholder: "Paste your code here and I'll explain what it does...",
    examples: [
      "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}",
      "const debounce = (func, wait) => {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n};",
    ],
  },
  {
    id: "fix-bug",
    name: "Fix Bug",
    description: "Find and fix bugs in your code",
    placeholder: "Paste your buggy code here and I'll help fix it...",
    examples: [
      "function sortArray(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length; j++) {\n      if (arr[i] < arr[j]) {\n        let temp = arr[i];\n        arr[i] = arr[j];\n        arr[j] = temp;\n      }\n    }\n  }\n}",
      "function fetchData() {\n  fetch('https://api.example.com/data')\n    .then(response => response.json())\n    .then(data => {\n      console.log(data);\n    })\n    .catch(error => {\n      console.log('Error:', error);\n    }\n}",
    ],
  },
  {
    id: "generate-regex",
    name: "Generate Regex",
    description: "Create regex patterns from natural language descriptions",
    placeholder: "Describe the pattern you need in plain English...",
    examples: [
      "I need a regex to validate email addresses",
      "Create a regex to match US phone numbers in the format (123) 456-7890 or 123-456-7890",
    ],
  },
]

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("explain-code")
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleSubmit = async (inputPrompt: string) => {
    setIsLoading(true)
    try {
      const result = await submitPrompt(activeTab, inputPrompt)
      setResponse(result.response)
    } catch (error) {
      setResponse("An error occurred while processing your request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const activeTool = tools.find((tool) => tool.id === activeTab) || tools[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
        <p className="text-muted-foreground">Use our AI-powered tools to supercharge your development workflow</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          {tools.map((tool) => (
            <TabsTrigger key={tool.id} value={tool.id}>
              {tool.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tools.map((tool) => (
          <TabsContent key={tool.id} value={tool.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PromptForm
                  placeholder={tool.placeholder}
                  examples={tool.examples}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                />

                {(response || isLoading) && <ResponseDisplay response={response} isLoading={isLoading} />}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
