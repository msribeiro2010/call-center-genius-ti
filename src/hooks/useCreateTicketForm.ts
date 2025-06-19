
import { useEffect } from 'react';
import { useAssuntos } from './useAssuntos';
import { useCPFValidation } from './useCPFValidation';
import { useUsuarios } from './useUsuarios';
import { useTicketFormData } from './useTicketFormData';
import { useTicketFormHandlers } from './useTicketFormHandlers';
import { useTicketSubmission } from './useTicketSubmission';

export const useCreateTicketForm = (editingTicket?: any, onTicketCreated?: () => void) => {
  const { assuntos, loading: assuntosLoading } = useAssuntos();
  const { cpfError } = useCPFValidation();
  const { loading: usuariosLoading } = useUsuarios();
  
  const { formData, setFormData, handleFormDataChange, resetFormData } = useTicketFormData(editingTicket);
  
  const {
    ojData,
    clearOJData,
    handleProcessoChange,
    handleGrauChange,
    handleCPFChange,
    handleImprovedDescription
  } = useTicketFormHandlers(formData, setFormData, editingTicket);

  const {
    showJiraModal,
    jiraTemplateData,
    handleSubmit: handleSubmitBase,
    handleJiraModalClose
  } = useTicketSubmission(formData, resetFormData, clearOJData, editingTicket, onTicketCreated);

  // Sync with OJ detection hook - apenas orgaoJulgador e ojDetectada
  useEffect(() => {
    if (!editingTicket) {
      setFormData(prev => ({
        ...prev,
        orgaoJulgador: ojData.orgaoJulgador,
        ojDetectada: ojData.ojDetectada
      }));
    }
  }, [ojData.orgaoJulgador, ojData.ojDetectada, editingTicket, setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    handleSubmitBase(e, assuntos);
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
