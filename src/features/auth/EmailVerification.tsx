import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, Car } from 'lucide-react';
import { resendVerificationEmail, logoutUser } from '@/services/auth';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';

export const EmailVerification: React.FC = () => {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await resendVerificationEmail();
      setResent(true);
    } catch (err: any) {
      setError(err.message ?? 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  const handleDone = async () => {
    // Reload user to check verification status
    window.location.href = '/dashboard';
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Car size={32} className="text-blue-400 mx-auto mb-3" />
        </div>

        <Card className="text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <Mail size={36} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Verify your email</h2>
          <p className="text-sm text-white/50 mb-2">
            We sent a verification link to:
          </p>
          <p className="text-sm font-medium text-blue-400 mb-6">
            {firebaseUser?.email}
          </p>
          <p className="text-xs text-white/40 mb-6">
            Click the link in the email to verify your account. Check your spam folder if you don't see it.
          </p>

          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {resent && (
            <div className="mb-4 bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-3 text-sm text-green-300">
              Verification email resent!
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={handleDone} fullWidth>
              I've verified, continue
            </Button>
            <Button
              variant="secondary"
              onClick={handleResend}
              loading={resending}
              fullWidth
              icon={<RefreshCw size={15} />}
            >
              Resend email
            </Button>
            <button
              onClick={handleLogout}
              className="text-sm text-white/40 hover:text-white/60 transition-colors mt-2"
            >
              Sign out
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
