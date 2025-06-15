
import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Settings } from 'lucide-react';
import OrgaoJulgadorSelect from '../OrgaoJulgadorSelect';

interface AdvancedSettingsSectionProps {
  formData: {
    orgaoJulgador: string;
    ojDetectada: string;
    tipo: string;
    prioridade: number;
  };
  onFormDataChange: (field: string, value: string | number) => void;
  grau: string;
}

const AdvancedSettingsSection: React.FC<AdvancedSettingsSectionProps> = ({
  formData,
  onFormDataChange,
  grau
}) => {
  const handleOJDetected = (ojNome: string) => {
    onFormDataChange('ojDetectada', ojNome);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">Configurações Avançadas</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="orgaoJulgador" className="text-sm font-medium text-gray-700">
            Órgão Julgador
          </Label>
          <OrgaoJulgadorSelect
            grau={grau}
            value={formData.orgaoJulgador}
            onValueChange={(value) => onFormDataChange('orgaoJulgador', value)}
            onOJDetected={handleOJDetected}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ojDetectada" className="text-sm font-medium text-gray-700">OJ Detectada</Label>
          <Input
            id="ojDetectada"
            value={formData.ojDetectada}
            onChange={(e) => onFormDataChange('ojDetectada', e.target.value)}
            placeholder="Nome da OJ detectada"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">Tipo do Chamado</Label>
          <Select 
            value={formData.tipo} 
            onValueChange={(value) => onFormDataChange('tipo', value)}
          >
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incidente">🔥 Incidente</SelectItem>
              <SelectItem value="requisicao">📋 Requisição</SelectItem>
              <SelectItem value="problema">⚠️ Problema</SelectItem>
              <SelectItem value="mudanca">🔄 Mudança</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prioridade" className="text-sm font-medium text-gray-700">Prioridade</Label>
          <Select 
            value={formData.prioridade.toString()} 
            onValueChange={(value) => onFormDataChange('prioridade', parseInt(value))}
          >
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Muito Baixa 🟢</SelectItem>
              <SelectItem value="2">2 - Baixa 🟡</SelectItem>
              <SelectItem value="3">3 - Média 🟠</SelectItem>
              <SelectItem value="4">4 - Alta 🔴</SelectItem>
              <SelectItem value="5">5 - Crítica 🚨</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsSection;
