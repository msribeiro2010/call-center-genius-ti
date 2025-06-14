
import { useState, useEffect } from 'react';
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

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chamados')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao buscar chamados:', error);
        toast({
          title: "Erro ao carregar chamados",
          description: "Não foi possível carregar os chamados.",
          variant: "destructive",
        });
        return;
      }

      setTickets(data || []);
      setFilteredTickets(data || []);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
      toast({
        title: "Erro ao carregar chamados",
        description: "Não foi possível carregar os chamados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchTickets = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const filtered = tickets.filter(ticket => 
      ticket.titulo.toLowerCase().includes(term.toLowerCase()) ||
      ticket.chamado_origem?.toLowerCase().includes(term.toLowerCase()) ||
      ticket.numero_processo?.toLowerCase().includes(term.toLowerCase()) ||
      ticket.descricao?.toLowerCase().includes(term.toLowerCase()) ||
      ticket.nome_usuario_afetado?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTickets(filtered);
  };

  const deleteTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('chamados')
        .delete()
        .eq('id', ticketId);

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

      // Refresh tickets list
      fetchTickets();
    } catch (error) {
      console.error('Erro ao excluir chamado:', error);
      toast({
        title: "Erro ao excluir chamado",
        description: "Não foi possível excluir o chamado.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    searchTickets(searchTerm);
  }, [tickets, searchTerm]);

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'Aberto').length,
    inProgress: tickets.filter(t => t.status === 'Em Andamento').length,
    templates: 0, // This would come from knowledge base
  };

  return {
    tickets: filteredTickets,
    loading,
    stats,
    searchTerm,
    setSearchTerm: searchTickets,
    fetchTickets,
    deleteTicket,
  };
};
