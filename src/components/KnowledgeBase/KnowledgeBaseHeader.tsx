
import React from 'react';
import { Button } from '../ui/button';
import { Plus, Upload, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KnowledgeBaseHeaderProps {
  onNewItem: () => void;
  onToggleBulkUpload: () => void;
  showBulkUpload: boolean;
}

const KnowledgeBaseHeader: React.FC<KnowledgeBaseHeaderProps> = ({
  onNewItem,
  onToggleBulkUpload,
  showBulkUpload
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h2>
        <p className="text-gray-600">Documentações e soluções para problemas comuns</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onToggleBulkUpload()}
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
          onClick={onNewItem}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Item
        </Button>
      </div>
    </div>
  );
};

export default KnowledgeBaseHeader;
