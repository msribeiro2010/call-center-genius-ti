
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Hash, Scale } from 'lucide-react';

interface BasicInfoSectionProps {
  formData: {
    chamadoOrigem: string;
    grau: string;
    numeroProcesso: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  onProcessoChange: (value: string) => void;
  onGrauChange: (value: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  onFormDataChange,
  onProcessoChange,
  onGrauChange
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Hash className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Informações Básicas</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="chamadoOrigem" className="text-sm font-medium text-gray-700">
            Número do Chamado de Origem
          </Label>
          <Input
            id="chamadoOrigem"
            value={formData.chamadoOrigem}
            onChange={(e) => onFormDataChange('chamadoOrigem', e.target.value)}
            placeholder="Ex: HELP-12345"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grau" className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Scale className="h-4 w-4" />
            Grau *
          </Label>
          <Select value={formData.grau} onValueChange={onGrauChange}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione o grau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1º Grau</SelectItem>
              <SelectItem value="2">2º Grau</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numeroProcesso" className="text-sm font-medium text-gray-700">
            Número do Processo
          </Label>
          <Input
            id="numeroProcesso"
            value={formData.numeroProcesso}
            onChange={(e) => onProcessoChange(e.target.value)}
            placeholder="Ex: 0010750-13.2024.5.15.0023"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
