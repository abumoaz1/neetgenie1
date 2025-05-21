'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EmailFormProps {
  token: string;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export default function EmailCollectionForm({ token, onSubmit, isLoading = false }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  // Form validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Store email in localStorage for future use
    if (typeof window !== 'undefined') {
      localStorage.setItem('userEmail', email);
    }
    
    onSubmit(email);
  };
  
  // Try to recover email from localStorage to prefill form
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email Address Required</CardTitle>
        <CardDescription>
          To complete email verification, please enter the email address associated with your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Continue Verification'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-xs text-gray-500">
          This is the email address you used to create your account.
        </div>
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/resend-verification">Resend Verification Email</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
