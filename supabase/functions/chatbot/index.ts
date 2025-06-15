
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
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configurações do Supabase não encontradas');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Buscando base de conhecimento relevante...');
    
    // Buscar base de conhecimento com busca inteligente
    let knowledgeBase = [];
    try {
      // Busca por título e descrição do problema que contenham palavras-chave da mensagem
      const searchTerms = message.toLowerCase().split(' ').filter(term => term.length > 3);
      
      let query = supabase
        .from('base_conhecimento')
        .select('titulo, problema_descricao, solucao, categoria, tags');

      // Se há termos de busca, filtrar por relevância
      if (searchTerms.length > 0) {
        const searchPattern = searchTerms.join('|');
        query = query.or(`titulo.ilike.%${message}%,problema_descricao.ilike.%${message}%`);
      }

      const { data: kbData, error: kbError } = await query.limit(10);

      if (kbError) {
        console.error('Erro ao buscar base de conhecimento:', kbError);
      } else {
        knowledgeBase = kbData || [];
        console.log('Base de conhecimento encontrada:', knowledgeBase.length, 'itens relevantes');
      }
    } catch (error) {
      console.error('Erro inesperado na base de conhecimento:', error);
    }

    console.log('Buscando assuntos relacionados...');
    
    // Buscar assuntos relacionados
    let assuntos = [];
    try {
      const { data: assuntosData, error: assuntosError } = await supabase
        .from('assuntos')
        .select('nome, categoria')
        .or(`nome.ilike.%${message}%,categoria.ilike.%${message}%`)
        .limit(20);

      if (assuntosError) {
        console.error('Erro ao buscar assuntos:', assuntosError);
      } else {
        assuntos = assuntosData || [];
        console.log('Assuntos encontrados:', assuntos.length, 'itens');
      }
    } catch (error) {
      console.error('Erro inesperado nos assuntos:', error);
    }

    console.log('Buscando chamados similares...');
    
    // Buscar chamados similares
    let chamados = [];
    try {
      const { data: chamadosData, error: chamadosError } = await supabase
        .from('chamados')
        .select('titulo, descricao, status, tipo, prioridade')
        .or(`titulo.ilike.%${message}%,descricao.ilike.%${message}%`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (chamadosError) {
        console.error('Erro ao buscar chamados:', chamadosError);
      } else {
        chamados = chamadosData || [];
        console.log('Chamados similares encontrados:', chamados.length, 'itens');
      }
    } catch (error) {
      console.error('Erro inesperado nos chamados:', error);
    }

    // Preparar contexto estruturado para a IA
    const contextoFormatado = {
      baseConhecimento: knowledgeBase.map(item => ({
        titulo: item.titulo,
        problema: item.problema_descricao,
        solucao: item.solucao,
        categoria: item.categoria
      })),
      assuntos: assuntos.map(item => ({
        nome: item.nome,
        categoria: item.categoria
      })),
      chamadosSimilares: chamados.map(item => ({
        titulo: item.titulo,
        descricao: item.descricao,
        status: item.status,
        tipo: item.tipo
      }))
    };

    console.log('Contexto preparado para IA:', {
      baseConhecimento: contextoFormatado.baseConhecimento.length,
      assuntos: contextoFormatado.assuntos.length,
      chamadosSimilares: contextoFormatado.chamadosSimilares.length
    });

    const huggingFaceApiKey = "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";

    // Prompt otimizado para o contexto do PJe TRT15
    const systemPrompt = `Você é um assistente especializado em suporte técnico do sistema PJe (Processo Judicial Eletrônico) do TRT15.

CONTEXTO DA BASE DE CONHECIMENTO:
${contextoFormatado.baseConhecimento.length > 0 ? 
  contextoFormatado.baseConhecimento.map((item, index) => 
    `${index + 1}. PROBLEMA: ${item.problema}\nSOLUÇÃO: ${item.solucao}\nCATEGORIA: ${item.categoria}\n`
  ).join('\n') : 'Nenhum item específico encontrado na base de conhecimento.'}

ASSUNTOS RELACIONADOS:
${contextoFormatado.assuntos.length > 0 ? 
  contextoFormatado.assuntos.map(item => `- ${item.nome} (${item.categoria})`).join('\n') : 'Nenhum assunto específico encontrado.'}

CHAMADOS SIMILARES:
${contextoFormatado.chamadosSimilares.length > 0 ? 
  contextoFormatado.chamadosSimilares.map((item, index) => 
    `${index + 1}. ${item.titulo} - Status: ${item.status}\n`
  ).join('\n') : 'Nenhum chamado similar encontrado.'}

INSTRUÇÕES PARA RESPOSTA:
1. Analise a pergunta: "${message}"
2. Se encontrar solução exata na base de conhecimento, cite diretamente
3. Se não houver solução exata, combine informações disponíveis para sugerir uma abordagem
4. Recomende assuntos apropriados quando relevante
5. Seja técnico mas didático, use linguagem clara
6. Forneça passos práticos sempre que possível
7. Se não souber, seja honesto e sugira contatar o suporte

FORMATO DA RESPOSTA:
- Seja direto e objetivo
- Use bullets para listar passos
- Mencione fontes da base quando usar informações específicas
- Sugira categorias de chamado quando apropriado`;

    console.log('Enviando para Hugging Face...');

    // Usando modelo de conversação otimizado do Hugging Face
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_length: 800,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1
        }
      }),
    });

    console.log('Status da resposta Hugging Face:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro do Hugging Face - Status:', response.status, 'Resposta:', errorText);
      throw new Error(`Erro da API Hugging Face: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Resposta do Hugging Face recebida');
    
    let botResponse;
    
    // Processar resposta da IA
    if (Array.isArray(data) && data.length > 0) {
      if (data[0].generated_text) {
        const fullText = data[0].generated_text;
        const userQuestion = `"${message}"`;
        const responseStart = fullText.indexOf(userQuestion) + userQuestion.length;
        botResponse = fullText.substring(responseStart).trim();
        
        if (!botResponse) {
          botResponse = fullText;
        }
      } else {
        botResponse = data[0].text || JSON.stringify(data[0]);
      }
    } else if (data.generated_text) {
      botResponse = data.generated_text;
    } else {
      console.error('Formato de resposta inesperado:', data);
      botResponse = 'Desculpe, recebi uma resposta em formato inesperado da IA. Tente reformular sua pergunta.';
    }
    
    // Fallback caso a IA não responda adequadamente
    if (!botResponse || botResponse.trim() === '' || botResponse.includes('generated_text')) {
      console.log('Gerando resposta baseada na base de conhecimento...');
      
      if (contextoFormatado.baseConhecimento.length > 0) {
        const melhorSolucao = contextoFormatado.baseConhecimento[0];
        botResponse = `Com base na nossa base de conhecimento, encontrei uma solução relacionada ao seu problema:

**Problema identificado:** ${melhorSolucao.problema}

**Solução recomendada:** ${melhorSolucao.solucao}

**Categoria:** ${melhorSolucao.categoria}

${contextoFormatado.assuntos.length > 0 ? 
  `\n**Assuntos relacionados que você pode usar:** ${contextoFormatado.assuntos.slice(0, 3).map(a => a.nome).join(', ')}` : ''}

Se esta solução não resolver seu problema, por favor reformule sua pergunta ou entre em contato com o suporte técnico.`;
      } else {
        botResponse = `Não encontrei uma solução específica na nossa base de conhecimento para: "${message}"

**Sugestões:**
• Tente reformular sua pergunta usando termos mais específicos
• Verifique se o problema está relacionado a: login, assinatura digital, movimentação processual, ou erro de sistema
• Entre em contato com o suporte técnico para assistência personalizada

${contextoFormatado.assuntos.length > 0 ? 
  `**Assuntos que podem estar relacionados:** ${contextoFormatado.assuntos.slice(0, 5).map(a => a.nome).join(', ')}` : ''}`;
      }
    }

    console.log('Resposta processada com sucesso');

    return new Response(JSON.stringify({ 
      response: botResponse,
      sources: {
        knowledgeBaseCount: contextoFormatado.baseConhecimento.length,
        assuntosCount: contextoFormatado.assuntos.length,
        chamadosCount: contextoFormatado.chamadosSimilares.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no chatbot:', error);
    
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
