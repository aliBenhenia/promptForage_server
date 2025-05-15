import Link from 'next/link';
import { ChevronRight, Code, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const Terminal = dynamic(() => import('lucide-react').then((mod) => mod.Terminal), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <header className="relative">
        <div className="bg-gradient-to-br from-black to-background pt-16 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block text-white">Supercharge Your</span>
                <span className="block text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                  Development Workflow
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-3xl">
                PromptForge provides developers with powerful AI-driven tools to explain code, fix bugs, and generate regex patterns. Boost your productivity with smart, context-aware assistance.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full max-w-lg h-[400px] mx-auto lg:mx-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative flex items-center justify-center">
                  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl shadow-xl p-6 w-full max-w-lg">
                    <pre className="font-mono text-xs sm:text-sm md:text-base bg-black/80 rounded-lg p-4 overflow-x-auto">
                    <code className="text-gray-200">
  <span className="text-purple-400">function</span>{" "}
  <span className="text-blue-400">calculateTotal</span>
  <span className="text-gray-400">(</span>
  <span className="text-orange-400">items</span>
  <span className="text-gray-400">) &#123;</span>
  <br />
  {"  "}
  <span className="text-purple-400">return</span>{" "}
  <span className="text-orange-400">items</span>
  <span className="text-blue-400">.reduce</span>
  <span className="text-gray-400">((</span>
  <span className="text-orange-400">sum</span>
  <span className="text-gray-400">,</span>{" "}
  <span className="text-orange-400">item</span>
  <span className="text-gray-400">
    {") =&gt; "}
  </span>
  <span className="text-orange-400">sum</span>{" "}
  <span className="text-gray-400">+</span>{" "}
  <span className="text-orange-400">item</span>
  <span className="text-blue-400">.price</span>
  <span className="text-gray-400">,</span>{" "}
  <span className="text-blue-400">0</span>
  <span className="text-gray-400">);</span>
  <br />
  <span className="text-gray-400">&#125;</span>
</code>

                    </pre>
                    <div className="mt-4 p-4 bg-green-900/20 border border-green-900/30 rounded-lg">
                      <h3 className="text-green-500 flex items-center gap-1 font-semibold">
                        <Sparkles className="h-4 w-4" /> AI Explanation
                      </h3>
                      <p className="text-sm mt-2 text-green-100">
                        This function calculates the total price of all items in an array. It uses the `reduce` method to iterate over each item, adding its price to the accumulating sum, starting with 0.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Powerful AI Tools for Developers</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our specialized tools help you code faster and more efficiently
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-xl p-8 transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Explain Code</h3>
              <p className="mt-2 text-muted-foreground">
                Get clear, concise explanations of complex code snippets to understand how they work
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-xl p-8 transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Fix Bugs</h3>
              <p className="mt-2 text-muted-foreground">
                Identify and fix bugs in your code with intelligent suggestions and best practices
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-xl p-8 transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Generate Regex</h3>
              <p className="mt-2 text-muted-foreground">
                Create optimized regular expressions for your specific validation needs
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to boost your development workflow?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of developers who use PromptForge to work more efficiently
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg">Get Started Today</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto py-10 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="ml-2 text-lg font-semibold">PromptForge</span>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-left text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PromptForge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}