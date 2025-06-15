
import React from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import DescriptionImprover from '../DescriptionImprover';
import { FileText } from 'lucide-react';

interface DescriptionSectionProps {
  descricao: string;
  onDescricaoChange: (value: string) => void;
  onImprovedDescription: (improvedText: string) => void;
  context: string;
  numeroProcesso: string;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  descricao,
  onDescricaoChange,
  onImprovedDescription,
  context,
  numeroProcesso
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Descrição Detalhada</h3>
        </div>
        <DescriptionImprover
          currentDescription={descricao}
          onImprovedDescription={onImprovedDescription}
          context={context}
          numeroProcesso={numeroProcesso}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">Descrição *</Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => onDescricaoChange(e.target.value)}
          placeholder="Descreva detalhadamente o problema ou solicitação..."
          rows={6}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
          required
        />
      </div>
    </div>
  );
};

export default DescriptionSection;
