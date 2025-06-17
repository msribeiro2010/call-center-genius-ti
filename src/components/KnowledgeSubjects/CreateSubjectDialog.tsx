
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus } from 'lucide-react';

interface CreateSubjectDialogProps {
  onCreate: (nome: string, categoria: string) => Promise<{ error?: any }>;
  trigger?: React.ReactNode;
}

const CreateSubjectDialog: React.FC<CreateSubjectDialogProps> = ({ onCreate, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', categoria: '' });

  const handleCreate = async () => {
    if (!formData.nome.trim()) return;

    const { error } = await onCreate(formData.nome.trim(), formData.categoria.trim());
    
    if (!error) {
      setFormData({ nome: '', categoria: '' });
      setIsOpen(false);
    }
  };

  const defaultTrigger = (
    <Button className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Novo Assunto
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Assunto</DialogTitle>
          <DialogDescription>
            Adicione um novo assunto à base de conhecimento
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Assunto *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Digite o nome do assunto"
            />
          </div>
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              placeholder="Digite a categoria (opcional)"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>
            Criar Assunto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubjectDialog;
