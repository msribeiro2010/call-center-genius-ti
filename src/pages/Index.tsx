
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
import { Sparkles, Zap } from "lucide-react";

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
    console.log('Editando ticket:', ticket);
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
          <div className="space-y-8">
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

  const navigationTabs = [
    { id: "dashboard", label: "Dashboard", icon: Sparkles },
    { id: "create", label: "Criar Chamado", icon: Zap },
    { id: "knowledge", label: "Base de Conhecimento", icon: Sparkles },
    { id: "templates", label: "Templates", icon: Zap },
    { id: "history", label: "Histórico", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Glass Header */}
      <header className="relative backdrop-blur-md bg-white/5 border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center py-8">
            {/* Logo Section */}
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    TI Support
                  </h1>
                  <p className="text-white/70 text-lg">Sistema Inteligente de Chamados JIRA</p>
                </div>
              </div>
            </div>

            {/* Modern Navigation */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-2">
              {navigationTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="ghost"
                    className={`group relative px-6 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 text-white shadow-lg"
                        : "hover:bg-white/10 backdrop-blur-sm text-white/80 hover:text-white border border-transparent hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Glass Effect */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8">
          {renderContent()}
        </div>
      </main>

      {/* Floating Elements */}
      <div className="fixed bottom-8 right-8 pointer-events-none">
        <div className="w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
      </div>
      <div className="fixed top-1/4 left-8 pointer-events-none">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default Index;
