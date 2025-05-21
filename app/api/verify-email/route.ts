import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle GET requests to /api/verify-email
 * This endpoint accepts email verification links and redirects to the client-side verification page
 */
export async function GET(request: NextRequest) {
  // Extract the token and email from the URL parameters
  const token = request.nextUrl.searchParams.get('token');
  const email = request.nextUrl.searchParams.get('email');
  
  console.log("API verify-email route: Redirecting verification request with params:", { token, email });
    // Check if we're already on the client-side verification page to prevent infinite redirects
  const referer = request.headers.get('referer') || '';
  const url = request.nextUrl.toString();
  
  const isRedirectLoop = referer.includes('/verify-email') || 
                         url.includes('/verify-email') && 
                         url.includes('from_redirect=true');
  
  if (isRedirectLoop) {
    console.log("Potential redirect loop detected, avoiding redirect");
    return new NextResponse(JSON.stringify({ 
      error: "Redirect loop detected", 
      message: "Please use the client-side verification page directly or try the direct verification method at /direct-backend-verify",
      missingEmail: !email,
      token: token // Return the token so it can be used in direct verification
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // If we only have token but no email, try to use the token-only verification endpoint
  if (token && !email) {
    try {
      console.log("Attempting token-only verification");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
      const response = await fetch(`${apiUrl}/auth/verify-email-token/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // If token-only verification succeeded, redirect to the verification success page
      if (response.ok) {
        const data = await response.json();
        
        // If successful, redirect to the success page
        const successUrl = new URL('/verify-email', request.nextUrl.origin);
        successUrl.searchParams.set('token', token);
        
        // If we got the email from the response, include it
        if (data.user && data.user.email) {
          successUrl.searchParams.set('email', data.user.email);
        }
        
        successUrl.searchParams.set('success', 'true');
        successUrl.searchParams.set('token_only', 'true');
        return NextResponse.redirect(successUrl);
      }
    } catch (error) {
      console.error("Token-only verification failed:", error);
      // Continue with normal redirect if token-only verification fails
    }
  }
  
  // Build a redirect URL with the same parameters
  const redirectUrl = new URL('/verify-email', request.nextUrl.origin);
  
  if (token) {
    redirectUrl.searchParams.set('token', token);
  }
  
  if (email) {
    redirectUrl.searchParams.set('email', email);
  }
  
  // Redirect to the client-side verification page
  return NextResponse.redirect(redirectUrl);
}

/**
 * Handle POST requests to /api/verify-email
 * This is a proxy endpoint for direct API verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email } = body;
    
    console.log("API verify-email route: POST request received with:", { token, email });
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
    
    // If email is missing, try the token-only endpoint first
    if (token && !email) {
      try {
        console.log("Attempting token-only verification from POST handler");
        const tokenOnlyResponse = await fetch(`${apiUrl}/auth/verify-email-token/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (tokenOnlyResponse.ok) {
          const data = await tokenOnlyResponse.json();
          return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (tokenError) {
        console.error("Token-only verification failed:", tokenError);
        // Continue with email+token verification if token-only fails
      }
    }
    
    // Fall back to standard email+token verification
    const response = await fetch(`${apiUrl}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, email }),
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
  } catch (error: any) {
    console.error("API verify-email route error:", error);
    
    return new NextResponse(JSON.stringify({
      error: "Verification failed",
      message: error.message || "An unexpected error occurred",
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
    });
  } catch (error) {
    console.error("API verify-email route: Error processing request:", error);
    
    // Return error response
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