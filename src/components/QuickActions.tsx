
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus, FileText, Search, BookOpen } from 'lucide-react';

interface QuickActionsProps {
  onCreateTicket: () => void;
  onOpenKnowledge: () => void;
  onOpenTemplates: () => void;
  onOpenHistory: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateTicket,
  onOpenKnowledge,
  onOpenTemplates,
  onOpenHistory
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Ações Rápidas</CardTitle>
        <CardDescription>Gerencie seus chamados e acesse a base de conhecimento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            onClick={onCreateTicket}
            className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <Plus className="h-6 w-6" />
            <span>Novo Chamado</span>
          </Button>
          
          <Button 
            onClick={onOpenKnowledge}
            className="h-24 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <BookOpen className="h-6 w-6" />
            <span>Base de Conhecimento</span>
          </Button>
          
          <Button 
            onClick={onOpenTemplates}
            variant="outline"
            className="h-24 border-2 border-blue-200 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2"
          >
            <FileText className="h-6 w-6 text-blue-600" />
            <span>Templates</span>
          </Button>
          
          <Button 
            onClick={onOpenHistory}
            variant="outline"
            className="h-24 border-2 border-gray-200 hover:bg-gray-50 flex flex-col items-center justify-center space-y-2"
          >
            <Search className="h-6 w-6 text-gray-600" />
            <span>Histórico</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
