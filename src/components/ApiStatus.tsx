import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useHealthCheck } from '../hooks/useApi';

export const ApiStatus: React.FC = () => {
  const { isHealthy, lastChecked, checkHealth } = useHealthCheck();

  if (isHealthy === null) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Checking API connection...
        </AlertDescription>
      </Alert>
    );
  }

  if (isHealthy === false) {
    return (
      <Alert variant="destructive" className="mb-4">
        <XCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            API connection failed. Using demo mode.
            {lastChecked && (
              <span className="text-xs block mt-1">
                Last checked: {lastChecked.toLocaleTimeString()}
              </span>
            )}
          </span>
          <Button variant="outline" size="sm" onClick={checkHealth}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-green-800">
          Connected to API server
          {lastChecked && (
            <span className="text-xs block mt-1">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </span>
        <Badge variant="outline" className="text-green-700 border-green-300">
          Live
        </Badge>
      </AlertDescription>
    </Alert>
  );
};

// Inline status indicator component
export const ApiStatusIndicator: React.FC = () => {
  const { isHealthy } = useHealthCheck();

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${
        isHealthy === null ? 'bg-yellow-500' :
        isHealthy ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className="text-xs text-gray-600">
        {isHealthy === null ? 'Checking...' :
         isHealthy ? 'API Connected' : 'Demo Mode'}
      </span>
    </div>
  );
};