
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

interface CreateTicketFormProps {
  onTicketCreated?: () => void;
  editingTicket?: any;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onTicketCreated, editingTicket }) => {
  const { toast } = useToast();
  const { ojData, detectarOJ, clearOJData } = useOJDetection();
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [formData, setFormData] = useState({
    chamadoOrigem: '',
    numeroProcesso: '',
    grau: '',
    orgaoJulgador: '',
    ojDetectada: '',
    titulo: '',
    descricao: '',
    prioridade: '',
    tipo: ''
  });

  useEffect(() => {
    if (editingTicket) {
      setFormData({
        chamadoOrigem: editingTicket.chamado_origem || editingTicket.chamadoOrigem || '',
        numeroProcesso: editingTicket.numero_processo || editingTicket.numeroProcesso || '',
        grau: editingTicket.grau || '',
        orgaoJulgador: editingTicket.orgao_julgador || editingTicket.orgaoJulgador || '',
        ojDetectada: editingTicket.oj_detectada || editingTicket.ojDetectada || '',
        titulo: editingTicket.titulo || editingTicket.title || '',
        descricao: editingTicket.descricao || '',
        prioridade: editingTicket.prioridade || editingTicket.priority || '',
        tipo: editingTicket.tipo || editingTicket.type || ''
      });
    }
  }, [editingTicket]);

  // Sync with OJ detection hook
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      grau: ojData.grau,
      orgaoJulgador: ojData.orgaoJulgador,
      ojDetectada: ojData.ojDetectada
    }));
  }, [ojData]);

  const handleProcessoChange = (value: string) => {
    setFormData(prev => ({ ...prev, numeroProcesso: value }));
    if (value.trim()) {
      detectarOJ(value);
    } else {
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
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTicket.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Chamado atualizado com sucesso"
        });
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
            tipo: formData.tipo
          });

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Chamado criado e salvo no banco de dados"
        });

        // Abrir modal do template JIRA
        setShowJiraModal(true);
      }
      
      // Reset form only if not editing or if successfully created
      if (!editingTicket) {
        setFormData({
          chamadoOrigem: '',
          numeroProcesso: '',
          grau: '',
          orgaoJulgador: '',
          ojDetectada: '',
          titulo: '',
          descricao: '',
          prioridade: '',
          tipo: ''
        });
        clearOJData();
      }

      // Call the callback function if provided and not showing modal
      if (onTicketCreated && !showJiraModal) {
        onTicketCreated();
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
    if (onTicketCreated) {
      onTicketCreated();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Chamado</CardTitle>
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
                <Select value={formData.prioridade} onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
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

            <div>
              <Label htmlFor="titulo">Título do Chamado *</Label>
              <Select value={formData.titulo} onValueChange={(value) => setFormData(prev => ({ ...prev, titulo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o título do chamado" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {titulosPadronizados.map((titulo, index) => (
                    <SelectItem key={index} value={titulo}>
                      {titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição Detalhada *</Label>
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
        ticketData={formData}
      />
    </div>
  );
};

export default CreateTicketForm;
