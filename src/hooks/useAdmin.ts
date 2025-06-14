
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface UserSession {
  id: string;
  user_id: string;
  last_seen: string;
  is_online: boolean;
  profiles?: {
    nome_completo: string;
    email: string;
    avatar_url?: string;
  };
}

interface AdminMessage {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  read: boolean;
  created_at: string;
  from_profiles?: {
    nome_completo: string;
    email: string;
  };
}

export const useAdmin = () => {
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Verificar se o usuário é admin
  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error);
    }
  };

  // Buscar usuários logados
  const fetchUserSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select(`
          id,
          user_id,
          last_seen,
          is_online,
          profiles!user_sessions_user_id_fkey (
            nome_completo,
            email,
            avatar_url
          )
        `)
        .eq('is_online', true)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      setUserSessions(data || []);
    } catch (error) {
      console.error('Erro ao buscar sessões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar usuários logados",
        variant: "destructive"
      });
    }
  };

  // Buscar mensagens do chat
  const fetchMessages = async (userId?: string) => {
    if (!user) return;

    try {
      let query = supabase
        .from('admin_messages')
        .select(`
          id,
          from_user_id,
          to_user_id,
          message,
          read,
          created_at,
          from_profiles:profiles!admin_messages_from_user_id_fkey (
            nome_completo,
            email
          )
        `)
        .order('created_at', { ascending: true });

      if (userId) {
        query = query.or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  // Enviar mensagem
  const sendMessage = async (toUserId: string, message: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('admin_messages')
        .insert({
          from_user_id: user.id,
          to_user_id: toUserId,
          message
        });

      if (error) throw error;

      toast({
        title: "Mensagem enviada",
        description: "Mensagem enviada com sucesso"
      });

      // Recarregar mensagens
      fetchMessages(toUserId);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
    }
  };

  // Atualizar sessão do usuário
  const updateUserSession = async () => {
    if (!user) return;

    try {
      await supabase
        .from('user_sessions')
        .upsert({
          user_id: user.id,
          last_seen: new Date().toISOString(),
          is_online: true
        });
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchUserSessions();
      // Atualizar lista a cada 30 segundos
      const interval = setInterval(fetchUserSessions, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (user) {
      updateUserSession();
      // Atualizar sessão a cada 5 minutos
      const interval = setInterval(updateUserSession, 300000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return {
    userSessions,
    messages,
    loading,
    isAdmin,
    fetchMessages,
    sendMessage,
    fetchUserSessions
  };
};
