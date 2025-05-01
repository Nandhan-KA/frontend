import { Calendar, Clock, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Registration = () => {
  return <section id="registration" className="section bg-[#121215] text-white">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Register <span className="fire-text text-slate-50">Now</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Secure your spot at TechShethra 2025 and be part of this transformative tech experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Registration Details</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company/Institution</Label>
                <Input id="company" placeholder="Your organization name" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Job Title/Role</Label>
                <Input id="role" placeholder="Your professional role" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
              </div>
              
              <Link to="/student/register" className="block">
                <button type="button" className="btn-gold w-full py-3 rounded-full font-bold text-black hover:bg-amber-400 transition-all duration-300">
                  Register Now
                </button>
              </Link>
              
              <div className="text-center mt-2">
                <p className="text-gray-400">
                  Already have an account? <Link to="/student/login" className="text-gold hover:underline">Login here</Link>
                </p>
              </div>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">Event Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="text-gold flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Event Date</h4>
                    <p className="text-gray-300">May 9, 2025</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="text-gold flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Event Time</h4>
                    <p className="text-gray-300">9:00 AM - 5:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="text-gold flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">Group Registration</h4>
                    <p className="text-gray-300">Special discounts available for groups of 5 or more participants. Contact us directly for custom packages.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FF4500]/10 backdrop-blur-md border border-gold/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">Why Attend?</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-gold p-0.5 mt-1.5">
                    <div className="w-1.5 h-1.5"></div>
                  </div>
                  <span>Access to all keynotes and technical sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-gold p-0.5 mt-1.5">
                    <div className="w-1.5 h-1.5"></div>
                  </div>
                  <span>Networking with industry professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-gold p-0.5 mt-1.5">
                    <div className="w-1.5 h-1.5"></div>
                  </div>
                  <span>Workshop participation and hands-on learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-gold p-0.5 mt-1.5">
                    <div className="w-1.5 h-1.5"></div>
                  </div>
                  <span>Exclusive tech demonstrations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Registration;