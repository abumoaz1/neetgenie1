# Email Verification Flow Guide

This document explains the email verification flow implemented in the NEETGenie application to ensure that users verify their email addresses before accessing the dashboard and other services.

## Overview of the Verification Flow

1. **User Signup**: When a user signs up, they are redirected to a verification required page instead of the dashboard
2. **Email Verification**: The user must click the verification link sent to their email
3. **Post-Verification**: After verification, the user is redirected to the login page
4. **Login Access**: Only verified users can log in and access the dashboard

## Components of the Email Verification System

### 1. Signup Page

- Collects user information and registers the account
- Saves user data without storing the token (to prevent access to protected routes)
- Redirects to the verification required page

### 2. Verification Required Page

- Informs the user that they need to verify their email
- Provides the option to resend the verification email
- Allows the user to check their verification status and proceed to login

### 3. Email Verification Routes

- **Client-side Verification**: `/verify-email` - Handles verification with token and email parameters
- **Direct Backend Verification**: `/direct-backend-verify` - Manual verification when automatic flow fails
- **Token-only Verification**: Added support for verifying with just a token when email is missing

### 4. Protected Route Component

- Prevents unverified users from accessing protected routes
- Redirects unverified users to the verification required page

## Verification Methods

### Standard Verification (token + email)

1. User receives an email with a verification link
2. The link contains both token and email parameters
3. The system verifies both parameters against the database

### Token-Only Verification

1. If email parameter is missing from the verification link
2. The system attempts to verify with just the token
3. If successful, the email is retrieved from the token verification response

### Manual Verification

1. User goes to the direct verification page
2. Enters their token (and optionally email)
3. The system attempts verification and provides detailed feedback

## Error Handling

- **Missing Email**: Redirect to direct verification page for manual entry
- **Invalid Token**: Show specific error and resend verification option
- **Redirect Loops**: Detection and prevention of infinite redirects
- **Token Expiry**: Option to request a new verification email

## Debugging Tools

- **Debug Verification Page**: `/debug-verification` - Helps diagnose verification issues
- **Test Verification Page**: `/test-verification` - Tests all verification endpoints
- **Detailed Logging**: Console logs for tracking verification attempts

## Security Considerations

1. Token is not stored until email is verified
2. Protected routes check for both authentication and email verification
3. Email verification status is validated on each login attempt
4. Session management for verification context

## User Experience Improvements

1. Clear guidance on the verification required page
2. Cooldown timer for resending verification emails
3. Multiple verification methods for flexibility
4. Improved error messages with clear next steps

## Implementation Notes

The email verification system uses a cascading approach to verification, trying different methods to maximize success rates:

1. First attempt token-only verification when email is missing
2. Fall back to email+token verification if token-only fails
3. Provide direct verification as a last resort for manual handling
