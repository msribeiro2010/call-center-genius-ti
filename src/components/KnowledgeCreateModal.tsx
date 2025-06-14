
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { X } from 'lucide-react';
import FileUpload from './FileUpload';

interface FormData {
  titulo: string;
  problema_descricao: string;
  solucao: string;
  categoria: string;
  tags: string;
  arquivo_print: string;
}

interface KnowledgeCreateModalProps {
  showCreateForm: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const KnowledgeCreateModal: React.FC<KnowledgeCreateModalProps> = ({
  showCreateForm,
  formData,
  setFormData,
  onSubmit,
  onClose
}) => {
  if (!showCreateForm) return null;

  return (
    <>
      <Card className="fixed inset-4 z-50 bg-white shadow-2xl max-w-2xl mx-auto my-auto max-h-[80vh] overflow-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Criar Novo Conhecimento</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Digite o título do conhecimento"
                required
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                placeholder="Ex: Sistema, Processo, Audiência"
              />
            </div>

            <div>
              <Label htmlFor="problema_descricao">Descrição do Problema *</Label>
              <Textarea
                id="problema_descricao"
                value={formData.problema_descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, problema_descricao: e.target.value }))}
                placeholder="Descreva o problema ou situação"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="solucao">Solução *</Label>
              <Textarea
                id="solucao"
                value={formData.solucao}
                onChange={(e) => setFormData(prev => ({ ...prev, solucao: e.target.value }))}
                placeholder="Descreva a solução detalhadamente"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Separe as tags por vírgula (ex: pje, erro, assinatura)"
              />
            </div>

            <FileUpload
              label="Print de Tela / Arquivo de Apoio"
              onFileUploaded={(filePath) => setFormData(prev => ({ ...prev, arquivo_print: filePath }))}
              currentFile={formData.arquivo_print}
              onFileRemoved={() => setFormData(prev => ({ ...prev, arquivo_print: '' }))}
              accept="image/*,.pdf,.doc,.docx"
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Criar Conhecimento
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
    </>
  );
};

export default KnowledgeCreateModal;
