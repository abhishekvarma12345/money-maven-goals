
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        navigate('/');
      } else {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: '', // Optional: can be updated later
              username: email.split('@')[0],
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>
      
      {resetSent && (
        <Alert>
          <AlertDescription>
            Password reset email sent. Check your inbox.
          </AlertDescription>
        </Alert>
      )}
      
      <Button type="submit" className="w-full">
        Send Reset Instructions
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsForgotPassword(false);
            setResetSent(false);
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </form>
  );

  const renderAuthForm = () => (
    <form onSubmit={handleAuth} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
      </div>
      
      {isLogin && (
        <div className="text-right">
          <button
            type="button"
            onClick={() => setIsForgotPassword(true)}
            className="text-xs text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      )}
      
      <Button type="submit" className="w-full">
        {isLogin ? 'Login' : 'Create Account'}
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isLogin 
            ? 'Need an account? Sign Up' 
            : 'Already have an account? Login'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isForgotPassword ? 'Reset Password' : isLogin ? 'Login' : 'Sign Up'}</CardTitle>
        </CardHeader>
        <CardContent>
          {isForgotPassword ? renderForgotPasswordForm() : renderAuthForm()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
