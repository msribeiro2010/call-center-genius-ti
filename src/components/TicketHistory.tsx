
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, FileText, Database, Calendar, User } from "lucide-react";

interface Ticket {
  id: number;
  title: string;
  type: string;
  status: string;
  created: string;
  priority: string;
}

interface TicketHistoryProps {
  tickets: Ticket[];
}

const TicketHistory = ({ tickets }: TicketHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Dados expandidos dos chamados para demonstração
  const ticketDetails = {
    1: {
      description: "Usuários não conseguem fazer login no sistema. O erro aparece após inserir credenciais válidas.",
      environment: "Produção",
      steps: "1. Acessar tela de login\n2. Inserir credenciais\n3. Clicar em entrar\n4. Erro é exibido",
      expectedResult: "Login deveria ser realizado com sucesso",
      actualResult: "Mensagem de erro 'Falha na autenticação' é exibida",
      jiraText: "h2. Problema de Login\nUsuários não conseguem acessar o sistema...",
      sqlQuery: "SELECT * FROM user_sessions WHERE login_attempts > 3 AND timestamp >= NOW() - INTERVAL 1 HOUR;",
      images: ["screenshot_error.png"],
      assignee: "João Silva",
      reporter: "Maria Santos"
    },
    2: {
      description: "Sistema de vendas apresenta lentidão excessiva durante picos de acesso.",
      environment: "Produção",
      steps: "1. Acessar módulo de vendas\n2. Tentar criar nova venda\n3. Observar demora no carregamento",
      expectedResult: "Tela deveria carregar em até 3 segundos",
      actualResult: "Tela demora mais de 15 segundos para carregar",
      jiraText: "h2. Problema de Performance\nSistema de vendas com lentidão...",
      sqlQuery: "SELECT query_time, query FROM slow_queries WHERE execution_time > 5 ORDER BY execution_time DESC;",
      images: ["performance_metrics.png"],
      assignee: "Pedro Costa",
      reporter: "Ana Oliveira"
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "crítica":
        return "bg-red-500 text-white";
      case "alta":
        return "bg-orange-500 text-white";
      case "média":
        return "bg-yellow-500 text-white";
      case "baixa":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const openTicketDetails = (ticket: Ticket) => {
    setSelectedTicket({
      ...ticket,
      ...(ticketDetails as any)[ticket.id]
    });
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
              placeholder="Pesquisar por título, tipo ou status..."
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
                    <h3 className="text-lg font-semibold text-gray-900">#{ticket.id} - {ticket.title}</h3>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{ticket.created}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{ticket.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
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
              Chamado #{selectedTicket?.id} - {selectedTicket?.title}
            </DialogTitle>
            <DialogDescription>
              Visualize todos os detalhes do chamado e os textos gerados
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
                      <Badge className={getStatusColor(selectedTicket.status)}>
                        {selectedTicket.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Prioridade:</span>
                      <Badge className={getPriorityColor(selectedTicket.priority)}>
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tipo:</span>
                      <span>{selectedTicket.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ambiente:</span>
                      <span>{selectedTicket.environment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Criado em:</span>
                      <span>{selectedTicket.created}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Responsáveis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Responsável:</span>
                      <span>{selectedTicket.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Solicitante:</span>
                      <span>{selectedTicket.reporter}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Descrição */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descrição do Problema</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{selectedTicket.description}</p>
                </CardContent>
              </Card>

              {/* Texto JIRA e Query */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>Texto JIRA</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap">{selectedTicket.jiraText}</pre>
                    </div>
                  </CardContent>
                </Card>

                {selectedTicket.sqlQuery && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-green-600" />
                        <span>Query SQL</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm">{selectedTicket.sqlQuery}</pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Evidências */}
              {selectedTicket.images && selectedTicket.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evidências</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedTicket.images.map((image: string, index: number) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          <FileText className="h-3 w-3 mr-1" />
                          {image}
                        </Badge>
                      ))}
                    </div>
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
