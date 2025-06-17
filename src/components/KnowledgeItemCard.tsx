
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, ThumbsUp, File, Edit2, Trash2 } from 'lucide-react';

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
  onEdit?: (item: KnowledgeItem) => void;
  onDelete?: (id: string) => void;
}

const KnowledgeItemCard: React.FC<KnowledgeItemCardProps> = ({ 
  item, 
  onViewSolution, 
  onEdit, 
  onDelete 
}) => {
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
          
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item)}
                title="Editar"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewSolution(item)}
            >
              Ver Solução
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeItemCard;
