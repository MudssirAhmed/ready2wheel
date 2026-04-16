import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Shield, Clock, Star, ArrowRight, Zap, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';

const features = [
  { icon: <Car size={24} />, title: 'Wide Selection', desc: 'Cars, bikes, scooters, and more for every need.' },
  { icon: <Shield size={24} />, title: 'Fully Insured', desc: 'Every rental comes with comprehensive coverage.' },
  { icon: <Clock size={24} />, title: 'Flexible Duration', desc: 'Rent by the hour, day, week, or month.' },
  { icon: <Star size={24} />, title: 'Top Rated', desc: 'Verified vehicles with genuine customer reviews.' },
  { icon: <Zap size={24} />, title: 'Instant Booking', desc: 'Book in minutes with our streamlined process.' },
  { icon: <MapPin size={24} />, title: 'Doorstep Delivery', desc: 'Vehicle delivered to your preferred location.' },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const Home: React.FC = () => (
  <div>
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-400/30 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6">
            <Zap size={14} /> Premium Vehicle Rentals
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
        >
          Drive Your{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Dream
          </span>
          <br />Vehicle Today
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/60 max-w-2xl mx-auto mb-8"
        >
          India's most trusted vehicle rental platform. Hundreds of cars, bikes, and scooters available near you — ready to roll.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/vehicles">
            <Button size="lg" icon={<Car size={20} />}>
              Browse Vehicles
            </Button>
          </Link>
          <Link to="/how-it-works">
            <Button size="lg" variant="secondary" icon={<ArrowRight size={20} />}>
              How It Works
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-8 mt-12 text-sm text-white/40"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">500+</div>
            <div>Vehicles</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">50K+</div>
            <div>Rentals</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4.9★</div>
            <div>Avg Rating</div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Why Choose ready2Wheel?</h2>
        <p className="text-white/50 max-w-xl mx-auto">
          We make vehicle rental effortless, transparent, and enjoyable.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={container}
      >
        {features.map(f => (
          <motion.div
            key={f.title}
            variants={item}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-white/50">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* CTA */}
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl p-10 text-center bg-gradient-to-br from-blue-600/30 to-purple-600/20 border border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
        <h2 className="relative text-3xl font-bold text-white mb-4">Ready to hit the road?</h2>
        <p className="relative text-white/60 mb-8">
          Sign up in minutes and get access to hundreds of vehicles near you.
        </p>
        <Link to="/signup">
          <Button size="lg" icon={<ChevronRight size={20} />}>
            Get Started — It's Free
          </Button>
        </Link>
      </motion.div>
    </section>
  </div>
);
