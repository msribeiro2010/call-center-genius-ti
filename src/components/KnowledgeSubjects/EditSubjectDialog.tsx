
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface Subject {
  id: string;
  nome: string;
  categoria: string;
}

interface EditSubjectDialogProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const EditSubjectDialog: React.FC<EditSubjectDialogProps> = ({ 
  subject, 
  onEdit, 
  trigger, 
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange 
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', categoria: '' });

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  useEffect(() => {
    if (isOpen && subject) {
      setFormData({ nome: subject.nome, categoria: subject.categoria || '' });
    }
  }, [isOpen, subject]);

  const handleEdit = async () => {
    if (!formData.nome.trim()) return;

    await onEdit({
      ...subject,
      nome: formData.nome.trim(),
      categoria: formData.categoria.trim()
    });
    
    setIsOpen(false);
  };

  if (!trigger && externalIsOpen !== undefined) {
    // Modo controlado externamente
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Assunto</DialogTitle>
            <DialogDescription>
              Modifique as informações do assunto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-nome">Nome do Assunto *</Label>
              <Input
                id="edit-nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-categoria">Categoria</Label>
              <Input
                id="edit-categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Modo com trigger
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Assunto</DialogTitle>
          <DialogDescription>
            Modifique as informações do assunto
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-nome">Nome do Assunto *</Label>
            <Input
              id="edit-nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-categoria">Categoria</Label>
            <Input
              id="edit-categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEdit}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubjectDialog;
