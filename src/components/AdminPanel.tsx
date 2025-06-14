import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Clock, ArrowLeft } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import AdminChat from '@/components/AdminChat';

const AdminPanel = () => {
  const { userSessions, loading, isAdmin } = useAdmin();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar o painel administrativo.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleChatWithUser = (userId: string) => {
    setSelectedUser(userId);
    setShowChat(true);
  };

  if (showChat && selectedUser) {
    return (
      <AdminChat 
        selectedUserId={selectedUser}
        onBack={() => {
          setShowChat(false);
          setSelectedUser(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Painel Administrativo
              </h1>
            </div>
            <Badge variant="secondary">
              <Users className="w-4 h-4 mr-1" />
              Administrador
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Usuários Conectados
              </CardTitle>
              <CardDescription>
                Lista de usuários atualmente logados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Carregando...</div>
              ) : userSessions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Nenhum usuário conectado no momento
                </div>
              ) : (
                <div className="space-y-4">
                  {userSessions.map((session) => {
                    const profile = session.profiles;
                    const initials = profile?.nome_completo
                      ?.split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U';

                    return (
                      <div 
                        key={session.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {profile?.nome_completo || 'Nome não informado'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {profile?.email}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              Última atividade: {new Date(session.last_seen).toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Online
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleChatWithUser(session.user_id)}
                            className="flex items-center gap-1"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
