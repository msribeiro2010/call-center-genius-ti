
import React from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface KnowledgeSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const KnowledgeSearchBar: React.FC<KnowledgeSearchBarProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Busque por problema, solução, categoria ou tags..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default KnowledgeSearchBar;
