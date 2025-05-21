import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle GET requests to /api/debug-verification
 * Returns debugging information about the request
 */
export async function GET(request: NextRequest) {
  // Collect all headers
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  // Collect URL parameters
  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  // Build debug information
  const debugInfo = {
    url: request.nextUrl.toString(),
    method: request.method,
    headers,
    params,
    timestamp: new Date().toISOString(),
  };
  
  // Return debug information
  return NextResponse.json(debugInfo, { status: 200 });
}
