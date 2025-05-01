
import React from 'react';
import { Linkedin, Twitter, Globe } from 'lucide-react';

const speakers = [
  {
    id: 1,
    name: 'Dr. Ava Chen',
    role: 'AI Research Scientist, Quantum Labs',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    topic: 'Future of Quantum Computing',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
      website: '#'
    }
  },
  {
    id: 2,
    name: 'Robert Williams',
    role: 'CTO, FutureTech Solutions',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
    topic: 'Web 3.0 Infrastructure',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
      website: '#'
    }
  },
  {
    id: 3,
    name: 'Dr. Sofia Rodriguez',
    role: 'Blockchain Researcher',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
    topic: 'Decentralized Economy',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
      website: '#'
    }
  },
  {
    id: 4,
    name: 'James Patterson',
    role: 'Lead Developer, CyberSec',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    topic: 'Zero Trust Security Models',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
      website: '#'
    }
  }
];

const Speakers = () => {
  return (
    <section id="speakers" className="section bg-[#121215] text-white">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Expert <span className="fire-text">Speakers</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Learn from industry leaders and visionaries who are shaping the future of technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="group">
              <div className="relative overflow-hidden rounded-xl bg-gradient-fire p-1 card-hover">
                <div className="bg-black rounded-lg overflow-hidden">
                  <div className="h-60 overflow-hidden">
                    <img 
                      src={speaker.image} 
                      alt={speaker.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                    <p className="text-gold text-sm mb-2">{speaker.role}</p>
                    <p className="text-gray-400 text-sm mb-4">
                      <span className="text-white">Speaking on:</span> {speaker.topic}
                    </p>
                    
                    <div className="flex space-x-3">
                      <a href={speaker.socialLinks.twitter} className="text-gray-400 hover:text-gold transition-colors">
                        <Twitter size={18} />
                      </a>
                      <a href={speaker.socialLinks.linkedin} className="text-gray-400 hover:text-gold transition-colors">
                        <Linkedin size={18} />
                      </a>
                      <a href={speaker.socialLinks.website} className="text-gray-400 hover:text-gold transition-colors">
                        <Globe size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 rounded-full px-8 py-3 text-lg font-bold">
            View All Speakers
          </button>
        </div>
      </div>
    </section>
  );
};

export default Speakers;
