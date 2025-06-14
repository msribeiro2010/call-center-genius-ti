
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { getPriorityVariant, getPriorityLabel } from '@/utils/ticketPriorityUtils';

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalhes do Chamado - {ticket.titulo}
          </DialogTitle>
          <DialogDescription>
            Visualize todas as informações do chamado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Chamado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Título:</span>
                  <span className="text-right max-w-[200px] break-words">{ticket.titulo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={ticket.status === "Aberto" ? "destructive" : "default"}>
                    {ticket.status}
                  </Badge>
                </div>
                {ticket.prioridade && (
                  <div className="flex justify-between">
                    <span className="font-medium">Prioridade:</span>
                    <Badge variant={getPriorityVariant(ticket.prioridade)}>
                      {getPriorityLabel(ticket.prioridade)}
                    </Badge>
                  </div>
                )}
                {ticket.tipo && (
                  <div className="flex justify-between">
                    <span className="font-medium">Tipo:</span>
                    <Badge variant="outline">{ticket.tipo}</Badge>
                  </div>
                )}
                {ticket.chamado_origem && (
                  <div className="flex justify-between">
                    <span className="font-medium">Chamado Origem:</span>
                    <span className="text-blue-600 font-medium">{ticket.chamado_origem}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Criado em:</span>
                  <span>{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Processo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ticket.numero_processo && (
                  <div className="flex justify-between">
                    <span className="font-medium">Número do Processo:</span>
                    <span className="text-right font-mono text-sm">{ticket.numero_processo}</span>
                  </div>
                )}
                {ticket.grau && (
                  <div className="flex justify-between">
                    <span className="font-medium">Grau:</span>
                    <span>{ticket.grau}</span>
                  </div>
                )}
                {ticket.orgao_julgador && (
                  <div className="flex justify-between">
                    <span className="font-medium">Órgão Julgador:</span>
                    <span>{ticket.orgao_julgador}</span>
                  </div>
                )}
                {ticket.oj_detectada && (
                  <div className="flex justify-between">
                    <span className="font-medium">OJ Detectada:</span>
                    <span className="text-right max-w-[200px] break-words">{ticket.oj_detectada}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Usuário Afetado */}
          {(ticket.nome_usuario_afetado || ticket.cpf_usuario_afetado || ticket.perfil_usuario_afetado) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usuário Afetado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ticket.nome_usuario_afetado && (
                  <div className="flex justify-between">
                    <span className="font-medium">Nome:</span>
                    <span>{ticket.nome_usuario_afetado}</span>
                  </div>
                )}
                {ticket.cpf_usuario_afetado && (
                  <div className="flex justify-between">
                    <span className="font-medium">CPF:</span>
                    <span className="font-mono">{ticket.cpf_usuario_afetado}</span>
                  </div>
                )}
                {ticket.perfil_usuario_afetado && (
                  <div className="flex justify-between">
                    <span className="font-medium">Perfil:</span>
                    <Badge variant="outline">{ticket.perfil_usuario_afetado}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Descrição do Problema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descrição do Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.descricao}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailsModal;
