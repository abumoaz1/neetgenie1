"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, AlertCircle, ChevronLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { endpoints, apiRequest, baseUrl } from "@/lib/baseUrl";

// Helper function to attempt verification when we only have a token but no email
// This tries to extract the email from the JWT token or uses a fallback mechanism
async function verifyWithTokenOnly(token: string) {
  const errors: any[] = [];
  
  console.log("Attempting email verification with token only:", { token });
  
  // Try to decode the token to see if it contains the email (if it's a JWT)
  let email = null;
  try {
    // Try to parse as a JWT to extract user info including email
    const tokenParts = token.split(".");
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload && payload.email) {
        email = payload.email;
        console.log("Successfully extracted email from token payload:", email);
      }
    }
  } catch (e) {
    console.log("Token is not a decodable JWT or doesn't contain email");
  }
  
  // If we successfully extracted an email from the token
  if (email) {
    try {
      console.log("Trying verification with extracted email:", email);
      const response = await apiRequest.post(endpoints.verifyEmail, { email, token });
      console.log("Verification with extracted email succeeded");
      return response;
    } catch (error) {
      console.error("Verification with extracted email failed:", error);
      errors.push({ method: "POST (with extracted email)", error });
    }
  }
  
  // Try direct API call with just the token, despite it not being according to API spec
  // The backend might have been updated to support token-only verification
  try {
    console.log("Trying direct POST fetch with token only (not spec compliant)...");
    const response = await fetch(`${baseUrl}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Direct POST fetch verification succeeded");
    return data;
  } catch (error) {
    console.error("Direct POST fetch verification failed:", error);
    errors.push({ method: "Direct POST fetch (token only)", error });
  }
  
  // Last attempt - try to get user's email through another means 
  // Attempt to get the stored email from localStorage if available
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.email) {
          console.log("Trying verification with stored user email:", user.email);
          const response = await apiRequest.post(endpoints.verifyEmail, { 
            email: user.email, 
            token 
          });
          console.log("Verification with stored user email succeeded");
          return response;
        }
      } catch (error) {
        console.error("Verification with stored user email failed:", error);
        errors.push({ method: "POST (with stored user email)", error });
      }
    }
  }
  
  // If all methods failed, throw a comprehensive error
  console.error("All verification methods failed");
  const error: any = new Error("Email verification failed with all attempted methods");
  error.attempts = errors;
  error.details = "The API requires both email and token, but we only have the token. Please try the process again or contact support.";
  throw error;
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<"success" | "error" | "pending">("pending");
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    async function verifyEmail() {
      // Check for parameters with different possible names
      const token = searchParams.get("token") || searchParams.get("verify_token") || searchParams.get("verification_token");
      const email = searchParams.get("email") || searchParams.get("user_email");
      const backendVerify = searchParams.get("backend_verify") === "true";
      const error = searchParams.get("error");
      
      // For debugging
      console.log("URL Parameters:", Object.fromEntries(searchParams.entries()));
      console.log("Token:", token);
      console.log("Email:", email);
      console.log("Backend Verify:", backendVerify);
      
      // Handle error cases
      if (error === "missing_params") {
        setVerificationStatus("error");
        setErrorMessage("Missing verification token or email. Please check your email link and try again.");
        setIsLoading(false);
        return;
      }
      
      if (error === "missing_token") {
        setVerificationStatus("error");
        setErrorMessage("Missing verification token. Please check your email link and try again.");
        setIsLoading(false);
        return;
      }
      
      if (!token) {
        setVerificationStatus("error");
        setErrorMessage("Missing verification token. Please check your email link and try again.");
        setIsLoading(false);
        return;
      }
      
      try {
        // If we were redirected from the API route that means we need to call the backend directly
        // via our apiRequest helper
        if (backendVerify) {
          // Use the multi-approach verification helper
          let response;
          if (email) {
            // If we have both email and token, use standard verification
            console.log("Verifying with both email and token");
            response = await apiRequest.post(endpoints.verifyEmail, { email, token });
          } else {
            // If we only have token, try our special handling function
            console.log("No email provided, using token-only approach");
            response = await verifyWithTokenOnly(token);
          }
          
          // Store the token and user info in localStorage
          if (response && response.token) {
            localStorage.setItem("token", response.token);
          }
          if (response && response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
          }
          
          setVerificationStatus("success");
        } else {
          // This is a direct access to verify-email page without going through our API route
          // Redirect to our API route that will handle proper verification
          let redirectUrl = `/api/verify-email?token=${encodeURIComponent(token)}`;
          if (email) {
            redirectUrl += `&email=${encodeURIComponent(email)}`;
          }
          window.location.href = redirectUrl;
          return; // Don't set loading to false as we're redirecting
        }
      } catch (error: any) {
        console.error("Verification error:", error);
        
        // Detailed error message based on response status
        if (error.response && error.response.status === 404) {
          setErrorMessage("User not found. Please make sure you're using the correct email address.");
        } else if (error.response && error.response.status === 400) {
          setErrorMessage(
            "The verification link is incomplete. The API requires both email and token. " +
            "Please try clicking the link from your email again or request a new verification email."
          );
        } else if (error.response && error.response.status === 405) {
          setErrorMessage(
            "The verification method is not supported. Please contact support."
          );
        } else {
          setErrorMessage(
            error.response?.data?.message || 
            error.details ||
            "Verification failed. The token may be invalid or expired."
          );
        }
        
        // Log detailed error information to help with debugging
        console.log("Error response:", error.response);
        
        setVerificationStatus("error");
      } finally {
        setIsLoading(false);
      }
    }
    
    verifyEmail();
  }, [searchParams, router]);
  
  return (
    <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="flex items-center text-slate-600 mb-6 hover:bg-slate-100"
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to home
        </Button>
        
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Verifying your email</h2>
                <p className="text-slate-600 text-center">
                  Please wait while we verify your email address...
                </p>
              </div>
            ) : verificationStatus === "success" ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Email Verified Successfully!</h2>
                <p className="text-slate-600 text-center mb-6">
                  Your email has been verified. You can now access all features of NEETGenie.
                </p>
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => router.push("/dashboard")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-red-100 p-3 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Verification Failed</h2>
                <p className="text-slate-600 text-center mb-6">
                  {errorMessage}
                </p>
                
                {/* Help and troubleshooting information */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 w-full">
                  <h3 className="font-medium text-slate-800 mb-2">Troubleshooting:</h3>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Make sure you clicked the verification link from your email directly</li>
                    <li>Check if the email address used for signup is correct</li>
                    <li>The verification link may have expired (valid for 24 hours)</li>
                    <li>Try requesting a new verification email</li>
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-3 w-full sm:flex-row sm:space-y-0 sm:space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/login")}
                    className="border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Go to Login
                  </Button>
                  <Button 
                    onClick={() => {
                      const email = searchParams.get("email") || searchParams.get("user_email") || "";
                      if (email) {
                        router.push(`/resend-verification?email=${encodeURIComponent(email)}`);
                      } else {
                        router.push("/resend-verification");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Resend Verification
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
