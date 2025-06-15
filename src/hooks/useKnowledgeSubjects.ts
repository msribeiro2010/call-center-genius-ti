
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface KnowledgeSubject {
  id: string;
  nome: string;
  categoria: string;
  created_at: string;
  updated_at: string;
}

export const useKnowledgeSubjects = () => {
  const [subjects, setSubjects] = useState<KnowledgeSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assuntos_base_conhecimento')
        .select('*')
        .order('categoria', { ascending: true })
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar assuntos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar assuntos",
          variant: "destructive"
        });
      } else {
        setSubjects(data || []);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (nome: string, categoria: string) => {
    try {
      const { data, error } = await supabase
        .from('assuntos_base_conhecimento')
        .insert([{ nome, categoria }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar assunto:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar assunto",
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Sucesso",
        description: "Assunto criado com sucesso"
      });

      fetchSubjects();
      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { error };
    }
  };

  const updateSubject = async (id: string, nome: string, categoria: string) => {
    try {
      const { data, error } = await supabase
        .from('assuntos_base_conhecimento')
        .update({ nome, categoria })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar assunto:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar assunto",
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Sucesso",
        description: "Assunto atualizado com sucesso"
      });

      fetchSubjects();
      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { error };
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assuntos_base_conhecimento')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir assunto:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir assunto",
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Sucesso",
        description: "Assunto excluído com sucesso"
      });

      fetchSubjects();
      return { error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    subjects,
    loading,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject
  };
};
