
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, Search, TrendingUp, Sparkles } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalTickets: number;
    openTickets: number;
    inProgress: number;
    templates: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statsConfig = [
    {
      title: "Total de Chamados",
      value: stats.totalTickets,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      shadowColor: "shadow-blue-500/20"
    },
    {
      title: "Chamados Abertos",
      value: stats.openTickets,
      icon: Search,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      shadowColor: "shadow-orange-500/20"
    },
    {
      title: "Base de Conhecimento",
      value: stats.templates,
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      shadowColor: "shadow-purple-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className={`group relative backdrop-blur-md bg-gradient-to-br ${stat.bgGradient} border border-white/20 shadow-xl ${stat.shadowColor} hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-white/30 overflow-hidden`}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Particles */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/20 rounded-full animate-bounce"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-800 group-hover:text-gray-700 transition-colors duration-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 origin-left`}>
                {stat.value}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-gray-600/80">Atualizado</span>
              </div>
            </CardContent>
            
            {/* Bottom Glow */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
