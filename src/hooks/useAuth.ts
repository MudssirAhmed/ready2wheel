import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { subscribeToAuthChanges, getUserProfile } from '@/services/auth';

export const useAuth = () => {
  const { user, firebaseUser, isLoading, setUser, setFirebaseUser, setLoading, clear } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async fu => {
      if (fu) {
        setFirebaseUser({ uid: fu.uid, email: fu.email, emailVerified: fu.emailVerified });
        const profile = await getUserProfile(fu.uid);
        setUser(profile);
      } else {
        clear();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, firebaseUser, isLoading, isAuthenticated: !!user, isAdmin: user?.role === 'admin' };
};
