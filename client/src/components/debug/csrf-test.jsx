import React, { useState } from 'react';
import csrfService from '../../services/csrfService';
import api from '../../services/api';

const CSRFTest = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCSRFToken = async () => {
    setLoading(true);
    addLog('Starting CSRF token test...');
    
    try {
      // Test 1: Fetch CSRF token directly
      addLog('Test 1: Fetching CSRF token directly...');
      const token = await csrfService.getToken();
      addLog(`✅ CSRF token fetched: ${token.substring(0, 10)}...`);
      
      // Test 2: Get token for headers
      addLog('Test 2: Getting token for headers...');
      const headers = await csrfService.getTokenForHeaders();
      addLog(`✅ Headers prepared: ${JSON.stringify(headers)}`);
      
      // Test 3: Make a test POST request
      addLog('Test 3: Making test POST request...');
      const response = await api.post('/shop/cart/add', {
        productId: 'test-product',
        quantity: 1
      });
      addLog(`✅ POST request successful: ${response.status}`);
      
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
      if (error.response) {
        addLog(`❌ Response status: ${error.response.status}`);
        addLog(`❌ Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    setLoading(false);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>CSRF Service Test</h3>
      <button 
        onClick={testCSRFToken} 
        disabled={loading}
        style={{ marginBottom: '10px', padding: '10px' }}
      >
        {loading ? 'Testing...' : 'Test CSRF Service'}
      </button>
      <button 
        onClick={clearLogs}
        style={{ marginLeft: '10px', padding: '10px' }}
      >
        Clear Logs
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Test Logs:</h4>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          height: '300px', 
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {logs.length === 0 ? 'No logs yet. Click "Test CSRF Service" to start.' : logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CSRFTest;
