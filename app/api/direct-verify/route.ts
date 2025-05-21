// Direct Backend Verification API Route
// This is a server-side route that directly accesses the backend API to verify emails
// It helps solve the redirect loop issue and handles the missing email problem

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract the token from the URL parameters
  const token = request.nextUrl.searchParams.get('token');
  
  console.log("Direct verify GET route: Processing request with token:", token);
  
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
    // Call the backend direct-verify-token endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
    const response = await fetch(`${apiUrl}/auth/direct-verify-token/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      }
    });
    
    // Get the HTML response
    const htmlContent = await response.text();
    
    // Return the HTML response as-is
    return new NextResponse(htmlContent, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error("Direct verify API error:", error);
    
    // Return an HTML error page
    return new NextResponse(
      `<html>
        <head>
          <title>Verification Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .error { color: red; }
            .button { display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Email Verification Error</h1>
          <p class="error">There was a problem verifying your email address.</p>
          <p>Error details: ${(error as Error).message || "Unknown error"}</p>
          <p>Please try one of the following options:</p>
          <p><a href="/direct-backend-verify" class="button">Try Manual Verification</a></p>
          <p><a href="/resend-verification" class="button">Request New Verification Email</a></p>
        </body>
      </html>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}
  } catch (error: any) {
    console.error("Direct verification API error:", error);
    
    // Return error response
    return new NextResponse(JSON.stringify({
      error: "Verification error",
      message: error.message || "Failed to process verification request",
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET(request: NextRequest) {
  // Get token and email from query parameters
  const token = request.nextUrl.searchParams.get('token');
  const email = request.nextUrl.searchParams.get('email');
  
  // Create a response with cookies to store verification info
  const response = NextResponse.redirect(new URL('/direct-backend-verify', request.url));
  
  // Store parameters in cookies
  if (token) {
    response.cookies.set('verification_token', token, { 
      httpOnly: false, // Allow client-side access
      maxAge: 60 * 10, // 10 minutes
    });
  }
  
  if (email) {
    response.cookies.set('verification_email', email, {
      httpOnly: false, // Allow client-side access
      maxAge: 60 * 10, // 10 minutes
    });
  }
  
  return response;
}
