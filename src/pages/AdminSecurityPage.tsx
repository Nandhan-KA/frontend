import * as React from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminLoginHistory from '../components/admin/AdminLoginHistory';
import { Shield, Lock } from 'lucide-react';

const AdminSecurityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Shield className="text-amber-500 mr-3" size={28} />
                Security & Login
              </h1>
              <p className="text-gray-600 font-medium mt-1">
                View your login history and security information
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AdminLoginHistory />
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Lock className="text-amber-500 mr-2" size={20} />
                  <h2 className="text-xl font-bold text-gray-800">Security Info</h2>
                </div>
                
                <div className="text-gray-700 text-sm space-y-4">
                  <div>
                    <p className="font-medium mb-1">IP Logger Status:</p>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-1">Security Features:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>IP tracking and logging</li>
                      <li>Secure token-based authentication</li>
                      <li>Session management</li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded border border-amber-200 text-amber-800 mt-4">
                    <p className="text-sm font-medium">Note:</p>
                    <p className="text-sm mt-1">
                      Login history cannot be edited or deleted. This is for security and audit purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSecurityPage; 