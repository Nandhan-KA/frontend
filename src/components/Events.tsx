import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { publicApi } from '../services/api';

const eventCategories = [{
  id: 'all',
  name: 'All Events'
}, {
  id: 'competition',
  name: 'Competitions'
}, {
  id: 'technical',
  name: 'Technical'
}, {
  id: 'nontechnical',
  name: 'Non Technical'
}];

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
}

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleEvents, setVisibleEvents] = useState<number>(6);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get('/api/events');
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on selected category
  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter(event => event.eventType === activeCategory);

  // For displaying limited events with "View More" functionality
  const displayEvents = filteredEvents.slice(0, visibleEvents);
  
  // Function to load more events
  const loadMoreEvents = () => {
    setVisibleEvents(prevVisible => prevVisible + 3);
  };

  return (
    <section id="events" className="section bg-gradient-to-b from-[#0e0e10] to-[#121215] text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-72 h-72 bg-gold/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-staggered-1"></div>
        <div className="absolute bottom-[20%] right-[5%] w-64 h-64 bg-amber-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-staggered-2"></div>
        <div className="absolute top-[40%] right-[20%] w-40 h-40 bg-orange-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-staggered-3"></div>
      </div>

      <div className="container mx-auto relative">
        <div className="mb-16 text-center animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-text-glow inline-block">
            Featured <span className="fire-text text-slate-50">Events</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Join us for a full day of innovation with our diverse range of events, 
            from hands-on workshops to intense competitions.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-8 overflow-x-auto py-2">
            {eventCategories.map((category, index) => (
              <button 
                key={category.id} 
                onClick={() => setActiveCategory(category.id)} 
                className={`rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category.id 
                    ? 'bg-gold text-black scale-110 shadow-md shadow-gold/20' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                } animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse-glow rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No events found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {displayEvents.map((event, index) => (
              <div 
                key={event._id} 
                className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden card-hover animate-scale-fade-in shadow-lg shadow-black/30 group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={event.image || 'https://images.unsplash.com/photo-1485163819542-13adeb5e0068?auto=format&fit=crop&w=800&q=80'} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 w-full">
                      <button 
                        className="bg-gold hover:bg-amber-400 text-black font-bold rounded-full w-full py-2 text-sm transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/event/${event._id}`;
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-xs font-medium bg-gold/90 text-black px-2 py-1 rounded-full">
                      {eventCategories.find(c => c.id === event.eventType)?.name || event.eventType}
                    </span>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {event.isTeamEvent && (
                      <span className="text-xs font-medium bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
                        Team (Max: {event.teamSize.max})
                      </span>
                    )}
                    <span className="text-xs font-medium bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full">
                      {event.registrationFee === 0 ? 'Free Entry' : `₹${event.registrationFee}`}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {event.description.length > 100 
                      ? `${event.description.substring(0, 100)}...` 
                      : event.description}
                  </p>
                  <div className="text-sm text-gray-300 mb-4 grid grid-cols-2 gap-1">
                    {event.date && (
                      <div className="mb-1 flex items-center">
                        <span className="text-gold mr-2">🗓️</span> 
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                    <div className="mb-1 flex items-center">
                      <span className="text-gold mr-2">📍</span> {event.location}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      className="flex items-center text-gold hover:text-amber-400 font-medium transition-all hover:translate-x-1 duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/event/${event._id}`;
                      }}
                    >
                      View Details <ChevronRight size={16} className="ml-1" />
                    </button>
                    <button 
                      className="bg-gold/10 hover:bg-gold/20 text-gold rounded-full px-3 py-1 text-sm transition-colors"
                      onClick={() => window.location.href = `/event-register/${event._id}`}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredEvents.length > visibleEvents && (
          <div className="text-center mt-12 animate-fade-in">
            <button 
              onClick={loadMoreEvents}
              className="btn-gold rounded-full px-6 sm:px-8 py-3 text-base sm:text-lg font-bold hover:scale-105 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Load More Events</span>
              <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;