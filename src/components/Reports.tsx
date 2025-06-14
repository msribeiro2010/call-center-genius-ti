
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, TrendingUp, Calendar } from 'lucide-react';

interface UserTicketStats {
  user_name: string;
  user_email: string;
  ticket_count: number;
}

interface SubjectStats {
  subject_name: string;
  ticket_count: number;
  percentage: number;
}

interface StatusStats {
  status: string;
  count: number;
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserTicketStats[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUserTicketStats = async () => {
    try {
      const { data, error } = await supabase
        .from('chamados')
        .select(`
          created_by,
          profiles:created_by (
            nome_completo,
            email
          )
        `)
        .not('created_by', 'is', null);

      if (error) {
        console.error('Erro ao buscar estatísticas por usuário:', error);
        return;
      }

      // Agrupar por usuário
      const userGroups: { [key: string]: { name: string; email: string; count: number } } = {};
      
      data.forEach((ticket: any) => {
        const userId = ticket.created_by;
        const userName = ticket.profiles?.nome_completo || 'Usuário sem nome';
        const userEmail = ticket.profiles?.email || 'Email não informado';
        
        if (!userGroups[userId]) {
          userGroups[userId] = { name: userName, email: userEmail, count: 0 };
        }
        userGroups[userId].count++;
      });

      const stats = Object.values(userGroups).map(group => ({
        user_name: group.name,
        user_email: group.email,
        ticket_count: group.count
      }));

      stats.sort((a, b) => b.ticket_count - a.ticket_count);
      setUserStats(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas por usuário:', error);
    }
  };

  const fetchSubjectStats = async () => {
    try {
      const { data, error } = await supabase
        .from('chamados')
        .select(`
          assunto_id,
          assuntos:assunto_id (
            nome
          )
        `)
        .not('assunto_id', 'is', null);

      if (error) {
        console.error('Erro ao buscar estatísticas por assunto:', error);
        return;
      }

      // Agrupar por assunto
      const subjectGroups: { [key: string]: { name: string; count: number } } = {};
      
      data.forEach((ticket: any) => {
        const subjectName = ticket.assuntos?.nome || 'Assunto não definido';
        
        if (!subjectGroups[subjectName]) {
          subjectGroups[subjectName] = { name: subjectName, count: 0 };
        }
        subjectGroups[subjectName].count++;
      });

      const total = data.length;
      const stats = Object.values(subjectGroups).map(group => ({
        subject_name: group.name,
        ticket_count: group.count,
        percentage: Math.round((group.count / total) * 100)
      }));

      stats.sort((a, b) => b.ticket_count - a.ticket_count);
      setSubjectStats(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas por assunto:', error);
    }
  };

  const fetchStatusStats = async () => {
    try {
      const { data, error } = await supabase
        .from('chamados')
        .select('status');

      if (error) {
        console.error('Erro ao buscar estatísticas por status:', error);
        return;
      }

      const statusGroups: { [key: string]: number } = {};
      
      data.forEach((ticket: any) => {
        const status = ticket.status || 'Sem status';
        statusGroups[status] = (statusGroups[status] || 0) + 1;
      });

      const stats = Object.entries(statusGroups).map(([status, count]) => ({
        status,
        count
      }));

      setStatusStats(stats);
      setTotalTickets(data.length);
    } catch (error) {
      console.error('Erro ao buscar estatísticas por status:', error);
    }
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserTicketStats(),
        fetchSubjectStats(),
        fetchStatusStats()
      ]);
      setLoading(false);
    };

    fetchAllStats();
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-lg">Carregando relatórios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
        <p className="text-gray-600">Análise detalhada dos chamados do sistema</p>
      </div>

      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
                <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assuntos Diferentes</p>
                <p className="text-2xl font-bold text-gray-900">{subjectStats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status Diferentes</p>
                <p className="text-2xl font-bold text-gray-900">{statusStats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chamados por Usuário */}
        <Card>
          <CardHeader>
            <CardTitle>Chamados por Usuário</CardTitle>
            <CardDescription>
              Usuários que mais criaram chamados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userStats.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userStats.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="user_name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, 'Chamados']}
                      labelFormatter={(label) => `Usuário: ${label}`}
                    />
                    <Bar dataKey="ticket_count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="space-y-2">
                  {userStats.slice(0, 5).map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{user.user_name}</p>
                        <p className="text-xs text-gray-600">{user.user_email}</p>
                      </div>
                      <Badge variant="outline">{user.ticket_count} chamados</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhum dados de usuário disponível
              </p>
            )}
          </CardContent>
        </Card>

        {/* Assuntos Mais Criados */}
        <Card>
          <CardHeader>
            <CardTitle>Assuntos Mais Criados</CardTitle>
            <CardDescription>
              Distribuição dos chamados por assunto
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subjectStats.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subjectStats.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ subject_name, percentage }) => `${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="ticket_count"
                    >
                      {subjectStats.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2">
                  {subjectStats.slice(0, 6).map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded mr-3"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <p className="font-medium text-sm">{subject.subject_name}</p>
                      </div>
                      <Badge variant="outline">
                        {subject.ticket_count} ({subject.percentage}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhum dados de assunto disponível
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status dos Chamados */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status</CardTitle>
          <CardDescription>
            Status atual dos chamados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statusStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusStats} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Nenhum dados de status disponível
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
