## Email Verification Testing Guide

This document provides steps to test the enhanced email verification flow in the NEETGenie application, particularly focusing on the new token-only verification approach.

### Test Scenarios

#### 1. Complete Email Verification Flow (with email parameter)

- **Test Steps:**
  1. Register a new user account
  2. Receive verification email
  3. Click on the verification link with both token and email parameters
  4. Verify successful verification and login

- **Expected Result:** User is verified and redirected to the dashboard

#### 2. Token-Only Verification Flow (missing email parameter)

- **Test Steps:**
  1. Register a new user account
  2. Receive verification email
  3. Remove or modify the email parameter from the verification link
  4. Click on the modified link
  5. Verify the system attempts token-only verification

- **Expected Result:** User is verified using just the token and redirected to the dashboard

#### 3. Fallback Verification Flow (when token-only fails)

- **Test Steps:**
  1. Register a new user account
  2. Receive verification email
  3. Remove the email parameter from the verification link
  4. Click on the modified link
  5. If token-only verification fails, verify the system attempts to recover email from storage

- **Expected Result:** System recovers email and completes verification or redirects to direct-backend-verify page

#### 4. Direct Backend Verification Flow

- **Test Steps:**
  1. Register a new user account
  2. Receive verification email
  3. Go directly to /direct-backend-verify
  4. Enter token (and email if needed)
  5. Click verify button

- **Expected Result:** User is verified and receives success message

#### 5. HTML Direct Verification Page

- **Test Steps:**
  1. Register a new user account
  2. Receive verification email
  3. Visit the /api/direct-html-verify?token=YOUR_TOKEN URL directly

- **Expected Result:** User receives an HTML page confirming verification status

### Debugging Tips

If you encounter verification issues:

1. **Check Browser Console:** Look for debugging logs that show verification attempts
2. **Inspect Network Requests:** Verify API calls are going to the correct endpoints
3. **Check API Responses:** Look for specific error messages that might indicate the problem
4. **Use Direct Verification:** Try the /direct-backend-verify page as a manual verification method

### Backend API Endpoints

The application now supports the following verification endpoints:

- **Email+Token Verification:** POST to `/api/auth/verify-email` with `{email, token}`
- **Token-only Verification:** GET to `/api/auth/verify-email-token/:token`
- **Direct HTML Token Verification:** GET to `/api/auth/direct-verify-token/:token`

### Client Routes

- **Client-side Verification Page:** `/verify-email?token=...&email=...`
- **Direct Backend Verification:** `/direct-backend-verify?token=...`
- **HTML Verification Page:** `/api/direct-html-verify?token=...`
- **JSON API Response:** `/api/direct-token-verify?token=...`

### Common Issues and Solutions

1. **Redirect Loop Error:** Use the direct verification methods instead
2. **Missing Email Error:** Enter your email manually on the direct verification page
3. **Invalid Token Error:** Request a new verification email
4. **Token Expired Error:** Request a new verification email

For any persistent issues, contact support with a screenshot of the error message and the verification URL you're using.
