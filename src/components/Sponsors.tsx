import React from 'react';
const sponsorTiers = [{
  tier: 'Gold Sponsors',
  sponsors: [{
    name: 'TechCorp',
    logo: 'https://via.placeholder.com/200x100.png?text=TechCorp'
  }, {
    name: 'Innovate Inc',
    logo: 'https://via.placeholder.com/200x100.png?text=Innovate+Inc'
  }, {
    name: 'Future Systems',
    logo: 'https://via.placeholder.com/200x100.png?text=Future+Systems'
  }]
}, {
  tier: 'Silver Sponsors',
  sponsors: [{
    name: 'DevLabs',
    logo: 'https://via.placeholder.com/180x90.png?text=DevLabs'
  }, {
    name: 'Cloud Solutions',
    logo: 'https://via.placeholder.com/180x90.png?text=Cloud+Solutions'
  }, {
    name: 'Quantum Networks',
    logo: 'https://via.placeholder.com/180x90.png?text=Quantum+Networks'
  }, {
    name: 'Digital Platforms',
    logo: 'https://via.placeholder.com/180x90.png?text=Digital+Platforms'
  }]
}, {
  tier: 'Bronze Sponsors',
  sponsors: [{
    name: 'Tech University',
    logo: 'https://via.placeholder.com/150x75.png?text=Tech+University'
  }, {
    name: 'StartupHub',
    logo: 'https://via.placeholder.com/150x75.png?text=StartupHub'
  }, {
    name: 'Code Academy',
    logo: 'https://via.placeholder.com/150x75.png?text=Code+Academy'
  }, {
    name: 'Dev Community',
    logo: 'https://via.placeholder.com/150x75.png?text=Dev+Community'
  }, {
    name: 'AI Labs',
    logo: 'https://via.placeholder.com/150x75.png?text=AI+Labs'
  }, {
    name: 'Data Systems',
    logo: 'https://via.placeholder.com/150x75.png?text=Data+Systems'
  }]
}];
const Sponsors = () => {
  return <section id="sponsors" className="section bg-[#0e0e10] text-white">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="fire-text text-slate-50">Sponsors</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            TechShethra is proudly supported by leading technology companies and organizations.
          </p>
        </div>
        
        {sponsorTiers.map((tier, index) => <div key={index} className="mb-16">
            <h3 className="text-xl font-bold text-gold mb-8 text-center">{tier.tier}</h3>
            <div className={`grid grid-cols-1 ${tier.tier === 'Gold Sponsors' ? 'sm:grid-cols-3' : tier.tier === 'Silver Sponsors' ? 'sm:grid-cols-2 md:grid-cols-4' : 'sm:grid-cols-3 md:grid-cols-6'} gap-8`}>
              {tier.sponsors.map((sponsor, idx) => <div key={idx} className="flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl p-6">
                  <img src={sponsor.logo} alt={sponsor.name} className="max-w-full h-auto" />
                </div>)}
            </div>
          </div>)}
        
        <div className="text-center mt-12 p-8 bg-black/30 backdrop-blur-md rounded-xl">
          <h3 className="text-2xl font-bold mb-4">Become a Sponsor</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join our prestigious list of sponsors and gain exposure to the tech industry's
            brightest minds and innovators. Various sponsorship packages are available.
          </p>
          <button className="btn-gold rounded-full px-8 py-3 text-lg font-bold">
            Sponsorship Opportunities
          </button>
        </div>
      </div>
    </section>;
};
export default Sponsors;