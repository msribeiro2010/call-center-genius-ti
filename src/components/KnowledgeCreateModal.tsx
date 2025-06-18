
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import FileUpload from './FileUpload';

interface KnowledgeCreateModalProps {
  showCreateForm: boolean;
  formData: {
    titulo: string;
    problema_descricao: string;
    solucao: string;
    categoria: string;
    tags: string;
    arquivo_print: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    titulo: string;
    problema_descricao: string;
    solucao: string;
    categoria: string;
    tags: string;
    arquivo_print: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditing?: boolean;
}

const KnowledgeCreateModal: React.FC<KnowledgeCreateModalProps> = ({
  showCreateForm,
  formData,
  setFormData,
  onSubmit,
  onClose,
  isEditing = false
}) => {
  const handleFileUploaded = (filePath: string) => {
    setFormData({ ...formData, arquivo_print: filePath });
  };

  const handleFileRemoved = () => {
    setFormData({ ...formData, arquivo_print: '' });
  };

  return (
    <Dialog open={showCreateForm} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Item' : 'Criar Novo Item'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações do item da base de conhecimento' : 'Adicione um novo item à base de conhecimento'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="problema_descricao">Descrição do Problema *</Label>
            <Textarea
              id="problema_descricao"
              value={formData.problema_descricao}
              onChange={(e) => setFormData({ ...formData, problema_descricao: e.target.value })}
              required
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="solucao">Solução *</Label>
            <Textarea
              id="solucao"
              value={formData.solucao}
              onChange={(e) => setFormData({ ...formData, solucao: e.target.value })}
              required
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="ex: windows, rede, impressora"
            />
          </div>
          
          <div>
            <FileUpload
              label="Arquivo/Documento de Apoio"
              onFileUploaded={handleFileUploaded}
              currentFile={formData.arquivo_print}
              onFileRemoved={handleFileRemoved}
              accept="image/*,.pdf,.txt,.rtf,.csv"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeCreateModal;
