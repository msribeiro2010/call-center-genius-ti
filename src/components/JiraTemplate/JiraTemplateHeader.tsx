
import React from 'react';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface JiraTemplateHeaderProps {
  onClose: () => void;
}

const JiraTemplateHeader: React.FC<JiraTemplateHeaderProps> = ({ onClose }) => {
  return (
    <DialogHeader>
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl font-bold text-blue-700">
          Template JIRA - Pronto para Copiar
        </DialogTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </DialogHeader>
  );
};

export default JiraTemplateHeader;
