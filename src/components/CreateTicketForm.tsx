import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Database, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateTicketFormProps {
  onTicketCreated: () => void;
  editingTicket?: any;
}

const CreateTicketForm = ({ onTicketCreated, editingTicket }: CreateTicketFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    priority: "",
    environment: "",
    steps: ""
  });
  
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [generatedJiraText, setGeneratedJiraText] = useState("");
  const [generatedQuery, setGeneratedQuery] = useState("");
  const { toast } = useToast();

  // Populate form when editing
  useEffect(() => {
    if (editingTicket) {
      setFormData({
        title: editingTicket.title || "",
        description: editingTicket.description || "",
        type: editingTicket.type || "",
        priority: editingTicket.priority || "",
        environment: editingTicket.environment || "",
        steps: editingTicket.steps || ""
      });
    }
  }, [editingTicket]);

  const ticketTypes = [
    { value: "bug", label: "Bug/Erro", query: "SELECT * FROM logs WHERE error_type = 'APPLICATION' AND timestamp >= NOW() - INTERVAL 24 HOUR;" },
    { value: "performance", label: "Performance", query: "SELECT query_time, query FROM slow_queries WHERE execution_time > 5 ORDER BY execution_time DESC LIMIT 10;" },
    { value: "access", label: "Acesso/Permissão", query: "SELECT user_id, role, last_login FROM users WHERE status = 'ACTIVE' AND role = ?;" },
    { value: "integration", label: "Integração", query: "SELECT service_name, status, last_check FROM service_health WHERE status != 'UP';" },
    { value: "data", label: "Dados/Relatório", query: "SELECT table_name, row_count, last_updated FROM table_stats WHERE last_updated < NOW() - INTERVAL 1 DAY;" }
  ];

  const priorities = [
    { value: "baixa", label: "Baixa" },
    { value: "media", label: "Média" },
    { value: "alta", label: "Alta" },
    { value: "critica", label: "Crítica" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateJiraText = () => {
    const selectedType = ticketTypes.find(t => t.value === formData.type);
    
    const jiraText = `h2. Descrição do Problema
${formData.description}

h2. Tipo de Chamado
${selectedType?.label || formData.type}

h2. Prioridade
${formData.priority}

h2. Ambiente
${formData.environment}

h2. Passos para Reproduzir
${formData.steps}

h2. Evidências
${uploadedImages.length > 0 ? `${uploadedImages.length} imagem(ns) anexada(s)` : "Nenhuma imagem anexada"}

h2. Informações Adicionais
- Data de abertura: ${new Date().toLocaleDateString('pt-BR')}
- Criado via: TI Support System`;

    setGeneratedJiraText(jiraText);
    
    if (selectedType?.query) {
      setGeneratedQuery(selectedType.query);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateJiraText();
    
    // Simular salvamento no banco de dados
    console.log(editingTicket ? "Atualizando chamado:" : "Salvando chamado:", { ...formData, images: uploadedImages });
    
    toast({
      title: editingTicket ? "Chamado atualizado com sucesso!" : "Chamado criado com sucesso!",
      description: "Texto JIRA e query SQL foram gerados",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">
            {editingTicket ? "Editar Chamado" : "Criar Novo Chamado"}
          </CardTitle>
          <CardDescription>Preencha as informações para gerar automaticamente o texto JIRA e queries SQL</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Chamado</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ex: Sistema de login não está funcionando"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Chamado</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment">Ambiente</Label>
                <Select value={formData.environment} onValueChange={(value) => handleInputChange("environment", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="producao">Produção</SelectItem>
                    <SelectItem value="homologacao">Homologação</SelectItem>
                    <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                    <SelectItem value="teste">Teste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva o problema em detalhes..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Passos para Reproduzir</Label>
              <Textarea
                id="steps"
                value={formData.steps}
                onChange={(e) => handleInputChange("steps", e.target.value)}
                placeholder="1. Acesse a tela de login&#10;2. Digite as credenciais&#10;3. Clique em entrar"
                rows={3}
              />
            </div>

            {/* Upload de Imagens */}
            <div className="space-y-4">
              <Label>Imagens de Erro</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Label htmlFor="images" className="cursor-pointer text-blue-600 hover:text-blue-500">
                    Clique para fazer upload
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">PNG, JPG, GIF até 10MB cada</p>
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="bg-gray-100 rounded-lg p-2 text-center">
                        <FileText className="mx-auto h-8 w-8 text-gray-500" />
                        <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {editingTicket ? "Atualizar Chamado JIRA" : "Gerar Chamado JIRA"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resultado Gerado */}
      {generatedJiraText && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Texto JIRA Gerado</span>
              </CardTitle>
              <CardDescription>Texto formatado para criar o chamado no JIRA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">{generatedJiraText}</pre>
              </div>
              <Button
                onClick={() => copyToClipboard(generatedJiraText, "Texto JIRA")}
                className="mt-4 w-full"
                variant="outline"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Texto JIRA
              </Button>
            </CardContent>
          </Card>

          {generatedQuery && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-green-600" />
                  <span>Query SQL Sugerida</span>
                </CardTitle>
                <CardDescription>Query para investigação no banco de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm">{generatedQuery}</pre>
                </div>
                <Button
                  onClick={() => copyToClipboard(generatedQuery, "Query SQL")}
                  className="mt-4 w-full"
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Query SQL
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateTicketForm;
