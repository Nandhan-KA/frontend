import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Calendar,
  Monitor,
  Wrench,
  MapPin,
  DollarSign,
  Users,
  AlertCircle,
  Info,
  CheckCircle,
  ListChecks,
  Award,
  Phone,
  Clock,
  FileText
} from 'lucide-react';
import { adminApi } from '../services/api';

import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  eventType: string;
  registrationFees: {
    solo: number;
    team: number;
  };
  image: string;
  qrCode?: string;
  upiId?: string;
  isTeamEvent: boolean;
  teamSize: {
    min: number;
    max: number;
  };
  capacity: number;
  prizes: {
    first: string;
    second: string;
    third: string;
    other: string;
  };
  rules: string[];
  requirements: string[];
  aboutContent?: string;
  detailsContent?: string;
  coordinators?: {
    name: string;
    contact: string;
    email?: string;
  }[];
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  date?: string;
  location?: string;
  image?: string;
  qrCode?: string;
  upiId?: string;
  maxTeamSize?: string;
  price?: string;
  capacity?: string;
}

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    eventType: 'competition',
    registrationFees: {
      solo: 0,
      team: 0
    },
    image: '',
    qrCode: '',
    upiId: '',
    isTeamEvent: false,
    capacity: 50,
    teamSize: {
      min: 1,
      max: 1
    },
    prizes: {
      first: '',
      second: '',
      third: '',
      other: ''
    },
    rules: [],
    requirements: [],
    aboutContent: '',
    detailsContent: '',
    coordinators: [],
    startTime: '',
    endTime: '',
    isActive: true
  });
  const [formTab, setFormTab] = useState("basic");
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  // Show/hide QR code field based on registration fee
  useEffect(() => {
    // If registration fee is set to 0 and we have errors for QR code, clear them
    if (formData.registrationFees.solo === 0 && formErrors.qrCode) {
      setFormErrors({
        ...formErrors,
        qrCode: undefined
      });
    }
  }, [formData.registrationFees.solo]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin');
        return;
      }
      
      const response = await adminApi.get('/api/events');
      
      // Transform backend response to match frontend Event interface if needed
      const transformedEvents = response.data.map((event: any) => ({
        _id: event._id,
        title: event.title,
        description: event.description,
        date: event.date || '',
        location: event.location || '',
        eventType: event.eventType,
        registrationFees: event.registrationFees || { solo: 0, team: 0 },
        image: event.image,
        qrCode: event.qrCode || '',
        upiId: event.upiId || '',
        isTeamEvent: event.isTeamEvent || false,
        teamSize: event.teamSize || { min: 1, max: 1 },
        capacity: event.capacity || 50,
        prizes: event.prizes || { first: '', second: '', third: '', other: '' },
        rules: event.rules || [],
        requirements: event.requirements || [],
        aboutContent: event.aboutContent,
        detailsContent: event.detailsContent,
        coordinators: event.coordinators || [],
        startTime: event.startTime,
        endTime: event.endTime,
        isActive: event.isActive !== false
      }));
      
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch events. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if any
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = value === '' ? 0 : parseFloat(value);
    
    // Don't update teamSize.max here, it's handled separately
    if (name.includes('.')) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(parsedValue) ? 0 : parsedValue
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      eventType: 'competition',
      registrationFees: {
        solo: 0,
        team: 0
      },
      image: '',
      qrCode: '',
      upiId: '',
      isTeamEvent: false,
      capacity: 50,
      teamSize: {
        min: 1,
        max: 1
      },
      prizes: {
        first: '',
        second: '',
        third: '',
        other: ''
      },
      rules: [],
      requirements: [],
      aboutContent: '',
      detailsContent: '',
      coordinators: [],
      startTime: '',
      endTime: '',
      isActive: true
    });
    setFormErrors({});
    setFormTab("basic");
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.title?.trim()) {
      errors.name = "Event name is required";
    }
    
    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 20) {
      errors.description = "Description must be at least 20 characters";
    }
    
    if (!formData.date) {
      errors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = "Event date cannot be in the past";
      }
    }
    
    if (!formData.location?.trim()) {
      errors.location = "Location is required";
    }
    
    if (!formData.image?.trim()) {
      errors.image = "Image URL is required";
    } else if (!isValidUrl(formData.image)) {
      errors.image = "Please enter a valid URL";
    }
    
    if (isNaN(formData.registrationFees.solo) || formData.registrationFees.solo < 0) {
      errors.price = "Solo registration fee must be a valid number";
    }
    
    if (isNaN(formData.registrationFees.team) || formData.registrationFees.team < 0) {
      errors.price = "Team registration fee must be a valid number";
    }
    
    if (formData.isTeamEvent && (formData.teamSize.max < 2 || formData.teamSize.max > 10)) {
      errors.maxTeamSize = "Team size must be between 2 and 10";
    }
    
    if (isNaN(formData.capacity) || formData.capacity < 1) {
      errors.capacity = "Capacity must be a valid number greater than 0";
    }
    
    // Check if registration fee is greater than 0 to require QR code and UPI ID
    const isPaid = formData.registrationFees.solo > 0 || formData.registrationFees.team > 0;
    
    if (isPaid && !formData.qrCode?.trim()) {
      errors.qrCode = "QR code is required for paid events";
    } else if (formData.qrCode && !isValidUrl(formData.qrCode)) {
      errors.qrCode = "Please enter a valid URL for QR code";
    }
    
    if (isPaid && !formData.upiId?.trim()) {
      errors.upiId = "UPI ID is required for paid events";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      location: event.location || '',
      eventType: event.eventType || 'competition',
      registrationFees: event.registrationFees || {
        solo: 0,
        team: 0
      },
      image: event.image || '',
      qrCode: event.qrCode || '',
      upiId: event.upiId || '',
      isTeamEvent: event.isTeamEvent || false,
      teamSize: event.teamSize || { min: 1, max: 1 },
      capacity: event.capacity || 50,
      prizes: event.prizes || { first: '', second: '', third: '', other: '' },
      rules: event.rules || [],
      requirements: event.requirements || [],
      aboutContent: event.aboutContent || '',
      detailsContent: event.detailsContent || '',
      coordinators: event.coordinators || [],
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      isActive: true
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (event: Event) => {
    setCurrentEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const createEvent = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      
      // Transform the frontend formData to match backend expectations
      const eventData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        qrCode: formData.qrCode,
        upiId: formData.upiId,
        eventType: formData.eventType,
        capacity: isNaN(formData.capacity) ? 50 : formData.capacity,
        registrationFees: {
          solo: isNaN(formData.registrationFees.solo) ? 0 : formData.registrationFees.solo,
          team: isNaN(formData.registrationFees.team) ? 0 : formData.registrationFees.team
        },
        isTeamEvent: formData.isTeamEvent,
        teamSize: {
          min: 1,
          max: formData.isTeamEvent ? 
            (isNaN(formData.teamSize.max) ? 1 : formData.teamSize.max) : 1
        },
        prizes: formData.prizes,
        rules: formData.rules,
        requirements: formData.requirements,
        aboutContent: formData.aboutContent,
        detailsContent: formData.detailsContent,
        coordinators: formData.coordinators,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isActive: true
      };
      
      await adminApi.post('/api/events', eventData);
      
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      
      setIsCreateDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event. Please check the form and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEvent = async () => {
    if (!currentEvent || !validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      
      // Transform the frontend formData to match backend expectations
      const eventData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        qrCode: formData.qrCode,
        upiId: formData.upiId,
        eventType: formData.eventType,
        capacity: isNaN(formData.capacity) ? 50 : formData.capacity,
        registrationFees: {
          solo: isNaN(formData.registrationFees.solo) ? 0 : formData.registrationFees.solo,
          team: isNaN(formData.registrationFees.team) ? 0 : formData.registrationFees.team
        },
        isTeamEvent: formData.isTeamEvent,
        teamSize: {
          min: 1,
          max: formData.isTeamEvent ? 
            (isNaN(formData.teamSize.max) ? 1 : formData.teamSize.max) : 1
        },
        prizes: formData.prizes,
        rules: formData.rules,
        requirements: formData.requirements,
        aboutContent: formData.aboutContent,
        detailsContent: formData.detailsContent,
        coordinators: formData.coordinators,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isActive: true
      };
      
      await adminApi.put(`/api/events/${currentEvent._id}`, eventData);
      
      toast({
        title: "Success",
        description: "Event updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event. Please check the form and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEvent = async () => {
    if (!currentEvent) return;
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      
      await adminApi.delete(`/api/events/${currentEvent._id}`);
      
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvents = events.filter(event => 
    (event.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (event.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (event.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (event.eventType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Events Management</h1>
              <p className="text-gray-600 font-medium mt-1">Create and manage events for the Technical Symposium</p>
            </div>
            <Button 
              onClick={openCreateDialog} 
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus size={16} className="mr-2" /> Add New Event
            </Button>
          </div>
          
          <div className="mb-6 flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search events by name, description, location..."
                className="pl-10 bg-white border-gray-200 text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span>Total: {events.length} events</span>
              {searchTerm && <span>• Found: {filteredEvents.length} results</span>}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-bold text-gray-800">Name</th>
                    <th className="p-4 font-bold text-gray-800">Category</th>
                    <th className="p-4 font-bold text-gray-800">Date</th>
                    <th className="p-4 font-bold text-gray-800">Location</th>
                    <th className="p-4 font-bold text-gray-800">Price</th>
                    <th className="p-4 font-bold text-gray-800">QR Code</th>
                    <th className="p-4 font-bold text-gray-800">Team Event</th>
                    <th className="p-4 text-right font-bold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <tr key={event._id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded bg-center bg-cover mr-3 border border-gray-200"
                              style={{ backgroundImage: `url(${event.image || '/placeholder-event.jpg'})` }}
                            ></div>
                            <div>
                              <div className="font-bold text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-600 truncate max-w-xs font-medium">
                                {event.description?.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            className={event.eventType === 'competition' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-green-100 text-green-800 font-medium'}
                          >
                            {event.eventType === 'competition' ? (
                              <Monitor size={14} className="mr-1" />
                            ) : (
                              <Wrench size={14} className="mr-1" />
                            )}
                            {event.eventType}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center font-medium text-gray-800">
                            <Calendar size={14} className="mr-2 text-gray-500" />
                            {event.date ? new Date(event.date).toLocaleDateString() : 'Not set'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center font-medium text-gray-800">
                            <MapPin size={14} className="mr-2 text-gray-500" />
                            {event.location}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center font-medium text-gray-800">
                            <DollarSign size={14} className="mr-1 text-gray-500" />
                            {event.registrationFees.solo === 0 ? 'Free' : `₹${event.registrationFees.solo}`}
                          </div>
                        </td>
                        <td className="p-4">
                          {event.qrCode ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center text-green-700 font-medium cursor-pointer">
                                    <CheckCircle size={14} className="mr-1" />
                                    <span>Available</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="p-1">
                                    <img 
                                      src={event.qrCode} 
                                      alt="Payment QR" 
                                      className="w-32 h-32 object-contain"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://via.placeholder.com/200x200?text=Invalid+QR";
                                      }}
                                    />
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <div className={event.registrationFees.solo > 0 ? "text-red-500 font-medium" : "text-gray-700 font-medium"}>
                              {event.registrationFees.solo > 0 ? "Missing" : "Not needed"}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {event.isTeamEvent ? (
                            <div className="flex items-center text-green-700 font-medium">
                              <Users size={14} className="mr-1" />
                              Yes (Max: {event.teamSize?.max || 1})
                            </div>
                          ) : (
                            <div className="text-gray-700 font-medium">No</div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-500 text-blue-500 hover:bg-blue-950"
                                    onClick={() => openEditDialog(event)}
                                  >
                                    <Edit2 size={14} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Event</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-500 text-red-500 hover:bg-red-950"
                                    onClick={() => openDeleteDialog(event)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Event</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center py-6">
                          <Info size={40} className="text-gray-500 mb-2" />
                          <p className="text-lg mb-1">No events found</p>
                          <p className="text-sm text-gray-500">
                            {searchTerm ? "Try changing your search terms" : "Create a new event to get started"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      
      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the details below to create a new event.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={formTab} onValueChange={setFormTab} className="mt-4">
            <TabsList className="grid grid-cols-5 bg-gray-700 p-1 rounded-md mb-4">
              <TabsTrigger value="basic" className="data-[state=active]:bg-gray-600">
                <FileText size={14} className="mr-1" /> Basic Info
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-gray-600">
                <Info size={14} className="mr-1" /> About
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-gray-600">
                <Calendar size={14} className="mr-1" /> Details
              </TabsTrigger>
              <TabsTrigger value="rules" className="data-[state=active]:bg-gray-600">
                <ListChecks size={14} className="mr-1" /> Rules
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-gray-600">
                <Phone size={14} className="mr-1" /> Contact
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="basic" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name" className="flex items-center justify-between">
                    Event Name
                    {formErrors.name && (
                      <span className="text-red-400 text-xs">{formErrors.name}</span>
                    )}
                  </Label>
                  <Input
                    id="name"
                    name="title"
                    placeholder="Enter event name"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.name ? 'border-red-400' : ''}`}
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="description" className="flex items-center justify-between">
                    Short Description
                    {formErrors.description && (
                      <span className="text-red-400 text-xs">{formErrors.description}</span>
                    )}
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter a brief description for event listings"
                    className={`bg-gray-700 border-gray-600 mt-1 min-h-[100px] ${formErrors.description ? 'border-red-400' : ''}`}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="date" className="flex items-center justify-between">
                    Date
                    {formErrors.date && (
                      <span className="text-red-400 text-xs">{formErrors.date}</span>
                    )}
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.date ? 'border-red-400' : ''}`}
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="flex items-center justify-between">
                    Location
                    {formErrors.location && (
                      <span className="text-red-400 text-xs">{formErrors.location}</span>
                    )}
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter event location"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.location ? 'border-red-400' : ''}`}
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventType">Category</Label>
                  <Select 
                    value={formData.eventType} 
                    onValueChange={(value) => handleSelectChange('eventType', value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="nontechnical">Non Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="registrationFee-solo" className="flex items-center justify-between">
                      Solo Registration Fee (₹)
                      {formErrors.price && (
                        <span className="text-red-400 text-xs">{formErrors.price}</span>
                      )}
                    </Label>
                    <Input
                      id="registrationFee-solo"
                      name="registrationFees.solo"
                      type="number"
                      min="0"
                      className="bg-gray-700 border-gray-600 mt-1"
                      value={isNaN(formData.registrationFees.solo) ? '' : formData.registrationFees.solo}
                      onChange={(e) => {
                        const { value } = e.target;
                        const parsedValue = value === '' ? 0 : parseInt(value, 10);
                        setFormData(prev => ({
                          ...prev,
                          registrationFees: {
                            ...prev.registrationFees,
                            solo: isNaN(parsedValue) ? 0 : parsedValue
                          }
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="registrationFee-team" className="flex items-center justify-between">
                      Team Registration Fee (₹)
                    </Label>
                    <Input
                      id="registrationFee-team"
                      name="registrationFees.team"
                      type="number"
                      min="0"
                      className="bg-gray-700 border-gray-600 mt-1"
                      value={isNaN(formData.registrationFees.team) ? '' : formData.registrationFees.team}
                      onChange={(e) => {
                        const { value } = e.target;
                        const parsedValue = value === '' ? 0 : parseInt(value, 10);
                        setFormData(prev => ({
                          ...prev,
                          registrationFees: {
                            ...prev.registrationFees,
                            team: isNaN(parsedValue) ? 0 : parsedValue
                          }
                        }));
                      }}
                    />
                  </div>
                </div>
                
                {(formData.registrationFees.solo > 0 || formData.registrationFees.team > 0) && (
                  <div className="col-span-2">
                    <Label htmlFor="qrCode" className="flex items-center justify-between">
                      Payment QR Code URL
                      {formErrors.qrCode && (
                        <span className="text-red-400 text-xs">{formErrors.qrCode}</span>
                      )}
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="qrCode"
                        name="qrCode"
                        placeholder="Enter payment QR code URL"
                        className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.qrCode ? 'border-red-400' : ''}`}
                        value={formData.qrCode}
                        onChange={handleInputChange}
                      />
                      {formData.qrCode && (
                        <div className="flex items-center justify-center border border-gray-600 rounded-md p-2 bg-gray-900">
                          <img 
                            src={formData.qrCode} 
                            alt="Payment QR Code Preview" 
                            className="max-h-24 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/200x200?text=Invalid+QR";
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-1">QR code is required for paid events</p>
                  </div>
                )}
                
                {(formData.registrationFees.solo > 0 || formData.registrationFees.team > 0) && (
                  <div className="col-span-2">
                    <Label htmlFor="upiId" className="flex items-center justify-between">
                      UPI ID
                      {formErrors.upiId && (
                        <span className="text-red-400 text-xs">{formErrors.upiId}</span>
                      )}
                    </Label>
                    <Input
                      id="upiId"
                      name="upiId"
                      placeholder="Enter UPI ID (e.g., username@bankname)"
                      className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.upiId ? 'border-red-400' : ''}`}
                      value={formData.upiId}
                      onChange={handleInputChange}
                    />
                    <p className="text-gray-400 text-xs mt-1">UPI ID is required for paid events</p>
                  </div>
                )}
                
                <div className="col-span-2">
                  <Label htmlFor="image" className="flex items-center justify-between">
                    Image URL
                    {formErrors.image && (
                      <span className="text-red-400 text-xs">{formErrors.image}</span>
                    )}
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    placeholder="Enter image URL"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.image ? 'border-red-400' : ''}`}
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isTeamEvent"
                    name="isTeamEvent"
                    checked={formData.isTeamEvent}
                    onChange={handleCheckboxChange}
                    className="rounded text-amber-600 bg-gray-700 border-gray-500"
                  />
                  <Label htmlFor="isTeamEvent">Team Event</Label>
                </div>
                
                {formData.isTeamEvent && (
                  <div>
                    <Label htmlFor="maxTeamSize" className="flex items-center justify-between">
                      Max Team Size
                      {formErrors.maxTeamSize && (
                        <span className="text-red-400 text-xs">{formErrors.maxTeamSize}</span>
                      )}
                    </Label>
                    <Input
                      id="maxTeamSize"
                      name="teamSize.max"
                      type="number"
                      min="2"
                      max="10"
                      className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.maxTeamSize ? 'border-red-400' : ''}`}
                      value={isNaN(formData.teamSize.max) ? '' : formData.teamSize.max}
                      onChange={(e) => {
                        const { value } = e.target;
                        const parsedValue = value === '' ? 1 : parseInt(value, 10);
                        setFormData(prev => ({
                          ...prev,
                          teamSize: {
                            ...prev.teamSize,
                            max: isNaN(parsedValue) ? 1 : parsedValue
                          }
                        }));
                      }}
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="capacity" className="flex items-center justify-between">
                    Capacity
                    {formErrors.capacity && (
                      <span className="text-red-400 text-xs">{formErrors.capacity}</span>
                    )}
                  </Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.capacity ? 'border-red-400' : ''}`}
                    value={isNaN(formData.capacity) ? '' : formData.capacity}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="space-y-4 mt-2">
              <div>
                <Label htmlFor="aboutContent" className="text-lg font-semibold mb-2 block">
                  About Content
                </Label>
                <p className="text-gray-400 text-sm mb-4">
                  Provide detailed information about the event, its purpose, and what participants can expect.
                </p>
                <Textarea
                  id="aboutContent"
                  name="aboutContent"
                  placeholder="Enter detailed about information for the event"
                  className="bg-gray-700 border-gray-600 min-h-[250px] w-full"
                  value={formData.aboutContent}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    className="bg-gray-700 border-gray-600 mt-1"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    className="bg-gray-700 border-gray-600 mt-1"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="detailsContent" className="text-lg font-semibold mb-2 block">
                  Additional Details
                </Label>
                <p className="text-gray-400 text-sm mb-4">
                  Provide any additional information specific to this event, such as format, schedule, or requirements.
                </p>
                <Textarea
                  id="detailsContent"
                  name="detailsContent"
                  placeholder="Enter additional details for the event"
                  className="bg-gray-700 border-gray-600 min-h-[200px] w-full"
                  value={formData.detailsContent}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="rules" className="space-y-4 mt-2">
              <div>
                <Label className="text-lg font-semibold mb-2 block">
                  Event Rules
                </Label>
                <p className="text-gray-400 text-sm mb-4">
                  Add rules for your event. Click the "Add Rule" button to add a new rule.
                </p>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto p-2">
                  {formData.rules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={rule}
                        onChange={(e) => {
                          const newRules = [...formData.rules];
                          newRules[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            rules: newRules
                          }));
                        }}
                        className="bg-gray-700 border-gray-600 flex-grow"
                        placeholder={`Rule ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="border-gray-600"
                        onClick={() => {
                          const newRules = formData.rules.filter((_, i) => i !== index);
                          setFormData(prev => ({
                            ...prev,
                            rules: newRules
                          }));
                        }}
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
                    </div>
                  ))}
                  
                  {formData.rules.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No rules added yet
                    </div>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 border-amber-500 text-amber-500 hover:bg-amber-500/10"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      rules: [...prev.rules, '']
                    }));
                  }}
                >
                  <Plus size={16} className="mr-2" /> Add Rule
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4 mt-2">
              <div>
                <Label className="text-lg font-semibold mb-2 block">
                  Event Coordinators
                </Label>
                <p className="text-gray-400 text-sm mb-4">
                  Add contact persons for this event. Click the "Add Coordinator" button to add a new contact.
                </p>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
                  {formData.coordinators && formData.coordinators.map((coordinator, index) => (
                    <div key={index} className="p-4 bg-gray-700/50 rounded-md relative">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 border-gray-600 h-7 w-7"
                        onClick={() => {
                          const newCoordinators = formData.coordinators.filter((_, i) => i !== index);
                          setFormData(prev => ({
                            ...prev,
                            coordinators: newCoordinators
                          }));
                        }}
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                          <Label htmlFor={`coordinator-${index}-name`}>Name</Label>
                          <Input
                            id={`coordinator-${index}-name`}
                            value={coordinator.name}
                            onChange={(e) => {
                              const newCoordinators = [...formData.coordinators];
                              newCoordinators[index] = {
                                ...newCoordinators[index],
                                name: e.target.value
                              };
                              setFormData(prev => ({
                                ...prev,
                                coordinators: newCoordinators
                              }));
                            }}
                            className="bg-gray-700 border-gray-600 mt-1"
                            placeholder="Enter name"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`coordinator-${index}-contact`}>Contact Number</Label>
                          <Input
                            id={`coordinator-${index}-contact`}
                            value={coordinator.contact}
                            onChange={(e) => {
                              const newCoordinators = [...formData.coordinators];
                              newCoordinators[index] = {
                                ...newCoordinators[index],
                                contact: e.target.value
                              };
                              setFormData(prev => ({
                                ...prev,
                                coordinators: newCoordinators
                              }));
                            }}
                            className="bg-gray-700 border-gray-600 mt-1"
                            placeholder="Enter contact number"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor={`coordinator-${index}-email`}>Email (Optional)</Label>
                          <Input
                            id={`coordinator-${index}-email`}
                            value={coordinator.email || ''}
                            onChange={(e) => {
                              const newCoordinators = [...formData.coordinators];
                              newCoordinators[index] = {
                                ...newCoordinators[index],
                                email: e.target.value
                              };
                              setFormData(prev => ({
                                ...prev,
                                coordinators: newCoordinators
                              }));
                            }}
                            className="bg-gray-700 border-gray-600 mt-1"
                            placeholder="Enter email"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.coordinators || formData.coordinators.length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      No coordinators added yet
                    </div>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 border-amber-500 text-amber-500 hover:bg-amber-500/10"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      coordinators: [...(prev.coordinators || []), { name: '', contact: '', email: '' }]
                    }));
                  }}
                >
                  <Plus size={16} className="mr-2" /> Add Coordinator
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={createEvent}
              className="bg-amber-600 hover:bg-amber-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the event details below.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={formTab} onValueChange={setFormTab} className="mt-4">
            <TabsList className="grid grid-cols-5 bg-gray-700 p-1 rounded-md mb-4">
              <TabsTrigger value="basic" className="data-[state=active]:bg-gray-600">
                <FileText size={14} className="mr-1" /> Basic Info
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-gray-600">
                <Info size={14} className="mr-1" /> About
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-gray-600">
                <Calendar size={14} className="mr-1" /> Details
              </TabsTrigger>
              <TabsTrigger value="rules" className="data-[state=active]:bg-gray-600">
                <ListChecks size={14} className="mr-1" /> Rules
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-gray-600">
                <Phone size={14} className="mr-1" /> Contact
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-name" className="flex items-center justify-between">
                    Event Name
                    {formErrors.name && (
                      <span className="text-red-400 text-xs">{formErrors.name}</span>
                    )}
                  </Label>
                  <Input
                    id="edit-name"
                    name="title"
                    placeholder="Enter event name"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.name ? 'border-red-400' : ''}`}
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="edit-description" className="flex items-center justify-between">
                    Short Description
                    {formErrors.description && (
                      <span className="text-red-400 text-xs">{formErrors.description}</span>
                    )}
                  </Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    placeholder="Enter a brief description for event listings"
                    className={`bg-gray-700 border-gray-600 mt-1 min-h-[100px] ${formErrors.description ? 'border-red-400' : ''}`}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-date" className="flex items-center justify-between">
                    Date
                    {formErrors.date && (
                      <span className="text-red-400 text-xs">{formErrors.date}</span>
                    )}
                  </Label>
                  <Input
                    id="edit-date"
                    name="date"
                    type="date"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.date ? 'border-red-400' : ''}`}
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-location" className="flex items-center justify-between">
                    Location
                    {formErrors.location && (
                      <span className="text-red-400 text-xs">{formErrors.location}</span>
                    )}
                  </Label>
                  <Input
                    id="edit-location"
                    name="location"
                    placeholder="Enter event location"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.location ? 'border-red-400' : ''}`}
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={formData.eventType} 
                    onValueChange={(value) => handleSelectChange('eventType', value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="nontechnical">Non Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="edit-image" className="flex items-center justify-between">
                    Image URL
                    {formErrors.image && (
                      <span className="text-red-400 text-xs">{formErrors.image}</span>
                    )}
                  </Label>
                  <Input
                    id="edit-image"
                    name="image"
                    placeholder="Enter image URL"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.image ? 'border-red-400' : ''}`}
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-isTeamEvent"
                    name="isTeamEvent"
                    checked={formData.isTeamEvent}
                    onChange={handleCheckboxChange}
                    className="rounded text-amber-600 bg-gray-700 border-gray-500"
                  />
                  <Label htmlFor="edit-isTeamEvent">Team Event</Label>
                </div>
                
                {formData.isTeamEvent && (
                  <div>
                    <Label htmlFor="edit-maxTeamSize" className="flex items-center justify-between">
                      Max Team Size
                      {formErrors.maxTeamSize && (
                        <span className="text-red-400 text-xs">{formErrors.maxTeamSize}</span>
                      )}
                    </Label>
                    <Input
                      id="edit-maxTeamSize"
                      name="teamSize.max"
                      type="number"
                      min="2"
                      max="10"
                      className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.maxTeamSize ? 'border-red-400' : ''}`}
                      value={isNaN(formData.teamSize.max) ? '' : formData.teamSize.max}
                      onChange={(e) => {
                        const { value } = e.target;
                        const parsedValue = value === '' ? 1 : parseInt(value, 10);
                        setFormData(prev => ({
                          ...prev,
                          teamSize: {
                            ...prev.teamSize,
                            max: isNaN(parsedValue) ? 1 : parsedValue
                          }
                        }));
                      }}
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="edit-capacity" className="flex items-center justify-between">
                    Capacity
                    {formErrors.capacity && (
                      <span className="text-red-400 text-xs">{formErrors.capacity}</span>
                    )}
                  </Label>
                  <Input
                    id="edit-capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    className={`bg-gray-700 border-gray-600 mt-1 ${formErrors.capacity ? 'border-red-400' : ''}`}
                    value={isNaN(formData.capacity) ? '' : formData.capacity}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="about">
              <div>
                <Label htmlFor="edit-aboutContent" className="text-lg font-semibold mb-2 block">
                  About Content
                </Label>
                <p className="text-gray-400 text-sm mb-4">
                  Provide detailed information about the event, its purpose, and what participants can expect.
                </p>
                <Textarea
                  id="edit-aboutContent"
                  name="aboutContent"
                  placeholder="Enter detailed about information for the event"
                  className="bg-gray-700 border-gray-600 min-h-[250px] w-full"
                  value={formData.aboutContent}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="edit-startTime">Start Time</Label>
                  <Input
                    id="edit-startTime"
                    name="startTime"
                    type="time"
                    className="bg-gray-700 border-gray-600 mt-1"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endTime">End Time</Label>
                  <Input
                    id="edit-endTime"
                    name="endTime"
                    type="time"
                    className="bg-gray-700 border-gray-600 mt-1"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-detailsContent" className="text-lg font-semibold mb-2 block">
                  Additional Details
                </Label>
                <p className="text-gray-400 text-sm mb-4">
                  Provide any additional information specific to this event, such as format, schedule, or requirements.
                </p>
                <Textarea
                  id="edit-detailsContent"
                  name="detailsContent"
                  placeholder="Enter additional details for the event"
                  className="bg-gray-700 border-gray-600 min-h-[200px] w-full"
                  value={formData.detailsContent}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="rules">
              <div>
                <Label className="text-lg font-semibold mb-2 block">
                  Event Rules
                </Label>
                <p className="text-gray-400 text-sm mb-4">
                  Add rules for your event. Click the "Add Rule" button to add a new rule.
                </p>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto p-2">
                  {formData.rules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={rule}
                        onChange={(e) => {
                          const newRules = [...formData.rules];
                          newRules[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            rules: newRules
                          }));
                        }}
                        className="bg-gray-700 border-gray-600 flex-grow"
                        placeholder={`Rule ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="border-gray-600"
                        onClick={() => {
                          const newRules = formData.rules.filter((_, i) => i !== index);
                          setFormData(prev => ({
                            ...prev,
                            rules: newRules
                          }));
                        }}
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
                    </div>
                  ))}
                  
                  {formData.rules.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No rules added yet
                    </div>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 border-amber-500 text-amber-500 hover:bg-amber-500/10"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      rules: [...prev.rules, '']
                    }));
                  }}
                >
                  <Plus size={16} className="mr-2" /> Add Rule
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="contact">
              <div>
                <Label className="text-lg font-semibold mb-2 block">
                  Event Coordinators
                </Label>
                <p className="text-gray-400 text-sm mb-4">
                  Add contact persons for this event. Click the "Add Coordinator" button to add a new contact.
                </p>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
                  {formData.coordinators && formData.coordinators.map((coordinator, index) => (
                    <div key={index} className="p-4 bg-gray-700/50 rounded-md relative">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 border-gray-600 h-7 w-7"
                        onClick={() => {
                          const newCoordinators = formData.coordinators.filter((_, i) => i !== index);
                          setFormData(prev => ({
                            ...prev,
                            coordinators: newCoordinators
                          }));
                        }}
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                          <Label htmlFor={`edit-coordinator-${index}-name`}>Name</Label>
                          <Input
                            id={`edit-coordinator-${index}-name`}
                            value={coordinator.name}
                            onChange={(e) => {
                              const newCoordinators = [...formData.coordinators];
                              newCoordinators[index] = {
                                ...newCoordinators[index],
                                name: e.target.value
                              };
                              setFormData(prev => ({
                                ...prev,
                                coordinators: newCoordinators
                              }));
                            }}
                            className="bg-gray-700 border-gray-600 mt-1"
                            placeholder="Enter name"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-coordinator-${index}-contact`}>Contact Number</Label>
                          <Input
                            id={`edit-coordinator-${index}-contact`}
                            value={coordinator.contact}
                            onChange={(e) => {
                              const newCoordinators = [...formData.coordinators];
                              newCoordinators[index] = {
                                ...newCoordinators[index],
                                contact: e.target.value
                              };
                              setFormData(prev => ({
                                ...prev,
                                coordinators: newCoordinators
                              }));
                            }}
                            className="bg-gray-700 border-gray-600 mt-1"
                            placeholder="Enter contact number"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor={`edit-coordinator-${index}-email`}>Email (Optional)</Label>
                          <Input
                            id={`edit-coordinator-${index}-email`}
                            value={coordinator.email || ''}
                            onChange={(e) => {
                              const newCoordinators = [...formData.coordinators];
                              newCoordinators[index] = {
                                ...newCoordinators[index],
                                email: e.target.value
                              };
                              setFormData(prev => ({
                                ...prev,
                                coordinators: newCoordinators
                              }));
                            }}
                            className="bg-gray-700 border-gray-600 mt-1"
                            placeholder="Enter email"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.coordinators || formData.coordinators.length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      No coordinators added yet
                    </div>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 border-amber-500 text-amber-500 hover:bg-amber-500/10"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      coordinators: [...(prev.coordinators || []), { name: '', contact: '', email: '' }]
                    }));
                  }}
                >
                  <Plus size={16} className="mr-2" /> Add Coordinator
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={updateEvent}
              className="bg-amber-600 hover:bg-amber-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Updating...
                </>
              ) : (
                'Update Event'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Event Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Event</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentEvent && (
            <div className="py-4 bg-gray-750 rounded-md p-4 border border-gray-700">
              <p className="font-medium text-lg">{currentEvent.title}</p>
              <div className="flex items-center text-gray-400 mt-2">
                <Calendar size={14} className="mr-2" />
                <span>{currentEvent.date ? new Date(currentEvent.date).toLocaleDateString() : 'No date'}</span>
                <span className="mx-2">•</span>
                <MapPin size={14} className="mr-2" />
                <span>{currentEvent.location}</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={deleteEvent}
              variant="destructive"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : (
                'Delete Event'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents; 