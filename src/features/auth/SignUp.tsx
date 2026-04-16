import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Car } from 'lucide-react';
import { registerUser } from '@/services/auth';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { validateEmail, validatePhone } from '@/utils/helpers';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.displayName.trim()) e.displayName = 'Name is required';
    if (!validateEmail(form.email)) e.email = 'Invalid email';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!validatePhone(form.phoneNumber)) e.phoneNumber = 'Invalid Indian mobile number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      await registerUser(form.email, form.password, form.displayName, form.phoneNumber);
      navigate('/verify-email');
    } catch (err: any) {
      setServerError(err.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Car size={32} className="text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ready2Wheel
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-white/50 text-sm mt-1">Start your journey today</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {serverError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300">
                {serverError}
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="John Doe"
              value={form.displayName}
              onChange={f('displayName')}
              icon={<User size={16} />}
              error={errors.displayName}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={f('email')}
              icon={<Mail size={16} />}
              error={errors.email}
            />
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="9876543210"
              value={form.phoneNumber}
              onChange={f('phoneNumber')}
              icon={<Phone size={16} />}
              error={errors.phoneNumber}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={f('password')}
              icon={<Lock size={16} />}
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={f('confirmPassword')}
              icon={<Lock size={16} />}
              error={errors.confirmPassword}
            />

            <Button type="submit" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-white/50 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
