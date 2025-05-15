"use client"

import { useState } from 'react';
import { User as UserIcon, Mail, Lock, Save, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import userService from '@/services/user-service';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ProfilePage() {
  const { user,updateProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsUpdatingProfile(true);
    
    // Simulate API call
    // setTimeout(() => {
    //   toast({
    //     title: 'Profile updated',
    //     description: 'Your profile has been updated successfully.',
    //   });
    //   setIsUpdatingProfile(false);
    // }, 1000);
    
     try {
      setIsUpdatingProfile(true);
      await updateProfile(data.name, data.email);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      setIsUpdatingProfile(false);
      profileForm.reset();
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: 'There was an error updating your profile. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsUpdatingPassword(true);
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: 'Error',
        description: "New password and confirmation don't match",
        variant: 'destructive',
      });
      setIsUpdatingPassword(false);
      return;
    }
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      setIsUpdatingPassword(false);
      return;
    }
    try {
      await userService.updatePassword(data.currentPassword, data.newPassword);
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
      setIsUpdatingPassword(false);
      passwordForm.reset();
    } catch (error) {
      toast({
        title: 'Error updating password',
        description: 'There was an error updating your password. Please try again.',
        variant: 'destructive',
      });
      setIsUpdatingPassword(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your account settings and change your password
      </p>
      
      <Tabs defaultValue="general" className="space-y-8">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your name"
                            disabled={isUpdatingProfile}
                            className="max-w-md"
                            icon={<UserIcon className="h-4 w-4 text-muted-foreground" />}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            disabled={isUpdatingProfile}
                            className="max-w-md"
                            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                          />
                        </FormControl>
                        <FormDescription>
                          We'll never share your email with anyone else.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>
                Your account usage and limits
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Account Plan</div>
                    <div className="font-semibold">Free Plan</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Daily Request Limit</div>
                    <div className="font-semibold">1,000 requests</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Member Since</div>
                    <div className="font-semibold">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Last Login</div>
                    <div className="font-semibold">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 border-t">
              <p className="text-sm text-muted-foreground">
                Need more requests? Contact support to upgrade your plan.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your current password"
                            disabled={isUpdatingPassword}
                            className="max-w-md"
                            icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your new password"
                            disabled={isUpdatingPassword}
                            className="max-w-md"
                            icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                          />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 6 characters long.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm your new password"
                            disabled={isUpdatingPassword}
                            className="max-w-md"
                            icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Additional security settings for your account
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You're currently signed in on 1 device.
                  </p>
                  <Button variant="outline">Manage Sessions</Button>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">API Key</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate an API key to access our services programmatically.
                  </p>
                  <Button variant="outline">Generate API Key</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}