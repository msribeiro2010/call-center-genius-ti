
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Search, ThumbsUp, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

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
}

const KnowledgeBase = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

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
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Base de Conhecimento
          </CardTitle>
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
                    <Badge variant="outline">{item.categoria}</Badge>
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

      {/* Modal para exibir solução */}
      {selectedItem && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl max-w-2xl mx-auto my-auto max-h-[80vh] overflow-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedItem.titulo}</CardTitle>
                <Badge variant="outline" className="mt-2">{selectedItem.categoria}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                ✕
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
      
      {/* Overlay para o modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default KnowledgeBase;
