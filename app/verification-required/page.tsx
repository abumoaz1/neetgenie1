"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/baseUrl";
import { syncVerificationStatus, resetVerificationState } from "@/utils/verification-status";
import { debugVerificationStatus } from "@/utils/debug-verification-status";

export default function VerificationRequired() {
  const [email, setEmail] = useState<string>("");
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const router = useRouter();  useEffect(() => {
    // Check if the user is already verified on page load
    const checkIfVerified = () => {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      
      // If no token or user, redirect to login
      if (!token || !userJson) {
        console.log("No authenticated user, redirecting to login");
        router.push('/login');
        return;
      }
        try {
        const user = JSON.parse(userJson);
        
        // Check for verification status using either field from the API
        const isVerified = 
          user.is_verified === true || 
          user.email_verified === true;
        
        // If user is already verified, redirect to dashboard
        if (isVerified) {
          console.log("User already verified, redirecting to dashboard");
          router.push('/dashboard');
          return;
        }
        
        // Set email for resending verification
        if (user.email) {
          setEmail(user.email);
          localStorage.setItem('userEmail', user.email);
        } else {
          // Try to get email from localStorage
          const userEmail = localStorage.getItem('userEmail');
          if (userEmail) {
            setEmail(userEmail);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        
        // On error, try to get email directly from localStorage
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          setEmail(userEmail);
        } else {
          // If can't get email, redirect to login
          router.push('/login');
        }
      }
    };

    checkIfVerified();
  }, [router]);

  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendVerification = async () => {
    if (!email || countdown > 0) return;
    
    setResendStatus('loading');
    setMessage("");
    
    try {
      const result = await apiRequest.resendVerification(email);
      
      setResendStatus('success');
      setMessage(result.message || 'Verification email has been resent.');
      setCountdown(60); // Set a 60-second cooldown
    } catch (error) {
      console.error("Resend verification error:", error);
      setResendStatus('error');
      setMessage((error as Error).message || 'Failed to resend verification email. Please try again.');
    }
  };  const handleCheckVerification = async () => {
    if (!email) return;
    
    setResendStatus('loading');
    setMessage("Checking verification status...");
    
    try {
      // Get current token
      const token = localStorage.getItem('token');
      
      if (!token) {
        setResendStatus('error');
        setMessage('No authentication token found. Please login again.');
        setTimeout(() => router.push('/login'), 1500);
        return;
      }
      
      // Make a direct API call to check verification status
      const response = await fetch('http://127.0.0.1:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
        if (response.ok) {
        const userData = await response.json();
        
        // Check for verification using either field that the API might provide
        const isVerified = 
          (userData.user && userData.user.is_verified === true) || 
          (userData.user && userData.user.email_verified === true);
        
        if (isVerified) {
          // Update local storage with verified status from server
          const userJson = localStorage.getItem('user');
          if (userJson) {
            const user = JSON.parse(userJson);
            // Update both verification fields for consistency
            user.is_verified = true;
            user.email_verified = true;
            localStorage.setItem('user', JSON.stringify(user));
          } else {
            // If no user data, create minimal user object
            localStorage.setItem('user', JSON.stringify({
              email: email,
              is_verified: true,
              email_verified: true
            }));
          }
          
          setResendStatus('success');
          setMessage("Your email has been verified! Redirecting to dashboard...");
          
          // Redirect to dashboard for verified users
          setTimeout(() => router.push('/dashboard'), 1500);
          return;
        }
      }
      
      // If verification check didn't confirm verification
      setResendStatus('error');
      setMessage('Your account is not yet verified. Please check your email for a verification link.');
    } catch (error) {
      console.error("Verification check error:", error);
      setResendStatus('error');
      setMessage('Failed to check verification status. Your account may not be verified yet.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification Required</CardTitle>
          <CardDescription>
            We've sent a verification email to your inbox. Please verify your email address to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle>Verification Pending</AlertTitle>
            <AlertDescription>
              A verification link has been sent to:
              <span className="font-bold block mt-1">{email || 'your email address'}</span>
            </AlertDescription>
          </Alert>
          
          {resendStatus === 'success' && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Email Sent!</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {resendStatus === 'error' && (
            <Alert className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2 text-center">
            <h3 className="font-medium">Next steps:</h3>
            <ol className="list-decimal text-left pl-5 space-y-2">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Once verified, you can log in to access your account</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            onClick={handleResendVerification} 
            disabled={countdown > 0 || resendStatus === 'loading'} 
            className="w-full"
          >
            {resendStatus === 'loading' ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {countdown > 0 ? `Resend Email (${countdown}s)` : 'Resend Verification Email'}
          </Button>
          
          <Button onClick={handleCheckVerification} variant="outline" className="w-full">
            I've Verified My Email - Log In
          </Button>
          
          <div className="text-center text-sm text-gray-500 pt-2">
            Having trouble? <Link href="/support" className="text-primary hover:underline">Contact Support</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
