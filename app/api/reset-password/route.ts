import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle GET requests to /api/reset-password
 * This endpoint accepts password reset links and redirects to the client-side reset page
 */
export async function GET(request: NextRequest) {
  // Extract the token and email from the URL parameters
  const token = request.nextUrl.searchParams.get('token');
  const email = request.nextUrl.searchParams.get('email');
  
  console.log("API reset-password route: Redirecting reset request with params:", { token, email });
  
  // Build a redirect URL with the same parameters
  const redirectUrl = new URL('/reset-password', request.nextUrl.origin);
  
  if (token) {
    redirectUrl.searchParams.set('token', token);
  }
  
  if (email) {
    redirectUrl.searchParams.set('email', email);
  }
  
  // Redirect to the client-side reset password page
  return NextResponse.redirect(redirectUrl);
}
