"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { useState } from "react"

interface ResponseDisplayProps {
  response: string
  isLoading: boolean
}

export function ResponseDisplay({ response, isLoading }: ResponseDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-md">Response</CardTitle>
        {response && !isLoading && (
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={copyToClipboard}>
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-11/12 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-9/12 animate-pulse rounded bg-muted"></div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm">{response}</pre>
        )}
      </CardContent>
    </Card>
  )
}
