
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Save, FileText } from 'lucide-react';
import BasicInfoSection from './FormSections/BasicInfoSection';
import SubjectSection from './FormSections/SubjectSection';
import UserSection from './FormSections/UserSection';
import AdvancedSettingsSection from './FormSections/AdvancedSettingsSection';
import DescriptionSection from './FormSections/DescriptionSection';
import JiraTemplateModal from './JiraTemplateModal';
import { useCreateTicketForm } from '@/hooks/useCreateTicketForm';

interface CreateTicketFormProps {
  editingTicket?: any;
  onTicketCreated?: () => void;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ editingTicket, onTicketCreated }) => {
  const {
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
  } = useCreateTicketForm(editingTicket, onTicketCreated);

  // Buscar o título do assunto selecionado
  const assuntoSelecionado = assuntos.find(a => a.id === formData.assuntoId);
  const titulo = assuntoSelecionado ? assuntoSelecionado.nome : '';

  // Criar objeto com título para o JiraTemplateModal
  const jiraDataWithTitle = {
    ...jiraTemplateData,
    titulo: titulo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {editingTicket ? 'Editar Chamado' : 'Criar Novo Chamado'}
          </h1>
          <p className="text-gray-600">
            {editingTicket ? 'Atualize as informações do chamado' : 'Preencha as informações para criar um novo chamado'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoSection
            formData={{
              chamadoOrigem: formData.chamadoOrigem,
              grau: formData.grau,
              numeroProcesso: formData.numeroProcesso,
              ojDetectada: formData.ojDetectada
            }}
            onFormDataChange={handleFormDataChange}
            onProcessoChange={handleProcessoChange}
            onGrauChange={handleGrauChange}
          />

          <UserSection
            formData={{
              nomeUsuarioAfetado: formData.nomeUsuarioAfetado,
              cpfUsuarioAfetado: formData.cpfUsuarioAfetado,
              perfilUsuarioAfetado: formData.perfilUsuarioAfetado
            }}
            onFormDataChange={handleFormDataChange}
            onCPFChange={handleCPFChange}
            cpfError={cpfError}
            usuariosLoading={usuariosLoading}
          />

          <SubjectSection
            assuntoId={formData.assuntoId}
            onAssuntoChange={(value) => handleFormDataChange('assuntoId', value)}
            assuntos={assuntos}
            assuntosLoading={assuntosLoading}
          />

          <DescriptionSection
            descricao={formData.descricao}
            onDescricaoChange={(value) => handleFormDataChange('descricao', value)}
            onImprovedDescription={handleImprovedDescription}
            context={`Grau: ${formData.grau}, Órgão: ${formData.orgaoJulgador}`}
            numeroProcesso={formData.numeroProcesso}
          />

          <AdvancedSettingsSection
            formData={{
              orgaoJulgador: formData.orgaoJulgador,
              ojDetectada: formData.ojDetectada,
              prioridade: formData.prioridade,
              tipo: formData.tipo
            }}
            onFormDataChange={handleFormDataChange}
            grau={formData.grau}
          />

          {/* Submit Button */}
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {editingTicket ? 'Atualizar Chamado' : 'Criar Chamado'}
              </Button>
            </CardContent>
          </Card>
        </form>

        <JiraTemplateModal 
          isOpen={showJiraModal}
          onClose={handleJiraModalClose}
          ticketData={jiraDataWithTitle}
        />
      </div>
    </div>
  );
};

export default CreateTicketForm;
