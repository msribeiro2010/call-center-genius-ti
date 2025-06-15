
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

interface ProcessInfoProps {
  ticketData: TicketData;
  getOJName: () => string;
  onCopy: (value: string, label: string) => void;
}

const ProcessInfo: React.FC<ProcessInfoProps> = ({ ticketData, getOJName, onCopy }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-blue-700">Informações do Processo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <CopyField 
            label="Chamado de Origem" 
            value={ticketData.chamadoOrigem} 
            onCopy={onCopy}
          />
          <CopyField 
            label="Número do Processo" 
            value={ticketData.numeroProcesso} 
            onCopy={onCopy}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CopyField 
            label="Grau" 
            value={ticketData.grau ? `${ticketData.grau}º Grau` : ''} 
            onCopy={onCopy}
          />
          <CopyField 
            label="Órgão Julgador" 
            value={ticketData.orgaoJulgador} 
            onCopy={onCopy}
          />
        </div>

        <CopyField 
          label="OJ Detectada" 
          value={getOJName()}
          className="border-l-4 border-orange-500"
          onCopy={onCopy}
        />
      </CardContent>
    </Card>
  );
};

export default ProcessInfo;
