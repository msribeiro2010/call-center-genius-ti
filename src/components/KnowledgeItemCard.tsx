
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, ThumbsUp, File } from 'lucide-react';

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

interface KnowledgeItemCardProps {
  item: KnowledgeItem;
  onViewSolution: (item: KnowledgeItem) => void;
}

const KnowledgeItemCard: React.FC<KnowledgeItemCardProps> = ({ item, onViewSolution }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
            onClick={() => onViewSolution(item)}
          >
            Ver Solução
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeItemCard;
