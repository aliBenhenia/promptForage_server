"use client";

import Link from 'next/link';
import { ChevronRight, Code, Sparkles, Zap, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
// dynamic from 'next/dynamic';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background-dark">
      {/* Hero section */}
      <div className="fixed top-[33px] left-1/2 transform -translate-x-1/2 z-10">
        <a href="https://github.com/alibenhenia" target="_blank" rel="noopener noreferrer">
          <img
            src="https://avatars.githubusercontent.com/u/95689141?v=4" 
            alt="GitHub Logo"
            className="w-16 h-16 rounded-full border-2 border-primary animate-pulse"
          />
        </a>
        


      </div>
      <header className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-black to-background pt-16 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left animate-fadeInLeft">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block text-white">Supercharge Your</span>
                <span className="block text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 animate-text">
                  Development Workflow
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
                PromptForge provides developers with powerful AI-driven tools to explain code, fix bugs, and generate regex patterns. Boost your productivity with smart, context-aware assistance.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto transform hover:scale-105 transition-transform">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto transform hover:scale-105 transition-transform">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative animate-fadeInRight">
              {/* Animated Blobs */}
              <div className="absolute top-0 -left-10 w-64 h-64 bg-purple-500/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-10 -right-10 w-64 h-64 bg-indigo-500/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative flex items-center justify-center">
                <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md hover:scale-105 transition-transform">
                  <pre className="font-mono text-xs sm:text-sm md:text-base bg-black/80 rounded-lg p-4 overflow-x-auto">
                    <code className="text-gray-200">
                      {/* code snippet here */}
                                  {`function calculateTotal(items) {
              return items.reduce((sum, item) => sum + item.price, 0);
            }`}
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
      </header>

      {/* Features section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-3xl font-bold tracking-tight">Powerful AI Tools for Developers</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our specialized tools help you code faster and more efficiently
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Code, title: 'Explain Code', desc: 'Get clear, concise explanations of complex code snippets to understand how they work.' },
              { icon: Zap, title: 'Fix Bugs', desc: 'Identify and fix bugs in your code with intelligent suggestions and best practices.' },
              { icon: Sparkles, title: 'Generate Regex', desc: 'Create optimized regular expressions for your specific validation needs.' }
            ].map((f, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-8 transition-transform hover:shadow-lg hover:-translate-y-2 animate-fadeInUp delay-[${idx*100}]">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 animate-fadeInUp">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to boost your development workflow?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of developers who use PromptForge to work more efficiently
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" className="transform hover:scale-105 transition-transform">Get Started Today</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-lg font-semibold">PromptForge</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PromptForge. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Global Animations Styles */}
      <style jsx global>{`
        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
        .animate-fadeInLeft { animation: fadeInLeft 0.8s ease-out both; }
        .animate-fadeInRight { animation: fadeInRight 0.8s ease-out both; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-text {
          background-size: 200% auto;
          animation: shineText 1.5s linear infinite;
        }
        @keyframes shineText {
          to { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
