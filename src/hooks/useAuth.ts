
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Inicializando useAuth...');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Configurar listener de mudanças de autenticação PRIMEIRO
        console.log('Configurando listener de auth...');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session ? 'Logado' : 'Não logado');
            
            if (mounted) {
              setSession(session);
              setUser(session?.user ?? null);
              
              // Se o evento for SIGNED_OUT, garantir que o estado seja limpo
              if (event === 'SIGNED_OUT') {
                setSession(null);
                setUser(null);
              }
              
              // Marcar loading como false apenas após o primeiro evento
              if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                setLoading(false);
              }
            }
          }
        );

        // Verificar sessão existente
        console.log('Verificando sessão existente...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          if (mounted) {
            setLoading(false);
          }
        } else {
          console.log('Sessão obtida:', session ? 'Logado' : 'Não logado');
          
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erro na inicialização da auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Inicializar
    const cleanup = initializeAuth();

    return () => {
      mounted = false;
      cleanup?.then(fn => fn?.());
    };
  }, []);

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    if (!email.endsWith('@trt15.jus.br')) {
      toast({
        title: "Erro",
        description: "Apenas emails do domínio @trt15.jus.br são permitidos",
        variant: "destructive"
      });
      return { error: { message: "Domínio não autorizado" } };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: nomeCompleto
        }
      }
    });

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Cadastro realizado",
        description: "Verifique seu email para confirmar a conta",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setLoading(false);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          hd: 'trt15.jus.br' // Restringe ao domínio trt15.jus.br
        }
      }
    });

    if (error) {
      setLoading(false);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
    }

    return { error };
  };

  const signOut = async () => {
    console.log('Fazendo logout...');
    
    try {
      setLoading(true);
      
      // Fazer logout no Supabase PRIMEIRO
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Força logout em todas as sessões
      });
      
      if (error) {
        console.error('Erro no logout:', error);
        setLoading(false);
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      // Limpar estado local após sucesso
      setUser(null);
      setSession(null);
      setLoading(false);
      
      console.log('Logout realizado com sucesso');
      
      // Limpar localStorage como precaução adicional
      localStorage.removeItem('supabase.auth.token');
      
      // Forçar recarregamento da página para garantir limpeza completa
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      
      return { error: null };
    } catch (err) {
      console.error('Erro inesperado no logout:', err);
      
      // Em caso de erro, ainda assim limpar o estado local e recarregar
      setUser(null);
      setSession(null);
      setLoading(false);
      
      // Limpar localStorage como precaução adicional
      localStorage.removeItem('supabase.auth.token');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
      return { error: err };
    }
  };

  console.log('useAuth state:', { user: !!user, session: !!session, loading });

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
