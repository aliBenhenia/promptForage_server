"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Code, Zap, Lightbulb, CornerRightDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { toolService } from '@/services/tool-service';
import { Tool } from '@/types/tool';

// Typewriter effect for AI response
function useTypingEffect(text: string, speed = 20) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let idx = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, ++idx));
      if (idx >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const initialToolId = searchParams.get('tool');

  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [prompt, setPrompt] = useState('');
  const [rawResponse, setRawResponse] = useState('');
  const response = useTypingEffect(rawResponse, 20);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTools = async () => {
      setIsLoadingTools(true);
      try {
        const data = await toolService.getTools();
        setTools(data);
        const initial = initialToolId
          ? data.find(t => t.id === initialToolId)
          : data[0];
        if (initial) {
          setSelectedTool(initial);
          setPrompt(initial.placeholderPrompt);
        }
      } catch (err) {
        console.error(err);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load tools.' });
      } finally {
        setIsLoadingTools(false);
      }
    };
    fetchTools();
  }, [initialToolId, toast]);

  const handleToolSelect = (id: string) => {
    const tool = tools.find(t => t.id === id);
    if (tool) {
      setSelectedTool(tool);
      setPrompt(tool.placeholderPrompt);
      setRawResponse('');
      setProgress(0);
    }
  };

  const handlePromptSubmit = async () => {
    if (!selectedTool) return;
    if (!prompt.trim()) {
      toast({ variant: 'destructive', title: 'Empty Prompt', description: 'Please enter a prompt.' });
      return;
    }
    setIsSubmitting(true);
    setRawResponse('');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 300);
    try {
      const result = await toolService.submitPrompt(selectedTool.id, prompt);
      clearInterval(interval);
      setProgress(100);
      setRawResponse(result.response);
      toast({ title: 'Success', description: 'Response received.' });
    } catch (err) {
      clearInterval(interval);
      toast({ variant: 'destructive', title: 'Error', description: 'Prompt failed.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const renderToolIcon = (icon: string) => {
    switch (icon) {
      case 'code': return <Code className="h-5 w-5" />;
      case 'bug': return <Zap className="h-5 w-5" />;
      case 'idea': return <Lightbulb className="h-5 w-5" />;
      default: return <Code className="h-5 w-5" />;
    }
  };

  if (isLoadingTools) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-lg font-medium">Loading tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">AI Tools</h1>
      <p className="text-muted-foreground mb-8">Select a tool and enter your prompt below.</p>

      {isSubmitting && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-100 z-50">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold">Available Tools</h2>
          {tools.map(tool => (
            <Card
              key={tool.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedTool?.id === tool.id ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleToolSelect(tool.id)}
            >
              <CardHeader className="flex items-center space-x-3 p-4">
                <div className={`p-2 rounded-md ${
                  selectedTool?.id === tool.id ? 'bg-primary/20' : 'bg-muted'
                }`}>{renderToolIcon(tool.icon)}</div>
                <div>
                  <CardTitle className="text-base">{tool.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-1">{tool.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Main */}
        <div className="lg:col-span-9">
          {selectedTool ? (
            <Card className="border-2">
              <CardHeader className="flex items-center space-x-3 p-4">
                <div className="p-2 rounded-md bg-primary/10">{renderToolIcon(selectedTool.icon)}</div>
                <div>
                  <CardTitle>{selectedTool.name}</CardTitle>
                  <CardDescription>{selectedTool.description}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="prompt">
                  <TabsList className="mb-4">
                    <TabsTrigger value="prompt">Prompt</TabsTrigger>
                    <TabsTrigger value="response" disabled={!rawResponse}>Response</TabsTrigger>
                  </TabsList>

                  <TabsContent value="prompt">
                    <div className="space-y-4">
                      <Textarea
                        placeholder={`Enter your ${selectedTool.name.toLowerCase()} prompt...`}
                        className="min-h-[200px] font-mono text-sm"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handlePromptSubmit} disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <CornerRightDown className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CornerRightDown className="mr-2 h-4 w-4" />
                              Submit
                            </>
                          )}
                        </Button>
                      </div>

                      {rawResponse && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <div className="p-1 rounded-md bg-primary/10">{renderToolIcon(selectedTool.icon)}</div>
                            <span>Response</span>
                          </h3>
                          <div className="bg-card border rounded-md p-4">
                            <pre className="whitespace-pre-wrap font-mono text-sm">
                              {response}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="response">
                    {rawResponse && (
                      <div className="bg-card border rounded-md p-4">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {response}
                        </pre>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Select a tool to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
