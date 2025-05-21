import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle GET requests to /api/direct-token-verify
 * This endpoint uses the token-only verification endpoint
 */
export async function GET(request: NextRequest) {
  // Extract the token from the URL parameters
  const token = request.nextUrl.searchParams.get('token');
  
  console.log("API direct-token-verify route: Processing request with token:", token);
  
  if (!token) {
    return new NextResponse(JSON.stringify({ 
      error: "Missing token",
      message: "Verification token is required"
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Call the backend token-only verification endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
    const response = await fetch(`${apiUrl}/auth/verify-email-token/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Get response data
    const responseData = await response.json();
    
    // Return the API response with appropriate status
    return new NextResponse(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Token-only verification API error:", error);
    
    return new NextResponse(JSON.stringify({
      error: "Verification failed",
      message: (error as Error).message || "An unexpected error occurred",
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
