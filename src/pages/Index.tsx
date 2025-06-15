
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateTicketForm from "@/components/CreateTicketForm";
import StatsCards from "@/components/StatsCards";
import RecentTickets from "@/components/RecentTickets";
import KnowledgeBase from "@/components/KnowledgeBase";
import Reports from "@/components/Reports";
import UserMenu from "@/components/UserMenu";
import AuthPage from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { useTickets } from "@/hooks/useTickets";
import { useAdmin } from "@/hooks/useAdmin";

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

const Index = () => {
  const { user, loading } = useAuth();
  const { tickets, loading: ticketsLoading, stats, searchTerm, setSearchTerm, deleteTicket } = useTickets();
  const { isAdmin } = useAdmin();
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const navigate = useNavigate();

  console.log('Index render:', { user: !!user, loading });

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    console.log('Mostrando loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, mostrar página de autenticação
  if (!user) {
    console.log('Usuário não logado, mostrando AuthPage...');
    return <AuthPage />;
  }

  console.log('Usuário logado, mostrando dashboard...');

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    console.log('Editing ticket:', ticket);
  };

  const handleDeleteTicket = (ticketId: string) => {
    deleteTicket(ticketId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                TRT15 - Sistema de Gestão
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/chatbot')}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                ChatBot
              </Button>
              <span className="text-sm text-gray-600">
                Bem-vindo, {user?.user_metadata?.full_name || user?.email}
              </span>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Mostrar StatsCards apenas para administradores */}
          {isAdmin && <StatsCards stats={stats} />}
          
          <Tabs defaultValue="tickets" className={isAdmin ? "mt-6" : ""}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tickets">Chamados</TabsTrigger>
              <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tickets" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CreateTicketForm />
                <RecentTickets 
                  tickets={tickets}
                  loading={ticketsLoading}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onEditTicket={handleEditTicket}
                  onDeleteTicket={handleDeleteTicket}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="knowledge">
              <KnowledgeBase />
            </TabsContent>
            
            <TabsContent value="reports">
              <Reports />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
