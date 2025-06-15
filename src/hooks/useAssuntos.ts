
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Assunto {
  id: string;
  nome: string;
  categoria: string;
}

export const useAssuntos = () => {
  const [assuntos, setAssuntos] = useState<Assunto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssuntos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('assuntos')
          .select('id, nome, categoria')
          .order('categoria', { ascending: true })
          .order('nome', { ascending: true });

        if (error) {
          console.error('Erro ao buscar assuntos:', error);
          throw error;
        }
        
        if (data) {
          setAssuntos(data);
        } else {
          setAssuntos([]);
        }
      } catch (err: any) {
        console.error('Erro na busca de assuntos:', err);
        setError('Erro ao carregar assuntos: ' + (err.message || err.toString()));
        setAssuntos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssuntos();
  }, []);

  return { assuntos, loading, error };
};
