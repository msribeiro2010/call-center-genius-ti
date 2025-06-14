
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ResponseTemplates from './ResponseTemplates';
import JiraTemplateModal from './JiraTemplateModal';
import { useOJDetection } from '@/hooks/useOJDetection';
import { useAssuntos } from '@/hooks/useAssuntos';
import { primeiroGrauOJs, segundoGrauOJs, titulosPadronizados } from '@/data/ojData';
import DescriptionImprover from './DescriptionImprover';

interface CreateTicketFormProps {
  onTicketCreated?: () => void;
  editingTicket?: any;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onTicketCreated, editingTicket }) => {
  const { toast } = useToast();
  const { ojData, detectarOJ, clearOJData } = useOJDetection();
  const { assuntos, loading: assuntosLoading } = useAssuntos();
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [jiraTemplateData, setJiraTemplateData] = useState({
    chamadoOrigem: '',
    numeroProcesso: '',
    grau: '',
    orgaoJulgador: '',
    ojDetectada: '',
    titulo: '',
    descricao: '',
    prioridade: 3,
    tipo: '',
    nomeUsuarioAfetado: '',
    cpfUsuarioAfetado: '',
    perfilUsuarioAfetado: ''
  });
  const [formData, setFormData] = useState({
    usuarioAfetado: '',
    telefone: '',
    ramal: '',
    email: '',
    notas: '',
    chamadoNAPJe: '',
    servidorResponsavel: '',
    tipoPendencia: '',
    resumo: '',
    versao: '',
    urgencia: '',
    subsistema: '',
    ambiente: '',
    perfilCpfNome: '',
    numeroProcessos: '',
    assunto: ''
  });

  // Carregar dados do ticket para edição
  useEffect(() => {
    if (editingTicket) {
      console.log('Carregando dados para edição:', editingTicket);
      setFormData({
        usuarioAfetado: editingTicket.nome_usuario_afetado || '',
        telefone: editingTicket.telefone || '',
        ramal: editingTicket.ramal || '',
        email: editingTicket.email || '',
        notas: editingTicket.descricao || '',
        chamadoNAPJe: editingTicket.chamado_origem || '',
        servidorResponsavel: editingTicket.servidor_responsavel || '',
        tipoPendencia: editingTicket.tipo || '',
        resumo: editingTicket.titulo || '',
        versao: editingTicket.versao || '',
        urgencia: editingTicket.prioridade?.toString() || '3',
        subsistema: editingTicket.subsistema || '',
        ambiente: editingTicket.ambiente || '',
        perfilCpfNome: editingTicket.cpf_usuario_afetado || '',
        numeroProcessos: editingTicket.numero_processo || ''
      });
    } else {
      // Limpar formulário quando não está editando
      setFormData({
        usuarioAfetado: '',
        telefone: '',
        ramal: '',
        email: '',
        notas: '',
        chamadoNAPJe: '',
        servidorResponsavel: '',
        tipoPendencia: '',
        resumo: '',
        versao: '',
        urgencia: '3',
        subsistema: '',
        ambiente: '',
        perfilCpfNome: '',
        numeroProcessos: ''
      });
    }
  }, [editingTicket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.resumo || !formData.notas || !formData.usuarioAfetado) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const chamadoData = {
        titulo: formData.resumo,
        descricao: formData.notas,
        nome_usuario_afetado: formData.usuarioAfetado,
        cpf_usuario_afetado: formData.perfilCpfNome,
        telefone: formData.telefone,
        ramal: formData.ramal,
        email: formData.email,
        chamado_origem: formData.chamadoNAPJe,
        servidor_responsavel: formData.servidorResponsavel,
        tipo: formData.tipoPendencia,
        prioridade: parseInt(formData.urgencia),
        versao: formData.versao,
        subsistema: formData.subsistema,
        ambiente: formData.ambiente,
        numero_processo: formData.numeroProcessos,
        assunto_id: formData.assunto || null
      };

      if (editingTicket) {
        // Atualizar chamado existente
        const { error } = await supabase
          .from('chamados')
          .update({
            ...chamadoData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTicket.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Chamado atualizado com sucesso"
        });

        if (onTicketCreated) {
          onTicketCreated();
        }
      } else {
        // Criar novo chamado
        const { error } = await supabase
          .from('chamados')
          .insert(chamadoData);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Chamado criado e salvo no banco de dados"
        });

        // Mapear dados para o template JIRA com as propriedades corretas
        const mappedJiraData = {
          chamadoOrigem: formData.chamadoNAPJe,
          numeroProcesso: formData.numeroProcessos,
          grau: ojData.grau || '',
          orgaoJulgador: ojData.orgaoJulgador || '',
          ojDetectada: ojData.ojDetectada || '',
          titulo: formData.resumo,
          descricao: formData.notas,
          prioridade: parseInt(formData.urgencia),
          tipo: formData.tipoPendencia,
          nomeUsuarioAfetado: formData.usuarioAfetado,
          cpfUsuarioAfetado: formData.perfilCpfNome,
          perfilUsuarioAfetado: formData.perfilCpfNome
        };
        
        setJiraTemplateData(mappedJiraData);
        setShowJiraModal(true);

        // Reset form apenas para novos chamados
        setFormData({
          usuarioAfetado: '',
          telefone: '',
          ramal: '',
          email: '',
          notas: '',
          chamadoNAPJe: '',
          servidorResponsavel: '',
          tipoPendencia: '',
          resumo: '',
          versao: '',
          urgencia: '3',
          subsistema: '',
          ambiente: '',
          perfilCpfNome: '',
          numeroProcessos: '',
          assunto: ''
        });
      }
    } catch (error) {
      console.error('Erro ao salvar chamado:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar chamado no banco de dados",
        variant: "destructive"
      });
    }
  };

  const handleJiraModalClose = () => {
    setShowJiraModal(false);
    setJiraTemplateData({
      chamadoOrigem: '',
      numeroProcesso: '',
      grau: '',
      orgaoJulgador: '',
      ojDetectada: '',
      titulo: '',
      descricao: '',
      prioridade: 3,
      tipo: '',
      nomeUsuarioAfetado: '',
      cpfUsuarioAfetado: '',
      perfilUsuarioAfetado: ''
    });
    if (onTicketCreated) {
      onTicketCreated();
    }
  };

  // Agrupar assuntos por categoria
  const assuntosPorCategoria = assuntos.reduce((acc, assunto) => {
    const categoria = assunto.categoria || 'Outros';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(assunto);
    return acc;
  }, {} as Record<string, typeof assuntos>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingTicket ? 'Editar Chamado' : 'Criar Nova Issue'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primeira linha - Usuário Afetado e Telefone */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="usuarioAfetado" className="text-sm font-medium">
                  Usuário Afetado <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="usuarioAfetado"
                    value={formData.usuarioAfetado}
                    onChange={(e) => setFormData(prev => ({ ...prev, usuarioAfetado: e.target.value }))}
                    placeholder="Nome do usuário"
                    required
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="sm" className="px-2">
                    👤
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(19) 32362100"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Segunda linha - Ramal e Email */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ramal" className="text-sm font-medium">Ramal</Label>
                <Input
                  id="ramal"
                  value={formData.ramal}
                  onChange={(e) => setFormData(prev => ({ ...prev, ramal: e.target.value }))}
                  placeholder="2007"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="nucleo.apoiopje@trt15.jus.br"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Campo de Assunto */}
            <div>
              <Label htmlFor="assunto" className="text-sm font-medium">
                Assunto <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.assunto} onValueChange={(value) => setFormData(prev => ({ ...prev, assunto: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o assunto" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {Object.entries(assuntosPorCategoria).map(([categoria, assuntosCategoria]) => (
                    <div key={categoria}>
                      <div className="px-2 py-1 text-sm font-semibold text-gray-700 bg-gray-100">
                        {categoria}
                      </div>
                      {assuntosCategoria.map((assunto) => (
                        <SelectItem key={assunto.id} value={assunto.id}>
                          {assunto.nome}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notas - Campo Rico */}
            <div>
              <Label htmlFor="notas" className="text-sm font-medium">
                Notas <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 border border-gray-300 rounded-md">
                <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                  <Button type="button" variant="ghost" size="sm" className="p-1 h-8 w-8 text-sm font-bold">B</Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1 h-8 w-8 text-sm italic">I</Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1 h-8 w-8 text-sm">≡</Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1 h-8 w-8 text-sm">○</Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1 h-8 w-8 text-sm">📋</Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1 h-8 w-8 text-sm">🔗</Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1 h-8 w-8 text-sm">📷</Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1 h-8 w-8 text-sm">⚡</Button>
                </div>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                  placeholder="Descreva detalhadamente o problema..."
                  rows={6}
                  className="border-0 focus:ring-0 resize-none"
                  required
                />
              </div>
            </div>

            {/* Terceira linha - Chamado NAPJe e Servidor Responsável */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="chamadoNAPJe" className="text-sm font-medium">Chamado do NAPJe que originou a issue</Label>
                <Input
                  id="chamadoNAPJe"
                  value={formData.chamadoNAPJe}
                  onChange={(e) => setFormData(prev => ({ ...prev, chamadoNAPJe: e.target.value }))}
                  placeholder="Número do chamado"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="servidorResponsavel" className="text-sm font-medium">
                  <span className="text-red-500">*</span>Servidor responsável pela abertura da issue
                </Label>
                <Input
                  id="servidorResponsavel"
                  value={formData.servidorResponsavel}
                  onChange={(e) => setFormData(prev => ({ ...prev, servidorResponsavel: e.target.value }))}
                  placeholder="Nome do servidor"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {/* Quarta linha - Tipo de Pendência e Resumo */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="tipoPendencia" className="text-sm font-medium">
                  <span className="text-red-500">*</span>Tipo de Pendência
                </Label>
                <Select value={formData.tipoPendencia} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoPendencia: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Melhoria">Melhoria</SelectItem>
                    <SelectItem value="Nova Funcionalidade">Nova Funcionalidade</SelectItem>
                    <SelectItem value="Tarefa">Tarefa</SelectItem>
                    <SelectItem value="História">História</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="resumo" className="text-sm font-medium">
                  <span className="text-red-500">*</span>Resumo
                </Label>
                <Input
                  id="resumo"
                  value={formData.resumo}
                  onChange={(e) => setFormData(prev => ({ ...prev, resumo: e.target.value }))}
                  placeholder="Resumo da issue"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {/* Quinta linha - Versão e Urgência */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="versao" className="text-sm font-medium">
                  <span className="text-red-500">*</span>Versão
                </Label>
                <Input
                  id="versao"
                  value={formData.versao}
                  onChange={(e) => setFormData(prev => ({ ...prev, versao: e.target.value }))}
                  placeholder="Versão do sistema"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="urgencia" className="text-sm font-medium">
                  <span className="text-red-500">*</span>Urgência
                </Label>
                <Select value={formData.urgencia} onValueChange={(value) => setFormData(prev => ({ ...prev, urgencia: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione a urgência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Muito Baixa</SelectItem>
                    <SelectItem value="2">2 - Baixa</SelectItem>
                    <SelectItem value="3">3 - Média</SelectItem>
                    <SelectItem value="4">4 - Alta</SelectItem>
                    <SelectItem value="5">5 - Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sexta linha - Subsistema e Ambiente */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="subsistema" className="text-sm font-medium">
                  <span className="text-red-500">*</span>Subsistema
                </Label>
                <Select value={formData.subsistema} onValueChange={(value) => setFormData(prev => ({ ...prev, subsistema: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o subsistema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PJe">PJe</SelectItem>
                    <SelectItem value="PJe-JT">PJe-JT</SelectItem>
                    <SelectItem value="E-Recursal">E-Recursal</SelectItem>
                    <SelectItem value="JIRA">JIRA</SelectItem>
                    <SelectItem value="Sistema Auxiliar">Sistema Auxiliar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="ambiente" className="text-sm font-medium">
                  <span className="text-red-500">*</span>Ambiente
                </Label>
                <Select value={formData.ambiente} onValueChange={(value) => setFormData(prev => ({ ...prev, ambiente: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produção">Produção</SelectItem>
                    <SelectItem value="Homologação">Homologação</SelectItem>
                    <SelectItem value="Treinamento">Treinamento</SelectItem>
                    <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sétima linha - Perfil/CPF/Nome e Número dos processos */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="perfilCpfNome" className="text-sm font-medium">
                  <span className="text-red-500">*</span>Perfil/CPF/Nome completo do usuário
                </Label>
                <Input
                  id="perfilCpfNome"
                  value={formData.perfilCpfNome}
                  onChange={(e) => setFormData(prev => ({ ...prev, perfilCpfNome: e.target.value }))}
                  placeholder="Ex: Magistrado/123.456.789-00/João da Silva"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="numeroProcessos" className="text-sm font-medium">Número dos processos</Label>
                <Textarea
                  id="numeroProcessos"
                  value={formData.numeroProcessos}
                  onChange={(e) => setFormData(prev => ({ ...prev, numeroProcessos: e.target.value }))}
                  placeholder="Liste os números dos processos envolvidos"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingTicket ? 'Atualizar' : 'Criar'}
              </Button>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ResponseTemplates />

      {/* Modal do Template JIRA */}
      <JiraTemplateModal
        isOpen={showJiraModal}
        onClose={handleJiraModalClose}
        ticketData={jiraTemplateData}
      />
    </div>
  );
};

export default CreateTicketForm;
