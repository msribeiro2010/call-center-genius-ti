
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import KnowledgeCreateModal from './KnowledgeCreateModal';
import KnowledgeSolutionModal from './KnowledgeSolutionModal';
import BulkKnowledgeUpload from './BulkKnowledgeUpload';
import KnowledgeBaseHeader from './KnowledgeBase/KnowledgeBaseHeader';
import CategoryFilter from './KnowledgeBase/CategoryFilter';
import KnowledgeItemsList from './KnowledgeBase/KnowledgeItemsList';
import { useKnowledgeBase } from './KnowledgeBase/useKnowledgeBase';

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
  const {
    items,
    loading,
    updateItemViews,
    deleteItem,
    voteItem,
    saveItem
  } = useKnowledgeBase();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    problema_descricao: '',
    solucao: '',
    categoria: '',
    tags: '',
    arquivo_print: ''
  });

  const handleOpenSolution = async (item: KnowledgeItem) => {
    setSelectedItem(item);
    await updateItemViews(item);
  };

  const handleCloseSolution = () => {
    setSelectedItem(null);
  };

  const handleEditItem = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      problema_descricao: item.problema_descricao,
      solucao: item.solucao,
      categoria: item.categoria,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      arquivo_print: item.arquivo_print || ''
    });
    setIsCreateModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await saveItem(formData, editingItem);
    if (success) {
      setFormData({
        titulo: '',
        problema_descricao: '',
        solucao: '',
        categoria: '',
        tags: '',
        arquivo_print: ''
      });
      setEditingItem(null);
      setIsCreateModalOpen(false);
    }
  };

  const handleMarkUseful = async (item: KnowledgeItem) => {
    await voteItem(item, true);
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setFormData({
      titulo: '',
      problema_descricao: '',
      solucao: '',
      categoria: '',
      tags: '',
      arquivo_print: ''
    });
    setIsCreateModalOpen(true);
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
      <KnowledgeBaseHeader
        onNewItem={handleNewItem}
        onToggleBulkUpload={() => setShowBulkUpload(!showBulkUpload)}
        showBulkUpload={showBulkUpload}
      />

      {showBulkUpload && (
        <BulkKnowledgeUpload />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-auto"
          />
        </div>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <KnowledgeItemsList
        items={filteredItems}
        loading={loading}
        onViewSolution={handleOpenSolution}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />

      {isCreateModalOpen && (
        <KnowledgeCreateModal
          showCreateForm={isCreateModalOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateSubmit}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingItem(null);
          }}
          isEditing={!!editingItem}
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
