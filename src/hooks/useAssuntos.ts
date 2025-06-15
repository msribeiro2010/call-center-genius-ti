
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
        console.log('Supabase URL:', 'https://zpufcvesenbhtmizmjiz.supabase.co');
        console.log('Supabase configurado:', !!supabase);
        setLoading(true);
        setError(null);
        
        // Primeiro, vamos testar a conexão com uma query simples
        console.log('Testando conexão com Supabase...');
        const { data: testData, error: testError } = await supabase
          .from('assuntos')
          .select('count', { count: 'exact', head: true });
        
        console.log('Teste de conexão:', { count: testData, error: testError });
        
        // Agora vamos buscar os dados
        console.log('Buscando assuntos...');
        const { data, error } = await supabase
          .from('assuntos')
          .select('id, nome, categoria')
          .order('categoria', { ascending: true })
          .order('nome', { ascending: true });

        console.log('=== RESULTADO DA BUSCA ===');
        console.log('Erro:', error);
        console.log('Dados recebidos:', data);
        console.log('Quantidade de registros:', data?.length || 0);
        console.log('Tipo dos dados:', typeof data);
        console.log('É array?', Array.isArray(data));

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
          console.log('Todos os assuntos:', data);
          setAssuntos(data);
        } else {
          console.warn('⚠️ ATENÇÃO: Nenhum assunto encontrado na base de dados!');
          console.log('Vamos tentar uma busca mais simples...');
          
          // Tentar busca sem ordenação
          const { data: simpleData, error: simpleError } = await supabase
            .from('assuntos')
            .select('*');
          
          console.log('Busca simples:', { data: simpleData, error: simpleError });
          setAssuntos(simpleData || []);
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
