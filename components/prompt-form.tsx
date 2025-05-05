"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface PromptFormProps {
  placeholder: string
  examples: string[]
  onSubmit: (prompt: string) => void
  isLoading: boolean
  isAuthenticated: boolean
}

export function PromptForm({ placeholder, examples, onSubmit, isLoading, isAuthenticated }: PromptFormProps) {
  const [prompt, setPrompt] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    onSubmit(prompt)
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-32 font-mono"
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button type="submit" disabled={isLoading || !prompt.trim()} className="sm:w-auto w-full">
          {isLoading ? "Processing..." : "Submit"}
        </Button>

        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <Button key={index} type="button" variant="outline" size="sm" onClick={() => handleExampleClick(example)}>
              Example {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="text-sm text-muted-foreground">
          <span>You need to </span>
          <Button variant="link" className="h-auto p-0" onClick={() => router.push("/login")}>
            log in
          </Button>
          <span> to use this tool.</span>
        </div>
      )}
    </form>
  )
}
