"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DebugVerification() {
  const [params, setParams] = useState<Record<string, string>>({});
  const [cookies, setCookies] = useState<string>('');
  const [referer, setReferer] = useState<string>('');
  const [userAgent, setUserAgent] = useState<string>('');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Collect URL parameters
    const paramObj: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      paramObj[key] = value;
    }
    setParams(paramObj);
    
    // Collect cookies
    setCookies(document.cookie);
    
    // Collect referer
    setReferer(document.referrer);
    
    // Collect user agent
    setUserAgent(navigator.userAgent);
    
    // Make a test fetch to check headers
    const fetchData = async () => {
      try {
        const response = await fetch('/api/debug-verification', {
          method: 'GET',
          headers: {
            'X-Debug-Request': 'true'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.headers) {
            setHeaders(data.headers);
          }
        }
      } catch (error) {
        console.error("Failed to fetch headers:", error);
      }
    };
    
    fetchData();
    
  }, [searchParams]);
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Verification Debug Information</CardTitle>
            <CardDescription>
              This page shows information about the current request to help debug verification issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">URL Parameters</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {JSON.stringify(params, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Cookies</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {cookies || 'No cookies found'}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Referer</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {referer || 'No referer found'}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">User Agent</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {userAgent}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Request Headers</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {Object.keys(headers).length ? JSON.stringify(headers, null, 2) : 'No headers information available'}
              </pre>
            </div>
            
            <div className="flex space-x-4">
              <Button asChild>
                <Link href="/direct-backend-verify">Use Direct Verification</Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}