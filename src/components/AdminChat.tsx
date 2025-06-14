
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AdminChatProps {
  selectedUserId: string;
  onBack: () => void;
}

const AdminChat: React.FC<AdminChatProps> = ({ selectedUserId, onBack }) => {
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const { messages, sendMessage, fetchMessages } = useAdmin();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages(selectedUserId);
    
    // Buscar perfil do usuário selecionado
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', selectedUserId)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
      }
    };

    fetchUserProfile();
  }, [selectedUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(selectedUserId, message);
    setMessage('');
  };

  const initials = userProfile?.nome_completo
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || userProfile?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {userProfile?.nome_completo || 'Usuário'}
                </h1>
                <p className="text-sm text-gray-500">{userProfile?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Chat Administrativo</CardTitle>
              <CardDescription>
                Conversa com {userProfile?.nome_completo || userProfile?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Nenhuma mensagem ainda. Inicie a conversa!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isFromAdmin = msg.from_user_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isFromAdmin
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            isFromAdmin ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminChat;
