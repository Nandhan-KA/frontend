import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicApi, api } from '../services/api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload, PlusCircle, MinusCircle, AlertCircle, CheckCircle } from 'lucide-react';
// Adding a module declaration for react-confetti
import Confetti from 'react-confetti';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Define interface for Event
interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  image: string;
  location: string;
  registrationFee: number;
  isTeamEvent: boolean;
  teamSize: {
    min: number;
    max: number;
  };
  capacity: number;
  isActive: boolean;
  date?: string;
  qrCode?: string;
  upiId?: string;
}

// Define schema for team member
const teamMemberSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  college: z.string().min(2, { message: 'College name is required' }),
});

// Define schema for registration form
const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  college: z.string().min(2, { message: 'College name is required' }),
  department: z.string().min(2, { message: 'Department is required' }),
  year: z.string().min(1, { message: 'Year is required' }),
  teamName: z.string().optional(),
  teamMembers: z.array(teamMemberSchema).optional(),
  transactionId: z.string().min(4, { message: 'Transaction ID is required' }),
  paymentScreenshot: z.any().optional(),
  additionalInfo: z.string().optional(),
});

// Define component
const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("details");
  const [loggedIn, setLoggedIn] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>({
    paymentQrCode: '',
    upiId: 'organizers@techshethra'
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Setup form with zod validation
  const { register, control, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      teamMembers: [],
    }
  });

  // Watch form values
  const teamMembers = watch('teamMembers');

  // Update window dimensions when window resizes for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check login status and fetch event details on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('studentToken');
      const info = localStorage.getItem('studentInfo');
      
      if (!token || !info) {
        setLoggedIn(false);
        return { isLoggedIn: false };
      }
      
      try {
        const parsedInfo = JSON.parse(info);
        setLoggedIn(true);
        setStudentInfo(parsedInfo);
        return { isLoggedIn: true, info: parsedInfo, token };
      } catch (e) {
        console.error("Error parsing student info:", e);
        setLoggedIn(false);
        return { isLoggedIn: false };
      }
    };

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get(`/api/events/${eventId}`);
        setEvent(response.data);
        
        // Just check login status without auto-filling
        const loginStatus = checkLoginStatus();
        if (loginStatus.isLoggedIn && loginStatus.info) {
          // Initialize empty team members array if it's a team event
          if (response.data.isTeamEvent) {
            setValue('teamMembers', [{ name: '', email: '', phone: '', college: '' }]);
          }
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSiteSettings = async () => {
      try {
        const response = await publicApi.get('/api/admin/settings/public');
        setSiteSettings(response.data);
      } catch (err) {
        console.error('Error fetching site settings:', err);
        // Continue with default values if settings can't be fetched
      }
    };

    const fetchPreviousTeammates = async () => {
      // This function is now empty as we've removed account fetching
    };

    fetchEventDetails();
    fetchSiteSettings();
    // fetchPreviousTeammates(); // Removed as it's no longer necessary
  }, [eventId, setValue, loggedIn]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setValue('paymentScreenshot', file);
  };

  // Add team member
  const addTeamMember = () => {
    if (!event) return;
    
    const currentTeamMembers = watch('teamMembers') || [];
    if (currentTeamMembers.length >= (event.teamSize.max - 1)) {
      toast({
        title: "Maximum team size reached",
        description: `You can only add up to ${event.teamSize.max - 1} team members.`,
      });
      return;
    }
    
    // Try to fill with saved teammate information if available
    const savedTeammatesString = localStorage.getItem('savedTeammates');
    let newTeamMember = { name: '', email: '', phone: '', college: '' };
    
    if (savedTeammatesString) {
      try {
        const savedTeammates = JSON.parse(savedTeammatesString);
        if (Array.isArray(savedTeammates) && savedTeammates.length > currentTeamMembers.length) {
          newTeamMember = savedTeammates[currentTeamMembers.length];
        }
      } catch (e) {
        console.error('Error parsing saved teammates:', e);
      }
    }
    
    setValue('teamMembers', [
      ...currentTeamMembers,
      newTeamMember
    ]);
  };

  // Remove team member
  const removeTeamMember = (index: number) => {
    const currentTeamMembers = watch('teamMembers') || [];
    setValue('teamMembers', currentTeamMembers.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    if (!event) return;
    
    // Check login status
    if (!loggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to register for this event",
        variant: "destructive"
      });
      navigate('/student/login', { state: { redirectTo: `/event-register/${eventId}` } });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Save team members for future registrations
      if (data.teamMembers && data.teamMembers.length > 0) {
        localStorage.setItem('savedTeammates', JSON.stringify(data.teamMembers));
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('eventId', eventId!);
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('college', data.college);
      formData.append('department', data.department);
      formData.append('year', data.year);
      
      if (data.teamName) {
        formData.append('teamName', data.teamName);
      }
      
      if (data.teamMembers && data.teamMembers.length > 0) {
        formData.append('teamMembers', JSON.stringify(data.teamMembers));
      }
      
      formData.append('transactionId', data.transactionId);
      
      if (data.paymentScreenshot) {
        formData.append('paymentScreenshot', data.paymentScreenshot as File);
      }
      
      if (data.additionalInfo) {
        formData.append('additionalInfo', data.additionalInfo);
      }
      
      // Get token
      const token = localStorage.getItem('studentToken');
      
      // Submit registration
      const response = await api.post(
        '/api/students/events/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
          }
        }
      );
      
      // Show confetti for 5 seconds
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      toast({
        title: "Registration Successful",
        description: "Your registration has been submitted successfully!",
      });
      
      // Delay the redirect to show confetti
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 3000);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      toast({
        title: "Registration Failed",
        description: err.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e10] text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold mr-2" />
        <p className="text-lg">Loading event details...</p>
      </div>
    );
  }

  // Render error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0e0e10] text-white flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Event</h1>
        <p className="text-gray-400 mb-4">{error || "Event not found"}</p>
        <Button onClick={() => navigate('/')} className="btn-gold rounded-full">Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Confetti effect when registration is successful */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={true}
          numberOfPieces={500}
          gravity={0.3}
          colors={['#FFD700', '#FF4500', '#FFA500', '#FF6347', '#FF8C00', '#FFFFFF']}
        />
      )}
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Event Details Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4 hover:border-gold hover:text-gold transition-colors">
            &larr; Back
          </Button>
          
          <div className="grid sm:grid-cols-[250px,1fr] gap-6">
            <div className="relative h-[200px] sm:h-[250px] rounded-xl overflow-hidden group">
              <img
                src={event.image || 'https://images.unsplash.com/photo-1485163819542-13adeb5e0068?auto=format&fit=crop&w=800&q=80'}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
            
            <div>
              <div className="mb-2">
                <span className="text-xs font-medium bg-gold/20 text-gold px-2 py-1 rounded-full">
                  {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                </span>
                {event.isTeamEvent && (
                  <span className="ml-2 text-xs font-medium bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
                    Team Event (Max: {event.teamSize.max} members)
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-orbitron font-bold mb-2 text-gold animate-text-glow">{event.title}</h1>
              
              <div className="text-gray-300 space-y-1 mb-4">
                {event.date && (
                  <div>
                    <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
                <div>
                  <span className="font-medium">Location:</span> {event.location}
                </div>
                <div>
                  <span className="font-medium">Registration Fee:</span> {event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee}`}
                </div>
                <div>
                  <span className="font-medium">Capacity:</span> {event.capacity} participants
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                <p className="text-gray-300">{event.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Registration Form */}
        <Card className="bg-black/50 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-gold">Registration Form</CardTitle>
            <CardDescription className="text-gray-400">
              Fill out the form below to register for {event.title}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-gray-900/50 border border-gray-800">
                <TabsTrigger value="details" className="data-[state=active]:bg-gold data-[state=active]:text-black">Personal Details</TabsTrigger>
                {event.isTeamEvent && <TabsTrigger value="team" className="data-[state=active]:bg-gold data-[state=active]:text-black">Team Details</TabsTrigger>}
                <TabsTrigger value="payment" className="data-[state=active]:bg-gold data-[state=active]:text-black">Payment</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <TabsContent value="details">
                  <div className="space-y-6">
                    {!loggedIn && (
                      <Alert variant="destructive" className="mb-4 border-red-600 bg-red-950/50 backdrop-blur-sm">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Login Required</AlertTitle>
                        <AlertDescription>
                          You need to login before registering for an event.
                          <Button 
                            variant="outline" 
                            className="ml-2 mt-2 border-gold text-gold hover:bg-gold/10" 
                            onClick={() => navigate('/student/login', { state: { redirectTo: `/event-register/${eventId}` } })}
                          >
                            Login Now
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name" className="text-gold">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-gold">Email <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-gold">Phone Number <span className="text-red-500">*</span></Label>
                        <Input
                          id="phone"
                          className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="college" className="text-gold">College/University <span className="text-red-500">*</span></Label>
                        <Input
                          id="college"
                          className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                          {...register('college')}
                        />
                        {errors.college && (
                          <p className="text-red-500 text-sm mt-1">{errors.college.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="department" className="text-gold">Department <span className="text-red-500">*</span></Label>
                        <Input
                          id="department"
                          className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                          {...register('department')}
                        />
                        {errors.department && (
                          <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="year" className="text-gold">Year of Study <span className="text-red-500">*</span></Label>
                        <select
                          id="year"
                          className="w-full h-10 px-3 py-2 bg-black/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-100 mt-1"
                          {...register('year')}
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="5">5th Year</option>
                          <option value="Others">Others</option>
                        </select>
                        {errors.year && (
                          <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => setCurrentTab(event.isTeamEvent ? "team" : "payment")}
                        className="btn-gold rounded-full hover:animate-pulse-glow"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {event.isTeamEvent && (
                  <TabsContent value="team">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="teamName" className="text-gold">Team Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="teamName"
                          className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                          {...register('teamName')}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-gold font-orbitron text-lg">Team Members</Label>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={addTeamMember}
                            className="flex items-center border-gold text-gold hover:bg-gold/10"
                          >
                            <PlusCircle className="h-4 w-4 mr-1" /> Add Member
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {teamMembers?.map((_, index) => (
                            <div key={index} className="p-5 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800 shadow-lg hover:border-gold/50 transition-all">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium text-gold font-orbitron">Team Member {index + 1}</h4>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeTeamMember(index)}
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor={`teamMembers.${index}.name`} className="text-gray-300">Name <span className="text-red-500">*</span></Label>
                                  <Input
                                    id={`teamMembers.${index}.name`}
                                    className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                                    {...register(`teamMembers.${index}.name` as const)}
                                  />
                                  {errors.teamMembers?.[index]?.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.teamMembers[index]?.name?.message}</p>
                                  )}
                                </div>
                                
                                <div>
                                  <Label htmlFor={`teamMembers.${index}.email`} className="text-gray-300">Email <span className="text-red-500">*</span></Label>
                                  <Input
                                    id={`teamMembers.${index}.email`}
                                    type="email"
                                    className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                                    {...register(`teamMembers.${index}.email` as const)}
                                  />
                                  {errors.teamMembers?.[index]?.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.teamMembers[index]?.email?.message}</p>
                                  )}
                                </div>
                                
                                <div>
                                  <Label htmlFor={`teamMembers.${index}.phone`} className="text-gray-300">Phone <span className="text-red-500">*</span></Label>
                                  <Input
                                    id={`teamMembers.${index}.phone`}
                                    className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                                    {...register(`teamMembers.${index}.phone` as const)}
                                  />
                                  {errors.teamMembers?.[index]?.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.teamMembers[index]?.phone?.message}</p>
                                  )}
                                </div>
                                
                                <div>
                                  <Label htmlFor={`teamMembers.${index}.college`} className="text-gray-300">College <span className="text-red-500">*</span></Label>
                                  <Input
                                    id={`teamMembers.${index}.college`}
                                    className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                                    {...register(`teamMembers.${index}.college` as const)}
                                  />
                                  {errors.teamMembers?.[index]?.college && (
                                    <p className="text-red-500 text-sm mt-1">{errors.teamMembers[index]?.college?.message}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCurrentTab("details")}
                          className="border-gray-700 hover:border-gold hover:text-gold"
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => setCurrentTab("payment")}
                          className="btn-gold rounded-full hover:animate-pulse-glow"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                )}
                
                <TabsContent value="payment">
                  <div className="space-y-6">
                    {event.registrationFee > 0 ? (
                      <>
                        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg mb-6">
                          <h3 className="text-xl font-orbitron font-bold mb-4 text-gold">Payment Information</h3>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-gray-400">Event Fee:</div>
                              <div className="font-medium text-white">₹{event.registrationFee}</div>
                              
                              {event.isTeamEvent && (
                                <>
                                  <div className="text-gray-400">Team Members:</div>
                                  <div className="font-medium text-white">{watch('teamMembers')?.length || 0} + 1 (you)</div>
                                </>
                              )}
                              
                              <div className="text-gray-400">Payment Method:</div>
                              <div className="font-medium text-white">UPI / Net Banking</div>
                              
                              <div className="col-span-2 border-t border-gray-700 my-2"></div>
                              
                              <div className="text-gray-400 font-medium">Total Amount:</div>
                              <div className="font-bold text-gold text-xl">₹{event.registrationFee}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <div className="flex justify-center mb-4">
                            <div className="bg-white p-6 rounded-lg max-w-[220px] shadow-[0_0_20px_rgba(255,215,0,0.2)] animate-pulse-slow">
                              <img 
                                src={siteSettings.paymentQrCode || "/payment-qr.png"} 
                                alt="Payment QR Code" 
                                className="w-full h-auto rounded-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://via.placeholder.com/200x200?text=Payment+QR+Code";
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="text-center mb-4">
                            <p className="text-gray-300 mb-1">Scan the QR code or use the following details:</p>
                            <p className="font-medium text-gold text-lg animate-text-glow">UPI: {event.upiId || siteSettings.upiId}</p>
                            <p className="text-sm text-gray-400 mt-2">Please mention your name and event in payment description</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="transactionId" className="text-gold">Transaction ID <span className="text-red-500">*</span></Label>
                            <Input
                              id="transactionId"
                              placeholder="Enter UPI reference ID / Transaction ID"
                              className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                              {...register('transactionId')}
                            />
                            {errors.transactionId && (
                              <p className="text-red-500 text-sm mt-1">{errors.transactionId.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="paymentScreenshot" className="text-gold">Payment Screenshot <span className="text-red-500">*</span></Label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md hover:border-gold transition-colors duration-200 group bg-black/30 backdrop-blur-sm">
                              <div className="space-y-1 text-center">
                                {imagePreview ? (
                                  <div className="mb-3">
                                    <img src={imagePreview} alt="Payment Screenshot Preview" className="mx-auto h-32 object-contain rounded-md shadow-lg" />
                                    <p className="text-gold text-xs mt-2 animate-pulse-slow">Screenshot uploaded</p>
                                  </div>
                                ) : (
                                  <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gold transition-colors duration-200" />
                                )}
                                
                                <div className="flex text-sm text-gray-400">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md font-medium text-gold hover:text-amber-400 focus-within:outline-none"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="file-upload"
                                      name="file-upload"
                                      type="file"
                                      className="sr-only"
                                      accept="image/*"
                                      onChange={handleFileChange}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 5MB
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="additionalInfo" className="text-gold">Additional Information (Optional)</Label>
                            <Textarea
                              id="additionalInfo"
                              placeholder="Any special requirements or information you'd like to share"
                              className="bg-black/50 border-gray-700 focus:border-gold focus:ring-1 focus:ring-gold text-gray-100 placeholder:text-gray-500 mt-1"
                              {...register('additionalInfo')}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6 bg-black/40 backdrop-blur-sm rounded-lg border border-gray-800 shadow-lg">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-orbitron font-bold mb-2 text-gold">Free Registration</h3>
                        <p className="text-gray-400 mb-4">
                          This event has no registration fee. Click the register button below to complete your registration.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setCurrentTab(event.isTeamEvent ? "team" : "details")}
                        className="border-gray-700 hover:border-gold hover:text-gold"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="btn-gold rounded-full hover:animate-pulse-glow"
                        disabled={submitting || !isValid}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Complete Registration'
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventRegistration; 