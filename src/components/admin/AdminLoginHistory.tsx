import * as React from 'react';
import { useState, useEffect } from 'react';
import { Clock, MapPin, Info } from 'lucide-react';
import { adminApi } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface LoginRecord {
  ip: string;
  timestamp: string;
}

interface LoginHistoryResponse {
  lastLogin: string;
  lastLoginIp: string;
  loginHistory: LoginRecord[];
}

const AdminLoginHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<LoginHistoryResponse | null>(null);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        const response = await adminApi.get('/api/admin/login-history');
        setLoginData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch login history:', err);
        setError(err.response?.data?.message || 'Failed to load login history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoginHistory();
  }, []);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-64" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-900">Login History</CardTitle>
        <CardDescription>Record of your login sessions and IP addresses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Last Login
          </h3>
          <div className="text-amber-700 mb-1">
            <span className="font-semibold">Time:</span> {formatDate(loginData?.lastLogin || '')}
          </div>
          <div className="text-amber-700">
            <span className="font-semibold">IP Address:</span> {loginData?.lastLoginIp || 'Unknown'}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-gray-700 mb-3">Previous Login Sessions</h3>
          
          {!loginData?.loginHistory?.length ? (
            <div className="text-gray-500 text-center py-4">No login history available</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {loginData.loginHistory.slice().reverse().map((record, index) => (
                <div key={index} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{record.ip}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-gray-100 text-gray-700 font-medium"
                    >
                      {formatDate(record.timestamp)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLoginHistory; 