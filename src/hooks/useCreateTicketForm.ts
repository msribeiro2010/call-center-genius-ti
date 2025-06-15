
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOJDetection } from './useOJDetection';
import { useAssuntos } from './useAssuntos';
import { useCPFValidation } from './useCPFValidation';
import { useUsuarios } from './useUsuarios';

interface FormData {
  chamadoOrigem: string;
  numeroProcesso: string;
  grau: string;
  orgaoJulgador: string;
  ojDetectada: string;
  descricao: string;
  prioridade: number;
  tipo: string;
  nomeUsuarioAfetado: string;
  cpfUsuarioAfetado: string;
  perfilUsuarioAfetado: string;
  assuntoId: string;
}

export const useCreateTicketForm = (editingTicket?: any, onTicketCreated?: () => void) => {
  const { toast } = useToast();
  const { ojData, detectarOJ, clearOJData } = useOJDetection();
  const { assuntos, loading: assuntosLoading } = useAssuntos();
  const { cpfError, validateCPF, formatCPF, setCpfError } = useCPFValidation();
  const { buscarUsuarioPorCPF, salvarUsuario, loading: usuariosLoading } = useUsuarios();
  
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [jiraTemplateData, setJiraTemplateData] = useState<FormData>({
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

  const [formData, setFormData] = useState<FormData>({
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

  const handleFormDataChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  const handleJiraModalClose = () => {
    setShowJiraModal(false);
    // Limpar dados do template quando fechar o modal
    setJiraTemplateData({
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
    if (onTicketCreated) {
      onTicketCreated();
    }
  };

  const handleImprovedDescription = (improvedText: string) => {
    setFormData(prev => ({ ...prev, descricao: improvedText }));
  };

  return {
    formData,
    handleFormDataChange,
    handleProcessoChange,
    handleGrauChange,
    handleCPFChange,
    handleSubmit,
    handleImprovedDescription,
    showJiraModal,
    jiraTemplateData,
    handleJiraModalClose,
    assuntos,
    assuntosLoading,
    cpfError,
    usuariosLoading
  };
};
