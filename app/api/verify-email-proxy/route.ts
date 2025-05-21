import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Helper function to safely set a cookie
 */
function setCookie(name: string, value: string, response: NextResponse): void {
  const oneDay = 24 * 60 * 60 * 1000;
  response.cookies.set({
    name,
    value,
    httpOnly: false, // Allow JavaScript access for session recovery
    path: '/',
    sameSite: 'lax',
    maxAge: oneDay,
  });
}

/**
 * Handle GET requests to /api/verify-email-proxy
 * A more reliable proxy endpoint for email verification links that avoids redirect loops
 */
export async function GET(request: NextRequest) {
  // Extract token and email from the URL parameters
  const token = request.nextUrl.searchParams.get('token');
  const email = request.nextUrl.searchParams.get('email');
  
  console.log("Verification proxy: Processing request with params:", { token, email });
  
  // Track that this request came through the proxy to avoid redirect loops
  const redirectUrl = new URL('/verify-email', request.nextUrl.origin);
  
  if (token) {
    redirectUrl.searchParams.set('token', token);
    
    // Also set verification token in a cookie for recovery
    const response = NextResponse.redirect(redirectUrl);
    if (token) setCookie('verification_token', token, response);
    if (email) setCookie('verification_email', email, response);
    
    return response;
  }
  
  if (email) {
    redirectUrl.searchParams.set('email', email);
  }
  
  // Add a special parameter to prevent redirect loops
  redirectUrl.searchParams.set('from_proxy', 'true');
  
  // Redirect to the client-side verification page
  return NextResponse.redirect(redirectUrl);
}

/**
 * Handle POST requests for direct verification via API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email } = body;
    
    console.log("Verification proxy: Processing direct API verification with:", { token, email });
    
    // Send directly to backend API, bypassing any Next.js routes
    const apiUrl = "http://127.0.0.1:5000/api/auth/verify-email";
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, email }),
    });
    
    // Get the response data and pass it through
    const responseData = await response.json();
    
    return new NextResponse(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Verification proxy API error:", error);
    
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to process verification request',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}