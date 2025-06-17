
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Settings, Eye, Trash, Plus } from 'lucide-react';
import { useKnowledgeSubjects } from '@/hooks/useKnowledgeSubjects';
import CreateSubjectDialog from './KnowledgeSubjects/CreateSubjectDialog';
import EditSubjectDialog from './KnowledgeSubjects/EditSubjectDialog';
import DeleteSubjectDialog from './KnowledgeSubjects/DeleteSubjectDialog';
import { Badge } from './ui/badge';

const KnowledgeSubjectManager = () => {
  const { subjects, loading, createSubject, updateSubject, deleteSubject } = useKnowledgeSubjects();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = async (subject: any) => {
    await updateSubject(subject.id, subject.nome, subject.categoria);
    setIsEditDialogOpen(false);
  };

  const handleViewSubject = (subject: any) => {
    setSelectedSubject(subject);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Assuntos da Base de Conhecimento
            </CardTitle>
            <CardDescription>
              Visualize e gerencie os assuntos disponíveis
            </CardDescription>
          </div>
          <CreateSubjectDialog onCreate={createSubject} />
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando assuntos...</div>
        ) : (
          <div className="space-y-2">
            {subjects.map(subject => (
              <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{subject.nome}</span>
                  {subject.categoria && (
                    <Badge variant="outline">{subject.categoria}</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewSubject(subject)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DeleteSubjectDialog
                    subject={subject}
                    onDelete={deleteSubject}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
            ))}
            
            {subjects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum assunto cadastrado
              </div>
            )}
          </div>
        )}
      </CardContent>

      {selectedSubject && (
        <EditSubjectDialog
          subject={selectedSubject}
          onEdit={handleEdit}
          trigger={null}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </Card>
  );
};

export default KnowledgeSubjectManager;
