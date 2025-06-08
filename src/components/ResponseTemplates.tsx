
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Copy, Plus, Trash2, Sparkles } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface ResponseTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
}

const ResponseTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ResponseTemplate[]>([
    {
      id: '1',
      title: 'Problema de Acesso ao Sistema',
      content: 'Prezados da TI,\n\nIdentificamos problema de acesso ao sistema. Usuário relata impossibilidade de login.\n\nDados:\n- Usuário: [INSERIR]\n- Erro: [INSERIR]\n- Horário: [INSERIR]\n\nSolicitamos verificação urgente.\n\nAtenciosamente,',
      category: 'Acesso'
    },
    {
      id: '2',
      title: 'Erro de Sistema no Processo',
      content: 'Prezados da TI,\n\nSistema apresentou erro durante tramitação do processo.\n\nDetalhes:\n- Processo: [INSERIR]\n- Erro: [INSERIR]\n- Ação realizada: [INSERIR]\n\nFavor verificar e corrigir.\n\nAtenciosamente,',
      category: 'Sistema'
    }
  ]);
  
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    category: ''
  });
  
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [aiHelp, setAiHelp] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Resposta copiada para a área de transferência"
    });
  };

  const addTemplate = () => {
    if (newTemplate.title && newTemplate.content) {
      setTemplates([...templates, {
        ...newTemplate,
        id: Date.now().toString()
      }]);
      setNewTemplate({ title: '', content: '', category: '' });
      setShowNewTemplate(false);
      toast({
        title: "Sucesso!",
        description: "Nova resposta adicionada"
      });
    }
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast({
      title: "Removido!",
      description: "Resposta removida com sucesso"
    });
  };

  const generateAIResponse = async () => {
    if (!aiHelp.trim()) return;
    
    setIsGeneratingAI(true);
    
    // Simulação de IA - aqui você integraria com uma API de IA real
    setTimeout(() => {
      const aiResponse = `Prezados da TI,\n\n${aiHelp}\n\nDados relevantes:\n- [INSERIR DADOS ESPECÍFICOS]\n- [INSERIR CONTEXTO ADICIONAL]\n\nSolicitamos análise e resolução.\n\nAtenciosamente,`;
      
      setNewTemplate({
        ...newTemplate,
        content: aiResponse
      });
      setIsGeneratingAI(false);
      toast({
        title: "IA gerou resposta!",
        description: "Resposta gerada com base na sua descrição"
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Banco de Respostas para JIRA</h3>
        <Button 
          onClick={() => setShowNewTemplate(!showNewTemplate)}
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Resposta
        </Button>
      </div>

      {showNewTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Criar Nova Resposta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Título da resposta"
                value={newTemplate.title}
                onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
              />
              <Input
                placeholder="Categoria"
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Descreva o problema para a IA ajudar..."
                  value={aiHelp}
                  onChange={(e) => setAiHelp(e.target.value)}
                />
                <Button 
                  onClick={generateAIResponse}
                  disabled={isGeneratingAI || !aiHelp.trim()}
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGeneratingAI ? 'Gerando...' : 'IA'}
                </Button>
              </div>
            </div>
            
            <Textarea
              placeholder="Conteúdo da resposta..."
              value={newTemplate.content}
              onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
              rows={8}
            />
            
            <div className="flex gap-2">
              <Button onClick={addTemplate}>Salvar Resposta</Button>
              <Button variant="outline" onClick={() => setShowNewTemplate(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-sm">{template.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(template.content)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                {template.content}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResponseTemplates;
