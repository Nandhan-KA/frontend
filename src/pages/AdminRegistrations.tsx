import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, publicApi } from '../services/api';
import { Loader2, CheckCircle, XCircle, Filter, Search, Download, RefreshCw, Eye, Edit, Trash, AlertTriangle } from 'lucide-react';

import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { toast } from '../components/ui/use-toast';

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  event: {
    _id: string;
    title: string;
  };
  teamName?: string;
  teamMembers?: Array<{
    name: string;
    email: string;
    phone: string;
    college: string;
  }>;
  registrationStatus: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paymentProof?: string;
  createdAt: string;
  isNew?: boolean;
  highlightUntil?: number;
}

interface Event {
  _id: string;
  title: string;
}

const AdminRegistrations = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterRegistrationStatus, setFilterRegistrationStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [editRegistrationStatus, setEditRegistrationStatus] = useState<string>('');
  const [editPaymentStatus, setEditPaymentStatus] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previousRegistrationsCount, setPreviousRegistrationsCount] = useState(0);
  const [newRegistrationsCount, setNewRegistrationsCount] = useState(0);

  // Clear new registrations indicator when user interacts with the list
  const clearNewRegistrationsIndicator = () => {
    if (newRegistrationsCount > 0) {
      setNewRegistrationsCount(0);
    }
  };

  // Function to fetch data
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin');
        return;
      }
      
      // Store previous count to detect new registrations
      const prevCount = registrations.length;
      
      // Fetch all registrations
      const regResponse = await adminApi.get('/api/registration');
      
      // Fetch all events for filtering
      const eventsResponse = await adminApi.get('/api/events');
      
      // Check for new registrations
      const newRegs = regResponse.data;
      if (prevCount > 0 && newRegs.length > prevCount) {
        const newCount = newRegs.length - prevCount;
        setNewRegistrationsCount(newCount);
        
        // Mark new registrations with a timestamp for highlighting
        const now = new Date().getTime();
        const markedRegistrations = newRegs.map(reg => {
          // Consider only registrations that weren't in the previous list
          const isNewRegistration = !registrations.some(oldReg => oldReg._id === reg._id);
          return {
            ...reg,
            isNew: isNewRegistration,
            highlightUntil: isNewRegistration ? now + 30000 : undefined // highlight for 30 seconds
          };
        });
        
        setRegistrations(markedRegistrations);
        
        // Show notification
        toast({
          title: `${newCount} New Registration${newCount > 1 ? 's' : ''}`,
          description: `${newCount} new registration${newCount > 1 ? 's have' : ' has'} been received.`,
          variant: "default",
        });
      } else {
        setRegistrations(newRegs);
      }
      
      setPreviousRegistrationsCount(prevCount);
      setEvents(eventsResponse.data);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load registrations. Please try again.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [navigate]);
  
  // Set up polling for real-time updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchData();
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval]);

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 5) return 'just now';
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const DataFreshnessIndicator = () => {
    // Determine the status of data freshness
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    let statusColor = 'bg-green-400'; // Fresh
    if (diffInSeconds > 60) statusColor = 'bg-yellow-400'; // Stale
    if (diffInSeconds > 300) statusColor = 'bg-red-400';  // Very stale
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
        <span className="text-gray-600">
          Last updated: {formatTimeAgo(lastUpdated)}
        </span>
      </div>
    );
  };

  const RefreshControls = () => {
    return (
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <input 
              type="checkbox" 
              id="autoRefresh" 
              className="rounded" 
              checked={autoRefresh}
              onChange={toggleAutoRefresh} 
            />
            <label htmlFor="autoRefresh">Auto refresh</label>
          </div>
        </div>
        
        {autoRefresh && (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>Every</span>
            <Select 
              value={refreshInterval.toString()} 
              onValueChange={(value) => setRefreshInterval(parseInt(value))}
            >
              <SelectTrigger className="w-24 h-7">
                <SelectValue placeholder="Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 sec</SelectItem>
                <SelectItem value="30">30 sec</SelectItem>
                <SelectItem value="60">1 min</SelectItem>
                <SelectItem value="300">5 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  const handleManualRefresh = () => {
    clearNewRegistrationsIndicator();
    fetchData();
  };
  
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Filter registrations based on search term and filters
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      searchTerm === '' || 
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.event.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = filterEvent === 'all' || reg.event._id === filterEvent;
    
    const matchesRegistrationStatus = 
      filterRegistrationStatus === 'all' || 
      reg.registrationStatus === filterRegistrationStatus;
    
    const matchesPaymentStatus = 
      filterPaymentStatus === 'all' || 
      reg.paymentStatus === filterPaymentStatus;
    
    return matchesSearch && matchesEvent && matchesRegistrationStatus && matchesPaymentStatus;
  });

  // Handle viewing registration details
  const handleViewRegistration = (registration: Registration) => {
    setSelectedRegistration(registration);
    setViewDialogOpen(true);
  };

  // Handle editing registration status
  const handleEditRegistration = (registration: Registration) => {
    setSelectedRegistration(registration);
    setEditRegistrationStatus(registration.registrationStatus);
    setEditPaymentStatus(registration.paymentStatus);
    setEditDialogOpen(true);
  };

  // Handle deleting registration
  const handleDeleteRegistration = (registration: Registration) => {
    setSelectedRegistration(registration);
    setDeleteDialogOpen(true);
  };

  // Update registration status
  const updateRegistrationStatus = async () => {
    if (!selectedRegistration) return;
    
    try {
      setUpdating(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await adminApi.put(
        `/api/registration/${selectedRegistration._id}`,
        {
          registrationStatus: editRegistrationStatus,
          paymentStatus: editPaymentStatus
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Update the registration in the state
      setRegistrations(prevRegistrations => 
        prevRegistrations.map(reg => 
          reg._id === selectedRegistration._id ? { ...reg, ...response.data } : reg
        )
      );
      
      toast({
        title: "Success",
        description: "Registration status updated successfully",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating registration:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update registration status",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Delete registration
  const deleteRegistration = async () => {
    if (!selectedRegistration) return;
    
    try {
      setDeleting(true);
      const token = localStorage.getItem('adminToken');
      
      await adminApi.delete(
        `/api/registration/${selectedRegistration._id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Remove the registration from the state
      setRegistrations(prevRegistrations => 
        prevRegistrations.filter(reg => reg._id !== selectedRegistration._id)
      );
      
      toast({
        title: "Success",
        description: "Registration deleted successfully",
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete registration",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Export registrations as CSV
  const exportToCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'College',
      'Event',
      'Team Name',
      'Registration Status',
      'Payment Status', 
      'Transaction ID',
      'Date Registered'
    ];
    
    const csvRows = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        `"${reg.name}"`,
        `"${reg.email}"`,
        `"${reg.phone}"`,
        `"${reg.college}"`,
        `"${reg.event.title}"`,
        `"${reg.teamName || ''}"`,
        `"${reg.registrationStatus}"`,
        `"${reg.paymentStatus}"`,
        `"${reg.transactionId || ''}"`,
        `"${new Date(reg.createdAt).toLocaleDateString()}"`,
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge component
  const StatusBadge = ({ status, type }: { status: string, type: 'registration' | 'payment' }) => {
    const badgeClasses = {
      registration: {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        cancelled: "bg-gray-100 text-gray-800"
      },
      payment: {
        pending: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800"
      }
    };
    
    const statusClass = badgeClasses[type][status as keyof typeof badgeClasses[typeof type]] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={`${statusClass} font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex">
        <AdminHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
        </div>
      </div>
    );
  }

  // Show error state if needed
  if (registrations.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex">
        <AdminHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">No Registrations Found</h2>
            <p className="text-gray-600 mb-6">There are no event registrations in the system yet.</p>
            <Button onClick={handleManualRefresh} className="mr-4">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/events')}>
              View Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Registrations</h1>
              <DataFreshnessIndicator />
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <RefreshControls />
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportToCSV}
                className="ml-4 border-amber-500 text-amber-500 hover:bg-amber-50 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </div>
          </div>
          
          {newRegistrationsCount > 0 && (
            <div className="mb-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-amber-800 p-3 rounded-md flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                <span>
                  {newRegistrationsCount} new registration{newRegistrationsCount > 1 ? 's' : ''} received
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-amber-800 hover:text-amber-900 hover:bg-amber-100"
                onClick={clearNewRegistrationsIndicator}
              >
                Dismiss
              </Button>
            </div>
          )}
          
          {/* Filters */}
          <Card className="mb-6 bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 pb-4 border-b border-gray-200">
              <CardTitle className="flex items-center text-gray-800">
                <Filter className="h-4 w-4 mr-2 text-amber-500" /> 
                Filters and Search
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Name, email or event..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-50 border-gray-200 pl-8 text-gray-800 placeholder:text-gray-400 focus-visible:ring-amber-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Event</label>
                  <Select value={filterEvent} onValueChange={setFilterEvent}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 focus:ring-amber-500">
                      <SelectValue placeholder="All Events" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-800">
                      <SelectItem value="all">All Events</SelectItem>
                      {events.map(event => (
                        <SelectItem key={event._id} value={event._id}>{event.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Registration Status</label>
                  <Select value={filterRegistrationStatus} onValueChange={setFilterRegistrationStatus}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 focus:ring-amber-500">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-800">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Payment Status</label>
                  <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 focus:ring-amber-500">
                      <SelectValue placeholder="All Payments" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-800">
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Registrations Table */}
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="rounded-md">
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow className="hover:bg-gray-100">
                      <TableHead className="text-gray-700 font-medium">Participant</TableHead>
                      <TableHead className="text-gray-700 font-medium">Event</TableHead>
                      <TableHead className="text-gray-700 font-medium">Registration Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Registration Status</TableHead>
                      <TableHead className="text-gray-700 font-medium">Payment Status</TableHead>
                      <TableHead className="text-gray-700 font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.length === 0 ? (
                      <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                          No registrations found matching the filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRegistrations.map((registration) => (
                        <TableRow 
                          key={registration._id} 
                          className={`hover:bg-gray-50 border-b border-gray-200 ${
                            registration.isNew && registration.highlightUntil && registration.highlightUntil > new Date().getTime()
                              ? 'bg-amber-50'
                              : ''
                          }`}
                          onClick={clearNewRegistrationsIndicator}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-semibold shadow-sm">
                                {registration.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{registration.name}</div>
                                <div className="text-sm text-gray-500">{registration.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-800">{registration.event.title}</div>
                            {registration.teamName && (
                              <div className="text-sm text-gray-500">Team: {registration.teamName}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-600">{formatDate(registration.createdAt)}</TableCell>
                          <TableCell>
                            <StatusBadge status={registration.registrationStatus} type="registration" />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={registration.paymentStatus} type="payment" />
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full">
                                  <span className="sr-only">Open menu</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white border-gray-200 text-gray-800 shadow-lg">
                                <DropdownMenuItem 
                                  onClick={() => handleViewRegistration(registration)}
                                  className="hover:bg-gray-100 cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleEditRegistration(registration)}
                                  className="hover:bg-gray-100 cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4 text-amber-500" /> Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteRegistration(registration)}
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                                >
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* View Registration Dialog */}
      {selectedRegistration && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-3xl shadow-lg">
            <DialogHeader className="bg-gradient-to-r from-amber-50 to-amber-100 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-gray-200">
              <DialogTitle className="text-xl font-semibold text-gray-800">Registration Details</DialogTitle>
              <DialogDescription className="text-gray-600">
                Complete registration information for {selectedRegistration.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Event</h3>
                  <p className="text-gray-900 text-lg font-medium">{selectedRegistration.event.title}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Date</h3>
                  <p className="text-gray-900">{formatDate(selectedRegistration.createdAt)}</p>
                </div>
                
                <div className="flex space-x-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Status</h3>
                    <StatusBadge status={selectedRegistration.registrationStatus} type="registration" />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Status</h3>
                    <StatusBadge status={selectedRegistration.paymentStatus} type="payment" />
                  </div>
                </div>
                
                {selectedRegistration.transactionId && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Transaction ID</h3>
                    <p className="text-gray-900 break-all bg-gray-50 p-2 rounded-md border border-gray-200">{selectedRegistration.transactionId}</p>
                  </div>
                )}
                
                {selectedRegistration.paymentProof && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Proof</h3>
                    <a 
                      href={`${import.meta.env.VITE_API_URL}/${selectedRegistration.paymentProof}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Payment Screenshot
                    </a>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Participant Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-semibold">
                        {selectedRegistration.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedRegistration.name}</p>
                        <p className="text-sm text-gray-500">{selectedRegistration.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 pl-2 border-l-2 border-amber-200">
                      <p className="text-gray-700">{selectedRegistration.phone}</p>
                      <p className="text-gray-700">{selectedRegistration.college}</p>
                    </div>
                  </div>
                </div>
                
                {selectedRegistration.teamName && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Team Information</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold">
                          T
                        </div>
                        <p className="font-medium text-gray-900">Team: {selectedRegistration.teamName}</p>
                      </div>
                      
                      {selectedRegistration.teamMembers && selectedRegistration.teamMembers.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-600 mb-2">Team Members:</p>
                          <div className="space-y-3">
                            {selectedRegistration.teamMembers.map((member, idx) => (
                              <div key={idx} className="pl-3 border-l-2 border-amber-200 hover:border-amber-300 transition-colors">
                                <p className="text-sm text-gray-900 font-medium">{member.name}</p>
                                <p className="text-xs text-gray-600">{member.email} | {member.phone}</p>
                                <p className="text-xs text-gray-600">{member.college}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="border-t border-gray-200 -mx-6 -mb-6 px-6 py-4 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setViewDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setViewDialogOpen(false);
                  handleEditRegistration(selectedRegistration);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Registration Status Dialog */}
      {selectedRegistration && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-white border-gray-200 text-gray-900 shadow-lg">
            <DialogHeader className="bg-gradient-to-r from-amber-50 to-amber-100 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-gray-200">
              <DialogTitle className="text-xl font-semibold text-gray-800">Update Registration Status</DialogTitle>
              <DialogDescription className="text-gray-600">
                Change registration and payment status for this participant
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-5 py-6">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Participant Details</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-semibold">
                    {selectedRegistration.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedRegistration.name}</p>
                    <p className="text-sm text-gray-600">{selectedRegistration.email}</p>
                    <p className="text-sm text-gray-600">Event: {selectedRegistration.event.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Registration Status</label>
                  <Select value={editRegistrationStatus} onValueChange={setEditRegistrationStatus}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 focus:ring-amber-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-800">
                      <SelectItem value="pending" className="text-yellow-600">Pending</SelectItem>
                      <SelectItem value="confirmed" className="text-green-600">Confirmed</SelectItem>
                      <SelectItem value="cancelled" className="text-gray-600">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Status</label>
                  <Select value={editPaymentStatus} onValueChange={setEditPaymentStatus}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 focus:ring-amber-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-800">
                      <SelectItem value="pending" className="text-blue-600">Pending</SelectItem>
                      <SelectItem value="completed" className="text-green-600">Completed</SelectItem>
                      <SelectItem value="failed" className="text-red-600">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter className="border-t border-gray-200 -mx-6 -mb-6 px-6 py-4 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={updateRegistrationStatus}
                disabled={updating}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Registration Dialog */}
      {selectedRegistration && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-white border-gray-200 text-gray-900 shadow-lg">
            <DialogHeader className="bg-gradient-to-r from-red-50 to-red-100 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-gray-200">
              <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Trash className="h-5 w-5 text-red-500" /> 
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                This action cannot be undone. This will permanently delete the registration.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
                <p><span className="font-medium">Participant:</span> {selectedRegistration.name}</p>
                <p><span className="font-medium">Email:</span> {selectedRegistration.email}</p>
                <p><span className="font-medium">Event:</span> {selectedRegistration.event.title}</p>
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  All data related to this registration will be permanently deleted.
                </p>
              </div>
            </div>
            
            <DialogFooter className="border-t border-gray-200 -mx-6 -mb-6 px-6 py-4 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
                className="border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={deleteRegistration}
                disabled={deleting}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Registration'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminRegistrations; 