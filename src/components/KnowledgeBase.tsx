import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Search, ThumbsUp, Eye, Plus, X, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';
import FileUpload from './FileUpload';

interface KnowledgeItem {
  id: string;
  titulo: string;
  problema_descricao: string;
  solucao: string;
  categoria: string;
  tags: string[];
  visualizacoes: number;
  util_count: number;
  created_at: string;
  arquivo_print?: string;
}

const KnowledgeBase = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    problema_descricao: '',
    solucao: '',
    categoria: '',
    tags: '',
    arquivo_print: ''
  });

  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, knowledgeItems]);

  const loadKnowledgeBase = async () => {
    try {
      const { data, error } = await supabase
        .from('base_conhecimento')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setKnowledgeItems(data || []);
    } catch (error) {
      console.error('Erro ao carregar base de conhecimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar base de conhecimento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchTerm) {
      setFilteredItems(knowledgeItems);
      return;
    }

    const filtered = knowledgeItems.filter(item =>
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.problema_descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredItems(filtered);
  };

  const handleViewSolution = async (item: KnowledgeItem) => {
    setSelectedItem(item);
    
    // Incrementar visualizações
    try {
      await supabase
        .from('base_conhecimento')
        .update({ visualizacoes: item.visualizacoes + 1 })
        .eq('id', item.id);
      
      // Atualizar estado local
      setKnowledgeItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, visualizacoes: i.visualizacoes + 1 } : i
      ));
    } catch (error) {
      console.error('Erro ao atualizar visualizações:', error);
    }
  };

  const handleMarkUseful = async (item: KnowledgeItem) => {
    try {
      await supabase
        .from('base_conhecimento')
        .update({ util_count: item.util_count + 1 })
        .eq('id', item.id);
      
      // Atualizar estado local
      setKnowledgeItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, util_count: i.util_count + 1 } : i
      ));

      toast({
        title: "Obrigado!",
        description: "Sua avaliação foi registrada"
      });
    } catch (error) {
      console.error('Erro ao marcar como útil:', error);
    }
  };

  const handleCreateKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.problema_descricao || !formData.solucao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const { error } = await supabase
        .from('base_conhecimento')
        .insert({
          titulo: formData.titulo,
          problema_descricao: formData.problema_descricao,
          solucao: formData.solucao,
          categoria: formData.categoria || 'Geral',
          tags: tagsArray,
          arquivo_print: formData.arquivo_print || null
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Conhecimento criado com sucesso"
      });

      // Reset form
      setFormData({
        titulo: '',
        problema_descricao: '',
        solucao: '',
        categoria: '',
        tags: '',
        arquivo_print: ''
      });
      setShowCreateForm(false);
      
      // Recarregar lista
      loadKnowledgeBase();
    } catch (error) {
      console.error('Erro ao criar conhecimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar conhecimento",
        variant: "destructive"
      });
    }
  };

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('knowledge-base-files')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando base de conhecimento...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Base de Conhecimento
            </CardTitle>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Conhecimento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busque por problema, solução, categoria ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{item.titulo}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.categoria}</Badge>
                      {item.arquivo_print && (
                        <Badge variant="secondary" className="text-xs">
                          <File className="h-3 w-3 mr-1" />
                          Anexo
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{item.problema_descricao}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.visualizacoes}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {item.util_count}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSolution(item)}
                    >
                      Ver Solução
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhum resultado encontrado para sua busca.' : 'Nenhum item na base de conhecimento.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para criar novo conhecimento */}
      {showCreateForm && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl max-w-2xl mx-auto my-auto max-h-[80vh] overflow-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Criar Novo Conhecimento</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateKnowledge} className="space-y-4">
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
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Modal para exibir solução */}
      {selectedItem && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl max-w-2xl mx-auto my-auto max-h-[80vh] overflow-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedItem.titulo}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedItem.categoria}</Badge>
                  {selectedItem.arquivo_print && (
                    <Badge variant="secondary" className="text-xs">
                      <File className="h-3 w-3 mr-1" />
                      Anexo
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Problema:</h4>
                <p className="text-gray-700">{selectedItem.problema_descricao}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Solução:</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedItem.solucao}</p>
                </div>
              </div>

              {selectedItem.arquivo_print && (
                <div>
                  <h4 className="font-semibold mb-2">Arquivo de Apoio:</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Arquivo anexado</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getFileUrl(selectedItem.arquivo_print!), '_blank')}
                      >
                        Abrir Arquivo
                      </Button>
                    </div>
                    
                    {selectedItem.arquivo_print.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                      <img 
                        src={getFileUrl(selectedItem.arquivo_print)} 
                        alt="Print de tela" 
                        className="max-w-full max-h-64 object-contain rounded border cursor-pointer"
                        onClick={() => window.open(getFileUrl(selectedItem.arquivo_print!), '_blank')}
                      />
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-1">
                {selectedItem.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {selectedItem.visualizacoes} visualizações
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {selectedItem.util_count} marcaram como útil
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkUseful(selectedItem)}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Útil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Overlay para os modais */}
      {(selectedItem || showCreateForm) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setSelectedItem(null);
            setShowCreateForm(false);
          }}
        />
      )}
    </div>
  );
};

export default KnowledgeBase;
