
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import TicketCard from './TicketCard';
import TicketDetailsModal from './TicketDetailsModal';
import TicketSearchBar from './TicketSearchBar';

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
                  onDeleteTicket={onDeleteTicket}
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
    </>
  );
};

export default RecentTickets;
