import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Car size={24} className="text-blue-400" />
            <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ready2Wheel
            </span>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            Premium vehicle rentals at your fingertips. Drive your dream vehicle today.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/80 mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: '/vehicles', label: 'Browse Vehicles' },
              { to: '/how-it-works', label: 'How it Works' },
              { to: '/dashboard', label: 'My Dashboard' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="text-sm text-white/50 hover:text-white/80 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/80 mb-4">Support</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: '/faq', label: 'FAQ' },
              { to: '/terms', label: 'Terms of Service' },
              { to: '/privacy', label: 'Privacy Policy' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="text-sm text-white/50 hover:text-white/80 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/80 mb-4">Contact</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Mail size={14} /> support@ready2wheel.com
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Phone size={14} /> +91 98765 43210
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <MapPin size={14} /> Mumbai, India
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/30">© {new Date().getFullYear()} ready2Wheel. All rights reserved.</p>
        <p className="text-xs text-white/30">Built with ❤️ for seamless mobility</p>
      </div>
    </div>
  </footer>
);
