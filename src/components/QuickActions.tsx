
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus, BookOpen, FileText, History, Zap, Sparkles, ArrowRight } from 'lucide-react';

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
  onOpenHistory,
}) => {
  const actions = [
    {
      title: "Novo Chamado",
      description: "Criar chamado JIRA otimizado",
      icon: Plus,
      onClick: onCreateTicket,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      primary: true
    },
    {
      title: "Base de Conhecimento",
      description: "Soluções e documentação",
      icon: BookOpen,
      onClick: onOpenKnowledge,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      title: "Templates",
      description: "Modelos personalizados",
      icon: FileText,
      onClick: onOpenTemplates,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      title: "Histórico",
      description: "Chamados anteriores",
      icon: History,
      onClick: onOpenHistory,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10"
    }
  ];

  return (
    <Card className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl overflow-hidden">
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              Ações Rápidas
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </CardTitle>
            <p className="text-white/70 text-sm">Acesse as principais funcionalidades rapidamente</p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                onClick={action.onClick}
                variant="ghost"
                className={`group relative h-auto p-6 backdrop-blur-md bg-gradient-to-br ${action.bgGradient} border border-white/20 rounded-2xl hover:border-white/40 transition-all duration-500 hover:scale-105 ${
                  action.primary ? 'ring-2 ring-blue-500/30' : ''
                }`}
              >
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-700/80 group-hover:text-gray-600 transition-colors duration-300">
                      {action.description}
                    </p>
                  </div>
                  
                  {/* Arrow Indicator */}
                  <ArrowRight className="w-4 h-4 text-gray-600/70 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                {/* Bottom Glow */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`}></div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
