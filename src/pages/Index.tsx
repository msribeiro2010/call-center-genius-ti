
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CreateTicketForm from "@/components/CreateTicketForm";
import StatsCards from "@/components/StatsCards";
import RecentTickets from "@/components/RecentTickets";
import KnowledgeBase from "@/components/KnowledgeBase";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { useTickets } from "@/hooks/useTickets";

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
  const { user } = useAuth();
  const { tickets, loading, stats, deleteTicket } = useTickets();
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    // TODO: Implement edit modal
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
          <StatsCards stats={stats} />
          
          <Tabs defaultValue="tickets" className="mt-6">
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
                  loading={loading}
                  onEditTicket={handleEditTicket}
                  onDeleteTicket={handleDeleteTicket}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="knowledge">
              <KnowledgeBase />
            </TabsContent>
            
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios</CardTitle>
                  <CardDescription>
                    Visualize estatísticas e relatórios do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Funcionalidade de relatórios em desenvolvimento...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
