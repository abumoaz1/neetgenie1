"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { 
  storeVerificationEmail, 
  getVerificationEmail, 
  getVerificationToken, 
  clearVerificationSession 
} from "@/lib/verificationSession";
import { syncVerificationStatus, resetVerificationState } from "@/utils/verification-status";

export default function DirectBackendVerify() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Reset any verification states first
    resetVerificationState();
    
    // Check if already verified first
    const checkIfVerified = async () => {
      const isVerified = await syncVerificationStatus();
      if (isVerified) {
        setVerificationStatus('success');
        setMessage('Your email is already verified! You can now proceed to login.');
      }
    };
    
    checkIfVerified();
    
    // Get token from URL if available
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      // Try to get token from session storage
      const storedToken = getVerificationToken();
      if (storedToken) {
        console.log("Using stored token:", storedToken);
        setToken(storedToken);
      }
    }
    
    // Get email from session if available
    const storedEmail = getVerificationEmail();
    if (storedEmail) {
      console.log("Using stored email:", storedEmail);
      setEmail(storedEmail);
    }
  }, [searchParams]);
  
  const handleVerify = async () => {
    if (!token) {
      setVerificationStatus('error');
      setMessage('Please enter a verification token.');
      return;
    }
    
    // Save email to verification session for future use
    if (email) {
      storeVerificationEmail(email);
    }
    
    setVerificationStatus('loading');
    setMessage('Verifying your email...');
    
    try {
      console.log("Directly verifying email with:", { token, email });
      
      // If email is missing, try to use the token-only endpoint first
      if (!email) {
        try {
          console.log("Attempting token-only verification");
          const tokenOnlyUrl = `http://127.0.0.1:5000/api/auth/verify-email-token/${token}`;
          const tokenOnlyResponse = await fetch(tokenOnlyUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          console.log("Token-only verification response status:", tokenOnlyResponse.status);
          
          if (tokenOnlyResponse.ok) {
            const result = await tokenOnlyResponse.json();
            console.log("Token-only verification successful:", result);
            
            // Store user data and token if provided
            if (result.token) {
              localStorage.setItem('token', result.token);
            }
            
            if (result.user) {
              // Ensure the is_verified flag is set to true
              const userObj = { ...result.user, is_verified: true };
              localStorage.setItem('user', JSON.stringify(userObj));
              // Also store the email for future verification attempts
              if (result.user.email) {
                storeVerificationEmail(result.user.email);
              }
            }
            
            // Clear verification session since we succeeded
            clearVerificationSession();
            
            setVerificationStatus('success');
            setMessage(result.message || 'Your email has been verified successfully! You can now log in to access your account.');
            return;
          }
        } catch (tokenError) {
          console.error("Token-only verification failed:", tokenError);
          // Continue with standard verification if token-only fails
        }
      }
      
      // Make direct API call to backend with email+token method
      const backendUrl = "http://127.0.0.1:5000/api/auth/verify-email";
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          ...(email && { email })
        })
      });
      
      console.log("Direct verification response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Direct verification error:", errorText);
        
        let errorMessage = `Verification failed: ${response.status}`;
        
        // Parse error response if possible
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          
          if (errorData.missingEmail || 
              errorText.includes('email') || 
              errorText.toLowerCase().includes('required') || 
              !email) {
            errorMessage = "Email address is required but was not provided. Please enter your email address above.";
          }
        } catch (parseError) {
          // If parsing fails, check the raw error text
          if (errorText.includes('email') || 
              errorText.toLowerCase().includes('required')) {
            errorMessage = "Email address is required but was not provided. Please enter your email address above.";
          }
        }
        
        setVerificationStatus('error');
        setMessage(errorMessage);
        return;
      }
      
      const result = await response.json();
      console.log("Direct verification successful:", result);
      
      // Store user data and token if provided
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      
      if (result.user) {
        // Ensure the is_verified flag is set to true
        const userObj = { ...result.user, is_verified: true };
        localStorage.setItem('user', JSON.stringify(userObj));
      }
      
      // Clean up verification session data since we succeeded
      clearVerificationSession();
      
      setVerificationStatus('success');
      setMessage(result.message || 'Your email has been verified successfully! You can now log in to access your account.');
      
    } catch (error) {
      console.error("Direct verification error:", error);
      setVerificationStatus('error');
      setMessage('Email verification failed. Please try again or contact support.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Direct Email Verification</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowHelp(!showHelp)}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription>
            Use this page if you're experiencing issues with the automatic verification process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showHelp && (
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-4">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle>How to find your verification token</AlertTitle>
              <AlertDescription className="text-xs mt-2">
                <p className="mb-1">1. Open the verification email sent to you</p>
                <p className="mb-1">2. Look for the long code in the verification link</p>
                <p className="mb-1">3. Copy everything after "token=" in the URL</p>
                <p className="mb-1">4. If you can't find it, request a new verification email</p>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="token">Verification Token</Label>
            <Input 
              id="token" 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
              placeholder="Enter your verification token"
            />
            <p className="text-xs text-gray-500">The token from your verification email</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email address"
            />
            <p className="text-xs text-gray-500">Your registered email address</p>
          </div>
          
          {verificationStatus !== 'idle' && (
            <div className="mt-6">
              <Alert variant={
                verificationStatus === 'error' ? 'destructive' : 
                verificationStatus === 'success' ? 'default' : 'default'
              }>
                <div className="flex items-center gap-2">
                  {verificationStatus === 'loading' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                  )}
                  
                  {verificationStatus === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  
                  {verificationStatus === 'error' && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  
                  <AlertTitle>
                    {verificationStatus === 'loading' ? 'Verifying' : 
                    verificationStatus === 'success' ? 'Success' : 'Error'}
                  </AlertTitle>
                </div>
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-6">
          <Button 
            onClick={handleVerify} 
            disabled={verificationStatus === 'loading'} 
            className="w-full"
          >
            Verify Email
          </Button>
          
          <div className="flex justify-between gap-2 w-full">
            {verificationStatus === 'success' && (
              <Button asChild className="w-full">
                <Link href="/login">Log in to Your Account</Link>
              </Button>
            )}
            
            {verificationStatus === 'error' && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Go to Login</Link>
                </Button>
                
                <Button asChild variant="outline" size="sm">
                  <Link href="/resend-verification">Resend Email</Link>
                </Button>
                
                <Button asChild variant="outline" size="sm">
                  <Link href="/debug-api-verify">Advanced Debug</Link>
                </Button>
              </>
            )}
            
            {verificationStatus === 'idle' && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Back to Login</Link>
                </Button>
                
                <Button asChild variant="outline" size="sm">
                  <Link href="/resend-verification">Resend Email</Link>
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
