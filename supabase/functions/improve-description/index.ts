
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { description, context } = await req.json();

    if (!description) {
      throw new Error('Description is required');
    }

    const systemPrompt = `Você é um assistente especializado em melhorar descrições de chamados técnicos para sistemas judiciários.

Sua tarefa é:
1. Melhorar a clareza e objetividade do texto
2. Corrigir erros de português
3. Estruturar melhor a informação
4. Manter o tom profissional e técnico
5. Preservar todas as informações importantes
6. Adicionar detalhes técnicos relevantes quando apropriado

Contexto do chamado: ${context || 'Chamado técnico do sistema PJe'}

Regras:
- Mantenha o foco no problema descrito
- Use linguagem técnica apropriada
- Organize as informações de forma lógica
- Seja conciso mas completo
- Preserve números de processo, códigos e referências técnicas exatamente como fornecidos`;

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
          { role: 'user', content: `Melhore esta descrição de chamado:\n\n${description}` }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error from OpenAI API');
    }

    const improvedDescription = data.choices[0].message.content;

    return new Response(JSON.stringify({ improvedDescription }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in improve-description function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
