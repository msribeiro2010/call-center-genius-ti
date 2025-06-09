
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Copy, X } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface JiraTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: {
    chamadoOrigem: string;
    numeroProcesso: string;
    grau: string;
    orgaoJulgador: string;
    ojDetectada: string;
    titulo: string;
    descricao: string;
    prioridade: string;
    tipo: string;
  };
}

const JiraTemplateModal: React.FC<JiraTemplateModalProps> = ({ isOpen, onClose, ticketData }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${fieldName} copiado para a área de transferência`
    });
  };

  const copyAllTemplate = () => {
    const fullTemplate = `
RESUMO: ${ticketData.titulo}

TIPO DE ISSUE: ${ticketData.tipo || 'Incident'}

PRIORIDADE: ${ticketData.prioridade || 'Medium'}

DESCRIÇÃO:
${ticketData.descricao}

INFORMAÇÕES ADICIONAIS:
- Chamado de Origem: ${ticketData.chamadoOrigem || 'N/A'}
- Número do Processo: ${ticketData.numeroProcesso || 'N/A'}
- Grau: ${ticketData.grau ? `${ticketData.grau}º Grau` : 'N/A'}
- Órgão Julgador: ${ticketData.orgaoJulgador || 'N/A'}
- OJ Detectada: ${ticketData.ojDetectada || 'N/A'}

Data de Criação: ${new Date().toLocaleDateString('pt-BR')}
    `.trim();

    copyToClipboard(fullTemplate, 'Template completo');
  };

  const formatPriority = (prioridade: string) => {
    const priorityMap: { [key: string]: string } = {
      'baixa': 'Low',
      'media': 'Medium', 
      'alta': 'High',
      'critica': 'Critical'
    };
    return priorityMap[prioridade] || 'Medium';
  };

  const formatType = (tipo: string) => {
    const typeMap: { [key: string]: string } = {
      'incidente': 'Incident',
      'requisicao': 'Service Request',
      'problema': 'Problem',
      'mudanca': 'Change'
    };
    return typeMap[tipo] || 'Incident';
  };

  const CopyField: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className = "" }) => (
    <div className={`flex items-center justify-between p-3 bg-muted rounded-lg ${className}`}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-sm break-words">{value || 'N/A'}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(value || '', label)}
        className="ml-2 p-2"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <div className="space-y-6">
          {/* Botão para copiar template completo */}
          <div className="flex justify-center">
            <Button 
              onClick={copyAllTemplate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              size="lg"
            >
              <Copy className="h-5 w-5 mr-2" />
              Copiar Template Completo
            </Button>
          </div>

          {/* Campos Principais do JIRA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">Campos Principais do JIRA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CopyField 
                label="RESUMO (Summary)" 
                value={ticketData.titulo} 
                className="border-l-4 border-blue-500"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <CopyField 
                  label="TIPO DE ISSUE (Issue Type)" 
                  value={formatType(ticketData.tipo)} 
                />
                <CopyField 
                  label="PRIORIDADE (Priority)" 
                  value={formatPriority(ticketData.prioridade)} 
                />
              </div>

              <CopyField 
                label="DESCRIÇÃO (Description)" 
                value={ticketData.descricao}
                className="border-l-4 border-green-500"
              />
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">Informações do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CopyField 
                  label="Chamado de Origem" 
                  value={ticketData.chamadoOrigem} 
                />
                <CopyField 
                  label="Número do Processo" 
                  value={ticketData.numeroProcesso} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CopyField 
                  label="Grau" 
                  value={ticketData.grau ? `${ticketData.grau}º Grau` : ''} 
                />
                <CopyField 
                  label="Órgão Julgador" 
                  value={ticketData.orgaoJulgador} 
                />
              </div>

              <CopyField 
                label="OJ Detectada" 
                value={ticketData.ojDetectada}
                className="border-l-4 border-orange-500"
              />
            </CardContent>
          </Card>

          {/* Preview do Template */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">Preview do Template Completo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="text-sm whitespace-pre-wrap font-mono">
{`RESUMO: ${ticketData.titulo}

TIPO DE ISSUE: ${formatType(ticketData.tipo)}

PRIORIDADE: ${formatPriority(ticketData.prioridade)}

DESCRIÇÃO:
${ticketData.descricao}

INFORMAÇÕES ADICIONAIS:
- Chamado de Origem: ${ticketData.chamadoOrigem || 'N/A'}
- Número do Processo: ${ticketData.numeroProcesso || 'N/A'}
- Grau: ${ticketData.grau ? `${ticketData.grau}º Grau` : 'N/A'}
- Órgão Julgador: ${ticketData.orgaoJulgador || 'N/A'}
- OJ Detectada: ${ticketData.ojDetectada || 'N/A'}

Data de Criação: ${new Date().toLocaleDateString('pt-BR')}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JiraTemplateModal;
