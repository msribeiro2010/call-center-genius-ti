
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

interface KnowledgeItem {
  id: string;
  titulo: string;
  problema_descricao: string;
  solucao: string;
  categoria: string;
  tags: string[];
  visualizacoes: number;
  util_count: number;
  created_at: string;
  updated_at: string;
  arquivo_print?: string;
}

export const useKnowledgeBase = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchKnowledgeItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('base_conhecimento')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar itens:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar itens da base de conhecimento",
          variant: "destructive"
        });
      } else {
        const formattedData = data?.map(item => ({
          ...item,
          categoria: item.categoria || '',
          tags: item.tags || [],
          visualizacoes: item.visualizacoes || 0,
          util_count: item.util_count || 0
        })) || [];
        setItems(formattedData);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateItemViews = async (item: KnowledgeItem) => {
    try {
      const { error } = await supabase
        .from('base_conhecimento')
        .update({ visualizacoes: (item.visualizacoes || 0) + 1 })
        .eq('id', item.id);

      if (error) {
        console.error('Erro ao atualizar visualizações:', error);
      } else {
        setItems(prevItems =>
          prevItems.map(i =>
            i.id === item.id ? { ...i, visualizacoes: (i.visualizacoes || 0) + 1 } : i
          )
        );
      }
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('base_conhecimento')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir item:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir item da base de conhecimento",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Item excluído com sucesso!",
        });
        fetchKnowledgeItems();
      }
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir item",
        variant: "destructive"
      });
    }
  };

  const voteItem = async (item: KnowledgeItem, isUpvote: boolean) => {
    try {
      const newUtilCount = (item.util_count || 0) + (isUpvote ? 1 : -1);

      const { error } = await supabase
        .from('base_conhecimento')
        .update({ util_count: newUtilCount })
        .eq('id', item.id);

      if (error) {
        console.error('Erro ao atualizar contagem de votos:', error);
      } else {
        setItems(prevItems =>
          prevItems.map(i =>
            i.id === item.id ? { ...i, util_count: newUtilCount } : i
          )
        );
      }
    } catch (error) {
      console.error('Erro ao processar voto:', error);
    }
  };

  const saveItem = async (itemData: any, editingItem?: KnowledgeItem | null) => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('base_conhecimento')
          .update({
            titulo: itemData.titulo,
            problema_descricao: itemData.problema_descricao,
            solucao: itemData.solucao,
            categoria: itemData.categoria,
            tags: itemData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
            arquivo_print: itemData.arquivo_print
          })
          .eq('id', editingItem.id);

        if (error) {
          console.error('Erro ao atualizar item:', error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar item na base de conhecimento",
            variant: "destructive"
          });
          return false;
        } else {
          toast({
            title: "Sucesso",
            description: "Item atualizado com sucesso!",
          });
        }
      } else {
        const { error } = await supabase
          .from('base_conhecimento')
          .insert([{
            titulo: itemData.titulo,
            problema_descricao: itemData.problema_descricao,
            solucao: itemData.solucao,
            categoria: itemData.categoria,
            tags: itemData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
            arquivo_print: itemData.arquivo_print
          }])
          .select();

        if (error) {
          console.error('Erro ao criar item:', error);
          toast({
            title: "Erro",
            description: "Erro ao criar item na base de conhecimento",
            variant: "destructive"
          });
          return false;
        } else {
          toast({
            title: "Sucesso",
            description: "Item criado com sucesso!",
          });
        }
      }
      
      fetchKnowledgeItems();
      return true;
    } catch (error) {
      console.error('Erro ao processar item:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao processar item",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchKnowledgeItems();
  }, []);

  return {
    items,
    loading,
    fetchKnowledgeItems,
    updateItemViews,
    deleteItem,
    voteItem,
    saveItem
  };
};
