
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Plus, Edit2, Trash2, Settings } from 'lucide-react';
import { useKnowledgeSubjects } from '@/hooks/useKnowledgeSubjects';

const KnowledgeSubjectManager = () => {
  const { subjects, loading, createSubject, updateSubject, deleteSubject } = useKnowledgeSubjects();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [formData, setFormData] = useState({ nome: '', categoria: '' });

  const handleCreate = async () => {
    if (!formData.nome.trim()) return;

    const { error } = await createSubject(formData.nome.trim(), formData.categoria.trim());
    
    if (!error) {
      setFormData({ nome: '', categoria: '' });
      setIsCreateDialogOpen(false);
    }
  };

  const handleEdit = async () => {
    if (!editingSubject || !formData.nome.trim()) return;

    const { error } = await updateSubject(editingSubject.id, formData.nome.trim(), formData.categoria.trim());
    
    if (!error) {
      setEditingSubject(null);
      setFormData({ nome: '', categoria: '' });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSubject(id);
  };

  const openEditDialog = (subject: any) => {
    setEditingSubject(subject);
    setFormData({ nome: subject.nome, categoria: subject.categoria || '' });
  };

  const closeEditDialog = () => {
    setEditingSubject(null);
    setFormData({ nome: '', categoria: '' });
  };

  const categorias = [...new Set(subjects.map(s => s.categoria).filter(Boolean))];

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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Assunto
              </Button>
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
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate}>
                  Criar Assunto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando assuntos...</div>
        ) : (
          <div className="space-y-6">
            {categorias.length > 0 && (
              <div className="space-y-4">
                {categorias.map(categoria => (
                  <div key={categoria} className="space-y-2">
                    <h3 className="font-semibold text-lg">{categoria}</h3>
                    <div className="grid gap-2">
                      {subjects
                        .filter(subject => subject.categoria === categoria)
                        .map(subject => (
                          <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{subject.nome}</span>
                              <Badge variant="outline">{subject.categoria}</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(subject)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
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
                                    <Button variant="outline" onClick={closeEditDialog}>
                                      Cancelar
                                    </Button>
                                    <Button onClick={handleEdit}>
                                      Salvar Alterações
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o assunto "{subject.nome}"? 
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(subject.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Assuntos sem categoria */}
            {subjects.filter(s => !s.categoria).length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Sem Categoria</h3>
                <div className="grid gap-2">
                  {subjects
                    .filter(subject => !subject.categoria)
                    .map(subject => (
                      <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{subject.nome}</span>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(subject)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
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
                                <Button variant="outline" onClick={closeEditDialog}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleEdit}>
                                  Salvar Alterações
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o assunto "{subject.nome}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(subject.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeSubjectManager;
