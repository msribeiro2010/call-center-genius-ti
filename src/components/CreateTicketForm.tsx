
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
import { useCPFValidation } from '@/hooks/useCPFValidation';
import { useUsuarios } from '@/hooks/useUsuarios';
import { primeiroGrauOJs, segundoGrauOJs } from '@/data/ojData';
import DescriptionImprover from './DescriptionImprover';
import SearchableAssuntoSelect from './SearchableAssuntoSelect';

interface CreateTicketFormProps {
  onTicketCreated?: () => void;
  editingTicket?: any;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onTicketCreated, editingTicket }) => {
  const { toast } = useToast();
  const { ojData, detectarOJ, clearOJData } = useOJDetection();
  const { assuntos, loading: assuntosLoading } = useAssuntos();
  const { cpfError, validateCPF, formatCPF, setCpfError } = useCPFValidation();
  const { buscarUsuarioPorCPF, salvarUsuario, loading: usuariosLoading } = useUsuarios();
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [jiraTemplateData, setJiraTemplateData] = useState({
    notas: '',
    chamadoNapje: '',
    servidorResponsavel: '',
    tipoPendencia: '',
    resumo: '',
    versao: '',
    urgencia: '',
    subsistema: '',
    ambiente: '',
    perfilCpfNome: '',
    numeroProcessos: '',
    assuntoId: ''
  });
  const [formData, setFormData] = useState({
    notas: '',
    chamadoNapje: '',
    servidorResponsavel: '',
    tipoPendencia: '',
    resumo: '',
    versao: '',
    urgencia: '',
    subsistema: '',
    ambiente: '',
    perfilCpfNome: '',
    numeroProcessos: '',
    assuntoId: ''
  });

  // Carregar dados do ticket para edição
  useEffect(() => {
    if (editingTicket) {
      console.log('Carregando dados para edição:', editingTicket);
      setFormData({
        notas: editingTicket.notas || '',
        chamadoNapje: editingTicket.chamado_napje || '',
        servidorResponsavel: editingTicket.servidor_responsavel || '',
        tipoPendencia: editingTicket.tipo_pendencia || '',
        resumo: editingTicket.resumo || '',
        versao: editingTicket.versao || '',
        urgencia: editingTicket.urgencia || '',
        subsistema: editingTicket.subsistema || '',
        ambiente: editingTicket.ambiente || '',
        perfilCpfNome: editingTicket.perfil_cpf_nome || '',
        numeroProcessos: editingTicket.numero_processos || '',
        assuntoId: editingTicket.assunto_id || ''
      });
    } else {
      // Limpar formulário quando não está editando
      setFormData({
        notas: '',
        chamadoNapje: '',
        servidorResponsavel: '',
        tipoPendencia: '',
        resumo: '',
        versao: '',
        urgencia: '',
        subsistema: '',
        ambiente: '',
        perfilCpfNome: '',
        numeroProcessos: '',
        assuntoId: ''
      });
    }
  }, [editingTicket]);

  const handleProcessoChange = (value: string) => {
    setFormData(prev => ({ ...prev, numeroProcessos: value }));
    if (value.trim() && !editingTicket) {
      detectarOJ(value);
    } else if (!value.trim()) {
      clearOJData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Buscar o nome do assunto selecionado para usar como título
    const assuntoSelecionado = assuntos.find(a => a.id === formData.assuntoId);
    const titulo = assuntoSelecionado ? assuntoSelecionado.nome : '';
    
    if (!formData.resumo || !formData.tipoPendencia) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingTicket) {
        // Atualizar chamado existente
        const { error } = await supabase
          .from('chamados')
          .update({
            titulo: titulo,
            descricao: formData.resumo,
            notas: formData.notas,
            chamado_napje: formData.chamadoNapje,
            servidor_responsavel: formData.servidorResponsavel,
            tipo_pendencia: formData.tipoPendencia,
            resumo: formData.resumo,
            versao: formData.versao,
            urgencia: formData.urgencia,
            subsistema: formData.subsistema,
            ambiente: formData.ambiente,
            perfil_cpf_nome: formData.perfilCpfNome,
            numero_processos: formData.numeroProcessos,
            assunto_id: formData.assuntoId || null,
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
          .insert({
            titulo: titulo,
            descricao: formData.resumo,
            notas: formData.notas,
            chamado_napje: formData.chamadoNapje,
            servidor_responsavel: formData.servidorResponsavel,
            tipo_pendencia: formData.tipoPendencia,
            resumo: formData.resumo,
            versao: formData.versao,
            urgencia: formData.urgencia,
            subsistema: formData.subsistema,
            ambiente: formData.ambiente,
            perfil_cpf_nome: formData.perfilCpfNome,
            numero_processos: formData.numeroProcessos,
            assunto_id: formData.assuntoId || null
          });

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Chamado criado e salvo no banco de dados"
        });

        // Configurar dados para o template JIRA com os dados atuais do formulário
        setJiraTemplateData(formData);

        // Abrir modal do template JIRA apenas para novos chamados
        setShowJiraModal(true);

        // Reset form apenas para novos chamados
        setFormData({
          notas: '',
          chamadoNapje: '',
          servidorResponsavel: '',
          tipoPendencia: '',
          resumo: '',
          versao: '',
          urgencia: '',
          subsistema: '',
          ambiente: '',
          perfilCpfNome: '',
          numeroProcessos: '',
          assuntoId: ''
        });
        clearOJData();
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
      notas: '',
      chamadoNapje: '',
      servidorResponsavel: '',
      tipoPendencia: '',
      resumo: '',
      versao: '',
      urgencia: '',
      subsistema: '',
      ambiente: '',
      perfilCpfNome: '',
      numeroProcessos: '',
      assuntoId: ''
    });
    if (onTicketCreated) {
      onTicketCreated();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingTicket ? 'Editar Chamado' : 'Criar Novo Chamado JIRA'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notas */}
            <div>
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                placeholder="Adicione suas notas aqui..."
                rows={4}
                className="w-full"
              />
            </div>

            {/* Grid com dois campos por linha */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chamadoNapje">Chamado do NAPJe que originou a issue</Label>
                <Input
                  id="chamadoNapje"
                  value={formData.chamadoNapje}
                  onChange={(e) => setFormData(prev => ({ ...prev, chamadoNapje: e.target.value }))}
                  placeholder="Ex: HELP-12345"
                />
              </div>
              
              <div>
                <Label htmlFor="servidorResponsavel">
                  <span className="text-red-500">*</span> Servidor responsável pela abertura da issue
                </Label>
                <Input
                  id="servidorResponsavel"
                  value={formData.servidorResponsavel}
                  onChange={(e) => setFormData(prev => ({ ...prev, servidorResponsavel: e.target.value }))}
                  placeholder="Nome do servidor responsável"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoPendencia">
                  <span className="text-red-500">*</span> Tipo de Pendência
                </Label>
                <Select value={formData.tipoPendencia} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoPendencia: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de pendência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="melhoria">Melhoria</SelectItem>
                    <SelectItem value="nova-funcionalidade">Nova Funcionalidade</SelectItem>
                    <SelectItem value="tarefa">Tarefa</SelectItem>
                    <SelectItem value="incidente">Incidente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resumo">
                  <span className="text-red-500">*</span> Resumo
                </Label>
                <Input
                  id="resumo"
                  value={formData.resumo}
                  onChange={(e) => setFormData(prev => ({ ...prev, resumo: e.target.value }))}
                  placeholder="Resumo da issue"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="versao">
                  <span className="text-red-500">*</span> Versão
                </Label>
                <Input
                  id="versao"
                  value={formData.versao}
                  onChange={(e) => setFormData(prev => ({ ...prev, versao: e.target.value }))}
                  placeholder="Versão do sistema"
                  required
                />
              </div>

              <div>
                <Label htmlFor="urgencia">
                  <span className="text-red-500">*</span> Urgência
                </Label>
                <Select value={formData.urgencia} onValueChange={(value) => setFormData(prev => ({ ...prev, urgencia: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a urgência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subsistema">
                  <span className="text-red-500">*</span> Subsistema
                </Label>
                <Select value={formData.subsistema} onValueChange={(value) => setFormData(prev => ({ ...prev, subsistema: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o subsistema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pje">PJe</SelectItem>
                    <SelectItem value="seeu">SEEU</SelectItem>
                    <SelectItem value="saat">SAAT</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ambiente">
                  <span className="text-red-500">*</span> Ambiente
                </Label>
                <Select value={formData.ambiente} onValueChange={(value) => setFormData(prev => ({ ...prev, ambiente: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="producao">Produção</SelectItem>
                    <SelectItem value="homologacao">Homologação</SelectItem>
                    <SelectItem value="teste">Teste</SelectItem>
                    <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="perfilCpfNome">
                <span className="text-red-500">*</span> Perfil/CPF/Nome completo do usuário
              </Label>
              <Input
                id="perfilCpfNome"
                value={formData.perfilCpfNome}
                onChange={(e) => setFormData(prev => ({ ...prev, perfilCpfNome: e.target.value }))}
                placeholder="Ex: Magistrado - 123.456.789-00 - João da Silva"
                required
              />
            </div>

            <div>
              <Label htmlFor="numeroProcessos">Número dos processos</Label>
              <Textarea
                id="numeroProcessos"
                value={formData.numeroProcessos}
                onChange={(e) => handleProcessoChange(e.target.value)}
                placeholder="Ex: 0010750-13.2024.5.15.0023&#10;1234567-89.2024.5.15.0001&#10;..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full">
              {editingTicket ? 'Atualizar Chamado' : 'Criar Chamado JIRA'}
            </Button>
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
