
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Plus, FileText, Database, Image as ImageIcon, Search, Edit, Trash2, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import CreateTicketForm from "@/components/CreateTicketForm";
import TicketTemplates from "@/components/TicketTemplates";
import TicketHistory from "@/components/TicketHistory";
import KnowledgeBase from "@/components/KnowledgeBase";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('chamados')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTickets(data || []);
    } catch (error) {
      console.error('Erro ao carregar chamados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar chamados do banco de dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === "Aberto").length,
    inProgress: tickets.filter(t => t.status === "Em andamento").length,
    templates: 12
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setActiveTab("create");
  };

  const handleDeleteTicket = async (ticketId) => {
    if (confirm("Tem certeza que deseja excluir este chamado?")) {
      try {
        const { error } = await supabase
          .from('chamados')
          .delete()
          .eq('id', ticketId);

        if (error) throw error;

        setTickets(tickets.filter(t => t.id !== ticketId));
        toast({
          title: "Sucesso",
          description: "Chamado excluído com sucesso"
        });
      } catch (error) {
        console.error('Erro ao excluir chamado:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir chamado",
          variant: "destructive"
        });
      }
    }
  };

  const handleTicketCreated = () => {
    setEditingTicket(null);
    setActiveTab("dashboard");
    loadTickets(); // Recarregar lista de chamados
  };

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateTicketForm onTicketCreated={handleTicketCreated} editingTicket={editingTicket} />;
      case "templates":
        return <TicketTemplates />;
      case "history":
        return <TicketHistory tickets={tickets} />;
      case "knowledge":
        return <KnowledgeBase />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total de Chamados</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800">{stats.totalTickets}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">Chamados Abertos</CardTitle>
                  <Search className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-800">{stats.openTickets}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Em Andamento</CardTitle>
                  <Database className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800">{stats.inProgress}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Templates</CardTitle>
                  <ImageIcon className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-800">{stats.templates}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Ações Rápidas</CardTitle>
                <CardDescription>Gerencie seus chamados e acesse a base de conhecimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => {
                      setEditingTicket(null);
                      setActiveTab("create");
                    }}
                    className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2"
                  >
                    <Plus className="h-6 w-6" />
                    <span>Novo Chamado</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab("knowledge")}
                    className="h-24 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center space-y-2"
                  >
                    <BookOpen className="h-6 w-6" />
                    <span>Base de Conhecimento</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab("templates")}
                    variant="outline"
                    className="h-24 border-2 border-blue-200 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2"
                  >
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span>Templates</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab("history")}
                    variant="outline"
                    className="h-24 border-2 border-gray-200 hover:bg-gray-50 flex flex-col items-center justify-center space-y-2"
                  >
                    <Search className="h-6 w-6 text-gray-600" />
                    <span>Histórico</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
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
                                <Badge variant={
                                  ticket.prioridade === "critica" ? "destructive" : 
                                  ticket.prioridade === "alta" ? "destructive" : 
                                  ticket.prioridade === "media" ? "default" : "secondary"
                                }>
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
                          <ContextMenuItem onClick={() => handleEditTicket(ticket)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Chamado
                          </ContextMenuItem>
                          <ContextMenuItem 
                            onClick={() => handleDeleteTicket(ticket.id)}
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
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TI Support</h1>
              <p className="text-gray-600">Sistema de Geração de Chamados JIRA</p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setActiveTab("dashboard")}
                variant={activeTab === "dashboard" ? "default" : "outline"}
                className={activeTab === "dashboard" ? "bg-blue-600 text-white" : ""}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => setActiveTab("create")}
                variant={activeTab === "create" ? "default" : "outline"}
                className={activeTab === "create" ? "bg-blue-600 text-white" : ""}
              >
                Criar Chamado
              </Button>
              <Button
                onClick={() => setActiveTab("knowledge")}
                variant={activeTab === "knowledge" ? "default" : "outline"}
                className={activeTab === "knowledge" ? "bg-blue-600 text-white" : ""}
              >
                Base de Conhecimento
              </Button>
              <Button
                onClick={() => setActiveTab("templates")}
                variant={activeTab === "templates" ? "default" : "outline"}
                className={activeTab === "templates" ? "bg-blue-600 text-white" : ""}
              >
                Templates
              </Button>
              <Button
                onClick={() => setActiveTab("history")}
                variant={activeTab === "history" ? "default" : "outline"}
                className={activeTab === "history" ? "bg-blue-600 text-white" : ""}
              >
                Histórico
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
