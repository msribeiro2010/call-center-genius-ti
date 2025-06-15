
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ResponseTemplates from './ResponseTemplates';
import JiraTemplateModal from './JiraTemplateModal';
import { useCreateTicketForm } from '@/hooks/useCreateTicketForm';
import { primeiroGrauOJs, segundoGrauOJs } from '@/data';
import { FileText, Scale } from 'lucide-react';
import BasicInfoSection from './FormSections/BasicInfoSection';
import SubjectSection from './FormSections/SubjectSection';
import UserSection from './FormSections/UserSection';
import AdvancedSettingsSection from './FormSections/AdvancedSettingsSection';
import DescriptionSection from './FormSections/DescriptionSection';

interface CreateTicketFormProps {
  onTicketCreated?: () => void;
  editingTicket?: any;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onTicketCreated, editingTicket }) => {
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

  // Filter out invalid OJ options to prevent empty value props
  const ojOptions = formData.grau === '1' ? 
    primeiroGrauOJs.filter(oj => oj.codigo && oj.codigo.trim() !== '') : 
    formData.grau === '2' ? 
    segundoGrauOJs.filter(oj => oj.codigo && oj.codigo.trim() !== '') : 
    [];

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
            <BasicInfoSection
              formData={{
                chamadoOrigem: formData.chamadoOrigem,
                grau: formData.grau,
                numeroProcesso: formData.numeroProcesso
              }}
              onFormDataChange={handleFormDataChange}
              onProcessoChange={handleProcessoChange}
              onGrauChange={handleGrauChange}
            />

            {/* Seção do Assunto */}
            <SubjectSection
              assuntoId={formData.assuntoId}
              onAssuntoChange={(value) => handleFormDataChange('assuntoId', value)}
              assuntos={assuntos}
              assuntosLoading={assuntosLoading}
            />

            {/* Seção do Usuário Afetado */}
            <UserSection
              formData={{
                cpfUsuarioAfetado: formData.cpfUsuarioAfetado,
                nomeUsuarioAfetado: formData.nomeUsuarioAfetado,
                perfilUsuarioAfetado: formData.perfilUsuarioAfetado
              }}
              onFormDataChange={handleFormDataChange}
              onCPFChange={handleCPFChange}
              cpfError={cpfError}
              usuariosLoading={usuariosLoading}
            />

            {/* OJ Detectada */}
            {formData.ojDetectada && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  <label className="text-sm font-semibold text-blue-800">OJ Detectada Automaticamente:</label>
                </div>
                <p className="text-sm text-blue-700 font-medium">{formData.ojDetectada}</p>
              </div>
            )}

            {/* Seção de Configurações Avançadas */}
            <AdvancedSettingsSection
              formData={{
                orgaoJulgador: formData.orgaoJulgador,
                tipo: formData.tipo,
                prioridade: formData.prioridade,
                grau: formData.grau
              }}
              onFormDataChange={handleFormDataChange}
              ojOptions={ojOptions}
            />

            {/* Seção da Descrição */}
            <DescriptionSection
              descricao={formData.descricao}
              onDescricaoChange={(value) => handleFormDataChange('descricao', value)}
              onImprovedDescription={handleImprovedDescription}
              context={`${formData.assuntoId} - ${formData.tipo}`}
              numeroProcesso={formData.numeroProcesso}
            />

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
