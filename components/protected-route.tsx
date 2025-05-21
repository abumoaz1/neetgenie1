"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { syncVerificationStatus, resetVerificationState } from "@/utils/verification-status";
import { debugVerificationStatus } from "@/utils/debug-verification-status";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);  useEffect(() => {
    // Check if user is logged in and email is verified
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Not authenticated, redirect to login
        console.log("No token found, redirecting to login");
        router.push('/login');
        setIsAuthenticated(false);
        return;
      }
      
      // Check user verification status from localStorage
      const userJson = localStorage.getItem('user');
      
      if (!userJson) {
        // No user data, redirect to login
        console.log("No user data found, redirecting to login");
        router.push('/login');
        setIsAuthenticated(false);
        return;
      }
        try {
        const user = JSON.parse(userJson);
        
        // Check for verification status using either field from the API
        const isVerified = 
          user.is_verified === true || 
          user.email_verified === true;
        
        // If user is not verified, redirect to verification page
        if (!isVerified) {
          console.log("User not verified, redirecting to verification-required page");
          router.push('/verification-required');
          setIsAuthenticated(false);
          return;
        }
        
        // User is authenticated and verified
        console.log("User is verified, allowing access to protected route");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Error parsing user data, redirect to login
        router.push('/login');
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  return isAuthenticated ? <>{children}</> : null;
}