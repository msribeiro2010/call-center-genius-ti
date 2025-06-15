
import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { primeiroGrauOJs, segundoGrauOJs } from '@/data';
import JiraTemplateHeader from './JiraTemplate/JiraTemplateHeader';
import JiraMainFields from './JiraTemplate/JiraMainFields';
import ProcessInfo from './JiraTemplate/ProcessInfo';
import TemplatePreview from './JiraTemplate/TemplatePreview';
import { formatPriority, formatType } from './JiraTemplate/utils';

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

  const getOJName = () => {
    if (!ticketData.orgaoJulgador || !ticketData.grau) return 'N/A';
    
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <JiraTemplateHeader onClose={onClose} />

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

          <JiraMainFields
            ticketData={ticketData}
            formatType={formatType}
            formatPriority={formatPriority}
            formatUsuarioAfetado={formatUsuarioAfetado}
            onCopy={copyToClipboard}
          />

          <ProcessInfo
            ticketData={ticketData}
            getOJName={getOJName}
            onCopy={copyToClipboard}
          />

          <TemplatePreview templateContent={generateFullTemplate()} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JiraTemplateModal;
