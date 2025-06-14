
import { supabase } from '@/integrations/supabase/client';
import { knowledgeBaseItems } from '@/data/knowledgeBaseItems';

export const seedKnowledgeBase = async () => {
  try {
    console.log('Iniciando inserção de itens na base de conhecimento...');
    
    for (const item of knowledgeBaseItems) {
      // Verificar se o item já existe
      const { data: existing } = await supabase
        .from('base_conhecimento')
        .select('id')
        .eq('titulo', item.titulo)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from('base_conhecimento')
          .insert({
            titulo: item.titulo,
            problema_descricao: item.problema_descricao,
            solucao: item.solucao,
            categoria: item.categoria,
            tags: item.tags,
            visualizacoes: 0,
            util_count: 0
          });

        if (error) {
          console.error(`Erro ao inserir item ${item.titulo}:`, error);
        } else {
          console.log(`Item inserido: ${item.titulo}`);
        }
      } else {
        console.log(`Item já existe: ${item.titulo}`);
      }
    }
    
    console.log('Inserção concluída!');
  } catch (error) {
    console.error('Erro geral na inserção:', error);
  }
};
