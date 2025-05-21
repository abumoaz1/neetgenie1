"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, SendIcon, RotateCw, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function DebugApiVerify() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [backendUrl, setBackendUrl] = useState("http://127.0.0.1:5000/api/auth/verify-email");
  const [proxyUrl, setProxyUrl] = useState("/api/verify-email-proxy");
  const [method, setMethod] = useState("POST");
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleDirectApiCall = async () => {
    if (!token) {
      setRequestStatus('error');
      setErrorMessage('Please enter a verification token');
      return;
    }
    
    setRequestStatus('loading');
    
    try {
      console.log(`Making ${method} request to ${backendUrl} with:`, { token, email });
      
      // Prepare request body and options
      const requestBody = { token };
      if (email) {
        requestBody['email'] = email;
      }
      
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (method !== 'GET') {
        requestOptions.body = JSON.stringify(requestBody);
      }
      
      // Make the request
      const response = await fetch(backendUrl, requestOptions);
      
      // Get response as text first to avoid JSON parsing errors
      const responseText = await response.text();
      
      // Try to parse as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { text: responseText };
      }
      
      // Store full response info
      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData
      });
      
      if (response.ok) {
        setRequestStatus('success');
      } else {
        setRequestStatus('error');
        setErrorMessage(`API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("API call error:", error);
      setResponse(null);
      setRequestStatus('error');
      setErrorMessage(`Request failed: ${error.message}`);
    }
  };
  
  const handleProxyCall = async () => {
    if (!token) {
      setRequestStatus('error');
      setErrorMessage('Please enter a verification token');
      return;
    }
    
    setRequestStatus('loading');
    
    try {
      console.log(`Making ${method} request to ${proxyUrl} with:`, { token, email });
      
      // Prepare URL for GET requests with query params
      let url = proxyUrl;
      if (method === 'GET') {
        const params = new URLSearchParams();
        params.set('token', token);
        if (email) {
          params.set('email', email);
        }
        url = `${proxyUrl}?${params.toString()}`;
      }
      
      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      // Add body for non-GET requests
      if (method !== 'GET') {
        const requestBody = { token };
        if (email) {
          requestBody['email'] = email;
        }
        requestOptions.body = JSON.stringify(requestBody);
      }
      
      // Make the request
      const response = await fetch(url, requestOptions);
      
      // Handle redirects (don't follow)
      if (response.redirected) {
        setResponse({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          redirected: true,
          redirectUrl: response.url,
          data: { message: 'Request was redirected' }
        });
        
        setRequestStatus('success');
        return;
      }
      
      // Get response as text first to avoid JSON parsing errors
      const responseText = await response.text();
      
      // Try to parse as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { text: responseText };
      }
      
      // Store full response info
      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData
      });
      
      if (response.ok) {
        setRequestStatus('success');
      } else {
        setRequestStatus('error');
        setErrorMessage(`API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("API call error:", error);
      setResponse(null);
      setRequestStatus('error');
      setErrorMessage(`Request failed: ${error.message}`);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">API Verification Tester</CardTitle>
            <CardDescription>
              Test email verification API endpoints directly to identify any issues.
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="backend">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="backend">Direct Backend API</TabsTrigger>
                <TabsTrigger value="proxy">NextJS API Proxy</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="backend" className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backend-url">Backend API URL</Label>
                  <Input 
                    id="backend-url" 
                    value={backendUrl} 
                    onChange={(e) => setBackendUrl(e.target.value)} 
                    placeholder="Enter backend API URL"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="token-direct">Verification Token</Label>
                    <Input 
                      id="token-direct" 
                      value={token} 
                      onChange={(e) => setToken(e.target.value)} 
                      placeholder="Enter token"
                    />
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="email-direct">Email (Optional)</Label>
                    <Input 
                      id="email-direct" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Request Method</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant={method === 'GET' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setMethod('GET')}
                    >
                      GET
                    </Button>
                    <Button 
                      variant={method === 'POST' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setMethod('POST')}
                    >
                      POST
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleDirectApiCall} 
                  disabled={requestStatus === 'loading' || !token}
                  className="w-full"
                >
                  {requestStatus === 'loading' ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <SendIcon className="mr-2 h-4 w-4" />
                      Test Backend API Directly
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="proxy" className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="proxy-url">Next.js API Proxy URL</Label>
                  <Input 
                    id="proxy-url" 
                    value={proxyUrl} 
                    onChange={(e) => setProxyUrl(e.target.value)} 
                    placeholder="Enter Next.js API route"
                  />
                  <p className="text-xs text-gray-500">Use '/api/verify-email' or '/api/verify-email-proxy'</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="token-proxy">Verification Token</Label>
                    <Input 
                      id="token-proxy" 
                      value={token} 
                      onChange={(e) => setToken(e.target.value)} 
                      placeholder="Enter token"
                    />
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="email-proxy">Email (Optional)</Label>
                    <Input 
                      id="email-proxy" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Request Method</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant={method === 'GET' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setMethod('GET')}
                    >
                      GET
                    </Button>
                    <Button 
                      variant={method === 'POST' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setMethod('POST')}
                    >
                      POST
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleProxyCall} 
                  disabled={requestStatus === 'loading' || !token}
                  className="w-full"
                >
                  {requestStatus === 'loading' ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <SendIcon className="mr-2 h-4 w-4" />
                      Test Next.js API Proxy
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <CardContent className="p-6 border-t">
            <div className="space-y-4">
              {requestStatus !== 'idle' && (
                <Alert variant={
                  requestStatus === 'error' ? 'destructive' : 
                  requestStatus === 'success' ? 'default' : 'default'
                }>
                  <div className="flex items-center gap-2">
                    {requestStatus === 'loading' && (
                      <RotateCw className="h-4 w-4 animate-spin" />
                    )}
                    
                    {requestStatus === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    
                    {requestStatus === 'error' && (
                      <XCircle className="h-4 w-4" />
                    )}
                    
                    <AlertTitle>
                      {requestStatus === 'loading' ? 'Testing API' : 
                      requestStatus === 'success' ? 'Success' : 'Error'}
                    </AlertTitle>
                  </div>
                  
                  <AlertDescription>
                    {requestStatus === 'loading' ? 'Testing API endpoint...' : 
                    requestStatus === 'error' ? errorMessage : 
                    'API request completed successfully'}
                  </AlertDescription>
                </Alert>
              )}
              
              {response && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Response</h3>
                  <div className="bg-gray-100 rounded-md p-4 overflow-x-auto">
                    <div className="mb-2">
                      <span className="font-semibold">Status:</span> {response.status} {response.statusText}
                    </div>
                    
                    {response.redirected && (
                      <div className="mb-2">
                        <span className="font-semibold">Redirected To:</span> {response.redirectUrl}
                      </div>
                    )}
                    
                    <div className="mb-2">
                      <span className="font-semibold">Headers:</span>
                      <pre className="text-xs mt-1">{JSON.stringify(response.headers, null, 2)}</pre>
                    </div>
                    
                    <div>
                      <span className="font-semibold">Response Data:</span>
                      <pre className="text-xs mt-1">{JSON.stringify(response.data, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between px-6 py-4 border-t">
            <Button asChild variant="outline">
              <Link href="/login">Back to Login</Link>
            </Button>
            
            <div className="flex gap-2">
              <Button asChild variant="secondary">
                <Link href="/debug-verification">Debug Client</Link>
              </Button>
              <Button asChild>
                <Link href="/direct-backend-verify">Direct Verification</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}