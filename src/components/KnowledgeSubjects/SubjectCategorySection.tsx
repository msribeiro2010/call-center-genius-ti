
import React from 'react';
import SubjectCard from './SubjectCard';

interface Subject {
  id: string;
  nome: string;
  categoria: string;
}

interface SubjectCategorySectionProps {
  title: string;
  subjects: Subject[];
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
  showCategory?: boolean;
}

const SubjectCategorySection: React.FC<SubjectCategorySectionProps> = ({
  title,
  subjects,
  onEdit,
  onDelete,
  showCategory = false
}) => {
  if (subjects.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="grid gap-2">
        {subjects.map(subject => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onEdit={onEdit}
            onDelete={onDelete}
            showCategory={showCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectCategorySection;
