"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Code, Zap, Lightbulb, CornerRightDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { toolService } from '@/services/tool-service';
import { Tool } from '@/types/tool';

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const initialToolId = searchParams.get('tool');
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTools = async () => {
      setIsLoadingTools(true);
      try {
        const toolsData = await toolService.getTools();
        setTools(toolsData);
        
        // If a tool ID is provided in the URL, select that tool
        if (initialToolId) {
          const tool = toolsData.find(t => t.id === initialToolId);
          if (tool) {
            setSelectedTool(tool);
            setPrompt(tool.placeholderPrompt);
          }
        } else if (toolsData.length > 0) {
          // Otherwise select the first tool
          setSelectedTool(toolsData[0]);
          setPrompt(toolsData[0].placeholderPrompt);
        }
      } catch (error) {
        console.error('Failed to fetch tools:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load tools',
          description: 'Please try refreshing the page.',
        });
      } finally {
        setIsLoadingTools(false);
      }
    };
    
    fetchTools();
  }, [initialToolId, toast]);
  
  const handleToolSelect = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      setSelectedTool(tool);
      setPrompt(tool.placeholderPrompt);
      setResponse('');
    }
  };
  
  const handlePromptSubmit = async () => {
    if (!selectedTool) return;
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty prompt',
        description: 'Please enter a prompt before submitting.',
      });
      return;
    }
    
    setIsSubmitting(true);
    setResponse('');
    
    try {
      const result = await toolService.submitPrompt(selectedTool.id, prompt);
      setResponse(result.response);
      toast({
        title: 'Prompt submitted successfully',
        description: 'Your response is ready.',
      });
    } catch (error) {
      console.error('Failed to submit prompt:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to process prompt',
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderToolIcon = (icon: string) => {
    switch (icon) {
      case 'code':
        return <Code className="h-5 w-5" />;
      case 'bug':
        return <Zap className="h-5 w-5" />;
      case 'code-2':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Code className="h-5 w-5" />;
    }
  };
  
  if (isLoadingTools) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading tools...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">AI Tools</h1>
      <p className="text-muted-foreground mb-8">
        Select a tool and enter your prompt to get AI-powered assistance.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tool selection sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
          
          {tools.map((tool) => (
            <Card 
              key={tool.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedTool?.id === tool.id 
                  ? 'border-primary bg-primary/5' 
                  : ''
              }`}
              onClick={() => handleToolSelect(tool.id)}
            >
              <CardHeader className="py-4 px-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-md mr-3 ${
                    selectedTool?.id === tool.id 
                      ? 'bg-primary/20' 
                      : 'bg-muted'
                  }`}>
                    {renderToolIcon(tool.icon)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{tool.name}</CardTitle>
                    <CardDescription className="text-xs line-clamp-1">
                      {tool.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        {/* Main tool interface */}
        <div className="lg:col-span-9">
          {selectedTool ? (
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-primary/10 mr-3">
                    {renderToolIcon(selectedTool.icon)}
                  </div>
                  <div>
                    <CardTitle>{selectedTool.name}</CardTitle>
                    <CardDescription>{selectedTool.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="prompt">
                  <TabsList className="mb-4">
                    <TabsTrigger value="prompt">Prompt</TabsTrigger>
                    <TabsTrigger value="response" disabled={!response}>
                      Response
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="prompt">
                    <div className="space-y-4">
                      <Textarea
                        placeholder={`Enter your ${selectedTool.name.toLowerCase()} prompt...`}
                        className="min-h-[200px] font-mono text-sm"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          onClick={handlePromptSubmit} 
                          disabled={isSubmitting || !prompt.trim()}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CornerRightDown className="mr-2 h-4 w-4" />
                              Submit Prompt
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {/* Show response in prompt tab if available */}
                      {response && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <div className="p-1 rounded-md bg-primary/10 mr-2">
                              {renderToolIcon(selectedTool.icon)}
                            </div>
                            Response
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
                    {response && (
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
              <p className="text-muted-foreground">
                Please select a tool to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}