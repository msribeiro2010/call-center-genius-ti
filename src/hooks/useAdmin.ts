
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { userSessionService } from '@/services/userSessionService';
import { adminMessageService } from '@/services/adminMessageService';
import { adminService } from '@/services/adminService';
import type { UserSession, AdminMessage } from '@/types/admin';

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
      const adminStatus = await adminService.checkAdminStatus(user.id);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error);
    }
  };

  // Buscar usuários logados
  const fetchUserSessions = async () => {
    try {
      const sessions = await userSessionService.fetchUserSessions();
      setUserSessions(sessions);
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
      const messages = await adminMessageService.fetchMessages(userId);
      setMessages(messages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  // Enviar mensagem
  const sendMessage = async (toUserId: string, message: string) => {
    if (!user) return;

    try {
      await adminMessageService.sendMessage(user.id, toUserId, message);

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
      await userSessionService.updateUserSession(user.id);
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
