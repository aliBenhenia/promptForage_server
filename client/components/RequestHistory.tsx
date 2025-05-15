'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clipboard, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Request {
  id: string;
  toolId: string;
  createdAt: string;
  prompt: string;
  response: string;
}

interface RequestHistoryProps {
  recentRequests: Request[];
  getToolNameById: (id: string) => string;
}

export function RequestHistory({
  recentRequests,
  getToolNameById,
}: RequestHistoryProps) {
  const [selected, setSelected] = useState<Request | null>(null);
    const { toast } = useToast();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The text has been copied to your clipboard.',
      action: <Button variant="ghost" onClick={() => navigator.clipboard.writeText(text)}>Copy</Button>,
    });
  };

  return (
    <>
      <div className="space-y-4">
        {recentRequests.map((req) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            key={req.id}
            onClick={() => setSelected(req)}
            className="group cursor-pointer rounded-xl border border-border bg-card transition-shadow hover:shadow-md p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-muted p-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">{getToolNameById(req.toolId)}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="ml-11">
              <div className="bg-muted/60 border border-border rounded-lg p-3 text-sm">
                <p className="font-medium text-muted-foreground mb-1">Prompt:</p>
                <pre className="whitespace-pre-wrap font-mono text-xs bg-background border border-border rounded p-2 max-h-32 overflow-auto">
                  {req.prompt.length > 100
                    ? `${req.prompt.slice(0, 100)}...`
                    : req.prompt}
                </pre>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Centered, Animated Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="w-full max-w-3xl p-6 rounded-xl bg-card text-foreground shadow-2xl animate-in fade-in slide-in-from-top-8 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Request Details</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 mt-4"
            >
              <DetailItem label="Tool" value={getToolNameById(selected.toolId)} />
              <DetailItem
                label="Created At"
                value={new Date(selected.createdAt).toLocaleString()}
              />

              <div>
                <p className="text-sm text-muted-foreground mb-1">Prompt:</p>
                <pre className="whitespace-pre-wrap font-mono bg-muted border border-border p-4 rounded-lg text-sm max-h-60 overflow-auto">
                  {selected.prompt}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyToClipboard(selected.prompt)}
                  className="mt-2"
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Copy Prompt
                </Button>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">AI Response:</p>
                <pre className="whitespace-pre-wrap font-mono bg-muted border border-border p-4 rounded-lg text-sm max-h-60 overflow-auto">
                  {selected.response}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyToClipboard(selected.response)}
                  className="mt-2"
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Copy Response
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}:</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}
