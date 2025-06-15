
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, AlertCircle } from 'lucide-react';

interface UserSectionProps {
  formData: {
    cpfUsuarioAfetado: string;
    nomeUsuarioAfetado: string;
    perfilUsuarioAfetado: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  onCPFChange: (value: string) => void;
  cpfError: string;
  usuariosLoading: boolean;
}

const UserSection: React.FC<UserSectionProps> = ({
  formData,
  onFormDataChange,
  onCPFChange,
  cpfError,
  usuariosLoading
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Usuário Afetado</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cpfUsuarioAfetado" className="text-sm font-medium text-gray-700">CPF *</Label>
          <Input
            id="cpfUsuarioAfetado"
            value={formData.cpfUsuarioAfetado}
            onChange={(e) => onCPFChange(e.target.value)}
            placeholder="000.000.000-00"
            maxLength={14}
            className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${cpfError ? "border-red-500 focus:border-red-500" : ""}`}
            required
            disabled={usuariosLoading}
          />
          {cpfError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {cpfError}
            </p>
          )}
          {usuariosLoading && (
            <p className="text-sm text-blue-500 flex items-center gap-1">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              Buscando usuário...
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nomeUsuarioAfetado" className="text-sm font-medium text-gray-700">Nome Completo *</Label>
          <Input
            id="nomeUsuarioAfetado"
            value={formData.nomeUsuarioAfetado}
            onChange={(e) => onFormDataChange('nomeUsuarioAfetado', e.target.value)}
            placeholder="Nome completo do usuário"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="perfilUsuarioAfetado" className="text-sm font-medium text-gray-700">Perfil *</Label>
          <Select 
            value={formData.perfilUsuarioAfetado} 
            onValueChange={(value) => onFormDataChange('perfilUsuarioAfetado', value)}
          >
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Diretor">Diretor</SelectItem>
              <SelectItem value="Servidor">Servidor</SelectItem>
              <SelectItem value="Magistrado">Magistrado</SelectItem>
              <SelectItem value="Oficial">Oficial</SelectItem>
              <SelectItem value="Perito">Perito</SelectItem>
              <SelectItem value="Procurador">Procurador</SelectItem>
              <SelectItem value="Estagiário">Estagiário</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserSection;
