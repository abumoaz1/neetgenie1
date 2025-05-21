"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiRequest } from "@/lib/baseUrl";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract token and email from URL
  const token = searchParams.get('token');
  const email = searchParams.get('email') || localStorage.getItem('userEmail') || '';
  
  useEffect(() => {
    // Validate that we have the necessary parameters
    if (!token) {
      setStatus('error');
      setMessage('Missing reset token. Please use the link from your email.');
    }
  }, [token]);
  
  const validatePassword = () => {
    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setStatus('idle');
    setMessage('');
    
    // Validate token
    if (!token) {
      setStatus('error');
      setMessage('Missing reset token. Please use the link from your email.');
      return;
    }
    
    // Validate email
    if (!email) {
      setStatus('error');
      setMessage('Email address is required');
      return;
    }
    
    // Validate password
    if (!validatePassword()) {
      return;
    }
    
    // Submit the form
    try {
      setStatus('loading');
      
      const result = await apiRequest.resetPassword(email, token, password);
      
      console.log("Password reset successful:", result);
      setStatus('success');
      setMessage(result.message || 'Your password has been reset successfully');
      
      // Redirect to login after success
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setStatus('error');
      setMessage('Failed to reset password. The reset link may have expired or is invalid.');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'error' && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {status === 'success' && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {(status !== 'success' && token) && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  value={email || ''}
                  readOnly
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="New password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="link">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}