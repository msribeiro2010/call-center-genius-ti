import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Database, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TicketTemplates = () => {
  const defaultTemplates = [
    {
      id: 1,
      name: "Bug de Sistema",
      type: "bug",
      description: "Template para reportar bugs e erros do sistema",
      jiraTemplate: "h2. Descrição do Erro\n{description}\n\nPassos para reproduzir:\n{steps}",
      sqlQuery: "SELECT * FROM error_logs WHERE timestamp >= NOW() - INTERVAL 1 HOUR;",
      category: "Sistema"
    },
    {
      id: 2,
      name: "Problema de Performance",
      type: "performance",
      description: "Template para questões de performance e lentidão",
      jiraTemplate: "h2. Problema de Performance\n{description}\n\nMétricas observadas:\n{metrics}",
      sqlQuery: "SELECT query_time, query FROM slow_queries ORDER BY query_time DESC LIMIT 20;",
      category: "Performance"
    },
    {
      id: 3,
      name: "Erro de Integração",
      type: "integration",
      description: "Template para problemas de integração entre sistemas",
      jiraTemplate: "h2. Falha na Integração\n{description}\n\nServiços afetados:\n{services}",
      sqlQuery: "SELECT service_name, status, error_message FROM integration_logs WHERE status = 'FAILED';",
      category: "Integração"
    }
  ];

  const [templates, setTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem('ticketTemplates');
    return savedTemplates ? JSON.parse(savedTemplates) : defaultTemplates;
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    jiraTemplate: "",
    sqlQuery: "",
    category: ""
  });

  const { toast } = useToast();

  // Save templates to localStorage whenever templates change
  useEffect(() => {
    localStorage.setItem('ticketTemplates', JSON.stringify(templates));
  }, [templates]);

  const categories = ["Sistema", "Performance", "Integração", "Segurança", "Dados", "Relatórios"];
  const types = ["bug", "performance", "integration", "access", "data", "security"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openDialog = (template?: any) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        type: template.type,
        description: template.description,
        jiraTemplate: template.jiraTemplate,
        sqlQuery: template.sqlQuery,
        category: template.category
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: "",
        type: "",
        description: "",
        jiraTemplate: "",
        sqlQuery: "",
        category: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...formData }
          : t
      ));
      toast({
        title: "Template atualizado!",
        description: "O template foi atualizado com sucesso",
      });
    } else {
      const newTemplate = {
        id: Math.max(...templates.map(t => t.id), 0) + 1,
        ...formData
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast({
        title: "Template criado!",
        description: "Novo template foi adicionado com sucesso",
      });
    }
    
    setIsDialogOpen(false);
  };

  const deleteTemplate = (id: number) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Template removido!",
      description: "O template foi removido com sucesso",
    });
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      bug: "bg-red-100 text-red-800",
      performance: "bg-yellow-100 text-yellow-800",
      integration: "bg-blue-100 text-blue-800",
      access: "bg-green-100 text-green-800",
      data: "bg-purple-100 text-purple-800",
      security: "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Templates</h2>
          <p className="text-gray-600">Crie e edite templates para diferentes tipos de chamados</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Editar Template" : "Criar Novo Template"}
              </DialogTitle>
              <DialogDescription>
                Configure os campos do template para gerar automaticamente textos JIRA e queries SQL
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Bug de Sistema"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    placeholder="Ex: Sistema, Performance..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    placeholder="Ex: bug, performance, integration"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva quando este template deve ser usado..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jiraTemplate">Template JIRA</Label>
                <Textarea
                  id="jiraTemplate"
                  value={formData.jiraTemplate}
                  onChange={(e) => handleInputChange("jiraTemplate", e.target.value)}
                  placeholder="h2. Título&#10;{description}&#10;&#10;h2. Detalhes&#10;{details}"
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500">
                  Use variáveis como {"{description}"}, {"{steps}"}, {"{environment}"} que serão substituídas pelos valores do formulário
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sqlQuery">Query SQL</Label>
                <Textarea
                  id="sqlQuery"
                  value={formData.sqlQuery}
                  onChange={(e) => handleInputChange("sqlQuery", e.target.value)}
                  placeholder="SELECT * FROM logs WHERE..."
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  Query SQL que será sugerida para investigação deste tipo de problema
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingTemplate ? "Atualizar" : "Criar"} Template
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">{template.description}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(template)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{template.category}</Badge>
                  <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Template JIRA configurado</span>
                  </div>
                  
                  {template.sqlQuery && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Database className="h-4 w-4" />
                      <span>Query SQL disponível</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-3 rounded text-xs max-h-20 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{template.jiraTemplate.substring(0, 150)}...</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
            <p className="text-gray-500 mb-4">Crie seu primeiro template para começar a gerar chamados automaticamente.</p>
            <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TicketTemplates;
