
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GoogleDocsSync from '@/components/GoogleDocsSync';

const GoogleDocsSyncPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto py-4 sm:py-8 px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar ao Dashboard</span>
            <span className="sm:hidden">Voltar</span>
          </Button>
        </div>
        
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Sincronização Google Docs
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-4">
            Importe automaticamente seus documentos do Google Docs para enriquecer a base de conhecimento 
            do ChatBot com suas anotações e documentações pessoais.
          </p>
        </div>
        
        <GoogleDocsSync />
      </div>
    </div>
  );
};

export default GoogleDocsSyncPage;
