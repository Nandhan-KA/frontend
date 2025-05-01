import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import { ChevronLeft, Calendar, MapPin, Users, Clock, Award, Ticket, Share2 } from 'lucide-react';
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
  };
  rules?: string[];
  coordinators?: {
    name: string;
    contact: string;
    email?: string;
  }[];
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
        <div className="min-h-screen bg-gradient-to-b from-[#0e0e10] to-[#121215] flex justify-center items-center">
          <div className="animate-pulse-glow rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent animate-spin"></div>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#0e0e10] to-[#121215] flex justify-center items-center">
          <div className="text-center p-8 max-w-lg">
            <h2 className="text-2xl text-red-400 mb-4">Error Loading Event</h2>
            <p className="text-gray-300 mb-6">{error || 'Event not found'}</p>
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
      <div className="relative h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${event.image || 'https://images.unsplash.com/photo-1485163819542-13adeb5e0068?auto=format&fit=crop&w=800&q=80'})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <Link 
            to="/#events" 
            className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors hover:translate-x-[-4px] duration-300"
          >
            <ChevronLeft className="mr-1" size={16} /> Back to Events
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">{event.title}</h1>
          <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-sm font-medium bg-gold/20 text-gold px-3 py-1 rounded-full">
              {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
            </span>
            {event.isTeamEvent && (
              <span className="text-sm font-medium bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
                Team Size: {event.teamSize.min}-{event.teamSize.max}
              </span>
            )}
            <span className="text-sm font-medium bg-green-600/20 text-green-400 px-3 py-1 rounded-full">
              {event.registrationFee === 0 ? 'Free Entry' : `Entry Fee: ₹${event.registrationFee}`}
            </span>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-black/50 backdrop-blur-sm sticky top-0 z-10 shadow-xl">
        <div className="container mx-auto flex overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('about')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 ${activeTab === 'about' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
            About
            {activeTab === 'about' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left animate-scale-fade-in"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 ${activeTab === 'details' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
            Details
            {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left animate-scale-fade-in"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 ${activeTab === 'rules' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
            Rules
            {activeTab === 'rules' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left animate-scale-fade-in"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('prizes')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 ${activeTab === 'prizes' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
            Prizes
            {activeTab === 'prizes' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left animate-scale-fade-in"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`px-5 py-4 font-medium text-sm relative transition-colors duration-300 ${activeTab === 'contact' ? 'text-gold' : 'text-white/70 hover:text-white'}`}
          >
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
                  <h2 className="text-2xl font-bold mb-6">About the Event</h2>
                  <div className="prose prose-invert max-w-none mb-8">
                    <p className="text-gray-300 whitespace-pre-line">{event.description}</p>
                  </div>
                  
                  <div className="mt-10">
                    <Link 
                      to={`/event-register/${event._id}`}
                      className="btn-gold rounded-full px-8 py-4 text-lg font-bold hover:scale-105 transition-all inline-flex items-center"
                    >
                      Register Now <Ticket className="ml-2" size={18} />
                    </Link>
                  </div>
                </div>
              )}
              
              {activeTab === 'details' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">Event Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date & Time */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-transform hover:scale-[1.02] duration-500">
                      <div className="flex items-start">
                        <div className="bg-gold/20 p-3 rounded-full mr-4">
                          <Calendar className="text-gold" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Date & Time</h3>
                          <p className="text-gray-300 text-sm mb-1">
                            {event.date ? new Date(event.date).toLocaleDateString(undefined, 
                              { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                            ) : 'Date TBA'}
                          </p>
                          {event.startTime && event.endTime && (
                            <p className="text-gray-300 text-sm flex items-center">
                              <Clock className="text-gold/70 mr-1" size={14} />
                              {event.startTime} - {event.endTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-transform hover:scale-[1.02] duration-500">
                      <div className="flex items-start">
                        <div className="bg-gold/20 p-3 rounded-full mr-4">
                          <MapPin className="text-gold" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Location</h3>
                          <p className="text-gray-300 text-sm">{event.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Capacity */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-transform hover:scale-[1.02] duration-500">
                      <div className="flex items-start">
                        <div className="bg-gold/20 p-3 rounded-full mr-4">
                          <Users className="text-gold" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Capacity</h3>
                          <p className="text-gray-300 text-sm">Limited to {event.capacity} participants</p>
                          {event.isTeamEvent && (
                            <p className="text-gray-300 text-sm mt-1">
                              Team Size: {event.teamSize.min} to {event.teamSize.max} members
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Entry Fee */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-transform hover:scale-[1.02] duration-500">
                      <div className="flex items-start">
                        <div className="bg-gold/20 p-3 rounded-full mr-4">
                          <Ticket className="text-gold" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Registration Fee</h3>
                          <p className="text-gray-300 text-sm">
                            {event.registrationFee === 0 ? (
                              <span className="text-green-400 font-medium">Free Entry</span>
                            ) : (
                              <>₹{event.registrationFee} per {event.isTeamEvent ? 'team' : 'person'}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'rules' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">Rules & Guidelines</h2>
                  
                  {event.rules && event.rules.length > 0 ? (
                    <ul className="space-y-4">
                      {event.rules.map((rule, index) => (
                        <li key={index} className="flex">
                          <span className="bg-gold/20 text-gold font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-gray-300">{rule}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
                      <p className="text-gray-400">Rules will be announced soon or explained at the event.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'prizes' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">Prizes & Rewards</h2>
                  
                  {event.prizes ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* First Prize */}
                      <div className="relative bg-gradient-to-b from-[#FFD700]/20 to-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-all hover:scale-105 duration-500 group overflow-hidden">
                        <div className="absolute -top-6 -right-6 bg-[#FFD700]/10 w-24 h-24 rounded-full blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-700"></div>
                        <div className="relative">
                          <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 animate-pulse-glow">
                              <Award className="text-black" size={32} />
                            </div>
                          </div>
                          <h3 className="text-center text-xl font-bold text-yellow-300 mb-2">1st Prize</h3>
                          <p className="text-center text-gray-200 font-semibold">{event.prizes.first}</p>
                        </div>
                      </div>
                      
                      {/* Second Prize */}
                      <div className="relative bg-gradient-to-b from-[#C0C0C0]/20 to-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-all hover:scale-105 duration-500 group overflow-hidden">
                        <div className="absolute -top-6 -right-6 bg-[#C0C0C0]/10 w-20 h-20 rounded-full blur-2xl group-hover:w-28 group-hover:h-28 transition-all duration-700"></div>
                        <div className="relative">
                          <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-300 to-gray-400">
                              <Award className="text-black" size={32} />
                            </div>
                          </div>
                          <h3 className="text-center text-xl font-bold text-gray-300 mb-2">2nd Prize</h3>
                          <p className="text-center text-gray-200 font-semibold">{event.prizes.second}</p>
                        </div>
                      </div>
                      
                      {/* Third Prize */}
                      <div className="relative bg-gradient-to-b from-[#CD7F32]/20 to-black/30 backdrop-blur-sm rounded-xl p-6 transform transition-all hover:scale-105 duration-500 group overflow-hidden">
                        <div className="absolute -top-6 -right-6 bg-[#CD7F32]/10 w-20 h-20 rounded-full blur-2xl group-hover:w-28 group-hover:h-28 transition-all duration-700"></div>
                        <div className="relative">
                          <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-300 to-amber-700">
                              <Award className="text-black" size={32} />
                            </div>
                          </div>
                          <h3 className="text-center text-xl font-bold text-orange-300 mb-2">3rd Prize</h3>
                          <p className="text-center text-gray-200 font-semibold">{event.prizes.third}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
                      <p className="text-gray-400">Prize details will be announced soon.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'contact' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  
                  {event.coordinators && event.coordinators.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {event.coordinators.map((coordinator, index) => (
                        <div 
                          key={index}
                          className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transition-transform hover:scale-[1.02] duration-500"
                        >
                          <h3 className="text-lg font-semibold mb-2">{coordinator.name}</h3>
                          <p className="text-gray-300 text-sm mb-1">
                            Contact: {coordinator.contact}
                          </p>
                          {coordinator.email && (
                            <p className="text-gray-300 text-sm">
                              Email: {coordinator.email}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
                      <p className="text-gray-400">For any queries, please contact the event team at events@techshethra.com</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Action Card */}
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 mb-6 animate-fade-in">
                  <h3 className="text-xl font-bold mb-4">Ready to Participate?</h3>
                  <p className="text-gray-300 mb-6">Don't miss this opportunity to showcase your talent and win exciting prizes!</p>
                  
                  <Link 
                    to={`/event-register/${event._id}`}
                    className="w-full btn-gold rounded-full py-3 text-center font-bold block hover:scale-105 transition-transform"
                  >
                    Register Now
                  </Link>
                </div>
                
                {/* Share Card */}
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-xl font-bold mb-4">Share Event</h3>
                  <p className="text-gray-300 mb-6">Spread the word and invite your friends to join this amazing event!</p>
                  
                  <div className="flex justify-between">
                    <button 
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 transition-colors p-3 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </button>
                    
                    <button 
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join ${event.title} at TechShethra!&url=${window.location.href}`, '_blank')}
                      className="bg-sky-500 hover:bg-sky-600 transition-colors p-3 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </button>
                    
                    <button 
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${event.title}&summary=Join this amazing event at TechShethra!`, '_blank')}
                      className="bg-blue-800 hover:bg-blue-900 transition-colors p-3 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </button>
                    
                    <button 
                      onClick={() => window.open(`https://api.whatsapp.com/send?text=Check out this event: ${event.title} at TechShethra! ${window.location.href}`, '_blank')}
                      className="bg-green-600 hover:bg-green-700 transition-colors p-3 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </button>
                    
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }}
                      className="bg-purple-600 hover:bg-purple-700 transition-colors p-3 rounded-full"
                    >
                      <Share2 className="text-white" />
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