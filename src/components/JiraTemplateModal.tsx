
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
    notas: string;
    chamadoNapje: string;
    servidorResponsavel: string;
    tipoPendencia: string;
    resumo: string;
    versao: string;
    urgencia: string;
    subsistema: string;
    ambiente: string;
    perfilCpfNome: string;
    numeroProcessos: string;
    assuntoId: string;
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

  const formatType = (tipo: string) => {
    const typeMap: { [key: string]: string } = {
      'bug': 'Bug',
      'melhoria': 'Improvement',
      'nova-funcionalidade': 'New Feature',
      'tarefa': 'Task',
      'incidente': 'Incident'
    };
    return typeMap[tipo] || 'Task';
  };

  const formatUrgency = (urgencia: string) => {
    const urgencyMap: { [key: string]: string } = {
      'baixa': 'Low',
      'media': 'Medium', 
      'alta': 'High',
      'critica': 'Critical'
    };
    return urgencyMap[urgencia] || 'Medium';
  };

  const generateFullTemplate = () => {
    return `RESUMO: ${ticketData.resumo}

TIPO DE ISSUE: ${formatType(ticketData.tipoPendencia)}

URGÊNCIA: ${formatUrgency(ticketData.urgencia)}

NOTAS:
${ticketData.notas}

DETALHES TÉCNICOS:
- Chamado NAPJe: ${ticketData.chamadoNapje || 'N/A'}
- Servidor Responsável: ${ticketData.servidorResponsavel}
- Versão: ${ticketData.versao}
- Subsistema: ${ticketData.subsistema}
- Ambiente: ${ticketData.ambiente}

USUÁRIO AFETADO: ${ticketData.perfilCpfNome}

PROCESSOS ENVOLVIDOS:
${ticketData.numeroProcessos || 'N/A'}

Data de Criação: ${new Date().toLocaleDateString('pt-BR')}`.trim();
  };

  const copyAllTemplate = () => {
    const fullTemplate = generateFullTemplate();
    copyToClipboard(fullTemplate, 'Template completo');
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
                value={ticketData.resumo} 
                className="border-l-4 border-blue-500"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <CopyField 
                  label="TIPO DE ISSUE (Issue Type)" 
                  value={formatType(ticketData.tipoPendencia)} 
                />
                <CopyField 
                  label="URGÊNCIA (Priority)" 
                  value={formatUrgency(ticketData.urgencia)} 
                />
              </div>

              <CopyField 
                label="NOTAS (Description)" 
                value={ticketData.notas}
                className="border-l-4 border-green-500"
              />
            </CardContent>
          </Card>

          {/* Informações Técnicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">Informações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CopyField 
                  label="Chamado NAPJe" 
                  value={ticketData.chamadoNapje} 
                />
                <CopyField 
                  label="Servidor Responsável" 
                  value={ticketData.servidorResponsavel} 
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <CopyField 
                  label="Versão" 
                  value={ticketData.versao} 
                />
                <CopyField 
                  label="Subsistema" 
                  value={ticketData.subsistema} 
                />
                <CopyField 
                  label="Ambiente" 
                  value={ticketData.ambiente} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações do Usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">Usuário Afetado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CopyField 
                label="Perfil/CPF/Nome Completo" 
                value={ticketData.perfilCpfNome}
                className="border-l-4 border-purple-500"
              />
            </CardContent>
          </Card>

          {/* Processos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">Processos Envolvidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CopyField 
                label="Números dos Processos" 
                value={ticketData.numeroProcessos}
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
                  {generateFullTemplate()}
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
