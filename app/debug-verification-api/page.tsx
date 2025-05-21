"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function DebugVerificationAPI() {
  const [userData, setUserData] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current user data from localStorage
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUserData(user);
      } catch (error) {
        setError("Error parsing user data from localStorage");
      }
    }
  }, []);

  // Function to check verification status with backend
  const checkWithBackend = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://127.0.0.1:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      setApiResponse(data);
      
      // Compare localStorage with API response
      if (userData && data.user) {
        if (userData.is_verified !== data.user.is_verified) {
          console.log("Mismatch between localStorage and API verification status");
        }
      }
    } catch (error) {
      setError("API request failed");
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fix verification status
  const fixVerificationStatus = () => {
    if (!apiResponse || !apiResponse.user) return;
    
    try {
      // Get verification status from API response
      const isVerified = apiResponse.user.is_verified === true || 
                        apiResponse.user.email_verified === true;
      
      // Update user in localStorage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        user.is_verified = isVerified;
        user.email_verified = isVerified;
        localStorage.setItem('user', JSON.stringify(user));
        setUserData(user);
      }
    } catch (error) {
      setError("Error fixing verification status");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Email Verification API Debug Tool</CardTitle>
          <CardDescription>Compare local verification status with backend API status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium">User Data from localStorage:</h2>
            <pre className="bg-slate-100 p-4 rounded-md overflow-auto mt-2 text-xs">
              {userData ? JSON.stringify(userData, null, 2) : "No user data found"}
            </pre>
          </div>
          
          <Button onClick={checkWithBackend} disabled={loading}>
            {loading ? "Loading..." : "Check With Backend API"}
          </Button>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {apiResponse && (
            <>
              <div className="mt-6">
                <h2 className="text-lg font-medium">API Response:</h2>
                <pre className="bg-slate-100 p-4 rounded-md overflow-auto mt-2 text-xs">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
              
              {userData && apiResponse.user && (
                <Alert variant={userData.is_verified === apiResponse.user.is_verified ? "default" : "destructive"}>
                  <AlertTitle>Verification Status Comparison</AlertTitle>
                  <AlertDescription>
                    LocalStorage: {userData.is_verified ? "Verified" : "Not Verified"}<br />
                    API Response: {apiResponse.user.is_verified ? "Verified" : "Not Verified"}
                    {userData.is_verified !== apiResponse.user.is_verified && (
                      <Button className="mt-2" onClick={fixVerificationStatus}>Fix Local Verification Status</Button>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/verification-required">Verification Page</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
