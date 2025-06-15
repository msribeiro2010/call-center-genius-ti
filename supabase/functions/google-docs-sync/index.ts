
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, accessToken } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configurações do Supabase não encontradas');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === 'sync_docs') {
      console.log('Iniciando sincronização dos Google Docs...');
      
      // Listar documentos do Google Drive (apenas Google Docs)
      const driveResponse = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,modifiedTime)',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!driveResponse.ok) {
        throw new Error('Erro ao acessar Google Drive');
      }

      const driveData = await driveResponse.json();
      console.log(`Encontrados ${driveData.files?.length || 0} documentos`);

      const syncResults = [];

      for (const file of driveData.files || []) {
        try {
          // Exportar documento como texto
          const docResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          );

          if (!docResponse.ok) {
            console.error(`Erro ao exportar documento ${file.name}`);
            continue;
          }

          const content = await docResponse.text();
          
          // Verificar se já existe na base de conhecimento
          const { data: existing } = await supabase
            .from('base_conhecimento')
            .select('id, updated_at')
            .eq('titulo', `[Google Docs] ${file.name}`)
            .single();

          const docData = {
            titulo: `[Google Docs] ${file.name}`,
            problema_descricao: `Documento importado do Google Docs: ${file.name}`,
            solucao: content.substring(0, 5000), // Limitar tamanho
            categoria: 'Google Docs',
            tags: ['google-docs', 'documentacao'],
            arquivo_print: null
          };

          if (existing) {
            // Atualizar se modificado
            const docModified = new Date(file.modifiedTime);
            const dbModified = new Date(existing.updated_at);
            
            if (docModified > dbModified) {
              const { error } = await supabase
                .from('base_conhecimento')
                .update({ ...docData, updated_at: new Date().toISOString() })
                .eq('id', existing.id);

              if (error) {
                console.error('Erro ao atualizar documento:', error);
              } else {
                syncResults.push({ name: file.name, action: 'updated' });
              }
            } else {
              syncResults.push({ name: file.name, action: 'skipped' });
            }
          } else {
            // Inserir novo
            const { error } = await supabase
              .from('base_conhecimento')
              .insert(docData);

            if (error) {
              console.error('Erro ao inserir documento:', error);
            } else {
              syncResults.push({ name: file.name, action: 'created' });
            }
          }
        } catch (error) {
          console.error(`Erro ao processar documento ${file.name}:`, error);
          syncResults.push({ name: file.name, action: 'error', error: error.message });
        }
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Sincronização concluída',
        results: syncResults,
        total: driveData.files?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Ação não reconhecida' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na sincronização:', error);
    return new Response(JSON.stringify({
      error: 'Erro interno na sincronização',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
