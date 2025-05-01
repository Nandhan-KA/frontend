import { 
  FadeIn, 
  FadeInLeft, 
  FadeInRight, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedBackground 
} from '@/components/ui/animated-elements';
import { Zap, Users, Globe, Award, CheckCircle } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Zap size={24} className="text-gold" />,
      title: "Innovation Focus",
      description: "Cutting-edge tech showcases"
    },
    {
      icon: <Users size={24} className="text-gold" />,
      title: "5000+ Attendees",
      description: "Global tech enthusiasts"
    },
    {
      icon: <Globe size={24} className="text-gold" />,
      title: "Global Reach",
      description: "International speakers & participants"
    },
    {
      icon: <Award size={24} className="text-gold" />,
      title: "25+ Events",
      description: "Workshops, hackathons & panels"
    }
  ];

  const highlights = [
    "Expert-led workshops and hands-on sessions",
    "Networking opportunities with industry leaders",
    "Showcase your skills in competitive events",
    "Learn about emerging technologies and trends",
    "Win exciting prizes and recognition"
  ];
  
  return (
    <section id="about" className="section bg-gradient-to-b from-[#0e0e10] to-[#0f0f12] text-white overflow-hidden relative py-20">
      <AnimatedBackground />
      
      <div className="container mx-auto relative z-10">
        <FadeIn className="mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-text-glow inline-block">
            About <span className="fire-text text-slate-50">TechShethra</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            A premier technical symposium that brings together innovators, thought leaders, and tech enthusiasts
            to explore cutting-edge advancements and shape the future of technology.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <FadeInLeft>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl group shadow-2xl shadow-black/30">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                  alt="Tech Conference" 
                  className="w-full h-auto rounded-2xl group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="absolute -bottom-8 -right-8 bg-black/80 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-black/30 overflow-hidden group">
                <div className="relative z-10 flex items-center">
                  <div>
                    <div className="text-gold font-bold text-4xl">8+</div>
                    <div className="text-sm text-gray-300">Years of Excellence</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gold/10 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700 -translate-x-1/2 group-hover:translate-x-0 opacity-30 group-hover:opacity-40"></div>
              </div>
              
              {/* Stats Cards */}
              <div className="absolute -top-8 -left-8 bg-black/80 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-black/30 overflow-hidden hidden md:block">
                <div className="text-gold font-bold text-3xl">25+</div>
                <div className="text-sm text-gray-300">Exciting Events</div>
              </div>
            </div>
          </FadeInLeft>

          <FadeInRight>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Igniting Innovation Since 2017</h3>
            <p className="text-gray-300 mb-8">
              TechShethra has been at the forefront of technological discourse for over 8 years, 
              providing a platform for breakthrough ideas and transformative innovations. What started 
              as a small college event has grown into one of the region's most anticipated tech symposiums.
            </p>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <StaggerItem 
                  key={index} 
                  index={index} 
                  type="scale"
                  className="bg-black/30 backdrop-blur-sm p-4 rounded-xl hover:bg-gold/5 transition-colors duration-300 group border border-transparent hover:border-gold/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gold/20 rounded-lg group-hover:bg-gold/30 transition-colors">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold group-hover:text-gold transition-colors">{feature.title}</h4>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeInRight>
        </div>
        
        {/* Event Highlights Section */}
        <FadeIn className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center bg-black/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 overflow-hidden relative group border border-gold/10 hover:border-gold/20 transition-colors">
            <div className="lg:col-span-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-gold transition-colors">Event Highlights</h3>
              <p className="text-gray-300 mb-6">
                Join us for an unforgettable experience packed with innovations, competitions,
                workshops, and networking opportunities that will expand your horizons.
              </p>
              
              <a 
                href="#events" 
                className="inline-flex items-center bg-gold text-black px-6 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors"
              >
                Explore Events <Award className="ml-2" size={18} />
              </a>
            </div>
            
            <div className="lg:col-span-3">
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => (
                  <StaggerItem 
                    key={index} 
                    index={index}
                    type="fade"
                    className="flex items-center gap-3 p-3 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <CheckCircle size={20} className="text-gold flex-shrink-0" />
                    <p className="text-gray-200">{highlight}</p>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-[100px] group-hover:bg-gold/20 transition-colors"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-colors"></div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default About;