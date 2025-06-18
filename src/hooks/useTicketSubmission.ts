
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCPFValidation } from './useCPFValidation';
import { useUsuarios } from './useUsuarios';
import { useProcessos } from './useProcessos';

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

export const useTicketSubmission = (
  formData: FormData,
  resetFormData: () => void,
  clearOJData: () => void,
  editingTicket?: any,
  onTicketCreated?: () => void
) => {
  const { toast } = useToast();
  const { validateCPF } = useCPFValidation();
  const { salvarUsuario } = useUsuarios();
  const { salvarProcesso } = useProcessos();
  
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

  const handleSubmit = async (e: React.FormEvent, assuntos: any[]) => {
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

      // Salvar processo se todos os dados estiverem preenchidos
      if (formData.numeroProcesso && formData.grau && formData.orgaoJulgador) {
        await salvarProcesso(
          formData.numeroProcesso,
          formData.grau,
          formData.orgaoJulgador,
          formData.ojDetectada
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
        resetFormData();
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

  return {
    showJiraModal,
    jiraTemplateData,
    handleSubmit,
    handleJiraModalClose
  };
};
