import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from './ui/button';

const ApiTest = () => {
  const [apiStatus, setApiStatus] = useState<string>('Not tested');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Log API URL on component mount
  useEffect(() => {
    console.log('ApiTest component mounted');
    console.log('API base URL:', (api.defaults.baseURL));
  }, []);

  const testApiConnection = async () => {
    setIsLoading(true);
    setApiStatus('Testing connection...');
    
    try {
      // Simple test request to a public endpoint that should exist
      await api.get('/');
      setApiStatus('Connection successful! API is reachable.');
      console.log('API connection test successful');
    } catch (error: any) {
      console.error('API connection test failed:', error);
      if (error.request && !error.response) {
        setApiStatus('Error: Cannot reach API server. Is the backend running?');
      } else if (error.response) {
        setApiStatus(`Received response with status: ${error.response.status}`);
      } else {
        setApiStatus(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">API Connection Test</h3>
      <div className="mb-4">
        <p><strong>Status:</strong> <span className={
          apiStatus.includes('successful') ? 'text-green-600' : 
          apiStatus.includes('Error') ? 'text-red-600' : 'text-yellow-600'
        }>{apiStatus}</span></p>
      </div>
      <Button 
        onClick={testApiConnection} 
        disabled={isLoading}
        variant="default"
      >
        {isLoading ? 'Testing...' : 'Test API Connection'}
      </Button>
    </div>
  );
};

export default ApiTest;
