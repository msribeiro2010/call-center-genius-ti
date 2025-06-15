
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
    console.log('Iniciando ChatBot V2...');
    
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

    console.log('Realizando busca inteligente na base de conhecimento...');
    
    // Função para extrair palavras-chave relevantes
    function extractKeywords(text: string): string[] {
      const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'sem', 'sobre', 'que', 'como', 'quando', 'onde', 'por que', 'porque', 'é', 'são', 'foi', 'foram', 'ter', 'tem', 'temos', 'tenho', 'fazer', 'faz', 'faço', 'preciso', 'precisa'];
      
      return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word))
        .slice(0, 10); // Limitar a 10 palavras-chave
    }

    const keywords = extractKeywords(message);
    console.log('Palavras-chave extraídas:', keywords);

    // Buscar base de conhecimento com múltiplas estratégias
    let knowledgeBase = [];
    
    // Estratégia 1: Busca por palavras-chave no título e descrição
    for (const keyword of keywords) {
      const { data: kbData, error: kbError } = await supabase
        .from('base_conhecimento')
        .select('*')
        .or(`titulo.ilike.%${keyword}%,problema_descricao.ilike.%${keyword}%,solucao.ilike.%${keyword}%,categoria.ilike.%${keyword}%`)
        .limit(5);

      if (!kbError && kbData && kbData.length > 0) {
        knowledgeBase.push(...kbData);
        console.log(`Encontrados ${kbData.length} itens para palavra-chave: ${keyword}`);
      }
    }

    // Remover duplicatas
    knowledgeBase = knowledgeBase.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );

    // Se não encontrou nada, buscar tudo e fazer correspondência manual
    if (knowledgeBase.length === 0) {
      console.log('Nenhum resultado específico encontrado, fazendo busca geral...');
      const { data: allKb, error: allKbError } = await supabase
        .from('base_conhecimento')
        .select('*')
        .limit(20);

      if (!allKbError && allKb) {
        knowledgeBase = allKb.filter(item => {
          const itemText = `${item.titulo} ${item.problema_descricao} ${item.categoria}`.toLowerCase();
          return keywords.some(keyword => itemText.includes(keyword));
        });
      }
    }

    console.log('Base de conhecimento relevante encontrada:', knowledgeBase.length, 'itens');

    // Buscar assuntos relacionados
    let assuntos = [];
    try {
      for (const keyword of keywords.slice(0, 3)) { // Limitar a 3 palavras para performance
        const { data: assuntosData, error: assuntosError } = await supabase
          .from('assuntos')
          .select('nome, categoria')
          .or(`nome.ilike.%${keyword}%,categoria.ilike.%${keyword}%`)
          .limit(5);

        if (!assuntosError && assuntosData) {
          assuntos.push(...assuntosData);
        }
      }

      // Remover duplicatas
      assuntos = assuntos.filter((item, index, self) => 
        index === self.findIndex(t => t.nome === item.nome)
      );

      console.log('Assuntos relacionados encontrados:', assuntos.length);
    } catch (error) {
      console.error('Erro ao buscar assuntos:', error);
    }

    // Buscar chamados similares
    let chamados = [];
    try {
      for (const keyword of keywords.slice(0, 3)) {
        const { data: chamadosData, error: chamadosError } = await supabase
          .from('chamados')
          .select('id, titulo, descricao, status, tipo, prioridade')
          .or(`titulo.ilike.%${keyword}%,descricao.ilike.%${keyword}%`)
          .order('created_at', { ascending: false })
          .limit(3);

        if (!chamadosError && chamadosData) {
          chamados.push(...chamadosData);
        }
      }

      // Remover duplicatas
      chamados = chamados.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );

      console.log('Chamados similares encontrados:', chamados.length);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
    }

    // Gerar resposta baseada na base de conhecimento (sem IA externa)
    let botResponse = '';

    if (knowledgeBase.length > 0) {
      // Ordenar por relevância (simples - por número de palavras-chave encontradas)
      const scoredKb = knowledgeBase.map(item => {
        const itemText = `${item.titulo} ${item.problema_descricao}`.toLowerCase();
        const score = keywords.filter(keyword => itemText.includes(keyword)).length;
        return { ...item, score };
      }).sort((a, b) => b.score - a.score);

      const bestMatch = scoredKb[0];
      
      botResponse = `**Encontrei uma solução na nossa base de conhecimento:**

**${bestMatch.titulo}**

**Problema:** ${bestMatch.problema_descricao}

**Solução:** ${bestMatch.solucao}

**Categoria:** ${bestMatch.categoria || 'Geral'}`;

      // Adicionar soluções alternativas se houver
      if (scoredKb.length > 1) {
        botResponse += `\n\n**Outras soluções relacionadas:**`;
        scoredKb.slice(1, 3).forEach((item, index) => {
          botResponse += `\n${index + 2}. **${item.titulo}** - ${item.solucao.substring(0, 100)}...`;
        });
      }

    } else {
      // Resposta quando não encontra solução específica
      botResponse = `Não encontrei uma solução específica na nossa base de conhecimento para: "${message}"

**Sugestões:**
• Tente reformular sua pergunta usando termos mais específicos
• Verifique se o problema está relacionado a: login, assinatura digital, movimentação processual, ou erro de sistema
• Abra um chamado para assistência personalizada`;
    }

    // Adicionar assuntos relacionados se houver
    if (assuntos.length > 0) {
      botResponse += `\n\n**Assuntos relacionados que podem ajudar:**`;
      assuntos.slice(0, 5).forEach(assunto => {
        botResponse += `\n• ${assunto.nome}${assunto.categoria ? ` (${assunto.categoria})` : ''}`;
      });
    }

    // Adicionar números de chamados similares se houver
    if (chamados.length > 0) {
      botResponse += `\n\n**Chamados similares já cadastrados:**`;
      chamados.slice(0, 3).forEach((chamado, index) => {
        botResponse += `\n${index + 1}. **Chamado #${chamado.id.substring(0, 8)}** - ${chamado.titulo} (Status: ${chamado.status})`;
      });
      botResponse += `\n\n*Você pode usar estes números de chamado como referência.*`;
    }

    // Tentar usar OpenAI como fallback se disponível
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (openAIKey && knowledgeBase.length > 0) {
      try {
        console.log('Melhorando resposta com OpenAI...');
        
        const context = knowledgeBase.slice(0, 3).map(item => 
          `Título: ${item.titulo}\nProblema: ${item.problema_descricao}\nSolução: ${item.solucao}`
        ).join('\n\n');

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Você é um assistente especializado em suporte técnico do PJe (Processo Judicial Eletrônico). 
                Baseie sua resposta EXCLUSIVAMENTE nas informações da base de conhecimento fornecida. 
                Seja direto, prático e didático. Use formatação markdown.`
              },
              {
                role: 'user',
                content: `Pergunta: ${message}\n\nBase de conhecimento:\n${context}\n\nForneça uma resposta baseada apenas nestas informações.`
              }
            ],
            max_tokens: 800,
            temperature: 0.3
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          if (aiData.choices && aiData.choices[0] && aiData.choices[0].message) {
            botResponse = aiData.choices[0].message.content;
            console.log('Resposta melhorada com OpenAI');
          }
        }
      } catch (error) {
        console.log('Erro ao usar OpenAI, mantendo resposta original:', error);
      }
    }

    console.log('Resposta gerada com sucesso');

    return new Response(JSON.stringify({ 
      response: botResponse,
      sources: {
        knowledgeBaseCount: knowledgeBase.length,
        assuntosCount: assuntos.length,
        chamadosCount: chamados.length
      },
      similarTickets: chamados.slice(0, 3).map(c => ({
        id: c.id,
        titulo: c.titulo,
        status: c.status
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no ChatBot V2:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Erro interno do ChatBot. Tente novamente em alguns instantes.',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
