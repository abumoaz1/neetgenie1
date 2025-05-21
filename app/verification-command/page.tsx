"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkServerVerificationStatus } from "@/utils/verification-status";
import { debugVerificationStatus } from "@/utils/debug-verification-status";

export default function DebugVerificationCommand() {
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);
  const [localStatus, setLocalStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fixed, setFixed] = useState(false);

  const checkVerification = async () => {
    setIsLoading(true);
    try {
      // Get local status
      const localDebugInfo = debugVerificationStatus();
      setLocalStatus(localDebugInfo);
      
      // Check server status
      const serverVerified = await checkServerVerificationStatus();
      setServerStatus(serverVerified);
      
      // Log all information
      console.group("Verification Debug Info");
      console.log("Server verification status:", serverVerified);
      console.log("Local verification status:", localDebugInfo);
      console.groupEnd();
    } catch (error) {
      console.error("Error checking verification:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fixVerification = () => {
    try {
      // Get current user data
      const userJson = localStorage.getItem('user');
      
      if (!userJson) {
        console.log("No user data to fix");
        return;
      }
      
      // Parse and update verification status to match server
      const user = JSON.parse(userJson);
      user.is_verified = serverStatus;
      
      // Save back
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update local status
      setLocalStatus({
        ...localStatus,
        isVerified: serverStatus
      });
      
      // Set fixed flag
      setFixed(true);
    } catch (error) {
      console.error("Error fixing verification:", error);
    }
  };
  
  // Determine if there's a mismatch between server and local verification status
  const hasMismatch = serverStatus !== null && localStatus && serverStatus !== localStatus.isVerified;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Verification Status Debugger</h1>
      
      <div className="mb-6">
        <Button 
          onClick={checkVerification}
          disabled={isLoading}
          className="mr-4"
        >
          {isLoading ? "Checking..." : "Check Verification Status"}
        </Button>
        
        {hasMismatch && (
          <Button
            onClick={fixVerification}
            variant="outline"
          >
            Fix Verification Status
          </Button>
        )}
      </div>
      
      {fixed && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <AlertTitle>Fixed!</AlertTitle>
          <AlertDescription>
            Local verification status updated to match server status.
          </AlertDescription>
        </Alert>
      )}
      
      {serverStatus !== null && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Server Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-lg font-medium ${serverStatus ? 'text-green-600' : 'text-red-600'}`}>
              {serverStatus ? '✅ Verified' : '❌ Not Verified'}
            </div>
          </CardContent>
        </Card>
      )}
      
      {localStatus && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Local Storage Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Has Token:</div>
                <div>{localStatus.hasToken ? '✅ Yes' : '❌ No'}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Has User:</div>
                <div>{localStatus.hasUser ? '✅ Yes' : '❌ No'}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Local Verification:</div>
                <div className={localStatus.isVerified ? 'text-green-600' : 'text-red-600'}>
                  {localStatus.isVerified ? '✅ Verified' : '❌ Not Verified'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Email:</div>
                <div>{localStatus.email || 'Not found'}</div>
              </div>
            </div>
            
            {hasMismatch && (
              <Alert className="mt-4 bg-yellow-50 border-yellow-200 text-yellow-800">
                <AlertTitle>Mismatch Detected!</AlertTitle>
                <AlertDescription>
                  Server verification status ({serverStatus ? 'verified' : 'not verified'}) 
                  doesn't match local storage ({localStatus.isVerified ? 'verified' : 'not verified'}).
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
