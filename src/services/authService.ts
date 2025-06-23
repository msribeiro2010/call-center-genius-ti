
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const authService = {
  async signUp(email: string, password: string, nomeCompleto: string, toast: ReturnType<typeof useToast>['toast']) {
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
  },

  async signIn(email: string, password: string, toast: ReturnType<typeof useToast>['toast']) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
    }

    return { error };
  },

  async signInWithGoogle(toast: ReturnType<typeof useToast>['toast']) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          hd: 'trt15.jus.br'
        }
      }
    });

    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
    }

    return { error };
  },

  async signOut(toast: ReturnType<typeof useToast>['toast']) {
    console.log('Fazendo logout...');
    
    try {
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

      console.log('Logout realizado com sucesso');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      
      return { error: null };
    } catch (err) {
      console.error('Erro inesperado no logout:', err);
      return { error: err };
    }
  }
};
