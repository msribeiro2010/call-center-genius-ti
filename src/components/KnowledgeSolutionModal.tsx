
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X, File, Eye, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

interface KnowledgeSolutionModalProps {
  selectedItem: KnowledgeItem | null;
  onClose: () => void;
  onMarkUseful: (item: KnowledgeItem) => void;
}

const KnowledgeSolutionModal: React.FC<KnowledgeSolutionModalProps> = ({
  selectedItem,
  onClose,
  onMarkUseful
}) => {
  if (!selectedItem) return null;

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('knowledge-base-files')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <>
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
              onClick={onClose}
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
                onClick={() => onMarkUseful(selectedItem)}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                Útil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
    </>
  );
};

export default KnowledgeSolutionModal;
