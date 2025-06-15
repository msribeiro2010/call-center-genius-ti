
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import TicketCard from './TicketCard';
import TicketDetailsModal from './TicketDetailsModal';
import TicketSearchBar from './TicketSearchBar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticketId: string) => void;
}

const RecentTickets: React.FC<RecentTicketsProps> = ({ 
  tickets, 
  loading, 
  searchTerm,
  onSearchChange,
  onEditTicket, 
  onDeleteTicket 
}) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Verificar se o usuário é administrador
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao verificar status de admin:', error);
          return;
        }

        setIsAdmin(data?.is_admin || false);
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;

    try {
      const { error } = await supabase
        .from('chamados')
        .delete()
        .eq('id', ticketToDelete);

      if (error) {
        console.error('Erro ao excluir chamado:', error);
        toast({
          title: "Erro ao excluir chamado",
          description: "Não foi possível excluir o chamado.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Chamado excluído",
        description: "O chamado foi excluído com sucesso.",
      });

      // Chamar a função de exclusão do componente pai para atualizar a lista
      onDeleteTicket(ticketToDelete);
      
    } catch (error) {
      console.error('Erro ao excluir chamado:', error);
      toast({
        title: "Erro ao excluir chamado",
        description: "Não foi possível excluir o chamado.",
        variant: "destructive",
      });
    } finally {
      setTicketToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setTicketToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Chamados Recentes</CardTitle>
          <CardDescription>
            {loading ? "Carregando chamados..." : isAdmin ? "Visualize os últimos chamados criados - Clique com o botão direito para editar ou excluir" : "Visualize os últimos chamados criados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && (
            <TicketSearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              placeholder="Buscar por título, chamado origem, processo, descrição..."
            />
          )}
          
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Nenhum chamado encontrado para a busca atual." : "Nenhum chamado encontrado. Crie seu primeiro chamado!"}
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onViewTicket={handleViewTicket}
                  onEditTicket={onEditTicket}
                  onDeleteTicket={isAdmin ? handleDeleteClick : () => {}}
                  showDeleteOption={isAdmin}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este chamado? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RecentTickets;
