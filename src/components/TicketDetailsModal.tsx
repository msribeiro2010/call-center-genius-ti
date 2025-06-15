
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Ticket {
  id: string;
  titulo: string;
  created_at: string;
  numero_processo?: string;
  prioridade?: number;
  tipo?: string;
  status?: string;
  chamado_origem?: string;
  grau?: string;
  orgao_julgador?: string;
  oj_detectada?: string;
  descricao?: string;
  nome_usuario_afetado?: string;
  cpf_usuario_afetado?: string;
  perfil_usuario_afetado?: string;
}

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticket,
  isOpen,
  onOpenChange,
}) => {
  if (!ticket) return null;

  // Formatar usuário afetado no formato: nome/cpf/perfil/OJ
  const formatUsuarioAfetado = () => {
    const parts = [];
    if (ticket.nome_usuario_afetado) parts.push(ticket.nome_usuario_afetado);
    if (ticket.cpf_usuario_afetado) parts.push(ticket.cpf_usuario_afetado);
    if (ticket.perfil_usuario_afetado) parts.push(ticket.perfil_usuario_afetado);
    if (ticket.oj_detectada) parts.push(ticket.oj_detectada);
    return parts.length > 0 ? parts.join(' / ') : 'N/A';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Detalhes do Chamado
          </DialogTitle>
          <DialogDescription>
            Informações essenciais do chamado
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações do Chamado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticket.chamado_origem && (
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-600">Chamado de Origem:</span>
                <span className="text-blue-600 font-medium">{ticket.chamado_origem}</span>
              </div>
            )}
            
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-600">Título do Assunto:</span>
              <span className="text-right max-w-[300px] break-words">{ticket.titulo}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-600">Data de Criação:</span>
              <span>{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</span>
            </div>

            {ticket.numero_processo && (
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-600">Número do Processo:</span>
                <span className="text-right font-mono text-sm">{ticket.numero_processo}</span>
              </div>
            )}

            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-600">Usuário Afetado:</span>
              <span className="text-right max-w-[300px] break-words">{formatUsuarioAfetado()}</span>
            </div>

            {ticket.descricao && (
              <div className="flex flex-col space-y-2">
                <span className="font-medium text-gray-600">Descrição do Problema:</span>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">{ticket.descricao}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailsModal;
