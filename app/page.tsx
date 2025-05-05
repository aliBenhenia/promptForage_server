import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to <span className="text-primary">PromptForge</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Powerful AI tools to supercharge your development workflow. Explain code, fix bugs, and generate regex
          patterns with ease.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/login">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/tools">Explore Tools</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl">
        {["Explain Code", "Fix Bug", "Generate Regex"].map((tool) => (
          <div key={tool} className="flex flex-col items-center p-6 border rounded-lg bg-card">
            <h3 className="text-xl font-semibold mb-2">{tool}</h3>
            <p className="text-muted-foreground text-center">
              {tool === "Explain Code"
                ? "Get clear explanations for complex code snippets."
                : tool === "Fix Bug"
                  ? "Identify and fix bugs in your code automatically."
                  : "Create and test regex patterns with natural language."}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
