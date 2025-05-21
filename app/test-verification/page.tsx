"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { endpoints } from "@/lib/baseUrl";
import { runAllTests } from "@/utils/test-verification";

export default function VerificationTester() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  
  const addTestResult = (type, message) => {
    setTestResults(prev => [...prev, { type, message, timestamp: new Date().toISOString() }]);
  };
  
  const clearResults = () => {
    setTestResults([]);
  };
  
  const runEndpointTests = async () => {
    clearResults();
    addTestResult('info', 'Running endpoint tests...');
    
    try {
      await runAllTests();
      addTestResult('success', 'Endpoint tests completed');
    } catch (error) {
      addTestResult('error', `Test error: ${error.message}`);
    }
  };
  
  const testTokenOnlyFlow = async () => {
    if (!token) {
      addTestResult('error', 'Please enter a token to test');
      return;
    }
    
    setActiveTest('token-only');
    clearResults();
    addTestResult('info', 'Testing token-only verification flow...');
    
    try {
      // Test token-only verification via the API route
      addTestResult('info', `Making request to: /api/direct-token-verify?token=${token}`);
      const response = await fetch(`/api/direct-token-verify?token=${token}`);
      const status = response.status;
      const data = await response.json();
      
      addTestResult('info', `API Status: ${status}`);
      addTestResult('info', `API Response: ${JSON.stringify(data)}`);
      
      if (status >= 200 && status < 300) {
        addTestResult('success', 'Token-only verification endpoint is working!');
      } else {
        addTestResult('warning', 'Token-only verification returned an error, but the endpoint exists');
      }
    } catch (error) {
      addTestResult('error', `Token-only test error: ${error.message}`);
    }
    
    setActiveTest(null);
  };
  
  const testStandardFlow = async () => {
    if (!token || !email) {
      addTestResult('error', 'Please enter both token and email to test');
      return;
    }
    
    setActiveTest('standard');
    clearResults();
    addTestResult('info', 'Testing standard verification flow...');
    
    try {
      // Test standard verification via the API route
      addTestResult('info', `Making request to: /api/verify-email with token and email`);
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email })
      });
      
      const status = response.status;
      const data = await response.json();
      
      addTestResult('info', `API Status: ${status}`);
      addTestResult('info', `API Response: ${JSON.stringify(data)}`);
      
      if (status >= 200 && status < 300) {
        addTestResult('success', 'Standard verification endpoint is working!');
      } else {
        addTestResult('warning', 'Standard verification returned an error, but the endpoint exists');
      }
    } catch (error) {
      addTestResult('error', `Standard test error: ${error.message}`);
    }
    
    setActiveTest(null);
  };
  
  const testVerificationLinks = () => {
    if (!token) {
      addTestResult('error', 'Please enter a token to generate test links');
      return;
    }
    
    clearResults();
    addTestResult('info', 'Generating verification test links...');
    
    // Generate different verification links
    const baseUrl = window.location.origin;
    
    const links = [
      {
        name: 'Standard Verification Link',
        url: `${baseUrl}/api/verify-email?token=${token}${email ? `&email=${email}` : ''}`,
        description: 'Next.js API route that redirects to the client-side verification page'
      },
      {
        name: 'Direct Backend Verification Page',
        url: `${baseUrl}/direct-backend-verify?token=${token}`,
        description: 'Direct verification page where users can enter their email manually'
      },
      {
        name: 'Token-only Verification Link',
        url: `${baseUrl}/api/direct-token-verify?token=${token}`,
        description: 'Next.js API route that attempts token-only verification and returns JSON'
      },
      {
        name: 'HTML Verification Page',
        url: `${baseUrl}/api/direct-html-verify?token=${token}`,
        description: 'Next.js API route that returns an HTML verification page'
      },
      {
        name: 'Client-Side Verification Page',
        url: `${baseUrl}/verify-email?token=${token}${email ? `&email=${email}` : ''}`,
        description: 'Client-side verification page that uses React hooks for verification'
      }
    ];
    
    // Add links to test results
    links.forEach(link => {
      addTestResult('link', {
        name: link.name,
        url: link.url,
        description: link.description
      });
    });
  };
  
  // Render test result items
  const renderResultItem = (result, index) => {
    const { type, message, timestamp } = result;
    
    if (type === 'link') {
      return (
        <div key={index} className="border p-3 rounded-md bg-blue-50 mb-2">
          <h3 className="font-bold text-blue-800">{message.name}</h3>
          <p className="text-sm text-blue-700 mb-2">{message.description}</p>
          <div className="flex items-center gap-2">
            <Input value={message.url} readOnly className="flex-1 text-xs" />
            <Button size="sm" onClick={() => window.open(message.url, '_blank')}>Test</Button>
          </div>
        </div>
      );
    }
    
    return (
      <div key={index} className={`p-2 rounded-md mb-2 ${
        type === 'error' ? 'bg-red-50 text-red-800' :
        type === 'success' ? 'bg-green-50 text-green-800' :
        type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
        'bg-blue-50 text-blue-800'
      }`}>
        <div className="flex items-start gap-2">
          {type === 'error' && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />}
          {type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />}
          {type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />}
          {type === 'info' && <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />}
          <div>
            <div className="text-sm">{message}</div>
            <div className="text-xs opacity-70">{new Date(timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Email Verification Tester</CardTitle>
          <CardDescription>
            Test various verification flows to ensure they're working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="token">Verification Token</Label>
              <Input 
                id="token" 
                placeholder="Enter your verification token" 
                value={token} 
                onChange={(e) => setToken(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (optional for token-only flow)</Label>
              <Input 
                id="email" 
                placeholder="Enter your email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={testTokenOnlyFlow} disabled={!token || activeTest} variant="default">
            Test Token-Only Verification
          </Button>
          <Button onClick={testStandardFlow} disabled={!token || !email || activeTest} variant="outline">
            Test Standard Verification
          </Button>
          <Button onClick={testVerificationLinks} disabled={!token} variant="secondary">
            Generate Test Links
          </Button>
          <Button onClick={runEndpointTests} variant="secondary" className="ml-auto">
            Test All Endpoints
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Test Results</span>
            {testResults.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearResults}>
                Clear
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Results from your verification tests will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto p-2">
              {testResults.map(renderResultItem)}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No tests run yet</AlertTitle>
              <AlertDescription>
                Use the buttons above to test verification endpoints and flows
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="link">
            <Link href="/docs/email-verification-testing">View Verification Documentation</Link>
          </Button>
          <Button asChild variant="link">
            <Link href="/direct-backend-verify">Go to Direct Verification</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
