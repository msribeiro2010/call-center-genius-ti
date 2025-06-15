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
import { primeiroGrauOJs, segundoGrauOJs } from '@/data';
import DescriptionImprover from './DescriptionImprover';
import SearchableAssuntoSelect from './SearchableAssuntoSelect';
import { FileText, User, Scale, AlertCircle, Settings, Hash } from 'lucide-react';

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
    perfilUsuarioAfetado: '',
    assuntoId: ''
  });
  const [formData, setFormData] = useState({
    chamadoOrigem: '',
    numeroProcesso: '',
    grau: '',
    orgaoJulgador: '',
    ojDetectada: '',
    descricao: '',
    prioridade: 3,
    tipo: '',
    nomeUsuarioAfetado: '',
    cpfUsuarioAfetado: '',
    perfilUsuarioAfetado: '',
    assuntoId: ''
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
        descricao: editingTicket.descricao || '',
        prioridade: editingTicket.prioridade || 3,
        tipo: editingTicket.tipo || '',
        nomeUsuarioAfetado: editingTicket.nome_usuario_afetado || '',
        cpfUsuarioAfetado: editingTicket.cpf_usuario_afetado || '',
        perfilUsuarioAfetado: editingTicket.perfil_usuario_afetado || '',
        assuntoId: editingTicket.assunto_id || ''
      });
    } else {
      // Limpar formulário quando não está editando
      setFormData({
        chamadoOrigem: '',
        numeroProcesso: '',
        grau: '',
        orgaoJulgador: '',
        ojDetectada: '',
        descricao: '',
        prioridade: 3,
        tipo: '',
        nomeUsuarioAfetado: '',
        cpfUsuarioAfetado: '',
        perfilUsuarioAfetado: '',
        assuntoId: ''
      });
    }
  }, [editingTicket]);

  // Sync with OJ detection hook - apenas orgaoJulgador e ojDetectada
  useEffect(() => {
    if (!editingTicket) {
      setFormData(prev => ({
        ...prev,
        orgaoJulgador: ojData.orgaoJulgador,
        ojDetectada: ojData.ojDetectada
      }));
    }
  }, [ojData.orgaoJulgador, ojData.ojDetectada, editingTicket]);

  const handleProcessoChange = (value: string) => {
    console.log('Mudança no processo:', value);
    setFormData(prev => ({ ...prev, numeroProcesso: value }));
    
    // Só detectar OJ automaticamente se o grau for 1º grau
    if (value.trim() && !editingTicket && formData.grau === '1') {
      console.log('Detectando OJ para 1º grau');
      detectarOJ(value, '1');
    } else if (!value.trim()) {
      clearOJData();
    }
  };

  const handleGrauChange = (value: string) => {
    console.log('Mudança no grau:', value);
    setFormData(prev => ({ 
      ...prev, 
      grau: value, 
      orgaoJulgador: '', 
      ojDetectada: '' 
    }));
    
    // Limpar apenas os dados de OJ, mas manter o grau no hook
    clearOJData();
    
    // Se há um número de processo e o usuário escolheu 1º grau, detectar OJ automaticamente
    if (value === '1' && formData.numeroProcesso.trim()) {
      console.log('Detectando OJ automaticamente para 1º grau');
      detectarOJ(formData.numeroProcesso, '1');
    }
  };

  const handleCPFChange = async (value: string) => {
    // Formatar CPF enquanto digita
    const formattedCPF = formatCPF(value);
    setFormData(prev => ({ ...prev, cpfUsuarioAfetado: formattedCPF }));
    
    // Validar apenas se o campo estiver completo
    if (formattedCPF.length === 14) {
      const isValid = validateCPF(formattedCPF);
      
      if (isValid) {
        // Buscar usuário existente pelo CPF
        const usuarioExistente = await buscarUsuarioPorCPF(formattedCPF);
        
        if (usuarioExistente) {
          // Preencher automaticamente os campos com os dados encontrados
          setFormData(prev => ({
            ...prev,
            nomeUsuarioAfetado: usuarioExistente.nome_completo,
            perfilUsuarioAfetado: usuarioExistente.perfil || ''
          }));
          
          toast({
            title: "Usuário encontrado",
            description: `Dados de ${usuarioExistente.nome_completo} preenchidos automaticamente`,
          });
        } else {
          // Limpar campos se não encontrar usuário
          setFormData(prev => ({
            ...prev,
            nomeUsuarioAfetado: '',
            perfilUsuarioAfetado: ''
          }));
        }
      }
    } else {
      setCpfError('');
      // Limpar campos quando CPF não estiver completo
      if (formattedCPF.length < 14) {
        setFormData(prev => ({
          ...prev,
          nomeUsuarioAfetado: '',
          perfilUsuarioAfetado: ''
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Buscar o nome do assunto selecionado para usar como título
    const assuntoSelecionado = assuntos.find(a => a.id === formData.assuntoId);
    const titulo = assuntoSelecionado ? assuntoSelecionado.nome : '';
    
    if (!formData.assuntoId || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Validar CPF antes de submeter
    if (formData.cpfUsuarioAfetado && !validateCPF(formData.cpfUsuarioAfetado)) {
      toast({
        title: "Erro",
        description: "CPF inválido",
        variant: "destructive"
      });
      return;
    }

    try {
      // Salvar ou atualizar usuário se todos os dados estiverem preenchidos
      if (formData.cpfUsuarioAfetado && formData.nomeUsuarioAfetado && formData.perfilUsuarioAfetado) {
        await salvarUsuario(
          formData.cpfUsuarioAfetado,
          formData.nomeUsuarioAfetado,
          formData.perfilUsuarioAfetado
        );
      }

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
            titulo: titulo,
            descricao: formData.descricao,
            prioridade: formData.prioridade,
            tipo: formData.tipo,
            nome_usuario_afetado: formData.nomeUsuarioAfetado,
            cpf_usuario_afetado: formData.cpfUsuarioAfetado,
            perfil_usuario_afetado: formData.perfilUsuarioAfetado,
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
            chamado_origem: formData.chamadoOrigem,
            numero_processo: formData.numeroProcesso,
            grau: formData.grau,
            orgao_julgador: formData.orgaoJulgador,
            oj_detectada: formData.ojDetectada,
            titulo: titulo,
            descricao: formData.descricao,
            prioridade: formData.prioridade,
            tipo: formData.tipo,
            nome_usuario_afetado: formData.nomeUsuarioAfetado,
            cpf_usuario_afetado: formData.cpfUsuarioAfetado,
            perfil_usuario_afetado: formData.perfilUsuarioAfetado,
            assunto_id: formData.assuntoId || null
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
          titulo: titulo,
          descricao: formData.descricao,
          prioridade: formData.prioridade,
          tipo: formData.tipo,
          nomeUsuarioAfetado: formData.nomeUsuarioAfetado,
          cpfUsuarioAfetado: formData.cpfUsuarioAfetado,
          perfilUsuarioAfetado: formData.perfilUsuarioAfetado,
          assuntoId: formData.assuntoId
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
          descricao: '',
          prioridade: 3,
          tipo: '',
          nomeUsuarioAfetado: '',
          cpfUsuarioAfetado: '',
          perfilUsuarioAfetado: '',
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

  // Filter out invalid OJ options to prevent empty value props
  const ojOptions = formData.grau === '1' ? 
    primeiroGrauOJs.filter(oj => oj.codigo && oj.codigo.trim() !== '') : 
    formData.grau === '2' ? 
    segundoGrauOJs.filter(oj => oj.codigo && oj.codigo.trim() !== '') : 
    [];

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
      perfilUsuarioAfetado: '',
      assuntoId: ''
    });
    if (onTicketCreated) {
      onTicketCreated();
    }
  };

  const handleImprovedDescription = (improvedText: string) => {
    setFormData(prev => ({ ...prev, descricao: improvedText }));
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <FileText className="h-7 w-7" />
            {editingTicket ? 'Editar Chamado' : 'Criar Novo Chamado'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção de Informações Básicas */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Hash className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Informações Básicas</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="chamadoOrigem" className="text-sm font-medium text-gray-700">
                    Número do Chamado de Origem
                  </Label>
                  <Input
                    id="chamadoOrigem"
                    value={formData.chamadoOrigem}
                    onChange={(e) => setFormData(prev => ({ ...prev, chamadoOrigem: e.target.value }))}
                    placeholder="Ex: HELP-12345"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grau" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Scale className="h-4 w-4" />
                    Grau *
                  </Label>
                  <Select 
                    value={formData.grau} 
                    onValueChange={handleGrauChange}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione o grau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1º Grau</SelectItem>
                      <SelectItem value="2">2º Grau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numeroProcesso" className="text-sm font-medium text-gray-700">
                    Número do Processo
                  </Label>
                  <Input
                    id="numeroProcesso"
                    value={formData.numeroProcesso}
                    onChange={(e) => handleProcessoChange(e.target.value)}
                    placeholder="Ex: 0010750-13.2024.5.15.0023"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Seção do Assunto */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">Assunto do Chamado</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assunto" className="text-sm font-medium text-gray-700">Assunto *</Label>
                <SearchableAssuntoSelect
                  value={formData.assuntoId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assuntoId: value }))}
                  assuntos={assuntos}
                  loading={assuntosLoading}
                  placeholder={assuntosLoading ? "Carregando assuntos..." : "Selecione ou digite para buscar assunto..."}
                />
              </div>
            </div>

            {/* Seção do Usuário Afetado */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Usuário Afetado</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cpfUsuarioAfetado" className="text-sm font-medium text-gray-700">CPF *</Label>
                  <Input
                    id="cpfUsuarioAfetado"
                    value={formData.cpfUsuarioAfetado}
                    onChange={(e) => handleCPFChange(e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${cpfError ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                    disabled={usuariosLoading}
                  />
                  {cpfError && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {cpfError}
                    </p>
                  )}
                  {usuariosLoading && (
                    <p className="text-sm text-blue-500 flex items-center gap-1">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      Buscando usuário...
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeUsuarioAfetado" className="text-sm font-medium text-gray-700">Nome Completo *</Label>
                  <Input
                    id="nomeUsuarioAfetado"
                    value={formData.nomeUsuarioAfetado}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomeUsuarioAfetado: e.target.value }))}
                    placeholder="Nome completo do usuário"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perfilUsuarioAfetado" className="text-sm font-medium text-gray-700">Perfil *</Label>
                  <Select value={formData.perfilUsuarioAfetado} onValueChange={(value) => setFormData(prev => ({ ...prev, perfilUsuarioAfetado: value }))}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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

            {/* OJ Detectada */}
            {formData.ojDetectada && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  <Label className="text-sm font-semibold text-blue-800">OJ Detectada Automaticamente:</Label>
                </div>
                <p className="text-sm text-blue-700 font-medium">{formData.ojDetectada}</p>
              </div>
            )}

            {/* Seção de Configurações Avançadas */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Configurações do Chamado</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgaoJulgador" className="text-sm font-medium text-gray-700">Órgão Julgador</Label>
                  <Select value={formData.orgaoJulgador} onValueChange={(value) => setFormData(prev => ({ ...prev, orgaoJulgador: value }))}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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

                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">Tipo do Chamado</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incidente">🔥 Incidente</SelectItem>
                      <SelectItem value="requisicao">📋 Requisição</SelectItem>
                      <SelectItem value="problema">⚠️ Problema</SelectItem>
                      <SelectItem value="mudanca">🔄 Mudança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="prioridade" className="text-sm font-medium text-gray-700">Prioridade</Label>
                <Select value={formData.prioridade.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: parseInt(value) }))}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Muito Baixa 🟢</SelectItem>
                    <SelectItem value="2">2 - Baixa 🟡</SelectItem>
                    <SelectItem value="3">3 - Média 🟠</SelectItem>
                    <SelectItem value="4">4 - Alta 🔴</SelectItem>
                    <SelectItem value="5">5 - Crítica 🚨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Seção da Descrição */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Descrição Detalhada</h3>
                </div>
                <DescriptionImprover
                  currentDescription={formData.descricao}
                  onImprovedDescription={handleImprovedDescription}
                  context={`${formData.assuntoId} - ${formData.tipo}`}
                  numeroProcesso={formData.numeroProcesso}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva detalhadamente o problema ou solicitação..."
                  rows={6}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  required
                />
              </div>
            </div>

            {/* Botão de Submit */}
            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {editingTicket ? '✏️ Atualizar Chamado' : '🚀 Criar Chamado'}
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
