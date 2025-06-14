import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu';
import { Edit, Trash2, Eye } from 'lucide-react';

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
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getPriorityVariant = (prioridade: number) => {
    switch (prioridade) {
      case 5:
        return "destructive"; // Crítica
      case 4:
        return "destructive"; // Alta
      case 3:
        return "default"; // Média
      case 2:
        return "secondary"; // Baixa
      case 1:
        return "secondary"; // Muito baixa
      default:
        return "default";
    }
  };

  const getPriorityLabel = (prioridade: number) => {
    switch (prioridade) {
      case 5:
        return "Crítica";
      case 4:
        return "Alta";
      case 3:
        return "Média";
      case 2:
        return "Baixa";
      case 1:
        return "Muito baixa";
      default:
        return "Não definida";
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  return (
    <>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTicket(ticket);
                          }}
                          className="ml-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleViewTicket(ticket)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar Chamado
                    </ContextMenuItem>
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

      {/* Modal de Detalhes do Chamado */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes do Chamado - {selectedTicket?.titulo}
            </DialogTitle>
            <DialogDescription>
              Visualize todas as informações do chamado
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
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
                      <span className="text-right max-w-[200px] break-words">{selectedTicket.titulo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge variant={selectedTicket.status === "Aberto" ? "destructive" : "default"}>
                        {selectedTicket.status}
                      </Badge>
                    </div>
                    {selectedTicket.prioridade && (
                      <div className="flex justify-between">
                        <span className="font-medium">Prioridade:</span>
                        <Badge variant={getPriorityVariant(selectedTicket.prioridade)}>
                          {getPriorityLabel(selectedTicket.prioridade)}
                        </Badge>
                      </div>
                    )}
                    {selectedTicket.tipo && (
                      <div className="flex justify-between">
                        <span className="font-medium">Tipo:</span>
                        <Badge variant="outline">{selectedTicket.tipo}</Badge>
                      </div>
                    )}
                    {selectedTicket.chamado_origem && (
                      <div className="flex justify-between">
                        <span className="font-medium">Chamado Origem:</span>
                        <span className="text-blue-600 font-medium">{selectedTicket.chamado_origem}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">Criado em:</span>
                      <span>{new Date(selectedTicket.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dados do Processo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedTicket.numero_processo && (
                      <div className="flex justify-between">
                        <span className="font-medium">Número do Processo:</span>
                        <span className="text-right font-mono text-sm">{selectedTicket.numero_processo}</span>
                      </div>
                    )}
                    {selectedTicket.grau && (
                      <div className="flex justify-between">
                        <span className="font-medium">Grau:</span>
                        <span>{selectedTicket.grau}</span>
                      </div>
                    )}
                    {selectedTicket.orgao_julgador && (
                      <div className="flex justify-between">
                        <span className="font-medium">Órgão Julgador:</span>
                        <span>{selectedTicket.orgao_julgador}</span>
                      </div>
                    )}
                    {selectedTicket.oj_detectada && (
                      <div className="flex justify-between">
                        <span className="font-medium">OJ Detectada:</span>
                        <span className="text-right max-w-[200px] break-words">{selectedTicket.oj_detectada}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Usuário Afetado */}
              {(selectedTicket.nome_usuario_afetado || selectedTicket.cpf_usuario_afetado || selectedTicket.perfil_usuario_afetado) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Usuário Afetado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedTicket.nome_usuario_afetado && (
                      <div className="flex justify-between">
                        <span className="font-medium">Nome:</span>
                        <span>{selectedTicket.nome_usuario_afetado}</span>
                      </div>
                    )}
                    {selectedTicket.cpf_usuario_afetado && (
                      <div className="flex justify-between">
                        <span className="font-medium">CPF:</span>
                        <span className="font-mono">{selectedTicket.cpf_usuario_afetado}</span>
                      </div>
                    )}
                    {selectedTicket.perfil_usuario_afetado && (
                      <div className="flex justify-between">
                        <span className="font-medium">Perfil:</span>
                        <Badge variant="outline">{selectedTicket.perfil_usuario_afetado}</Badge>
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
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.descricao}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecentTickets;
