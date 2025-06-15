import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Search, Plus, Eye, ThumbsUp, FileText, Upload, ExternalLink, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import KnowledgeCreateModal from './KnowledgeCreateModal';
import KnowledgeSolutionModal from './KnowledgeSolutionModal';
import KnowledgeItemCard from './KnowledgeItemCard';
import BulkKnowledgeUpload from './BulkKnowledgeUpload';
import KnowledgeSubjectManager from './KnowledgeSubjectManager';
import { useAdmin } from '@/hooks/useAdmin';

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

const KnowledgeBase = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showSubjectManager, setShowSubjectManager] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    problema_descricao: '',
    solucao: '',
    categoria: '',
    tags: '',
    arquivo_print: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchKnowledgeItems();
  }, []);

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

  const handleOpenSolution = async (item: KnowledgeItem) => {
    setSelectedItem(item);

    // Incrementar visualizações
    try {
      const { error } = await supabase
        .from('base_conhecimento')
        .update({ visualizacoes: (item.visualizacoes || 0) + 1 })
        .eq('id', item.id);

      if (error) {
        console.error('Erro ao atualizar visualizações:', error);
      } else {
        // Atualizar localmente para refletir a mudança
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

  const handleCloseSolution = () => {
    setSelectedItem(null);
  };

  const handleVote = async (item: KnowledgeItem, isUpvote: boolean) => {
    try {
      const newUtilCount = (item.util_count || 0) + (isUpvote ? 1 : -1);

      const { error } = await supabase
        .from('base_conhecimento')
        .update({ util_count: newUtilCount })
        .eq('id', item.id);

      if (error) {
        console.error('Erro ao atualizar contagem de votos:', error);
      } else {
        // Atualizar localmente
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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('base_conhecimento')
        .insert([{
          titulo: formData.titulo,
          problema_descricao: formData.problema_descricao,
          solucao: formData.solucao,
          categoria: formData.categoria,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          arquivo_print: formData.arquivo_print
        }])
        .select();

      if (error) {
        console.error('Erro ao criar item:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar item na base de conhecimento",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Item criado com sucesso!",
        });
        setFormData({
          titulo: '',
          problema_descricao: '',
          solucao: '',
          categoria: '',
          tags: '',
          arquivo_print: ''
        });
        setIsCreateModalOpen(false);
        fetchKnowledgeItems();
      }
    } catch (error) {
      console.error('Erro ao criar item:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar item",
        variant: "destructive"
      });
    }
  };

  const handleMarkUseful = async (item: KnowledgeItem) => {
    handleVote(item, true);
  };

  const categories = ['all', ...new Set(items.map(item => item.categoria).filter(Boolean))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.problema_descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.solucao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h2>
          <p className="text-gray-600">Documentações e soluções para problemas comuns</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <Button
              onClick={() => setShowSubjectManager(!showSubjectManager)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Gerenciar Assuntos
            </Button>
          )}
          <Button
            onClick={() => setShowBulkUpload(!showBulkUpload)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload em Lote
          </Button>
          <Button
            onClick={() => navigate('/google-docs-sync')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Sincronizar Google Docs
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Item
          </Button>
        </div>
      </div>

      {showSubjectManager && isAdmin && (
        <KnowledgeSubjectManager />
      )}

      {showBulkUpload && (
        <BulkKnowledgeUpload />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          type="search"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-auto"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtrar por categoria:</span>
          <div className="flex flex-wrap gap-1">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                onClick={() => setSelectedCategory(category)}
                className="cursor-pointer"
              >
                {category === 'all' ? 'Todas' : category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <KnowledgeItemCard
              key={item.id}
              item={item}
              onViewSolution={() => handleOpenSolution(item)}
            />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <KnowledgeCreateModal
          showCreateForm={isCreateModalOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateSubmit}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {selectedItem && (
        <KnowledgeSolutionModal
          selectedItem={selectedItem}
          onClose={handleCloseSolution}
          onMarkUseful={handleMarkUseful}
        />
      )}
    </div>
  );
};

export default KnowledgeBase;
