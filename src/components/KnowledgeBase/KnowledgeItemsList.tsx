
import React from 'react';
import KnowledgeItemCard from '../KnowledgeItemCard';

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

interface KnowledgeItemsListProps {
  items: KnowledgeItem[];
  loading: boolean;
  onViewSolution: (item: KnowledgeItem) => void;
  onEditItem: (item: KnowledgeItem) => void;
  onDeleteItem: (id: string) => void;
}

const KnowledgeItemsList: React.FC<KnowledgeItemsListProps> = ({
  items,
  loading,
  onViewSolution,
  onEditItem,
  onDeleteItem
}) => {
  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <KnowledgeItemCard
          key={item.id}
          item={item}
          onViewSolution={() => onViewSolution(item)}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
        />
      ))}
    </div>
  );
};

export default KnowledgeItemsList;
