"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { debugVerificationStatus } from "@/utils/debug-verification-status";
import { syncVerificationStatus, resetVerificationState } from "@/utils/verification-status";

export default function VerificationDebugPage() {
  const [storageData, setStorageData] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<{status: string, message: string} | null>(null);
  
  useEffect(() => {
    // Run verification debug when component mounts
    const debug = debugVerificationStatus();
    setStorageData(debug);
  }, []);
  
  const handleCheckVerification = async () => {
    setVerificationResult({ status: 'checking', message: 'Checking verification status with server...' });
    
    try {
      const isVerified = await syncVerificationStatus();
      
      if (isVerified) {
        setVerificationResult({ 
          status: 'verified', 
          message: 'User is VERIFIED according to server. Local storage has been updated.' 
        });
      } else {
        setVerificationResult({ 
          status: 'unverified', 
          message: 'User is NOT VERIFIED according to server.' 
        });
      }
      
      // Refresh debug data
      const debug = debugVerificationStatus();
      setStorageData(debug);
    } catch (error) {
      setVerificationResult({ 
        status: 'error', 
        message: `Error checking verification: ${error}` 
      });
    }
  };
  
  const handleResetVerification = () => {
    resetVerificationState();
    const debug = debugVerificationStatus();
    setStorageData(debug);
    setVerificationResult({ 
      status: 'reset', 
      message: 'Verification state has been reset. Check console for details.' 
    });
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Email Verification Debug Tool</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Current verification state from localStorage</CardDescription>
          </CardHeader>
          <CardContent>
            {storageData ? (
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-semibold">Token exists:</dt>
                  <dd>{storageData.hasToken ? '✅ Yes' : '❌ No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold">User exists:</dt>
                  <dd>{storageData.hasUser ? '✅ Yes' : '❌ No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold">Is verified:</dt>
                  <dd>{storageData.isVerified ? '✅ Yes' : '❌ No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold">Email:</dt>
                  <dd>{storageData.email || 'Not found'}</dd>
                </div>
              </dl>
            ) : (
              <p>Loading storage data...</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Session Storage</CardTitle>
            <CardDescription>Verification data in sessionStorage</CardDescription>
          </CardHeader>
          <CardContent>
            {storageData?.sessionData ? (
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-semibold">Verification email:</dt>
                  <dd className="truncate max-w-[200px]">{storageData.sessionData.verificationEmail || 'None'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold">Verification token:</dt>
                  <dd className="truncate max-w-[200px]">{storageData.sessionData.verificationToken || 'None'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold">Verification attempts:</dt>
                  <dd>{storageData.sessionData.verificationAttempts || '0'}</dd>
                </div>
              </dl>
            ) : (
              <p>Loading session data...</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {verificationResult && (
        <Alert 
          className={`mb-6 ${
            verificationResult.status === 'verified' ? 'bg-green-50 border-green-200' : 
            verificationResult.status === 'unverified' ? 'bg-amber-50 border-amber-200' : 
            verificationResult.status === 'error' ? 'bg-red-50 border-red-200' : 
            'bg-blue-50 border-blue-200'
          }`}
        >
          {verificationResult.status === 'verified' && <CheckCircle className="h-4 w-4 text-green-600" />}
          {verificationResult.status === 'unverified' && <AlertCircle className="h-4 w-4 text-amber-600" />}
          {verificationResult.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
          {verificationResult.status === 'checking' && <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-600 rounded-full" />}
          {verificationResult.status === 'reset' && <AlertCircle className="h-4 w-4 text-blue-600" />}
          
          <AlertTitle>
            {verificationResult.status === 'verified' ? 'Verified' : 
             verificationResult.status === 'unverified' ? 'Not Verified' : 
             verificationResult.status === 'error' ? 'Error' : 
             verificationResult.status === 'reset' ? 'Reset Complete' : 
             'Checking...'}
          </AlertTitle>
          <AlertDescription>{verificationResult.message}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button onClick={handleCheckVerification}>
          Check Verification with Server
        </Button>
        <Button onClick={handleResetVerification} variant="outline">
          Reset Verification State
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
        <Button asChild>
          <Link href="/verification-required">Go to Verification Required</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">Try Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
