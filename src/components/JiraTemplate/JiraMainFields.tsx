
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import CopyField from './CopyField';

interface TicketData {
  chamadoOrigem: string;
  numeroProcesso: string;
  grau: string;
  orgaoJulgador: string;
  ojDetectada: string;
  titulo: string;
  descricao: string;
  prioridade: number;
  tipo: string;
  nomeUsuarioAfetado: string;
  cpfUsuarioAfetado: string;
  perfilUsuarioAfetado: string;
}

interface JiraMainFieldsProps {
  ticketData: TicketData;
  formatType: (tipo: string) => string;
  formatPriority: (prioridade: number) => string;
  formatUsuarioAfetado: () => string;
  onCopy: (value: string, label: string) => void;
}

const JiraMainFields: React.FC<JiraMainFieldsProps> = ({
  ticketData,
  formatType,
  formatPriority,
  formatUsuarioAfetado,
  onCopy
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-blue-700">Campos Principais do JIRA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CopyField 
          label="RESUMO (Summary)" 
          value={ticketData.titulo || 'N/A'} 
          className="border-l-4 border-blue-500"
          onCopy={onCopy}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <CopyField 
            label="TIPO DE ISSUE (Issue Type)" 
            value={formatType(ticketData.tipo)} 
            onCopy={onCopy}
          />
          <CopyField 
            label="PRIORIDADE (Priority)" 
            value={formatPriority(ticketData.prioridade)} 
            onCopy={onCopy}
          />
        </div>

        <CopyField 
          label="USUÁRIO AFETADO (CPF/Nome/Perfil/OJ)" 
          value={formatUsuarioAfetado()}
          className="border-l-4 border-purple-500"
          onCopy={onCopy}
        />

        <CopyField 
          label="DESCRIÇÃO (Description)" 
          value={ticketData.descricao}
          className="border-l-4 border-green-500"
          onCopy={onCopy}
        />
      </CardContent>
    </Card>
  );
};

export default JiraMainFields;
