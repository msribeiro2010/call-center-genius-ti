
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BulkKnowledgeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = `titulo,categoria,problema_descricao,solucao,tags
"Erro no PJe ao assinar documento","Sistema","Usuário não consegue assinar documentos no PJe","Verificar se o certificado digital está válido e configurado corretamente no navegador","pje,assinatura,certificado"
"Sistema lento durante audiências","Performance","Sistema apresenta lentidão durante horários de audiência","Reiniciar o navegador e limpar cache. Se persistir, contatar TI","performance,audiencia,lentidao"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_base_conhecimento.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      const item: any = {};
      headers.forEach((header, index) => {
        const value = values[index]?.replace(/"/g, '') || '';
        if (header === 'tags') {
          item[header] = value ? value.split(',').map(tag => tag.trim()) : [];
        } else {
          item[header] = value;
        }
      });
      
      return item;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setResults(null);

    try {
      const text = await file.text();
      const items = parseCSV(text);
      
      let successCount = 0;
      const errors: string[] = [];

      for (const [index, item] of items.entries()) {
        try {
          if (!item.titulo || !item.problema_descricao || !item.solucao) {
            errors.push(`Linha ${index + 2}: Campos obrigatórios faltando (titulo, problema_descricao, solucao)`);
            continue;
          }

          const { error } = await supabase
            .from('base_conhecimento')
            .insert([{
              titulo: item.titulo,
              categoria: item.categoria || null,
              problema_descricao: item.problema_descricao,
              solucao: item.solucao,
              tags: item.tags || []
            }]);

          if (error) {
            errors.push(`Linha ${index + 2}: ${error.message}`);
          } else {
            successCount++;
          }
        } catch (err) {
          errors.push(`Linha ${index + 2}: Erro inesperado`);
        }
      }

      setResults({ success: successCount, errors });
      
      if (successCount > 0) {
        toast({
          title: "Upload concluído",
          description: `${successCount} itens importados com sucesso${errors.length > 0 ? ` (${errors.length} com erro)` : ''}`,
        });
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo CSV",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Limpar o input
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload em Lote - Base de Conhecimento
        </CardTitle>
        <CardDescription>
          Importe múltiplos itens da base de conhecimento através de um arquivo CSV
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>1. Baixe o template CSV</Label>
            <div className="mt-2">
              <Button 
                onClick={downloadTemplate}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Template CSV
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Use este template como base para seus dados
            </p>
          </div>

          <div>
            <Label htmlFor="csv-upload">2. Selecione seu arquivo CSV preenchido</Label>
            <div className="mt-2">
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Campos obrigatórios: titulo, problema_descricao, solucao
            </p>
          </div>
        </div>

        {uploading && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-700">Processando arquivo...</span>
          </div>
        )}

        {results && (
          <div className="space-y-3">
            {results.success > 0 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-700">
                  {results.success} itens importados com sucesso
                </span>
              </div>
            )}
            
            {results.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-700">
                    {results.errors.length} erros encontrados:
                  </span>
                </div>
                <div className="max-h-32 overflow-y-auto bg-red-50 rounded p-2">
                  {results.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600 mb-1">
                      • {error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Formato do CSV:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>titulo</strong>: Título do conhecimento (obrigatório)</li>
                <li><strong>categoria</strong>: Categoria do problema (opcional)</li>
                <li><strong>problema_descricao</strong>: Descrição do problema (obrigatório)</li>
                <li><strong>solucao</strong>: Solução detalhada (obrigatório)</li>
                <li><strong>tags</strong>: Tags separadas por vírgula (opcional)</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkKnowledgeUpload;
