
import { useState, useEffect } from 'react';

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

export const useTicketFormData = (editingTicket?: any) => {
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

  const handleFormDataChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetFormData = () => {
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
  };

  return {
    formData,
    setFormData,
    handleFormDataChange,
    resetFormData
  };
};
