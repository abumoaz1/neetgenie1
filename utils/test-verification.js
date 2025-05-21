// Test script for email verification endpoints
import { apiRequest, endpoints } from './lib/baseUrl';

// Sample data
const testToken = 'sample-token-for-testing';
const testEmail = 'test@example.com';

// Console styling for better readability
const styles = {
  header: (text) => console.log(`\n\x1b[1;36m${text}\x1b[0m`),
  success: (text) => console.log(`\x1b[1;32m✓ ${text}\x1b[0m`),
  error: (text) => console.log(`\x1b[1;31m✗ ${text}\x1b[0m`),
  info: (text) => console.log(`\x1b[1;34mi ${text}\x1b[0m`),
  warn: (text) => console.log(`\x1b[1;33m! ${text}\x1b[0m`)
};

// Helper function to test an endpoint
async function testEndpoint(name, testFn) {
  styles.header(`Testing: ${name}`);
  try {
    const result = await testFn();
    styles.success(`${name} - endpoint is available`);
    return result;
  } catch (error) {
    styles.error(`${name} - endpoint test failed: ${error.message}`);
    console.error(error);
    return null;
  }
}

// Test standard email+token verification
async function testStandardVerification() {
  return testEndpoint('Standard Email+Token Verification', async () => {
    // This should fail with a 400 for invalid token, but the endpoint should exist
    try {
      await fetch(endpoints.verifyEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: testToken, email: testEmail })
      });
      styles.info('Standard verification endpoint accepts requests');
    } catch (error) {
      styles.error(`Standard verification endpoint error: ${error.message}`);
    }
    
    // Test our Next.js API route
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: testToken, email: testEmail })
      });
      const status = response.status;
      styles.info(`Next.js API route status: ${status}`);
    } catch (error) {
      styles.error(`Next.js API route error: ${error.message}`);
    }
    
    return { tested: true };
  });
}

// Test token-only verification
async function testTokenOnlyVerification() {
  return testEndpoint('Token-Only Verification', async () => {
    // Test backend endpoint
    const tokenEndpoint = endpoints.verifyEmailToken(testToken);
    try {
      await fetch(tokenEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      styles.info(`Token-only endpoint available: ${tokenEndpoint}`);
    } catch (error) {
      styles.error(`Token-only endpoint error: ${error.message}`);
    }
    
    // Test our Next.js API route
    try {
      const response = await fetch(`/api/direct-token-verify?token=${testToken}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const status = response.status;
      styles.info(`Next.js token-only API route status: ${status}`);
    } catch (error) {
      styles.error(`Next.js token-only API route error: ${error.message}`);
    }
    
    return { tested: true };
  });
}

// Test HTML verification
async function testHtmlVerification() {
  return testEndpoint('HTML Verification', async () => {
    // Test backend endpoint
    const htmlEndpoint = endpoints.directVerifyToken(testToken);
    try {
      await fetch(htmlEndpoint, {
        method: 'GET',
        headers: { 'Accept': 'text/html' }
      });
      styles.info(`HTML verification endpoint available: ${htmlEndpoint}`);
    } catch (error) {
      styles.error(`HTML verification endpoint error: ${error.message}`);
    }
    
    // Test our Next.js API route
    try {
      const response = await fetch(`/api/direct-html-verify?token=${testToken}`, {
        method: 'GET',
        headers: { 'Accept': 'text/html' }
      });
      const status = response.status;
      styles.info(`Next.js HTML verification API route status: ${status}`);
    } catch (error) {
      styles.error(`Next.js HTML verification API route error: ${error.message}`);
    }
    
    return { tested: true };
  });
}

// Run all tests
async function runAllTests() {
  styles.header('EMAIL VERIFICATION ENDPOINT TESTING');
  styles.info('Testing all verification endpoints to ensure they are properly configured.');
  styles.warn('Note: These tests expect 400 or 401 errors for invalid tokens, which is normal.');
  
  // First, confirm our endpoint config is correct
  styles.header('Endpoint Configuration');
  console.log('verifyEmail:', endpoints.verifyEmail);
  console.log('verifyEmailToken:', endpoints.verifyEmailToken(testToken));
  console.log('directVerifyToken:', endpoints.directVerifyToken(testToken));
  
  // Run the tests
  await testStandardVerification();
  await testTokenOnlyVerification();
  await testHtmlVerification();
  
  styles.header('EMAIL VERIFICATION ENDPOINT TESTING COMPLETE');
}

// Execute tests on load
if (typeof window !== 'undefined') {
  // Only run in browser environment
  window.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.innerText = 'Run Verification Tests';
    button.style.padding = '10px 20px';
    button.style.margin = '20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', runAllTests);
    
    document.body.appendChild(button);
  });
}

export { runAllTests };
