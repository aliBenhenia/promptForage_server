// app/verify-2fa/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { authService } from '@/services/auth-service';
const codeSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

type CodeForm = z.infer<typeof codeSchema>;

export default function Verify2FAPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  

  const form = useForm<CodeForm>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (values: CodeForm) => {
    setIsLoading(true);
    try {
        const data = await authService.verify2FA(values.code);
      localStorage.setItem('token', data.token);
        toast({
            title: 'Verification successful',
            description: 'You have successfully verified your 2FA code.',
        });

    } catch (error) {
      console.error('Verification error:', error);
      toast({
        variant: 'destructive',
        title: 'Verification failed',
        description: 'Invalid verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center mb-6">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-center">Enter Verification Code</h2>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            We sent a 6-digit code to your email. Please enter it below.
          </p>

          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          disabled={isLoading}
                          className="tracking-widest text-center"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-6 bg-muted p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                If you didn’t receive the code, please check your spam folder or{' '}
                <Button variant="link" className="p-0" onClick={() => router.push('/login')}>go back to login</Button> to resend.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
        </div>
      </div>
    </div>
  );
}
