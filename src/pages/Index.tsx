
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import CreateTicketForm from "@/components/CreateTicketForm";
import TicketTemplates from "@/components/TicketTemplates";
import TicketHistory from "@/components/TicketHistory";
import KnowledgeBase from "@/components/KnowledgeBase";
import StatsCards from "@/components/StatsCards";
import QuickActions from "@/components/QuickActions";
import RecentTickets from "@/components/RecentTickets";

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

  const handleCreateTicket = () => {
    setEditingTicket(null);
    setActiveTab("create");
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
            <StatsCards stats={stats} />
            
            <QuickActions 
              onCreateTicket={handleCreateTicket}
              onOpenKnowledge={() => setActiveTab("knowledge")}
              onOpenTemplates={() => setActiveTab("templates")}
              onOpenHistory={() => setActiveTab("history")}
            />

            <RecentTickets 
              tickets={tickets}
              loading={loading}
              onEditTicket={handleEditTicket}
              onDeleteTicket={handleDeleteTicket}
            />
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
