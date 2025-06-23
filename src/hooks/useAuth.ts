
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
    console.log('Inicializando useAuth - versão simplificada');
    
    let isMounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
        } else {
          console.log('Sessão inicial obtida:', session ? 'Logado' : 'Não logado');
        }
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro na inicialização:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session ? 'Logado' : 'Não logado');
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    // Obter sessão inicial
    getInitialSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // Array de dependências vazio para executar apenas uma vez

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    if (!email.endsWith('@trt15.jus.br')) {
      toast({
        title: "Erro",
        description: "Apenas emails do domínio @trt15.jus.br são permitidos",
        variant: "destructive"
      });
      return { error: { message: "Domínio não autorizado" } };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
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
        queryParams: {
          hd: 'trt15.jus.br'
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
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro no logout:', error);
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      // Limpar estado local
      setUser(null);
      setSession(null);
      setLoading(false);
      
      console.log('Logout realizado com sucesso');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      
      return { error: null };
    } catch (err) {
      console.error('Erro inesperado no logout:', err);
      setLoading(false);
      return { error: err };
    }
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
