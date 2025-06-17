
import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import EditSubjectDialog from './EditSubjectDialog';
import DeleteSubjectDialog from './DeleteSubjectDialog';

interface Subject {
  id: string;
  nome: string;
  categoria: string;
}

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
  showCategory?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onEdit, 
  onDelete, 
  showCategory = false 
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <span className="font-medium">{subject.nome}</span>
        {showCategory && subject.categoria && (
          <Badge variant="outline">{subject.categoria}</Badge>
        )}
      </div>
      <div className="flex gap-2">
        <EditSubjectDialog
          subject={subject}
          onEdit={onEdit}
          trigger={
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4" />
            </Button>
          }
        />
        <DeleteSubjectDialog
          subject={subject}
          onDelete={onDelete}
          trigger={
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default SubjectCard;
