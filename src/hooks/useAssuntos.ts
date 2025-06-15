
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
        console.log('=== INÍCIO DA BUSCA DE ASSUNTOS ===');
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('assuntos')
          .select('id, nome, categoria')
          .order('categoria', { ascending: true })
          .order('nome', { ascending: true });

        console.log('=== RESULTADO DA BUSCA ===');
        console.log('Erro:', error);
        console.log('Dados recebidos:', data);
        console.log('Quantidade de registros:', data?.length || 0);

        if (error) {
          console.error('Erro detalhado ao buscar assuntos:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log('✅ Assuntos carregados com sucesso!');
          console.log('Primeiros 3 assuntos:', data.slice(0, 3));
          setAssuntos(data);
        } else {
          console.warn('⚠️ ATENÇÃO: Nenhum assunto encontrado na base de dados!');
          setAssuntos([]);
        }
      } catch (err: any) {
        console.error('=== ERRO NA BUSCA DE ASSUNTOS ===');
        console.error('Erro capturado:', err);
        console.error('Tipo do erro:', typeof err);
        console.error('Stack trace:', err.stack);
        setError('Erro ao carregar assuntos: ' + (err.message || err.toString()));
        setAssuntos([]);
      } finally {
        setLoading(false);
        console.log('=== FIM DA BUSCA DE ASSUNTOS ===');
      }
    };

    fetchAssuntos();
  }, []);

  return { assuntos, loading, error };
};
