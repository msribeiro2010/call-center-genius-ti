import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import ResponseTemplates from './ResponseTemplates';

// Dados das OJs (mantendo os dados existentes)
const primeiroGrauOJs = [
  { codigo: "0023", nome: "1ª Vara do Trabalho de Jacareí" },
  { codigo: "0415", nome: "LIQ2 - Bauru" },
  { codigo: "0607", nome: "Órgão Centralizador de Leilões Judiciais de Limeira" },
  // ... keep existing code (todos os outros OJs do 1º grau)
];

const segundoGrauOJs = [
  { codigo: "0800", nome: "Assessoria de Precatórios" },
  { codigo: "0381", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - 8ª Câmara" },
  // ... keep existing code (todos os outros OJs do 2º grau)
];

interface CreateTicketFormProps {
  onTicketCreated?: () => void;
  editingTicket?: any;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onTicketCreated, editingTicket }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    chamadoOrigem: '',
    numeroProcesso: '',
    grau: '',
    orgaoJulgador: '',
    ojDetectada: '',
    titulo: '',
    descricao: '',
    prioridade: '',
    tipo: ''
  });

  useEffect(() => {
    if (editingTicket) {
      setFormData({
        chamadoOrigem: editingTicket.chamadoOrigem || '',
        numeroProcesso: editingTicket.numeroProcesso || '',
        grau: editingTicket.grau || '',
        orgaoJulgador: editingTicket.orgaoJulgador || '',
        ojDetectada: editingTicket.ojDetectada || '',
        titulo: editingTicket.titulo || editingTicket.title || '',
        descricao: editingTicket.descricao || '',
        prioridade: editingTicket.prioridade || editingTicket.priority || '',
        tipo: editingTicket.tipo || editingTicket.type || ''
      });
    }
  }, [editingTicket]);

  const detectarOJ = (numeroProcesso: string) => {
    // Extrair os últimos 4 dígitos do processo
    const match = numeroProcesso.match(/(\d{4})$/);
    if (match) {
      const codigoOJ = match[1];
      
      // Buscar nos OJs do 1º grau
      const oj1Grau = primeiroGrauOJs.find(oj => oj.codigo === codigoOJ);
      if (oj1Grau) {
        setFormData(prev => ({
          ...prev,
          grau: '1',
          orgaoJulgador: codigoOJ,
          ojDetectada: oj1Grau.nome
        }));
        return;
      }
      
      // Buscar nos OJs do 2º grau
      const oj2Grau = segundoGrauOJs.find(oj => oj.codigo === codigoOJ);
      if (oj2Grau) {
        setFormData(prev => ({
          ...prev,
          grau: '2',
          orgaoJulgador: codigoOJ,
          ojDetectada: oj2Grau.nome
        }));
        return;
      }
      
      // Se não encontrou
      setFormData(prev => ({
        ...prev,
        ojDetectada: 'OJ não encontrada para o código: ' + codigoOJ
      }));
    } else {
      setFormData(prev => ({ ...prev, ojDetectada: '' }));
    }
  };

  const handleProcessoChange = (value: string) => {
    setFormData(prev => ({ ...prev, numeroProcesso: value }));
    if (value.trim()) {
      detectarOJ(value);
    } else {
      setFormData(prev => ({ 
        ...prev, 
        grau: '', 
        orgaoJulgador: '', 
        ojDetectada: '' 
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    console.log('Dados do chamado:', formData);
    toast({
      title: "Sucesso!",
      description: editingTicket ? "Chamado atualizado com sucesso" : "Chamado criado com sucesso"
    });
    
    // Reset form
    setFormData({
      chamadoOrigem: '',
      numeroProcesso: '',
      grau: '',
      orgaoJulgador: '',
      ojDetectada: '',
      titulo: '',
      descricao: '',
      prioridade: '',
      tipo: ''
    });

    // Call the callback function if provided
    if (onTicketCreated) {
      onTicketCreated();
    }
  };

  const ojOptions = formData.grau === '1' ? primeiroGrauOJs : 
                   formData.grau === '2' ? segundoGrauOJs : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Chamado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chamadoOrigem">Número do Chamado de Origem</Label>
                <Input
                  id="chamadoOrigem"
                  value={formData.chamadoOrigem}
                  onChange={(e) => setFormData(prev => ({ ...prev, chamadoOrigem: e.target.value }))}
                  placeholder="Ex: HELP-12345"
                />
              </div>
              
              <div>
                <Label htmlFor="numeroProcesso">Número do Processo *</Label>
                <Input
                  id="numeroProcesso"
                  value={formData.numeroProcesso}
                  onChange={(e) => handleProcessoChange(e.target.value)}
                  placeholder="Ex: 0010750-13.2024.5.15.0023"
                />
              </div>
            </div>

            {formData.ojDetectada && (
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-sm font-medium">OJ Detectada:</Label>
                <p className="text-sm text-muted-foreground">{formData.ojDetectada}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grau">Grau</Label>
                <Select value={formData.grau} onValueChange={(value) => setFormData(prev => ({ ...prev, grau: value, orgaoJulgador: '' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Grau</SelectItem>
                    <SelectItem value="2">2º Grau</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="orgaoJulgador">Órgão Julgador</Label>
                <Select value={formData.orgaoJulgador} onValueChange={(value) => setFormData(prev => ({ ...prev, orgaoJulgador: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o órgão julgador" />
                  </SelectTrigger>
                  <SelectContent>
                    {ojOptions.map((oj) => (
                      <SelectItem key={oj.codigo} value={oj.codigo}>
                        {oj.codigo} - {oj.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo do Chamado</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incidente">Incidente</SelectItem>
                    <SelectItem value="requisicao">Requisição</SelectItem>
                    <SelectItem value="problema">Problema</SelectItem>
                    <SelectItem value="mudanca">Mudança</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={formData.prioridade} onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="titulo">Título do Chamado *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Descreva brevemente o problema"
                required
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição Detalhada *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva detalhadamente o problema ou solicitação"
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Criar Chamado
            </Button>
          </form>
        </CardContent>
      </Card>

      <ResponseTemplates />
    </div>
  );
};

export default CreateTicketForm;
