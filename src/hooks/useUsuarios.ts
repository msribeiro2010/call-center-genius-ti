
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Usuario {
  id: string;
  cpf: string;
  nome_completo: string;
  perfil: string | null;
  created_at: string;
  updated_at: string;
}

export const useUsuarios = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const buscarUsuarioPorCPF = async (cpf: string): Promise<Usuario | null> => {
    if (!cpf || cpf.length < 14) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('cpf', cpf)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const salvarUsuario = async (cpf: string, nome: string, perfil: string): Promise<Usuario | null> => {
    if (!cpf || !nome || !perfil) return null;

    try {
      // Primeiro, verifica se o usuário já existe
      const usuarioExistente = await buscarUsuarioPorCPF(cpf);
      
      if (usuarioExistente) {
        // Se existe, atualiza os dados
        const { data, error } = await supabase
          .from('usuarios')
          .update({
            nome_completo: nome,
            perfil: perfil,
            updated_at: new Date().toISOString()
          })
          .eq('cpf', cpf)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Se não existe, cria um novo
        const { data, error } = await supabase
          .from('usuarios')
          .insert({
            cpf,
            nome_completo: nome,
            perfil
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados do usuário",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    buscarUsuarioPorCPF,
    salvarUsuario,
    loading
  };
};
