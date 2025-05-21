"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/baseUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");
  
  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    try {
      setStatus('loading');
      
      const result = await apiRequest.resendVerification(email);
      
      setStatus('success');
      setMessage(result.message || 'Verification email sent successfully. Please check your inbox.');
      
      // Store email for potential future use
      localStorage.setItem('userEmail', email);
    } catch (error) {
      console.error("Resend verification error:", error);
      setStatus('error');
      setMessage('Failed to resend verification email. Please try again or contact support.');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Resend Verification Email</CardTitle>
          <CardDescription className="text-center">
            Enter your email address to receive a new verification link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResend} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {(status === 'error' || status === 'success') && (
              <Alert variant={status === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </form>
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