
import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu';
import { Edit, Trash2, Eye } from 'lucide-react';
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

interface TicketCardProps {
  ticket: Ticket;
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticketId: string) => void;
  showDeleteOption?: boolean;
  isAdmin?: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  showDeleteOption = true,
  isAdmin = false,
}) => {
  const handleCardClick = () => {
    onViewTicket(ticket);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditTicket(ticket);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteTicket(ticket.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{ticket.titulo}</h3>
            <p className="text-sm text-gray-500">
              Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
            </p>
            {ticket.numero_processo && (
              <p className="text-sm text-gray-600">Processo: {ticket.numero_processo}</p>
            )}
            {ticket.chamado_origem && (
              <p className="text-sm text-blue-600 font-medium">
                Originado do chamado: {ticket.chamado_origem}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {ticket.prioridade && (
              <Badge variant={getPriorityVariant(ticket.prioridade)}>
                {getPriorityLabel(ticket.prioridade)}
              </Badge>
            )}
            {ticket.tipo && (
              <Badge variant="outline">{ticket.tipo}</Badge>
            )}
            <Badge variant={ticket.status === "Aberto" ? "destructive" : "default"}>
              {ticket.status}
            </Badge>
            
            {/* Botões visíveis para administradores */}
            {isAdmin && (
              <div className="flex items-center space-x-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditClick}
                  className="h-8 w-8 p-0"
                  title="Editar Chamado"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {showDeleteOption && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteClick}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Excluir Chamado"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            
            {/* Botão de visualizar sempre visível para não-admins */}
            {!isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTicket(ticket);
                }}
                className="ml-2"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onViewTicket(ticket)}>
          <Eye className="mr-2 h-4 w-4" />
          Visualizar Chamado
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onEditTicket(ticket)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar Chamado
        </ContextMenuItem>
        {showDeleteOption && (
          <ContextMenuItem 
            onClick={() => onDeleteTicket(ticket.id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir Chamado
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TicketCard;
