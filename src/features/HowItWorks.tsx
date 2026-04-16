import React from 'react';
import { motion } from 'framer-motion';
import { Car, Search, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  { icon: <Search size={32} />, num: '01', title: 'Find Your Vehicle', desc: 'Enter your pincode and browse hundreds of verified vehicles near you. Filter by type, fuel, and more.' },
  { icon: <Car size={32} />, num: '02', title: 'Choose & Book', desc: 'Select your vehicle, pick your dates, and confirm your booking in just a few clicks.' },
  { icon: <CreditCard size={32} />, num: '03', title: 'Pay Securely', desc: 'Your booking is confirmed once payment is completed. All transactions are encrypted and safe.' },
  { icon: <CheckCircle size={32} />, num: '04', title: 'Enjoy the Ride', desc: 'The vehicle is delivered to your doorstep. Return it when you\'re done — hassle-free.' },
];

export const HowItWorks: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold text-white mb-4">How It Works</h1>
      <p className="text-white/50 max-w-xl mx-auto">
        From browsing to driving — ready2Wheel makes the entire process smooth and simple.
      </p>
    </div>

    <div className="space-y-8">
      {steps.map((step, i) => (
        <motion.div
          key={step.num}
          initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`flex items-start gap-6 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}
        >
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-600/20 border border-blue-400/20 flex items-center justify-center text-blue-400">
            {step.icon}
          </div>
          <div className={i % 2 === 1 ? 'text-right' : ''}>
            <span className="text-xs font-bold text-blue-400/60 tracking-widest">{step.num}</span>
            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
            <p className="text-white/50 max-w-md">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
