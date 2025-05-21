import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle GET requests to /api/direct-html-verify
 * This endpoint uses the direct-verify-token endpoint that returns HTML
 */
export async function GET(request: NextRequest) {
  // Extract the token from the URL parameters
  const token = request.nextUrl.searchParams.get('token');
  
  console.log("API direct-html-verify route: Processing request with token:", token);
  
  if (!token) {
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
          <p class="error">Missing verification token.</p>
          <p>Please check your email link or try one of the following options:</p>
          <p><a href="/direct-backend-verify" class="button">Try Manual Verification</a></p>
          <p><a href="/resend-verification" class="button">Request New Verification Email</a></p>
        </body>
      </html>`,
      {
        status: 400,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
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
    console.error("HTML verification API error:", error);
    
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
