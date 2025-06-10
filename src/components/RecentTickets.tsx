
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu';
import { Edit, Trash2 } from 'lucide-react';

interface Ticket {
  id: string;
  titulo: string;
  created_at: string;
  numero_processo?: string;
  prioridade?: string;
  tipo?: string;
  status?: string;
  chamado_origem?: string;
  grau?: string;
  orgao_julgador?: string;
  oj_detectada?: string;
  descricao?: string;
}

interface RecentTicketsProps {
  tickets: Ticket[];
  loading: boolean;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticketId: string) => void;
}

const RecentTickets: React.FC<RecentTicketsProps> = ({ 
  tickets, 
  loading, 
  onEditTicket, 
  onDeleteTicket 
}) => {
  const getPriorityVariant = (prioridade: string) => {
    switch (prioridade) {
      case "critica":
      case "alta":
        return "destructive";
      case "media":
        return "default";
      case "baixa":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Chamados Recentes</CardTitle>
        <CardDescription>
          {loading ? "Carregando chamados..." : "Visualize os últimos chamados criados - Clique com o botão direito para editar ou excluir"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum chamado encontrado. Crie seu primeiro chamado!
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <ContextMenu key={ticket.id}>
                <ContextMenuTrigger>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{ticket.titulo}</h3>
                      <p className="text-sm text-gray-500">
                        Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      {ticket.numero_processo && (
                        <p className="text-sm text-gray-600">Processo: {ticket.numero_processo}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {ticket.prioridade && (
                        <Badge variant={getPriorityVariant(ticket.prioridade)}>
                          {ticket.prioridade}
                        </Badge>
                      )}
                      {ticket.tipo && (
                        <Badge variant="outline">{ticket.tipo}</Badge>
                      )}
                      <Badge variant={ticket.status === "Aberto" ? "destructive" : "default"}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => onEditTicket(ticket)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Chamado
                  </ContextMenuItem>
                  <ContextMenuItem 
                    onClick={() => onDeleteTicket(ticket.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Chamado
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTickets;
