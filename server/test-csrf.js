/**
 * Simple test script to verify CSRF protection is working
 * Run with: node test-csrf.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testCSRF() {
  console.log('Testing CSRF Protection...\n');

  try {
    // Test 1: Get CSRF token
    console.log('1. Fetching CSRF token...');
    const tokenResponse = await axios.get(`${BASE_URL}/csrf-token`, {
      withCredentials: true
    });
    
    if (tokenResponse.data.success) {
      console.log('✅ CSRF token fetched successfully');
      console.log('Token:', tokenResponse.data.csrfToken.substring(0, 10) + '...');
    } else {
      console.log('❌ Failed to fetch CSRF token');
      return;
    }

    const csrfToken = tokenResponse.data.csrfToken;

    // Test 2: Make request without CSRF token (should fail)
    console.log('\n2. Testing request without CSRF token (should fail)...');
    try {
      await axios.post(`${BASE_URL}/shop/cart`, {
        productId: 'test',
        quantity: 1
      }, {
        withCredentials: true
      });
      console.log('❌ Request succeeded without CSRF token - this should not happen!');
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.error === 'MISSING_CSRF_TOKEN') {
        console.log('✅ Request correctly rejected for missing CSRF token');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 3: Make request with invalid CSRF token (should fail)
    console.log('\n3. Testing request with invalid CSRF token (should fail)...');
    try {
      await axios.post(`${BASE_URL}/shop/cart`, {
        productId: 'test',
        quantity: 1
      }, {
        headers: {
          'X-CSRF-Token': 'invalid-token'
        },
        withCredentials: true
      });
      console.log('❌ Request succeeded with invalid CSRF token - this should not happen!');
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.error === 'INVALID_CSRF_TOKEN') {
        console.log('✅ Request correctly rejected for invalid CSRF token');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 4: Make request with valid CSRF token (should succeed or fail gracefully)
    console.log('\n4. Testing request with valid CSRF token...');
    try {
      await axios.post(`${BASE_URL}/shop/cart`, {
        productId: 'test',
        quantity: 1
      }, {
        headers: {
          'X-CSRF-Token': csrfToken
        },
        withCredentials: true
      });
      console.log('✅ Request with valid CSRF token processed (may fail for other reasons like authentication)');
    } catch (error) {
      if (error.response?.status === 403 && 
          (error.response?.data?.error === 'MISSING_CSRF_TOKEN' || 
           error.response?.data?.error === 'INVALID_CSRF_TOKEN')) {
        console.log('❌ Request with valid CSRF token was rejected - CSRF implementation may have issues');
      } else {
        console.log('✅ Request with valid CSRF token processed (failed for other reasons like authentication)');
        console.log('Error:', error.response?.data?.message || error.message);
      }
    }

    // Test 5: Test GET request (should not require CSRF token)
    console.log('\n5. Testing GET request (should not require CSRF token)...');
    try {
      await axios.get(`${BASE_URL}/shop/products`, {
        withCredentials: true
      });
      console.log('✅ GET request succeeded without CSRF token (as expected)');
    } catch (error) {
      console.log('❌ GET request failed:', error.response?.data || error.message);
    }

    console.log('\n🎉 CSRF protection test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testCSRF();

