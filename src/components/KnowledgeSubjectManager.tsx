
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Settings } from 'lucide-react';
import { useKnowledgeSubjects } from '@/hooks/useKnowledgeSubjects';
import CreateSubjectDialog from './KnowledgeSubjects/CreateSubjectDialog';
import SubjectCategorySection from './KnowledgeSubjects/SubjectCategorySection';

const KnowledgeSubjectManager = () => {
  const { subjects, loading, createSubject, updateSubject, deleteSubject } = useKnowledgeSubjects();

  const handleEdit = async (subject: any) => {
    await updateSubject(subject.id, subject.nome, subject.categoria);
  };

  const categorias = [...new Set(subjects.map(s => s.categoria).filter(Boolean))];
  const subjectsWithoutCategory = subjects.filter(s => !s.categoria);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gerenciar Assuntos
            </CardTitle>
            <CardDescription>
              Gerencie os assuntos disponíveis na base de conhecimento
            </CardDescription>
          </div>
          <CreateSubjectDialog onCreate={createSubject} />
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando assuntos...</div>
        ) : (
          <div className="space-y-6">
            {/* Assuntos por categoria */}
            {categorias.map(categoria => (
              <SubjectCategorySection
                key={categoria}
                title={categoria}
                subjects={subjects.filter(subject => subject.categoria === categoria)}
                onEdit={handleEdit}
                onDelete={deleteSubject}
                showCategory={true}
              />
            ))}

            {/* Assuntos sem categoria */}
            <SubjectCategorySection
              title="Sem Categoria"
              subjects={subjectsWithoutCategory}
              onEdit={handleEdit}
              onDelete={deleteSubject}
              showCategory={false}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeSubjectManager;
