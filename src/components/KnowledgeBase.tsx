
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Search, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';
import KnowledgeItemCard from './KnowledgeItemCard';
import KnowledgeCreateModal from './KnowledgeCreateModal';
import KnowledgeSolutionModal from './KnowledgeSolutionModal';
import KnowledgeSearchBar from './KnowledgeSearchBar';

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
  arquivo_print?: string;
}

const KnowledgeBase = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    problema_descricao: '',
    solucao: '',
    categoria: '',
    tags: '',
    arquivo_print: ''
  });

  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, knowledgeItems]);

  const loadKnowledgeBase = async () => {
    try {
      const { data, error } = await supabase
        .from('base_conhecimento')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setKnowledgeItems(data || []);
    } catch (error) {
      console.error('Erro ao carregar base de conhecimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar base de conhecimento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchTerm) {
      setFilteredItems(knowledgeItems);
      return;
    }

    const filtered = knowledgeItems.filter(item =>
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.problema_descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredItems(filtered);
  };

  const handleViewSolution = async (item: KnowledgeItem) => {
    setSelectedItem(item);
    
    // Incrementar visualizações
    try {
      await supabase
        .from('base_conhecimento')
        .update({ visualizacoes: item.visualizacoes + 1 })
        .eq('id', item.id);
      
      // Atualizar estado local
      setKnowledgeItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, visualizacoes: i.visualizacoes + 1 } : i
      ));
    } catch (error) {
      console.error('Erro ao atualizar visualizações:', error);
    }
  };

  const handleMarkUseful = async (item: KnowledgeItem) => {
    try {
      await supabase
        .from('base_conhecimento')
        .update({ util_count: item.util_count + 1 })
        .eq('id', item.id);
      
      // Atualizar estado local
      setKnowledgeItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, util_count: i.util_count + 1 } : i
      ));

      toast({
        title: "Obrigado!",
        description: "Sua avaliação foi registrada"
      });
    } catch (error) {
      console.error('Erro ao marcar como útil:', error);
    }
  };

  const handleCreateKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.problema_descricao || !formData.solucao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const { error } = await supabase
        .from('base_conhecimento')
        .insert({
          titulo: formData.titulo,
          problema_descricao: formData.problema_descricao,
          solucao: formData.solucao,
          categoria: formData.categoria || 'Geral',
          tags: tagsArray,
          arquivo_print: formData.arquivo_print || null
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Conhecimento criado com sucesso"
      });

      // Reset form
      setFormData({
        titulo: '',
        problema_descricao: '',
        solucao: '',
        categoria: '',
        tags: '',
        arquivo_print: ''
      });
      setShowCreateForm(false);
      
      // Recarregar lista
      loadKnowledgeBase();
    } catch (error) {
      console.error('Erro ao criar conhecimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar conhecimento",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando base de conhecimento...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Base de Conhecimento
            </CardTitle>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Conhecimento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <KnowledgeSearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <KnowledgeItemCard
                key={item.id}
                item={item}
                onViewSolution={handleViewSolution}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhum resultado encontrado para sua busca.' : 'Nenhum item na base de conhecimento.'}
            </div>
          )}
        </CardContent>
      </Card>

      <KnowledgeCreateModal
        showCreateForm={showCreateForm}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateKnowledge}
        onClose={() => setShowCreateForm(false)}
      />

      <KnowledgeSolutionModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onMarkUseful={handleMarkUseful}
      />
    </div>
  );
};

export default KnowledgeBase;
