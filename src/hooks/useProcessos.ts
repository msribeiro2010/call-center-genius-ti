
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Processo {
  id: string;
  numero_processo: string;
  grau: string;
  orgao_julgador: string;
  oj_detectada: string;
  created_at: string;
  updated_at: string;
}

export const useProcessos = () => {
  const { toast } = useToast();
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarProcessoPorNumero = async (numeroProcesso: string): Promise<Processo | null> => {
    if (!numeroProcesso || numeroProcesso.length < 10) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('processos')
        .select('*')
        .eq('numero_processo', numeroProcesso)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar processo:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar processo:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const salvarProcesso = async (
    numeroProcesso: string, 
    grau: string, 
    orgaoJulgador: string, 
    ojDetectada: string
  ): Promise<Processo | null> => {
    if (!numeroProcesso) return null;

    try {
      // Primeiro, verifica se o processo já existe
      const processoExistente = await buscarProcessoPorNumero(numeroProcesso);
      
      if (processoExistente) {
        // Se existe, atualiza os dados
        const { data, error } = await supabase
          .from('processos')
          .update({
            grau,
            orgao_julgador: orgaoJulgador,
            oj_detectada: ojDetectada,
            updated_at: new Date().toISOString()
          })
          .eq('numero_processo', numeroProcesso)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Se não existe, cria um novo
        const { data, error } = await supabase
          .from('processos')
          .insert({
            numero_processo: numeroProcesso,
            grau,
            orgao_julgador: orgaoJulgador,
            oj_detectada: ojDetectada
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Erro ao salvar processo:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados do processo",
        variant: "destructive"
      });
      return null;
    }
  };

  const buscarTodosProcessos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('processos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProcessos(data || []);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar processos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    processos,
    buscarProcessoPorNumero,
    salvarProcesso,
    buscarTodosProcessos,
    loading
  };
};
