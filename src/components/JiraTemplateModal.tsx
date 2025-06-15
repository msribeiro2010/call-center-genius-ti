
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Copy, X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { primeiroGrauOJs, segundoGrauOJs } from '@/data';

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
    prioridade: number;
    tipo: string;
    nomeUsuarioAfetado: string;
    cpfUsuarioAfetado: string;
    perfilUsuarioAfetado: string;
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

  const formatPriority = (prioridade: number) => {
    return prioridade.toString();
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

  const getOJName = () => {
    if (!ticketData.orgaoJulgador || !ticketData.grau) return 'N/A';
    
    // Buscar o nome do OJ baseado no grau selecionado pelo usuário
    if (ticketData.grau === '1') {
      const oj = primeiroGrauOJs.find(oj => oj.codigo === ticketData.orgaoJulgador);
      return oj ? oj.nome : ticketData.ojDetectada || 'N/A';
    } else if (ticketData.grau === '2') {
      const oj = segundoGrauOJs.find(oj => oj.codigo === ticketData.orgaoJulgador);
      return oj ? oj.nome : ticketData.ojDetectada || 'N/A';
    }
    
    return ticketData.ojDetectada || 'N/A';
  };

  const formatUsuarioAfetado = () => {
    const cpf = ticketData.cpfUsuarioAfetado || 'N/A';
    const nome = ticketData.nomeUsuarioAfetado || 'N/A';
    const perfil = ticketData.perfilUsuarioAfetado || 'N/A';
    const oj = getOJName();
    
    return `${cpf}/${nome}/${perfil}/${oj}`;
  };

  const generateFullTemplate = () => {
    return `RESUMO: ${ticketData.titulo || 'N/A'}

TIPO DE ISSUE: ${formatType(ticketData.tipo)}

PRIORIDADE: ${formatPriority(ticketData.prioridade)}

USUÁRIO AFETADO: ${formatUsuarioAfetado()}

INFORMAÇÕES DO PROCESSO:
- Chamado de Origem: ${ticketData.chamadoOrigem || 'N/A'}
- Número do Processo: ${ticketData.numeroProcesso || 'N/A'}
- Grau: ${ticketData.grau ? `${ticketData.grau}º Grau` : 'N/A'}
- Órgão Julgador: ${ticketData.orgaoJulgador || 'N/A'}
- OJ Detectada: ${getOJName()}

DESCRIÇÃO:
${ticketData.descricao}

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
                value={ticketData.titulo || 'N/A'} 
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
                label="USUÁRIO AFETADO (CPF/Nome/Perfil/OJ)" 
                value={formatUsuarioAfetado()}
                className="border-l-4 border-purple-500"
              />

              <CopyField 
                label="DESCRIÇÃO (Description)" 
                value={ticketData.descricao}
                className="border-l-4 border-green-500"
              />
            </CardContent>
          </Card>

          {/* Informações do Processo */}
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
                value={getOJName()}
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
