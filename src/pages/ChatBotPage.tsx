
import React from 'react';
import ChatBot from '@/components/ChatBot';

const ChatBotPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assistente Virtual PJe
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Converse com nosso assistente virtual inteligente. Ele consulta nossa base de conhecimento, 
            assuntos de chamados e histórico para fornecer soluções personalizadas para seus problemas no PJe.
          </p>
        </div>
        <ChatBot />
      </div>
    </div>
  );
};

export default ChatBotPage;
