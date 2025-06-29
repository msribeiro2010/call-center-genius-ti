
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Loader2, MessageCircle, Database, BookOpen, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: {
    knowledgeBaseCount: number;
    assuntosCount: number;
    chamadosCount: number;
  };
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual do PJe TRT15 versão 2.0! 🤖\n\nMelhorias implementadas:\n• Busca inteligente na base de conhecimento com múltiplas estratégias\n• Extração automática de palavras-chave\n• Fallback para OpenAI quando disponível\n• Melhores correspondências por relevância\n\nPosso ajudar você com:\n• Problemas técnicos do sistema PJe\n• Dúvidas sobre funcionalidades\n• Soluções baseadas em nossa base de conhecimento\n• Sugestões de assuntos para chamados\n\nComo posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useV2, setUseV2] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Enviando mensagem para o chatbot:', currentMessage);
      console.log('Usando versão:', useV2 ? 'V2' : 'V1');
      
      const functionName = useV2 ? 'chatbot-v2' : 'chatbot';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { message: currentMessage }
      });

      console.log('Resposta do chatbot:', { data, error });

      if (error) {
        console.error('Erro do Supabase Functions:', error);
        throw new Error(`Erro da função: ${error.message || 'Erro desconhecido'}`);
      }

      if (!data) {
        throw new Error('Resposta vazia da função');
      }

      if (data.error) {
        console.error('Erro retornado pela função:', data.error);
        throw new Error(data.error);
      }

      if (!data.response) {
        console.error('Resposta da IA não encontrada:', data);
        throw new Error('Resposta da IA não encontrada');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        sources: data.sources
      };

      setMessages(prev => [...prev, botMessage]);

      toast({
        title: "Resposta recebida",
        description: `Consultei ${data.sources?.knowledgeBaseCount || 0} itens da base de conhecimento`,
      });

    } catch (error) {
      console.error('Erro detalhado ao enviar mensagem:', error);
      
      let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('OpenAI') || error.message.includes('Hugging Face')) {
          errorMessage = 'Erro na conexão com a IA externa. Verifique sua conexão.';
        } else if (error.message.includes('função')) {
          errorMessage = 'Erro no processamento da mensagem. Verifique sua conexão.';
        } else if (error.message.includes('Resposta vazia')) {
          errorMessage = 'Não foi possível obter uma resposta. Tente reformular sua pergunta.';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorBotMessage]);
      
      toast({
        title: "Erro no ChatBot",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleVersion = () => {
    setUseV2(!useV2);
    toast({
      title: `Mudando para versão ${!useV2 ? 'V2' : 'V1'}`,
      description: !useV2 ? 'Usando busca inteligente melhorada' : 'Usando versão original'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Card className="h-[80vh] max-h-[700px] min-h-[500px] flex flex-col shadow-lg border-blue-200 w-full">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg flex-shrink-0">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              ChatBot PJe TRT15 {useV2 ? 'V2' : 'V1'}
            </CardTitle>
            <Button
              onClick={toggleVersion}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {useV2 ? 'V1' : 'V2'}
            </Button>
          </div>
          <p className="text-blue-100 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1">
              <Database className="h-3 w-3 sm:h-4 sm:w-4" />
              Base de Conhecimento {useV2 ? '(Busca Inteligente)' : '(Busca Simples)'}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              {useV2 ? 'IA Híbrida' : 'IA Hugging Face'}
            </span>
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 border'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">
                          {message.text}
                        </p>
                        {message.sources && (
                          <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                            <p className="flex items-center gap-1">
                              <Database className="h-3 w-3" />
                              Consultei {message.sources.knowledgeBaseCount} itens da base de conhecimento
                              {message.sources.assuntosCount > 0 && `, ${message.sources.assuntosCount} assuntos`}
                              {message.sources.chamadosCount > 0 && ` e ${message.sources.chamadosCount} chamados similares`}
                            </p>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border rounded-lg p-2 sm:p-3 max-w-[85%] sm:max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-blue-600" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        {useV2 ? 'Analisando com busca inteligente...' : 'Consultando base de conhecimento...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="border-t p-3 sm:p-4 bg-gray-50 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta sobre o PJe..."
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button 
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                size="sm"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Database className="h-3 w-3" />
              Pressione Enter para enviar. {useV2 ? 'V2: Busca inteligente com extração de palavras-chave' : 'V1: Busca simples na base de conhecimento'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
