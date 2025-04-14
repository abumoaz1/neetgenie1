"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email is not valid");
      return;
    }

    setError("");
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side with image (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h1 className="text-3xl font-bold mb-6">Reset Your Password</h1>
          <p className="mb-8 text-blue-100">
            Don't worry, it happens to the best of us. We'll help you get back
            into your NEETGenie account.
          </p>
          <div className="bg-blue-500/30 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Password Reset Instructions</h3>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-start">
                <div className="bg-white/20 p-1 rounded-full mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Enter the email address associated with your account
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 p-1 rounded-full mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Check your inbox for a password reset link
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 p-1 rounded-full mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Click the link and set a new password
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 p-1 rounded-full mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Log in with your new password
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right side with forgot password form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="flex items-center text-slate-600 mb-6 hover:bg-slate-100"
              onClick={() => router.push("/login")}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to login
            </Button>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Forgot your password?</h1>
            <p className="text-slate-600 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Check your email</h3>
                  <p className="text-slate-600 mb-6">
                    We've sent a password reset link to <span className="font-medium">{email}</span>
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push("/login")}
                  >
                    Back to login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        className={cn(error && "border-red-500")}
                      />
                      {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending reset link...
                        </div>
                      ) : (
                        "Send reset link"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-lg">
              <p className="text-xs text-center text-slate-500">
                Remember your password?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Back to login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 