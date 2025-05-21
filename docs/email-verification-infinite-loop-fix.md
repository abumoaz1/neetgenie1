# Email Verification System Architecture

## Overview

The NEETGenie email verification system provides a secure way to verify user emails and manage password resets. The system has been redesigned to avoid redirect loops and ensure reliable verification.

## System Components

### 1. API Endpoints

The system uses dedicated API endpoints in the backend Flask application:
- `/api/auth/verify-email` - Verifies an email using a token
- `/api/auth/resend-verification` - Resends a verification email
- `/api/auth/forgot-password` - Initiates password reset process
- `/api/auth/reset-password` - Resets a password using a token

### 2. Frontend API Client Methods

The frontend provides client methods in `baseUrl.tsx` for interacting with the backend:
- `verifyEmail(token, email?)` - Verifies an email token
- `resendVerification(email)` - Requests a new verification email
- `forgotPassword(email)` - Requests a password reset link
- `resetPassword(email, token, newPassword)` - Sets a new password with token

### 3. Proxy Routes

Next.js API routes handle incoming email verification and password reset links:
- `/api/verify-email-proxy` - A dedicated proxy for handling email verification links
- `/api/verify-email` - Original proxy route (maintained for backward compatibility)
- `/api/reset-password` - Handles password reset links

### 4. Client Pages

User-facing pages for the verification flows:
- `/verify-email` - Displays verification status and handles verification tokens
- `/resend-verification` - Allows users to request a new verification email
- `/reset-password` - Form for entering a new password with a token
- `/forgot-password` - Form for requesting a password reset link

## Key Design Changes

### 1. Direct Backend Communication

The API client methods now communicate directly with the backend Flask application using absolute URLs:
```typescript
const backendUrl = "http://127.0.0.1:5000/api/auth/verify-email";
const response = await fetch(backendUrl, { /* ... */ });
```

This prevents redirect loops that can occur when the frontend tries to access its own API routes.

### 2. Loop Prevention in API Routes

API routes now include checks to prevent infinite redirect loops:
```typescript
// Check if we're already on the client-side verification page to prevent infinite redirects
const referer = request.headers.get('referer') || '';
if (referer.includes('/verify-email')) {
  console.log("Already on verification page, avoiding redirect loop");
  return new NextResponse(/* error response */);
}
```

### 3. Improved Proxy System

A new dedicated proxy route (`/api/verify-email-proxy`) has been created that:
- Adds a `from_proxy` parameter to track the redirect source
- Directly communicates with the backend API for POST requests
- Has improved error handling and logging

## Verification Flow

1. User receives an email with a verification link to `/api/verify-email-proxy?token=xxx&email=xxx`
2. The proxy route redirects to `/verify-email?token=xxx&email=xxx&from_proxy=true`
3. The client page uses the token to verify the email directly with the backend
4. The user receives feedback about their verification status
5. On success, the user is redirected to the dashboard

## Troubleshooting

### Common Issues

- **Redirect Loops**: Fixed by implementing direct backend communication and loop prevention
- **Missing Tokens**: The client page now clearly reports when a token is missing
- **Invalid Tokens**: Proper error handling shows user-friendly error messages
- **Network Errors**: Improved error catching and reporting to help diagnose issues

## Future Improvements

1. Implement token expiration handling with clear messages for expired tokens
2. Add automatic retry mechanism for failed verifications
3. Enhance analytics to track verification success rates
4. Create an admin dashboard for monitoring verification issues
