
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/authService';
import { useAuthState } from '@/hooks/useAuthState';
import type { UseAuthReturn } from '@/types/auth';

export const useAuth = (): UseAuthReturn => {
  const { user, session, loading, setLoading } = useAuthState();
  const { toast } = useToast();

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    return authService.signUp(email, password, nomeCompleto, toast);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authService.signIn(email, password, toast);
    if (result.error) {
      setLoading(false);
    }
    return result;
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const result = await authService.signInWithGoogle(toast);
    if (result.error) {
      setLoading(false);
    }
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    const result = await authService.signOut(toast);
    
    if (!result.error) {
      // Note: State will be cleared by the onAuthStateChange listener
      setLoading(false);
    } else {
      setLoading(false);
    }
    
    return result;
  };

  console.log('useAuth state atual:', { user: !!user, session: !!session, loading });

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };
};
