import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, FileText, Database, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateTicketForm = ({ onTicketCreated, editingTicket }: { onTicketCreated?: () => void, editingTicket?: any }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    priority: "",
    environment: "",
    cpf: "",
    userName: "",
    orgaoJulgador: ""
  });

  const [generatedText, setGeneratedText] = useState("");
  const [suggestedQuery, setSuggestedQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (editingTicket) {
      setFormData({
        title: editingTicket.title || "",
        type: editingTicket.type || "",
        description: editingTicket.description || "",
        priority: editingTicket.priority || "",
        environment: editingTicket.environment || "",
        cpf: editingTicket.cpf || "",
        userName: editingTicket.userName || "",
        orgaoJulgador: editingTicket.orgaoJulgador || ""
      });
    }
  }, [editingTicket]);

  const ticketTypes = [
    { value: "duvida", label: "Dúvida" },
    { value: "incidentes", label: "Incidentes" },
    { value: "melhorias", label: "Melhorias" }
  ];

  const environments = [
    { value: "producao", label: "Produção" },
    { value: "homologacao", label: "Homologação" },
    { value: "desenvolvimento", label: "Desenvolvimento" }
  ];

  const priorities = [
    { value: "baixa", label: "Baixa" },
    { value: "media", label: "Média" },
    { value: "alta", label: "Alta" },
    { value: "critica", label: "Crítica" }
  ];

  // Templates disponíveis (mesma lista dos templates)
  const availableTemplates = [
    "Bug de Sistema",
    "Problema de Performance",
    "Erro de Integração",
    "Erro de Acesso/Execução",
    "Erro na Assinatura de Documento",
    "Sessão de Julgamento - Erro",
    "Erro de Movimentação",
    "Tarefa - Erro de Fluxo",
    "Cadastro - Erro na Elaboração",
    "Usuário - Erro de Acesso ao Sistema",
    "Pauta de Julgamento - Erro",
    "Redistribuição - Erro",
    "Peticionamento Avulso - Erro",
    "Sistema - Correção/Inclusão de Dados",
    "Audiência - Erro de Assinatura",
    "Partes do Processo",
    "Tarefa Atual do Processo",
    "Processo na Fase Errada",
    "Documento sem Data de Juntada",
    "Análise de Dependência - Erro Inesperado",
    "Partes do Processo sem ID_PAIS",
    "Colocando Processo no Fluxo",
    "Count + Fórum por Tipo de Documento (RO)",
    "Inativar Documento de Decisão",
    "Levantamento de Advogados e Peritos",
    "Inativar Documento Não Assinado",
    "Análise de Dependência - Processo Preso",
    "Alteração de Nome no Cadastro de Advogado",
    "Excluir Perfil de Jus Postulandi para Servidor",
    "Cadastro de Órgão Público",
    "Processo Retornando Múltiplos Registros"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => {
    console.log("Título selecionado:", value);
    handleInputChange("title", value);
    
    // Buscar template correspondente
    const savedTemplates = localStorage.getItem('ticketTemplates');
    console.log("Templates salvos no localStorage:", savedTemplates);
    
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      const template = templates.find((t: any) => t.name === value);
      console.log("Template encontrado:", template);
      if (template) {
        setSelectedTemplate(template);
      } else {
        console.log("Template não encontrado para o título:", value);
        setSelectedTemplate(null);
      }
    } else {
      console.log("Nenhum template salvo no localStorage");
      setSelectedTemplate(null);
    }
  };

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numericValue.length <= 11) {
      return numericValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return numericValue.slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    handleInputChange("cpf", formattedCPF);
  };

  const generateTicketText = () => {
    console.log("Iniciando geração do texto JIRA");
    console.log("Dados do formulário:", formData);
    console.log("Template selecionado:", selectedTemplate);

    // Se não há template, vamos criar um texto básico
    if (!selectedTemplate) {
      console.log("Criando texto básico sem template");
      
      const basicText = `h2. Informações do Solicitante
*Nome:* ${formData.userName}
*CPF:* ${formData.cpf}
*Órgão Julgador:* ${formData.orgaoJulgador}
*Ambiente:* ${formData.environment}
*Prioridade:* ${formData.priority}

h2. Descrição do Problema
*Tipo:* ${formData.type}
*Título:* ${formData.title}

*Descrição Detalhada:*
${formData.description}

h2. Informações Técnicas
*Ambiente:* ${formData.environment}
*Prioridade:* ${formData.priority}`;

      setGeneratedText(basicText);
      setSuggestedQuery("");

      toast({
        title: "Texto gerado!",
        description: "O texto do chamado JIRA foi gerado com sucesso.",
      });
      return;
    }

    // Usar template se disponível
    let jiraText = selectedTemplate.jiraTemplate;
    
    // Substituir variáveis do template
    jiraText = jiraText.replace(/{description}/g, formData.description);
    jiraText = jiraText.replace(/{cpf}/g, formData.cpf);
    jiraText = jiraText.replace(/{userName}/g, formData.userName);
    jiraText = jiraText.replace(/{orgaoJulgador}/g, formData.orgaoJulgador);
    jiraText = jiraText.replace(/{environment}/g, formData.environment);
    jiraText = jiraText.replace(/{priority}/g, formData.priority);

    // Adicionar informações do solicitante
    const solicitanteInfo = `h2. Informações do Solicitante
*Nome:* ${formData.userName}
*CPF:* ${formData.cpf}
*Órgão Julgador:* ${formData.orgaoJulgador}
*Ambiente:* ${formData.environment}
*Prioridade:* ${formData.priority}

`;

    const finalText = solicitanteInfo + jiraText;
    
    setGeneratedText(finalText);
    setSuggestedQuery(selectedTemplate.sqlQuery || "");

    console.log("Texto gerado:", finalText);

    toast({
      title: "Texto gerado!",
      description: "O texto do chamado JIRA foi gerado com sucesso.",
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.title || !formData.type || !formData.description || !formData.cpf || !formData.userName || !formData.orgaoJulgador) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Chamado criado!",
      description: "O chamado foi criado com sucesso.",
    });
    
    if (onTicketCreated) {
      onTicketCreated();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">
            {editingTicket ? "Editar Chamado" : "Criar Novo Chamado"}
          </CardTitle>
          <CardDescription>
            Preencha as informações do chamado para gerar automaticamente o texto JIRA e sugestões de queries SQL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do Solicitante */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Informações do Solicitante</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Nome Completo *</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                    placeholder="Ex: João Silva Santos"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgaoJulgador">Órgão Julgador (OJ) *</Label>
                  <Input
                    id="orgaoJulgador"
                    value={formData.orgaoJulgador}
                    onChange={(e) => handleInputChange("orgaoJulgador", e.target.value)}
                    placeholder="Ex: 1ª Vara do Trabalho de São Paulo"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações do Chamado */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Detalhes do Chamado</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Chamado *</Label>
                  <Select value={formData.title} onValueChange={handleTitleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o título do chamado" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTemplates.map((template) => (
                        <SelectItem key={template} value={template}>
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Chamado *</Label>
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
                  <Label htmlFor="priority">Prioridade *</Label>
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
                      {environments.map((env) => (
                        <SelectItem key={env.value} value={env.value}>
                          {env.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Detalhada *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva detalhadamente o problema, erro ou solicitação..."
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500">
                  Inclua o máximo de detalhes possível: mensagens de erro, passos para reproduzir, comportamento esperado, etc.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                type="button" 
                onClick={generateTicketText}
                className="bg-green-600 hover:bg-green-700"
                disabled={!formData.title || !formData.description}
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerar Texto JIRA
              </Button>
              
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingTicket ? "Atualizar" : "Criar"} Chamado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {(generatedText || suggestedQuery) && (
        <div className="space-y-6">
          {generatedText && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Texto Gerado para JIRA</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedText, "Texto JIRA")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{generatedText}</pre>
                </div>
              </CardContent>
            </Card>
          )}

          {suggestedQuery && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-green-600" />
                    <span>Query SQL Sugerida</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(suggestedQuery, "Query SQL")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{suggestedQuery}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateTicketForm;
