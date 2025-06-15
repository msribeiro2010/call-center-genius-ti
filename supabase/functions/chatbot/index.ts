
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando processamento do chatbot...');
    
    const requestBody = await req.json();
    console.log('Corpo da requisição:', requestBody);
    
    const { message } = requestBody;
    
    if (!message) {
      console.error('Mensagem não fornecida');
      throw new Error('Mensagem é obrigatória');
    }

    console.log('Mensagem recebida:', message);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    console.log('Configurações Supabase:', {
      url: supabaseUrl ? 'definida' : 'não definida',
      key: supabaseKey ? 'definida' : 'não definida'
    });
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configurações do Supabase não encontradas');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Buscando dados da base de conhecimento...');
    
    // Buscar base de conhecimento com tratamento de erro melhorado
    let knowledgeBase = [];
    try {
      const { data: kbData, error: kbError } = await supabase
        .from('base_conhecimento')
        .select('titulo, problema_descricao, solucao, categoria, tags')
        .limit(20);

      if (kbError) {
        console.error('Erro ao buscar base de conhecimento:', kbError);
      } else {
        knowledgeBase = kbData || [];
        console.log('Base de conhecimento encontrada:', knowledgeBase.length, 'itens');
      }
    } catch (error) {
      console.error('Erro inesperado na base de conhecimento:', error);
    }

    console.log('Buscando assuntos...');
    
    // Buscar assuntos com tratamento de erro melhorado
    let assuntos = [];
    try {
      const { data: assuntosData, error: assuntosError } = await supabase
        .from('assuntos')
        .select('nome, categoria')
        .limit(50);

      if (assuntosError) {
        console.error('Erro ao buscar assuntos:', assuntosError);
      } else {
        assuntos = assuntosData || [];
        console.log('Assuntos encontrados:', assuntos.length, 'itens');
      }
    } catch (error) {
      console.error('Erro inesperado nos assuntos:', error);
    }

    console.log('Buscando chamados recentes...');
    
    // Buscar chamados recentes com tratamento de erro melhorado
    let chamados = [];
    try {
      const { data: chamadosData, error: chamadosError } = await supabase
        .from('chamados')
        .select('titulo, descricao, status, tipo, prioridade')
        .order('created_at', { ascending: false })
        .limit(20);

      if (chamadosError) {
        console.error('Erro ao buscar chamados:', chamadosError);
      } else {
        chamados = chamadosData || [];
        console.log('Chamados encontrados:', chamados.length, 'itens');
      }
    } catch (error) {
      console.error('Erro inesperado nos chamados:', error);
    }

    // Preparar contexto para a IA
    const contexto = {
      baseConhecimento: knowledgeBase,
      assuntos: assuntos,
      chamados: chamados
    };

    console.log('Contexto preparado:', {
      baseConhecimento: contexto.baseConhecimento.length,
      assuntos: contexto.assuntos.length,
      chamados: contexto.chamados.length
    });

    console.log('Verificando chave da OpenAI...');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY não configurada');
      throw new Error('Chave da API OpenAI não configurada. Entre em contato com o administrador.');
    }

    console.log('Chave OpenAI encontrada, enviando requisição...');

    const systemPrompt = `Você é um assistente especializado em suporte técnico do sistema PJe (Processo Judicial Eletrônico) do TRT15. 

CONTEXTO DISPONÍVEL:
- Base de Conhecimento: ${JSON.stringify(contexto.baseConhecimento)}
- Assuntos de Chamados: ${JSON.stringify(contexto.assuntos)}
- Chamados Recentes: ${JSON.stringify(contexto.chamados)}

INSTRUÇÕES:
1. Analise a pergunta do usuário e busque soluções na base de conhecimento
2. Se encontrar uma solução específica, cite-a diretamente
3. Se não encontrar solução exata, sugira soluções baseadas em problemas similares
4. Recomende assuntos apropriados quando relevante
5. Seja direto, técnico mas didático
6. Sempre forneça passos práticos quando possível
7. Se não souber, seja honesto e sugira entrar em contato com o suporte

FORMATO DE RESPOSTA:
- Seja conciso mas completo
- Use bullets para passos quando aplicável
- Mencione fontes da base de conhecimento quando usar
- Sugira assuntos de chamado quando relevante`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    console.log('Status da resposta OpenAI:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da OpenAI - Status:', response.status, 'Resposta:', errorText);
      throw new Error(`Erro da API OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Resposta da OpenAI recebida com sucesso');
    
    const botResponse = data.choices?.[0]?.message?.content;
    
    if (!botResponse) {
      console.error('Resposta vazia da OpenAI:', data);
      throw new Error('Resposta vazia da OpenAI');
    }

    console.log('Resposta processada com sucesso');

    return new Response(JSON.stringify({ 
      response: botResponse,
      sources: {
        knowledgeBaseCount: contexto.baseConhecimento.length,
        assuntosCount: contexto.assuntos.length,
        chamadosCount: contexto.chamados.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no chatbot:', error);
    
    // Retornar erro mais específico
    const errorMessage = error.message || 'Erro interno do servidor';
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.stack || 'Sem detalhes adicionais'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
