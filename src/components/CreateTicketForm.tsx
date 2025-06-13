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
import { primeiroGrauOJs, segundoGrauOJs, titulosPadronizados } from '@/data/ojData';
import DescriptionImprover from './DescriptionImprover';

interface CreateTicketFormProps {
  onTicketCreated?: () => void;
  editingTicket?: any;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onTicketCreated, editingTicket }) => {
  const { toast } = useToast();
  const { ojData, detectarOJ, clearOJData } = useOJDetection();
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

  // Carregar dados do ticket para edição
  useEffect(() => {
    if (editingTicket) {
      console.log('Carregando dados para edição:', editingTicket);
      setFormData({
        chamadoOrigem: editingTicket.chamado_origem || '',
        numeroProcesso: editingTicket.numero_processo || '',
        grau: editingTicket.grau || '',
        orgaoJulgador: editingTicket.orgao_julgador || '',
        ojDetectada: editingTicket.oj_detectada || '',
        titulo: editingTicket.titulo || '',
        descricao: editingTicket.descricao || '',
        prioridade: editingTicket.prioridade || 3,
        tipo: editingTicket.tipo || '',
        nomeUsuarioAfetado: editingTicket.nome_usuario_afetado || '',
        cpfUsuarioAfetado: editingTicket.cpf_usuario_afetado || '',
        perfilUsuarioAfetado: editingTicket.perfil_usuario_afetado || ''
      });
    } else {
      // Limpar formulário quando não está editando
      setFormData({
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
    }
  }, [editingTicket]);

  // Sync with OJ detection hook
  useEffect(() => {
    if (!editingTicket) {
      setFormData(prev => ({
        ...prev,
        grau: ojData.grau,
        orgaoJulgador: ojData.orgaoJulgador,
        ojDetectada: ojData.ojDetectada
      }));
    }
  }, [ojData, editingTicket]);

  const handleProcessoChange = (value: string) => {
    setFormData(prev => ({ ...prev, numeroProcesso: value }));
    if (value.trim() && !editingTicket) {
      detectarOJ(value);
    } else if (!value.trim()) {
      clearOJData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao) {
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
            chamado_origem: formData.chamadoOrigem,
            numero_processo: formData.numeroProcesso,
            grau: formData.grau,
            orgao_julgador: formData.orgaoJulgador,
            oj_detectada: formData.ojDetectada,
            titulo: formData.titulo,
            descricao: formData.descricao,
            prioridade: formData.prioridade,
            tipo: formData.tipo,
            nome_usuario_afetado: formData.nomeUsuarioAfetado,
            cpf_usuario_afetado: formData.cpfUsuarioAfetado,
            perfil_usuario_afetado: formData.perfilUsuarioAfetado,
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
            chamado_origem: formData.chamadoOrigem,
            numero_processo: formData.numeroProcesso,
            grau: formData.grau,
            orgao_julgador: formData.orgaoJulgador,
            oj_detectada: formData.ojDetectada,
            titulo: formData.titulo,
            descricao: formData.descricao,
            prioridade: formData.prioridade,
            tipo: formData.tipo,
            nome_usuario_afetado: formData.nomeUsuarioAfetado,
            cpf_usuario_afetado: formData.cpfUsuarioAfetado,
            perfil_usuario_afetado: formData.perfilUsuarioAfetado
          });

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Chamado criado e salvo no banco de dados"
        });

        // Configurar dados para o template JIRA com os dados atuais do formulário
        setJiraTemplateData({
          chamadoOrigem: formData.chamadoOrigem,
          numeroProcesso: formData.numeroProcesso,
          grau: formData.grau,
          orgaoJulgador: formData.orgaoJulgador,
          ojDetectada: formData.ojDetectada,
          titulo: formData.titulo,
          descricao: formData.descricao,
          prioridade: formData.prioridade,
          tipo: formData.tipo,
          nomeUsuarioAfetado: formData.nomeUsuarioAfetado,
          cpfUsuarioAfetado: formData.cpfUsuarioAfetado,
          perfilUsuarioAfetado: formData.perfilUsuarioAfetado
        });

        // Abrir modal do template JIRA apenas para novos chamados
        setShowJiraModal(true);

        // Reset form apenas para novos chamados
        setFormData({
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

  const ojOptions = formData.grau === '1' ? primeiroGrauOJs : 
                   formData.grau === '2' ? segundoGrauOJs : [];

  const handleJiraModalClose = () => {
    setShowJiraModal(false);
    // Limpar dados do template quando fechar o modal
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

  const handleImprovedDescription = (improvedText: string) => {
    setFormData(prev => ({ ...prev, descricao: improvedText }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingTicket ? 'Editar Chamado' : 'Criar Novo Chamado'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chamadoOrigem">Número do Chamado de Origem</Label>
                <Input
                  id="chamadoOrigem"
                  value={formData.chamadoOrigem}
                  onChange={(e) => setFormData(prev => ({ ...prev, chamadoOrigem: e.target.value }))}
                  placeholder="Ex: HELP-12345"
                />
              </div>
              
              <div>
                <Label htmlFor="numeroProcesso">Número do Processo *</Label>
                <Input
                  id="numeroProcesso"
                  value={formData.numeroProcesso}
                  onChange={(e) => handleProcessoChange(e.target.value)}
                  placeholder="Ex: 0010750-13.2024.5.15.0023"
                />
              </div>
            </div>

            {/* Seção do Usuário Afetado */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Usuário Afetado</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nomeUsuarioAfetado">Nome Completo *</Label>
                  <Input
                    id="nomeUsuarioAfetado"
                    value={formData.nomeUsuarioAfetado}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomeUsuarioAfetado: e.target.value }))}
                    placeholder="Nome completo do usuário"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cpfUsuarioAfetado">CPF *</Label>
                  <Input
                    id="cpfUsuarioAfetado"
                    value={formData.cpfUsuarioAfetado}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpfUsuarioAfetado: e.target.value }))}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="perfilUsuarioAfetado">Perfil *</Label>
                  <Select value={formData.perfilUsuarioAfetado} onValueChange={(value) => setFormData(prev => ({ ...prev, perfilUsuarioAfetado: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diretor">Diretor</SelectItem>
                      <SelectItem value="Servidor">Servidor</SelectItem>
                      <SelectItem value="Magistrado">Magistrado</SelectItem>
                      <SelectItem value="Oficial">Oficial</SelectItem>
                      <SelectItem value="Perito">Perito</SelectItem>
                      <SelectItem value="Procurador">Procurador</SelectItem>
                      <SelectItem value="Estagiário">Estagiário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {formData.ojDetectada && (
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-sm font-medium">OJ Detectada:</Label>
                <p className="text-sm text-muted-foreground">{formData.ojDetectada}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grau">Grau</Label>
                <Select value={formData.grau} onValueChange={(value) => setFormData(prev => ({ ...prev, grau: value, orgaoJulgador: '' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Grau</SelectItem>
                    <SelectItem value="2">2º Grau</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="orgaoJulgador">Órgão Julgador</Label>
                <Select value={formData.orgaoJulgador} onValueChange={(value) => setFormData(prev => ({ ...prev, orgaoJulgador: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o órgão julgador" />
                  </SelectTrigger>
                  <SelectContent>
                    {ojOptions.map((oj) => (
                      <SelectItem key={oj.codigo} value={oj.codigo}>
                        {oj.codigo} - {oj.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo do Chamado</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incidente">Incidente</SelectItem>
                    <SelectItem value="requisicao">Requisição</SelectItem>
                    <SelectItem value="problema">Problema</SelectItem>
                    <SelectItem value="mudanca">Mudança</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={formData.prioridade.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="descricao">Descrição Detalhada *</Label>
                <DescriptionImprover
                  currentDescription={formData.descricao}
                  onImprovedDescription={handleImprovedDescription}
                  context={`${formData.titulo} - ${formData.tipo}`}
                />
              </div>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva detalhadamente o problema ou solicitação"
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {editingTicket ? 'Atualizar Chamado' : 'Criar Chamado'}
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
