
import React from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface TicketSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

const TicketSearchBar: React.FC<TicketSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar por título, chamado origem, processo, descrição..."
}) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default TicketSearchBar;
