import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import { 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Award, 
  Ticket, 
  Share2,
  Info,
  ListChecks,
  Phone,
  BookOpen,
  FileText,
  CheckCircle,
  ArrowRight,
  CircleDollarSign,
  Trophy,
  Medal,
  Wrench,
  Code,
  Mic
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  startTime?: string;
  endTime?: string;
  prizes?: {
    first: string;
    second: string;
    third: string;
    other: string;
  };
  rules?: string[];
  coordinators?: {
    name: string;
    contact: string;
    email?: string;
  }[];
  aboutContent?: string;
  detailsContent?: string;
  qrCode?: string;
  upiId?: string;
}

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get(`/api/events/${eventId}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#0e0e10] to-[#121215] flex flex-col justify-center items-center">
          <div className="animate-pulse-glow rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent animate-spin mb-5"></div>
          <p className="text-gold font-medium animate-pulse">Loading event details...</p>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#0e0e10] to-[#121215] flex justify-center items-center">
          <div className="text-center p-8 max-w-lg bg-black/30 backdrop-blur-md rounded-xl border border-red-900/30">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl text-red-400 mb-2 font-bold">Error Loading Event</h2>
            <p className="text-gray-300 mb-6">{error || 'Event not found or unavailable. Please try again later.'}</p>
            <Link to="/#events" className="btn-gold px-6 py-3 rounded-full inline-flex items-center">
              <ChevronLeft className="mr-2" size={16} /> Back to Events
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[35vh] md:h-[40vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 hover:scale-105 shadow-inner"
          style={{ 
            backgroundImage: `url(${event.image || 'https://images.unsplash.com/photo-1485163819542-13adeb5e0068?auto=format&fit=crop&w=800&q=80'})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/80 to-transparent"></div>
        
        {/* Animated overlay elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[10%] right-[20%] w-48 h-48 rounded-full bg-purple-500/10 blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-[20%] left-[10%] w-64 h-64 rounded-full bg-gold/10 blur-3xl animate-float-staggered-1"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 container mx-auto">
          <Link 
            to="/#events" 
            className="inline-flex items-center text-white/70 hover:text-white mb-3 transition-colors hover:translate-x-[-4px] duration-300"
          >
            <ChevronLeft className="mr-1" size={16} /> Back to Events
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 animate-fade-in-up bg-gradient-to-r from-white to-gold bg-clip-text text-transparent drop-shadow-sm">{event.title}</h1>
          <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-sm font-medium bg-gold/20 text-gold px-3 py-1 rounded-full flex items-center">
              {event.eventType === 'competition' ? <Trophy size={14} className="mr-1.5" /> : 
               event.eventType === 'workshop' ? <Wrench size={14} className="mr-1.5" /> : 
               event.eventType === 'hackathon' ? <Code size={14} className="mr-1.5" /> : 
               event.eventType === 'talk' ? <Mic size={14} className="mr-1.5" /> : 
               <FileText size={14} className="mr-1.5" />}
              {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
            </span>
            {event.isTeamEvent && (
              <span className="text-sm font-medium bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full flex items-center">
                <Users size={14} className="mr-1.5" />
                Team Size: {event.teamSize.min}-{event.teamSize.max}
              </span>
            )}
            <span className="text-sm font-medium bg-green-600/20 text-green-400 px-3 py-1 rounded-full flex items-center">
              <CircleDollarSign size={14} className="mr-1.5" />
              {event.registrationFee === 0 ? 'Free Entry' : `Entry Fee: ₹${event.registrationFee}`}
            </span>
            {event.date && (
              <span className="text-sm font-medium bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full flex items-center">
                <Calendar size={14} className="mr-1.5" />
                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-black/70 backdrop-blur-lg sticky top-0 z-10 shadow-xl border-b border-gray-800/50">
        <div className="container mx-auto flex overflow-x-auto hide-scrollbar justify-center md:justify-start">
          <button 
            onClick={() => setActiveTab('about')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 flex items-center ${activeTab === 'about' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
            <BookOpen size={16} className="mr-2" />
            About
            {activeTab === 'about' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left animate-scale-fade-in"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 flex items-center ${activeTab === 'details' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
            <Info size={16} className="mr-2" />
            Details
            {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left animate-scale-fade-in"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 flex items-center ${activeTab === 'rules' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
            <ListChecks size={16} className="mr-2" />
            Rules
            {activeTab === 'rules' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left animate-scale-fade-in"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('prizes')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 flex items-center ${activeTab === 'prizes' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
            <Award size={16} className="mr-2" />
            Prizes
            {activeTab === 'prizes' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left animate-scale-fade-in"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 flex items-center ${activeTab === 'contact' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
            <Phone size={16} className="mr-2" />
            Contact
            {activeTab === 'contact' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left animate-scale-fade-in"></span>}
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="bg-gradient-to-b from-[#0e0e10] to-[#121215] min-h-[50vh]">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {activeTab === 'about' && (
                <div className="animate-fade-in">
                  <div className="flex items-center mb-6">
                    <div className="bg-gold/20 p-2 rounded-full mr-3">
                      <BookOpen className="text-gold" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4 animate-fade-in-up">About the Event</h2>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-inner shadow-gold/5 border border-gray-800/50">
                    <div className="prose prose-invert max-w-none">
                      {event.aboutContent ? (
                        <p className="text-gray-100 whitespace-pre-line">{event.aboutContent}</p>
                      ) : (
                        <p className="text-gray-100 whitespace-pre-line">{event.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-10">
                    <Link 
                      to={`/event-register/${event._id}`}
                      className="btn-gold rounded-full px-8 py-4 text-lg font-bold hover:scale-105 transition-all inline-flex items-center group"
                    >
                      Register Now 
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </Link>
                  </div>
                </div>
              )}
              
              {activeTab === 'details' && (
                <div className="animate-fade-in">
                  <div className="flex items-center mb-6">
                    <div className="bg-gold/20 p-2 rounded-full mr-3">
                      <Info className="text-gold" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Event Details</h2>
                  </div>
                  
                  {/* Event Details Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Date & Time */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-transform hover:scale-[1.02] duration-500 shadow-lg shadow-black/30 border border-gray-800/50">
                      <div className="flex items-start">
                        <div className="bg-gold/20 p-3 rounded-full mr-4">
                          <Calendar className="text-gold" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-100">Date & Time</h3>
                          <p className="text-gray-100 text-sm">
                            {event.date ? new Date(event.date).toLocaleDateString(undefined, 
                              { year: 'numeric', month: 'long', day: 'numeric' }
                            ) : 'Date TBA'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-transform hover:scale-[1.02] duration-500 shadow-lg shadow-black/30 border border-gray-800/50">
                      <div className="flex items-start">
                        <div className="bg-gold/20 p-3 rounded-full mr-4">
                          <MapPin className="text-gold" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-100">Location</h3>
                          <p className="text-gray-100 text-sm">{event.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Capacity */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-transform hover:scale-[1.02] duration-500 shadow-lg shadow-black/30 border border-gray-800/50">
                      <div className="flex items-start">
                        <div className="bg-gold/20 p-3 rounded-full mr-4">
                          <Users className="text-gold" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-100">Capacity</h3>
                          <p className="text-gray-100 text-sm">Limited to {event.capacity} participants</p>
                          {event.isTeamEvent && (
                            <p className="text-gray-100 text-sm mt-1">
                              Team Size: {event.teamSize.min} to {event.teamSize.max} members
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Entry Fee */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-transform hover:scale-[1.02] duration-500 shadow-lg shadow-black/30 border border-gray-800/50">
                      <div className="flex items-start">
                        <div className="bg-gold/20 p-3 rounded-full mr-4">
                          <Ticket className="text-gold" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-100">Registration Fee</h3>
                          <p className="text-gray-100 text-sm">
                            {event.registrationFee === 0 ? (
                              <span className="text-green-300 font-medium">Free Entry</span>
                            ) : (
                              <>₹{event.registrationFee} per {event.isTeamEvent ? 'team' : 'person'}</>
                            )}
                          </p>
                          
                          {event.registrationFee > 0 && event.upiId && (
                            <p className="text-gray-200 text-xs mt-2 flex items-center">
                              <CircleDollarSign size={12} className="mr-1 text-gold/70" />
                              Payment via UPI: {event.upiId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Details */}
                  {event.detailsContent && (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-inner shadow-gold/5 border border-gray-800/50">
                      <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-100">
                        <FileText size={18} className="text-gold mr-2" /> 
                        Additional Information
                      </h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-100 whitespace-pre-line">{event.detailsContent}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'rules' && (
                <div className="animate-fade-in">
                  <div className="flex items-center mb-6">
                    <div className="bg-gold/20 p-2 rounded-full mr-3">
                      <ListChecks className="text-gold" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Rules & Guidelines</h2>
                  </div>
                  
                  {event.rules && event.rules.length > 0 ? (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-inner shadow-gold/5 border border-gray-800/50">
                      <ul className="space-y-4">
                        {event.rules.map((rule, index) => (
                          <li key={index} className="flex group">
                            <span className="bg-gold/20 group-hover:bg-gold/30 transition-colors text-gold font-bold rounded-full w-7 h-7 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <div className="text-gray-100">{rule}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-800/50">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                        <Info className="text-gray-400" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-100">Rules Coming Soon</h3>
                      <p className="text-gray-200">Rules will be announced soon or explained at the event.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'prizes' && (
                <div className="animate-fade-in">
                  <div className="flex items-center mb-6">
                    <div className="bg-gold/20 p-2 rounded-full mr-3">
                      <Award className="text-gold" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Prizes & Rewards</h2>
                  </div>
                  
                  {(event.prizes && (event.prizes.first || event.prizes.second || event.prizes.third || event.prizes.other)) ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* First Prize */}
                        {event.prizes.first && (
                          <div className="relative bg-gradient-to-b from-[#FFD700]/20 to-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-all hover:scale-105 duration-500 group overflow-hidden border border-yellow-500/30 shadow-lg shadow-black/30">
                            <div className="absolute -top-6 -right-6 bg-[#FFD700]/10 w-24 h-24 rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-700"></div>
                            <div className="relative">
                              <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 animate-pulse-glow">
                                  <Trophy className="text-black" size={32} />
                                </div>
                              </div>
                              <h3 className="text-center text-xl font-bold text-yellow-300 mb-2">1st Prize</h3>
                              <p className="text-center text-gray-100 font-semibold">{event.prizes.first}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Second Prize */}
                        {event.prizes.second && (
                          <div className="relative bg-gradient-to-b from-[#C0C0C0]/20 to-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-all hover:scale-105 duration-500 group overflow-hidden border border-gray-400/30 shadow-lg shadow-black/30">
                            <div className="absolute -top-6 -right-6 bg-[#C0C0C0]/10 w-20 h-20 rounded-full blur-2xl group-hover:w-28 group-hover:h-28 transition-all duration-700"></div>
                            <div className="relative">
                              <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-300 to-gray-400">
                                  <Medal className="text-black" size={32} />
                                </div>
                              </div>
                              <h3 className="text-center text-xl font-bold text-gray-300 mb-2">2nd Prize</h3>
                              <p className="text-center text-gray-100 font-semibold">{event.prizes.second}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Third Prize */}
                        {event.prizes.third && (
                          <div className="relative bg-gradient-to-b from-[#CD7F32]/20 to-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-all hover:scale-105 duration-500 group overflow-hidden border border-amber-700/30 shadow-lg shadow-black/30">
                            <div className="absolute -top-6 -right-6 bg-[#CD7F32]/10 w-20 h-20 rounded-full blur-2xl group-hover:w-28 group-hover:h-28 transition-all duration-700"></div>
                            <div className="relative">
                              <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-300 to-amber-700">
                                  <Medal className="text-black" size={32} />
                                </div>
                              </div>
                              <h3 className="text-center text-xl font-bold text-orange-300 mb-2">3rd Prize</h3>
                              <p className="text-center text-gray-100 font-semibold">{event.prizes.third}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Other Prizes */}
                      {event.prizes.other && (
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-lg shadow-black/30">
                          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-100">
                            <Award size={18} className="text-gold mr-2" /> 
                            Additional Rewards
                          </h3>
                          <p className="text-gray-100 whitespace-pre-line">{event.prizes.other}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-800/50">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                        <Award className="text-gray-400" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-100">Prizes Coming Soon</h3>
                      <p className="text-gray-200">Prize details will be announced soon.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'contact' && (
                <div className="animate-fade-in">
                  <div className="flex items-center mb-6">
                    <div className="bg-gold/20 p-2 rounded-full mr-3">
                      <Phone className="text-gold" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                  </div>
                  
                  {event.coordinators && event.coordinators.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {event.coordinators.map((coordinator, index) => (
                        <div 
                          key={index}
                          className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transition-transform hover:scale-[1.02] duration-500 border border-gray-800/50 shadow-lg shadow-black/30"
                        >
                          <h3 className="text-lg font-semibold mb-3 text-gold">{coordinator.name}</h3>
                          <p className="text-gray-100 text-sm mb-2 flex items-center">
                            <Phone size={14} className="mr-2 text-gray-200" />
                            {coordinator.contact}
                          </p>
                          {coordinator.email && (
                            <p className="text-gray-100 text-sm flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {coordinator.email}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-800/50">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                        <Phone className="text-gray-400" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-100">Contact Information</h3>
                      <p className="text-gray-200 mb-1">For any queries, please contact the event team:</p>
                      <p className="text-gold font-medium">events@techshethra.com</p>
                    </div>
                  )}
                  
                  {/* Additional Support Info */}
                  <div className="mt-8 bg-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30">
                    <h3 className="text-lg font-semibold mb-3 flex items-center text-purple-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Need Support?
                    </h3>
                    <p className="text-gray-100 text-sm">
                      Our support team is available from 9:00 AM to 6:00 PM. Feel free to reach out via email or phone for any assistance regarding registration, payment, or event details.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Action Card */}
                <div className="bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800/50 shadow-lg shadow-black/30 animate-fade-in">
                  <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    Ready to Participate?
                  </h3>
                  <p className="text-gray-100 mb-6 text-sm">Secure your spot now in this exciting {event.eventType}. Don't miss the opportunity to showcase your talent and win amazing prizes!</p>
                  
                  <Link 
                    to={`/event-register/${event._id}`}
                    className="w-full btn-gold rounded-full py-3 text-center font-bold block hover:scale-105 transition-transform flex items-center justify-center"
                  >
                    <Ticket className="mr-2" size={16} />
                    Register Now
                  </Link>

                  {event.registrationFee > 0 && (
                    <div className="mt-4 bg-black/50 rounded-lg p-3 border border-gray-800">
                      <p className="text-sm text-gray-100 flex items-center">
                        <CircleDollarSign size={14} className="mr-2 text-gold" />
                        Registration Fee: <span className="font-semibold ml-1">₹{event.registrationFee}</span>
                      </p>
                      {event.qrCode && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-200 mb-1">Scan QR to pay:</p>
                          <div className="flex justify-center bg-white p-2 rounded-md">
                            <img 
                              src={event.qrCode} 
                              alt="Payment QR" 
                              className="h-32 w-32 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://via.placeholder.com/150x150?text=QR+Code";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Event Stats */}
                <div className="bg-black/50 backdrop-blur-lg rounded-xl border border-gray-800/50 shadow-lg shadow-black/30 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="grid grid-cols-2 divide-x divide-gray-800/50">
                    <div className="p-4 text-center">
                      <p className="text-gray-200 text-xs mb-1">Event Type</p>
                      <p className="font-semibold text-gold flex items-center justify-center">
                        {event.eventType === 'competition' ? <Trophy size={14} className="mr-1" /> : 
                         event.eventType === 'workshop' ? <Wrench size={14} className="mr-1" /> : 
                         <FileText size={14} className="mr-1" />}
                        {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                      </p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-gray-200 text-xs mb-1">Capacity</p>
                      <p className="font-semibold text-white">{event.capacity} {event.isTeamEvent ? 'Teams' : 'Participants'}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-800/50 grid grid-cols-2 divide-x divide-gray-800/50">
                    <div className="p-4 text-center">
                      <p className="text-gray-200 text-xs mb-1">{event.isTeamEvent ? 'Team Size' : 'Participants'}</p>
                      <p className="font-semibold text-white">
                        {event.isTeamEvent ? `${event.teamSize.min}-${event.teamSize.max} members` : 'Individual'}
                      </p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-gray-200 text-xs mb-1">Entry</p>
                      <p className="font-semibold text-white">{event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee}`}</p>
                    </div>
                  </div>
                </div>
                
                {/* Share Card */}
                <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 animate-fade-in border border-gray-800/50 shadow-lg shadow-black/30" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                    <Share2 className="mr-2 text-gold" size={18} />
                    Share Event
                  </h3>
                  <p className="text-gray-100 mb-6 text-sm">Spread the word and invite your friends to join this amazing event!</p>
                  
                  <div className="flex justify-between">
                    <button 
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 transition-colors p-3 rounded-full hover:scale-110 duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </button>
                    
                    <button 
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join ${event.title} at TechShethra!&url=${window.location.href}`, '_blank')}
                      className="bg-sky-500 hover:bg-sky-600 transition-colors p-3 rounded-full hover:scale-110 duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </button>
                    
                    <button 
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${event.title}&summary=Join this amazing event at TechShethra!`, '_blank')}
                      className="bg-blue-800 hover:bg-blue-900 transition-colors p-3 rounded-full hover:scale-110 duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </button>
                    
                    <button 
                      onClick={() => window.open(`https://api.whatsapp.com/send?text=Check out this event: ${event.title} at TechShethra! ${window.location.href}`, '_blank')}
                      className="bg-green-600 hover:bg-green-700 transition-colors p-3 rounded-full hover:scale-110 duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </button>
                    
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }}
                      className="bg-purple-600 hover:bg-purple-700 transition-colors p-3 rounded-full hover:scale-110 duration-300"
                    >
                      <Share2 className="text-white" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default EventDetail; 