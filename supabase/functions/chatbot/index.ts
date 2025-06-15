
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
        .select('id, titulo, descricao, status, tipo, prioridade')
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
        id: item.id,
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

    // Criar um prompt estruturado para um modelo de texto mais simples
    const systemPrompt = `Você é um assistente especializado em suporte técnico do sistema PJe (Processo Judicial Eletrônico) do TRT15.

Pergunta do usuário: "${message}"

INFORMAÇÕES DA BASE DE CONHECIMENTO:
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

Responda de forma técnica mas didática, forneça passos práticos quando possível. Se encontrar solução na base de conhecimento, cite diretamente. Caso contrário, combine as informações disponíveis para sugerir uma abordagem.`;

    console.log('Enviando para Hugging Face...');

    // Usando modelo de geração de texto mais confiável
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1,
          return_full_text: false
        }
      }),
    });

    console.log('Status da resposta Hugging Face:', response.status);

    let botResponse;

    if (!response.ok) {
      console.log('Erro na API Hugging Face, usando resposta baseada na base de conhecimento...');
      // Se a API do Hugging Face falhar, gerar resposta baseada na base de conhecimento
      if (contextoFormatado.baseConhecimento.length > 0) {
        const melhorSolucao = contextoFormatado.baseConhecimento[0];
        botResponse = `Com base na nossa base de conhecimento, encontrei uma solução relacionada ao seu problema:

**Problema identificado:** ${melhorSolucao.problema}

**Solução recomendada:** ${melhorSolucao.solucao}

**Categoria:** ${melhorSolucao.categoria}

${contextoFormatado.assuntos.length > 0 ? 
  `\n**Assuntos relacionados:** ${contextoFormatado.assuntos.slice(0, 3).map(a => a.nome).join(', ')}` : ''}

Se esta solução não resolver seu problema, por favor reformule sua pergunta ou abra um chamado para assistência personalizada.`;
      } else {
        // Resposta quando não encontra solução específica
        let fallbackResponse = `Não encontrei uma solução específica na nossa base de conhecimento para: "${message}"

**Sugestões:**
• Tente reformular sua pergunta usando termos mais específicos
• Verifique se o problema está relacionado a: login, assinatura digital, movimentação processual, ou erro de sistema
• Abra um chamado para assistência personalizada

${contextoFormatado.assuntos.length > 0 ? 
  `**Assuntos que podem estar relacionados:** ${contextoFormatado.assuntos.slice(0, 5).map(a => a.nome).join(', ')}` : ''}`;

        // Adicionar números de chamados similares se houver
        if (contextoFormatado.chamadosSimilares.length > 0) {
          fallbackResponse += `\n\n**Chamados similares já cadastrados:**`;
          contextoFormatado.chamadosSimilares.slice(0, 3).forEach((chamado, index) => {
            fallbackResponse += `\n${index + 1}. Chamado ID: \`${chamado.id}\` - ${chamado.titulo} (Status: ${chamado.status})`;
          });
          fallbackResponse += `\n\n*Você pode usar estes números de chamado como referência.*`;
        }

        botResponse = fallbackResponse;
      }
    } else {
      const data = await response.json();
      console.log('Resposta do Hugging Face recebida');
      
      // Processar resposta da IA
      if (Array.isArray(data) && data.length > 0) {
        if (data[0].generated_text) {
          botResponse = data[0].generated_text.trim();
        } else {
          botResponse = data[0].text || JSON.stringify(data[0]);
        }
      } else if (data.generated_text) {
        botResponse = data.generated_text.trim();
      } else {
        console.log('Formato inesperado da resposta, usando fallback...');
        // Fallback para resposta baseada na base de conhecimento
        if (contextoFormatado.baseConhecimento.length > 0) {
          const melhorSolucao = contextoFormatado.baseConhecimento[0];
          botResponse = `Com base na nossa base de conhecimento:

**${melhorSolucao.titulo}**

**Problema:** ${melhorSolucao.problema}

**Solução:** ${melhorSolucao.solucao}

**Categoria:** ${melhorSolucao.categoria}`;
        } else {
          let fallbackResponse = `Consultei nossa base de conhecimento mas não encontrei uma solução específica para "${message}". 

**Dicas:**
• Reformule sua pergunta com mais detalhes
• Mencione mensagens de erro específicas
• Descreva os passos que levaram ao problema

Abra um chamado se precisar de assistência adicional.`;

          // Adicionar números de chamados similares se houver
          if (contextoFormatado.chamadosSimilares.length > 0) {
            fallbackResponse += `\n\n**Chamados similares já cadastrados:**`;
            contextoFormatado.chamadosSimilares.slice(0, 3).forEach((chamado, index) => {
              fallbackResponse += `\n${index + 1}. Chamado ID: \`${chamado.id}\` - ${chamado.titulo} (Status: ${chamado.status})`;
            });
            fallbackResponse += `\n\n*Você pode usar estes números de chamado como referência.*`;
          }

          botResponse = fallbackResponse;
        }
      }
    }

    // Garantir que sempre temos uma resposta válida
    if (!botResponse || botResponse.trim() === '') {
      let finalResponse = `Consultei nossa base de conhecimento e encontrei ${contextoFormatado.baseConhecimento.length} itens relacionados ao seu problema.

${contextoFormatado.baseConhecimento.length > 0 ? 
  `**Solução sugerida:** ${contextoFormatado.baseConhecimento[0].solucao}` : 
  'Não encontrei soluções específicas na base de conhecimento.'}

Para uma resposta mais precisa, reformule sua pergunta ou abra um chamado para assistência personalizada.`;

      // Adicionar números de chamados similares se houver
      if (contextoFormatado.chamadosSimilares.length > 0) {
        finalResponse += `\n\n**Chamados similares já cadastrados:**`;
        contextoFormatado.chamadosSimilares.slice(0, 3).forEach((chamado, index) => {
          finalResponse += `\n${index + 1}. Chamado ID: \`${chamado.id}\` - ${chamado.titulo} (Status: ${chamado.status})`;
        });
        finalResponse += `\n\n*Você pode usar estes números de chamado como referência.*`;
      }

      botResponse = finalResponse;
    }

    console.log('Resposta processada com sucesso');

    return new Response(JSON.stringify({ 
      response: botResponse,
      sources: {
        knowledgeBaseCount: contextoFormatado.baseConhecimento.length,
        assuntosCount: contextoFormatado.assuntos.length,
        chamadosCount: contextoFormatado.chamadosSimilares.length
      },
      similarTickets: contextoFormatado.chamadosSimilares.slice(0, 3)
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
