
import React from 'react';
import { Label } from '../ui/label';
import SearchableAssuntoSelect from '../SearchableAssuntoSelect';
import { AlertCircle } from 'lucide-react';

interface SubjectSectionProps {
  assuntoId: string;
  onAssuntoChange: (value: string) => void;
  assuntos: any[];
  assuntosLoading: boolean;
}

const SubjectSection: React.FC<SubjectSectionProps> = ({
  assuntoId,
  onAssuntoChange,
  assuntos,
  assuntosLoading
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-800">Assunto do Chamado</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assunto" className="text-sm font-medium text-gray-700">Assunto *</Label>
        <SearchableAssuntoSelect
          value={assuntoId}
          onValueChange={onAssuntoChange}
          assuntos={assuntos}
          loading={assuntosLoading}
          placeholder={assuntosLoading ? "Carregando assuntos..." : "Selecione ou digite para buscar assunto..."}
        />
      </div>
    </div>
  );
};

export default SubjectSection;
