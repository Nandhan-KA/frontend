import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  CalendarDays, 
  User, 
  Receipt, 
  Settings, 
  LogOut,
  AlertCircle
} from 'lucide-react';

import StudentSidebar from '../components/student/StudentSidebar';
import StudentHeader from '../components/student/StudentHeader';
import NoRegistrations from '../components/student/NoRegistrations';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { toast } from '../components/ui/use-toast';
import { Skeleton } from '../components/ui/skeleton';

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  category: string;
  price: number;
  image: string;
  isTeamEvent: boolean;
  maxTeamSize: number;
}

interface Registration {
  _id: string;
  event: Event;
  registrationStatus: string;
  paymentStatus: string;
  createdAt: string;
}

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studentToken');
    if (token) {
      // Token should already have 'Bearer ' prefix from login component
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      // Clear invalid tokens
      localStorage.removeItem('studentToken');
      // Redirect to login
      window.location.href = '/student/login';
    }
    return Promise.reject(error);
  }
);

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [showNoRegistrationsDialog, setShowNoRegistrationsDialog] = useState(false);
  
  // Get the active tab from the URL query parameter or default to "events"
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'events';
  });

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    const info = localStorage.getItem('studentInfo');
    
    if (!token || !info) {
      console.log('No token or info found, redirecting to login');
      navigate('/student/login');
      return;
    }
    
    // For debugging
    console.log('Token found:', token);
    
    try {
      setStudentInfo(JSON.parse(info));
    } catch (e) {
      console.error("Error parsing student info:", e);
      localStorage.removeItem('studentInfo');
      navigate('/student/login');
      return;
    }
    
    // Fetch events and registered events
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First test the auth endpoint to verify token works
        try {
          const profileRes = await api.get('/api/students/profile');
          console.log('Authentication successful', profileRes.data);
        } catch (authError) {
          console.error('Authentication test failed:', authError);
          toast({
            variant: 'destructive',
            title: 'Session expired',
            description: 'Please login again to continue.',
          });
          handleLogout();
          return;
        }
        
        // Fetch all events
        const eventsRes = await api.get('/api/events');
        console.log('Events data:', eventsRes.data);
        
        if (Array.isArray(eventsRes.data) && eventsRes.data.length > 0) {
          setEvents(eventsRes.data);
        } else {
          // If no events are found, set an empty array instead of using sample data
          setEvents([]);
          toast({
            variant: 'default',
            title: 'No events',
            description: 'There are currently no events available.',
          });
        }
        
        // Now fetch registrations 
        try {
          const registrationsRes = await api.get('/api/students/events/registered');
          console.log('Registration data:', registrationsRes.data);
          
          // Parse and set registrations
          const registrationsArray = registrationsRes.data.registrations || [];
          setRegistrations(registrationsArray);
          
          // Show dialog if needed
          if (
            registrationsArray.length === 0 && 
            activeTab === 'registered' && 
            !location.search.includes('hideDialog')
          ) {
            setShowNoRegistrationsDialog(true);
          }
        } catch (error: any) {
          console.error('Error fetching registrations:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to fetch your registrations.',
          });
          setRegistrations([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch data. Please try again later.',
        });
        // Set empty arrays instead of using sample data
        setEvents([]);
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, activeTab, location.search]);

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('tab', activeTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [activeTab, navigate, location.pathname, location.search]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentInfo');
    navigate('/student/login');
  };

  // Open registration dialog - now redirects to event registration page
  const openRegisterDialog = (event: Event) => {
    // Navigate to event registration page
    navigate(`/event-register/${event._id}`);
  };

  const isRegistered = (eventId: string) => {
    return registrations.some((reg) => reg.event._id === eventId);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <StudentSidebar 
          registrationCount={0} 
          onLogout={handleLogout} 
          studentName={studentInfo?.name || "Student"} 
        />
        <div className="flex-1 overflow-auto">
          <StudentHeader 
            studentName={studentInfo?.name || "Student"} 
            registrationCount={0} 
            onLogout={handleLogout} 
          />
          <div className="container mx-auto p-6">
            <div className="space-y-6">
              <Skeleton className="h-10 w-[250px]" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-800">
      <StudentSidebar 
        registrationCount={registrations.length} 
        onLogout={handleLogout} 
        studentName={studentInfo?.name} 
      />
      <div className="flex-1 overflow-auto">
        <StudentHeader 
          studentName={studentInfo?.name} 
          registrationCount={registrations.length} 
          onLogout={handleLogout} 
        />
        <div className="container mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto mb-6">
              <TabsTrigger value="events">Available Events</TabsTrigger>
              <TabsTrigger value="registered">My Registrations</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
            </TabsList>
            
            {/* Available Events Tab */}
            <TabsContent value="events">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event._id} className="overflow-hidden bg-white border-gray-200 hover:border-gold/50 transition-all shadow-sm">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.image || 'https://via.placeholder.com/300x150?text=Event'} 
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-gray-900 text-xl">{event.name}</CardTitle>
                      <CardDescription className="text-gray-500">
                        {new Date(event.date).toLocaleDateString()} | {event.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
                          {event.category}
                        </span>
                        {event.isTeamEvent && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                            Team Event
                          </span>
                        )}
                      </div>
                      <p className="mb-4 text-sm line-clamp-3 text-gray-600">{event.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-amber-600">
                          {event.price === 0 ? 'Free' : `₹${event.price}`}
                        </span>
                        <Button 
                          disabled={isRegistered(event._id)}
                          onClick={() => isRegistered(event._id) ? null : openRegisterDialog(event)}
                          className={isRegistered(event._id) 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-gold hover:bg-amber-500 text-white"}
                        >
                          {isRegistered(event._id) ? 'Registered' : 'Register'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* My Registrations Tab */}
            <TabsContent value="registered">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">My Registrations</CardTitle>
                  <CardDescription className="text-gray-500">
                    Events you have registered for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {registrations.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <div className="mx-auto rounded-full w-12 h-12 flex items-center justify-center bg-gray-100 mb-4">
                        <AlertCircle className="h-6 w-6 text-amber-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Registrations Found</h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        You haven't registered for any events yet. Browse our exciting lineup and register to participate!
                      </p>
                      <Button 
                        onClick={() => setActiveTab('events')} 
                        className="bg-gold hover:bg-amber-500 text-white"
                      >
                        Browse Events
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          <TableHead className="text-gray-500">Event Name</TableHead>
                          <TableHead className="text-gray-500">Date</TableHead>
                          <TableHead className="text-gray-500">Registration Status</TableHead>
                          <TableHead className="text-gray-500">Payment Status</TableHead>
                          <TableHead className="text-gray-500">Registered On</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrations.map((reg) => (
                          <TableRow key={reg._id} className="border-gray-200 hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900">{reg.event.name}</TableCell>
                            <TableCell className="text-gray-700">{new Date(reg.event.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                reg.registrationStatus === 'confirmed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : reg.registrationStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {reg.registrationStatus.charAt(0).toUpperCase() + reg.registrationStatus.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                reg.paymentStatus === 'completed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : reg.paymentStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {reg.paymentStatus.charAt(0).toUpperCase() + reg.paymentStatus.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-700">{new Date(reg.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">My Profile</CardTitle>
                  <CardDescription className="text-gray-500">
                    Manage your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-3xl">
                        {studentInfo?.name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="mt-4 text-xl font-medium text-gray-900">{studentInfo?.name}</h3>
                      <p className="text-sm text-gray-500">{studentInfo?.email}</p>
                      <p className="text-sm text-gray-500 mt-1">{studentInfo?.phone || 'No phone number'}</p>
                    </div>
                    <div className="md:w-2/3">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                          <p className="text-gray-900 border border-gray-200 rounded-md p-2 bg-gray-50">{studentInfo?.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                          <p className="text-gray-900 border border-gray-200 rounded-md p-2 bg-gray-50">{studentInfo?.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">College</h3>
                          <p className="text-gray-900 border border-gray-200 rounded-md p-2 bg-gray-50">{studentInfo?.college || 'Not specified'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                          <p className="text-gray-900 border border-gray-200 rounded-md p-2 bg-gray-50">{studentInfo?.phone || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button className="bg-gold hover:bg-amber-500 text-white" onClick={() => navigate('/student/profile/edit')}>
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Show NoRegistrations component when needed */}
      {showNoRegistrationsDialog && (
        <NoRegistrations setActiveTab={setActiveTab} />
      )}
    </div>
  );
} 