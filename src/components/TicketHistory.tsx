
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, FileText, Database, Calendar, User, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Assunto {
  id: string;
  nome: string;
  categoria: string;
}

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
  assunto_id?: string;
  assuntos?: Assunto;
}

interface TicketHistoryProps {
  tickets: Ticket[];
}

const TicketHistory = ({ tickets }: TicketHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [ticketsWithAssuntos, setTicketsWithAssuntos] = useState<Ticket[]>([]);

  // Buscar assuntos relacionados aos tickets
  useEffect(() => {
    const fetchTicketsWithAssuntos = async () => {
      if (!tickets || tickets.length === 0) {
        setTicketsWithAssuntos([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('chamados')
          .select(`
            *,
            assuntos (
              id,
              nome,
              categoria
            )
          `)
          .in('id', tickets.map(t => t.id));

        if (error) throw error;
        setTicketsWithAssuntos(data || []);
      } catch (error) {
        console.error('Erro ao buscar tickets com assuntos:', error);
        setTicketsWithAssuntos(tickets);
      }
    };

    fetchTicketsWithAssuntos();
  }, [tickets]);

  // Filtrar tickets com verificação de segurança
  const filteredTickets = ticketsWithAssuntos.filter(ticket => {
    if (!ticket || typeof ticket !== 'object') return false;
    
    const titulo = ticket.titulo || '';
    const tipo = ticket.tipo || '';
    const status = ticket.status || '';
    const assunto = ticket.assuntos?.nome || '';
    
    return titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           status.toLowerCase().includes(searchTerm.toLowerCase()) ||
           assunto.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case "aberto":
        return "bg-red-100 text-red-800";
      case "em andamento":
        return "bg-yellow-100 text-yellow-800";
      case "resolvido":
        return "bg-green-100 text-green-800";
      case "fechado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityColor = (prioridade: number) => {
    switch (prioridade) {
      case 5:
        return "bg-red-500 text-white"; // Crítica
      case 4:
        return "bg-orange-500 text-white"; // Alta
      case 3:
        return "bg-yellow-500 text-white"; // Média
      case 2:
        return "bg-green-500 text-white"; // Baixa
      case 1:
        return "bg-green-500 text-white"; // Muito baixa
      default:
        return "bg-gray-500 text-white";
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

  const openTicketDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Histórico de Chamados</h2>
        <p className="text-gray-600">Visualize e gerencie todos os chamados criados</p>
      </div>

      {/* Barra de Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar por título, tipo, status ou assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Chamados */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      #{ticket.id} - {ticket.titulo}
                    </h3>
                    {ticket.prioridade && (
                      <Badge className={getPriorityColor(ticket.prioridade)}>
                        {getPriorityLabel(ticket.prioridade)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {ticket.tipo && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{ticket.tipo}</span>
                      </div>
                    )}
                    {ticket.assuntos && (
                      <div className="flex items-center space-x-1">
                        <Tag className="h-4 w-4" />
                        <span className="truncate max-w-xs">{ticket.assuntos.nome}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(ticket.status || '')}>
                    {ticket.status || 'Sem status'}
                  </Badge>
                  
                  <Button
                    onClick={() => openTicketDetails(ticket)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum chamado encontrado</h3>
            <p className="text-gray-500">
              {searchTerm ? "Tente modificar sua pesquisa" : "Nenhum chamado foi criado ainda"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Chamado #{selectedTicket?.id} - {selectedTicket?.titulo}
            </DialogTitle>
            <DialogDescription>
              Visualize todos os detalhes do chamado
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusColor(selectedTicket.status || '')}>
                        {selectedTicket.status || 'Sem status'}
                      </Badge>
                    </div>
                    {selectedTicket.prioridade && (
                      <div className="flex justify-between">
                        <span className="font-medium">Prioridade:</span>
                        <Badge className={getPriorityColor(selectedTicket.prioridade)}>
                          {getPriorityLabel(selectedTicket.prioridade)}
                        </Badge>
                      </div>
                    )}
                    {selectedTicket.tipo && (
                      <div className="flex justify-between">
                        <span className="font-medium">Tipo:</span>
                        <span>{selectedTicket.tipo}</span>
                      </div>
                    )}
                    {selectedTicket.assuntos && (
                      <div className="flex justify-between">
                        <span className="font-medium">Assunto:</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{selectedTicket.assuntos.nome}</div>
                          <div className="text-xs text-gray-500">{selectedTicket.assuntos.categoria}</div>
                        </div>
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
                    {selectedTicket.chamado_origem && (
                      <div className="flex justify-between">
                        <span className="font-medium">Chamado Origem:</span>
                        <span>{selectedTicket.chamado_origem}</span>
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
              {selectedTicket.descricao && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Descrição do Problema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.descricao}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketHistory;
