import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import { toast } from '@/components/ui/use-toast';
import { 
  Save, 
  QrCode, 
  Mail, 
  Phone, 
  CreditCard, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin,
  Loader2,
  UserCircle,
  Bell,
  LockKeyhole,
  Palette,
  Globe,
  Shield,
  CheckCircle2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Switch } from "@/components/ui/switch";

interface Settings {
  _id?: string;
  paymentQrCode: string;
  contactEmail: string;
  contactPhone: string;
  upiId: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    facebook: string;
    linkedin: string;
  };
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    paymentQrCode: '',
    contactEmail: '',
    contactPhone: '',
    upiId: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      facebook: '',
      linkedin: ''
    }
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [themeColor, setThemeColor] = useState("amber");
  
  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin');
        return;
      }
      
      const response = await adminApi.get('/api/admin/settings');
      
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load settings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties like socialLinks.instagram
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent as keyof Settings],
          [child]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      
      await adminApi.put('/api/admin/settings', settings);
      
      toast({
        title: "Success",
        description: "Settings updated successfully!",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const ThemeColorButton = ({ color }: { color: string }) => (
    <button
      className={`w-8 h-8 rounded-full transition-all ${
        themeColor === color 
          ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' 
          : 'hover:scale-105'
      }`}
      style={{ backgroundColor: `var(--${color}-500)` }}
      onClick={() => setThemeColor(color)}
    />
  );
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-amber-500 mr-2" />
        <span>Loading settings...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
              <div className="mt-4 sm:mt-0">
                <Button 
                  onClick={handleSave}
                  className={`${
                    saveSuccess 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-amber-500 hover:bg-amber-600'
                  } text-white transition-colors flex items-center gap-2`}
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 size={18} />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <Tabs 
              defaultValue="profile" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white p-2 border-b border-gray-200">
                  <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 bg-gray-100 p-1">
                    <TabsTrigger 
                      value="profile" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-amber-500"
                    >
                      <UserCircle size={16} /> 
                      <span className="hidden md:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-amber-500"
                    >
                      <Bell size={16} /> 
                      <span className="hidden md:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-amber-500"
                    >
                      <LockKeyhole size={16} /> 
                      <span className="hidden md:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="appearance" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-amber-500"
                    >
                      <Palette size={16} /> 
                      <span className="hidden md:inline">Appearance</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="site" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-amber-500"
                    >
                      <Globe size={16} /> 
                      <span className="hidden md:inline">Site Settings</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mail" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-amber-500"
                    >
                      <Mail size={16} /> 
                      <span className="hidden md:inline">Mail Server</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Profile Settings */}
                <TabsContent value="profile" className="mt-0">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-amber-500" />
                      <CardTitle>Profile Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="Admin User" className="bg-white border-gray-200 focus-visible:ring-amber-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="admin@techshethra.com" className="bg-white border-gray-200 focus-visible:ring-amber-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+91 9876543210" className="bg-white border-gray-200 focus-visible:ring-amber-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue="Administrator" disabled className="bg-gray-50 border-gray-200 text-gray-500" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea 
                          id="bio" 
                          rows={4}
                          defaultValue="Administrator for TechShethra 2025 technical symposium." 
                          className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Notification Settings */}
                <TabsContent value="notifications" className="mt-0">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <CardTitle>Notification Preferences</CardTitle>
                    </div>
                    <CardDescription>
                      Control how and when you receive notifications from the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Types</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserCircle className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">New Registrations</p>
                                <p className="text-xs text-gray-500">When a new student registers for an event</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Payment Confirmations</p>
                                <p className="text-xs text-gray-500">When a payment is completed for an event</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Mail className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Contact Messages</p>
                                <p className="text-xs text-gray-500">When someone sends a new contact message</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Appearance Settings */}
                <TabsContent value="appearance" className="mt-0">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-purple-500" />
                      <CardTitle>Appearance Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Customize the look and feel of the admin dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Color</h3>
                        <div className="flex items-center gap-4">
                          <ThemeColorButton color="amber" />
                          <ThemeColorButton color="blue" />
                          <ThemeColorButton color="green" />
                          <ThemeColorButton color="purple" />
                          <ThemeColorButton color="red" />
                          <ThemeColorButton color="indigo" />
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Interface</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                              <p className="text-xs text-gray-500">Switch between light and dark mode</p>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Compact Mode</p>
                              <p className="text-xs text-gray-500">Use more compact layout for tables and lists</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Show Quick Actions</p>
                              <p className="text-xs text-gray-500">Display quick action buttons in the header</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Security Settings */}
                <TabsContent value="security" className="mt-0">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-red-100/50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      <CardTitle>Security Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your account security and access settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" className="bg-white border-gray-200 focus-visible:ring-amber-500" />
                        </div>
                        <div className="col-span-2 md:col-span-1"></div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" className="bg-white border-gray-200 focus-visible:ring-amber-500" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" className="bg-white border-gray-200 focus-visible:ring-amber-500" />
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-red-100">
                              <Shield className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Two-factor authentication is not enabled</p>
                              <p className="text-xs text-gray-500 mt-1 mb-3">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                              <Button 
                                variant="outline" 
                                className="text-sm h-8 border-red-200 text-red-600 hover:bg-red-50"
                              >
                                Enable 2FA
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Session Management</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Current Session</p>
                              <p className="text-xs text-gray-500">Windows • Chrome • IP: 192.168.1.1</p>
                            </div>
                            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Active Now
                            </div>
                          </div>
                          
                          <Button 
                            variant="secondary" 
                            className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Log Out of All Other Sessions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Other tabs would go here */}
                <TabsContent value="site" className="mt-0">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-green-500" />
                      <CardTitle>Site Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Configure global site settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500 py-8">Site settings content will be implemented soon.</p>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="mail" className="mt-0">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-indigo-500" />
                      <CardTitle>Mail Server Configuration</CardTitle>
                    </div>
                    <CardDescription>
                      Configure email server settings for notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500 py-8">Mail server settings content will be implemented soon.</p>
                  </CardContent>
                </TabsContent>
              </Card>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 