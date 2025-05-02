import React from 'react';
import { motion } from 'framer-motion';

const Sponsors = () => {
  return (
    <section className="bg-gradient-to-b from-[#121215] to-[#0e0e10] py-20 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-72 h-72 bg-gold/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-staggered-2"></div>
        <div className="absolute bottom-0 right-[5%] w-64 h-64 bg-amber-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-staggered-3"></div>
        <div className="absolute top-[40%] left-[30%] w-48 h-48 bg-amber-600/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[15%] w-32 h-32 bg-amber-300/30 rounded-full mix-blend-screen filter blur-[50px] animate-float-staggered-1"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 animate-text-glow inline-block"
          >
            Our <span className="fire-text text-slate-50">Sponsors</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-300 max-w-3xl mx-auto"
          >
            We're proud to partner with these outstanding organizations to bring you Techshethra 2025
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-20">
          {/* Main sponsor with enhanced animations */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div 
              className="mb-6"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl md:text-2xl font-medium text-gold uppercase tracking-wide inline-block relative">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="absolute -top-6 left-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                ></motion.span>
                Sponsored By
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                ></motion.span>
              </h3>
            </motion.div>
            
            <motion.div 
              className="p-8 md:p-12 bg-black/30 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl hover:shadow-gold/20 transition-all duration-500"
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 25px -5px rgba(255, 215, 0, 0.1), 0 10px 10px -5px rgba(255, 215, 0, 0.04)" 
              }}
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Glow effect behind the logo */}
                <div className="absolute inset-0 bg-gold/10 rounded-full filter blur-2xl opacity-70 transform scale-90"></div>
                
                {/* Logo with floating animation */}
                <motion.img 
                  src="/poorvika.png" 
                  alt="Poorvika" 
                  className="h-36 md:h-48 mx-auto object-contain relative z-10"
                  animate={{ 
                    y: [0, -8, 0],
                    scale: [1, 1.03, 1]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.08 }}
                />
              </motion.div>
              
              <motion.div 
                className="mt-8 bg-gradient-to-r from-transparent via-white/10 to-transparent h-[1px]"
                initial={{ opacity: 0, width: "0%" }}
                whileInView={{ opacity: 1, width: "100%" }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              ></motion.div>
              
              <motion.p 
                className="mt-8 text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Poorvika is one of South India's leading electronics retail chains, providing the latest gadgets and technology solutions to customers across the region.
              </motion.p>
              
              {/* Decorative elements */}
              <div className="absolute -right-4 top-1/4 w-16 h-16 bg-gold/5 rounded-full blur-xl"></div>
              <div className="absolute -left-4 bottom-1/4 w-20 h-20 bg-amber-500/5 rounded-full blur-xl"></div>
            </motion.div>
          </motion.div>

          {/* Co-sponsor with enhanced animations */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div 
              className="mb-6"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl md:text-2xl font-medium text-gold uppercase tracking-wide inline-block relative">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="absolute -top-6 left-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                ></motion.span>
                Co-Sponsored By
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                ></motion.span>
              </h3>
            </motion.div>
            
            <motion.div 
              className="p-8 md:p-12 bg-black/30 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl hover:shadow-gold/20 transition-all duration-500"
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 25px -5px rgba(255, 215, 0, 0.1), 0 10px 10px -5px rgba(255, 215, 0, 0.04)" 
              }}
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Glow effect behind the logo */}
                <div className="absolute inset-0 bg-gold/10 rounded-full filter blur-2xl opacity-70 transform scale-90"></div>
                
                {/* Logo with pulse animation */}
                <motion.img 
                  src="/scholarpeak.png" 
                  alt="Scholarpeak" 
                  className="h-32 md:h-40 mx-auto object-contain relative z-10"
                  animate={{ 
                    boxShadow: ["0 0 10px rgba(255,215,0,0)", "0 0 20px rgba(255,215,0,0.2)", "0 0 10px rgba(255,215,0,0)"]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.08 }}
                />
              </motion.div>
              
              <motion.div 
                className="mt-8 bg-gradient-to-r from-transparent via-white/10 to-transparent h-[1px]"
                initial={{ opacity: 0, width: "0%" }}
                whileInView={{ opacity: 1, width: "100%" }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              ></motion.div>
              
              <motion.p 
                className="mt-8 text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Scholarpeak is an innovative educational platform empowering students through cutting-edge learning solutions and academic resources.
              </motion.p>
              
              {/* Decorative elements */}
              <div className="absolute -left-4 top-1/4 w-16 h-16 bg-gold/5 rounded-full blur-xl"></div>
              <div className="absolute -right-4 bottom-1/4 w-20 h-20 bg-amber-500/5 rounded-full blur-xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;