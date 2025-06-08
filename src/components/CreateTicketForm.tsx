
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import ResponseTemplates from './ResponseTemplates';

// Lista de títulos padronizados dos chamados
const titulosPadronizados = [
  "Acesso ao Sistema – Erro ao Carregar Painel",
  "Acórdão – Erro",
  "Acumulador – Consulta de Posição",
  "Acumulador – Regularização",
  "Advogado – Painel do Advogado / Procurador – Erro",
  "Agrupadores – Erro",
  "Área de Zoneamento – Erro em Configuração do Oficial de Justiça",
  "Assinador não Carrega – Não ativa o botão \"Entrar\"",
  "Assinatura de Acórdão – Erro",
  "Assinatura de Ata – Erro",
  "Assuntos da Ação – Competência",
  "Assuntos da Ação – Inexistência",
  "Ata de Audiência – Erro de Assinatura",
  "Ata de Audiência – Erro na Confirmação",
  "Ata de Audiência – Erro na Exportação",
  "Atualização de Tela",
  "Audiência – Pauta – Erro de Designação",
  "Audiências – Erro ao Abrir Pauta",
  "Audiências – Erro Configuração de Sala",
  "Audiências – Pauta Bloqueada – Marcação de Horário",
  "Autenticação: Erro ao Consultar Dados",
  "Autenticação: Não foi Possível Realizar",
  "Atuação – Correção de Parte",
  "Atuação – Erro ao Alterar a Classe",
  "Baixa ao 1º Grau – Erro",
  "Baixa de Documentos – Erro Webservice",
  "Baixa para diligência – Erro",
  "BNDT – Erro na Inclusão ou Exclusão",
  "Cadastro de Advogado – Erro",
  "Cadastro de Autoridade",
  "Cadastro de Magistrado – Alteração",
  "Cadastro de Órgãos Públicos",
  "Cadastro de Perito – Erro",
  "Cadastro de Pessoa Física – Atualização de Nome",
  "Cadastro de Pessoa Física – Erro",
  "Cadastro de Pessoa Jurídica – Erro",
  "Cadastro de Processo CLE – Erro na Elaboração",
  "Cadastro de Procurador – Erro",
  "Cadastro de Usuário – Correção de Perfil",
  "Cadastro de Usuário – Exclusão de Perfil",
  "Calendário",
  "Caixas das Árvores de Tarefa – Erro na listagem",
  "CEP – Registro Ausente",
  "CEP Inexistente na Base dos Correios – Não Encontrado",
  "Certidão de Distribuição de Ações Trabalhistas",
  "Competência – Classe × Assunto",
  "Competência – Órgão Julgador × Competência",
  "Configuração de Órgão Julgador",
  "Configuração do Sistema – Alteração, Inclusão ou Exclusão",
  "Consulta – Alertas em Processos – Erro",
  "Consulta Características / Recursos do Sistema",
  "Consulta de Processos",
  "Controle de prazos – Erro",
  "Decisão / Despacho – Erro na Assinatura",
  "Defeito em Homologação",
  "Defeito em Produção",
  "Descrição de Tipo de Parte – Erro – Classe Judicial",
  "Distribuição de Processos – Erro",
  "Documento – Sem Conteúdo",
  "Documento do Processo – Erro ao Abrir",
  "Documento do Processo – Erro ao Salvar",
  "Documento do Processo – Erro em Assinatura",
  "Documento do Processo – Erro no Escaninho",
  "Documento do Processo – Sem Assinatura",
  "Documento do Processo – Sem Data de Juntada",
  "Documentos – Aba Anexar Documentos – Tipos",
  "Documentos – Anexos – Sem Vinculação com o Principal",
  "Documentos – Exclusão",
  "Documentos do Processo – Erro ao Baixar",
  "Documentos do Processo – Erro na Atualização",
  "Documentos do Processo – Erro no Tipo – Despacho",
  "E-Rec – Configuração – Erro",
  "EXE-Pje – Erro de Execução",
  "GIGS – Erro",
  "Habilitação Advogado – Erro",
  "Inclusão de CEP",
  "JIRA 1º grau – Consulta de Mensagens",
  "JIRA 1º grau – Postar Mensagem",
  "JIRA 2º grau – Consulta de Mensagens",
  "JIRA 2º grau – Postar Mensagem",
  "Logs do Sistema – Solicitação",
  "MNI – Erro na Assinatura de Documentos",
  "Modelos de Documentos – Erro na Exibição / Seleção",
  "Movimento – Erro no Registro",
  "Nó de Desvio – Erro na Inclusão de Processo",
  "Nó de Desvio – Inexistência de Fluxo",
  "Painel KZ – Filtros",
  "Pauta de Julgamento – Fechamento – Erro",
  "Pauta de Julgamento – Inclusão de Processos – Erro",
  "Pje – Cadastro de usuários (Alteração ou Cadastramento de Localização, Visibilidade e Papel)",
  "Pje-Calc – Erro na Execução",
  "Pje-JT – BugFix 1º grau – Atualização",
  "Pje-JT – BugFix 2º grau – Atualização",
  "Pje-JT – Homologação 1º grau – Atualização de Versão",
  "Pje-JT – Homologação 2º grau – Atualização de Versão",
  "Pje-JT – Incidentes – Atualização de dados/versão",
  "Pje-JT – Produção 1º grau – Atualização de Versão",
  "Pje-JT – Produção 2º grau – Atualização de Versão",
  "Pje-JT – Treinamento 1º grau – Copiar dados/versão da produção",
  "Pje-JT – Treinamento 1º grau – Guardar cópia (fazer backup)",
  "Pje-JT – Treinamento 1º grau – Restaurar cópia (voltar backup)",
  "Pje-JT – Treinamento 2º grau – Copiar dados/versão da produção",
  "Pje-JT – Treinamento 2º grau – Guardar cópia (fazer backup)",
  "Pje-JT – Treinamento 2º grau – Restaurar cópia (voltar backup)",
  "PJE – Erro de acesso",
  "PJE 2º Grau – Produção – Alteração do Cadastro de Parte",
  "PJE 2º Grau – Produção – Alteração Órgãos Julgadores",
  "Peticionamento Avulso – Erro",
  "Pesquisa de Log – 2º Grau",
  "Pesquisas – Erro",
  "Perito – Erro ao Anexar Laudo",
  "Perito – Perícia Designada – Processo não Localizado no Painel",
  "Plantonista – Exclusão de Magistrados do OJ",
  "Plantonista – Usuário Sem Visibilidade",
  "Prazo em Aberto – Erro",
  "Prazo em Aberto – Erro ao Encerrar Expediente",
  "Processo – Bloqueado",
  "Processo – CHIPS – Erro de Registro",
  "Processo – Consulta a Dados do Processo",
  "Processo – Consulta – Erro ao Abrir",
  "Processo – Erro na Autuação",
  "Processo – Erro na Distribuição – Ausência de Petição Inicial",
  "Processo – Erro na Distribuição – Processo sem Número",
  "Processo – Localização – Não Encontrado",
  "Processo – Movimentos – Regularização ou Inclusão",
  "Processo – Registro de Valores – Correção de Erro",
  "PUSH – Erro",
  "Revisor – Erro ao Encaminhar",
  "Registros – Erro",
  "Redistribuição – Documento Não Assinado",
  "Redistribuição – Erro",
  "Remessa ao 2º Grau – Erro",
  "Remessa ao TST – Erro",
  "Remessa ao TST – Erro na Elaboração da Certidão de Remessa",
  "Retificação de Autuação – Erro",
  "SAO – Erro na Emissão de Relatório",
  "Sentença – Erro em Assinatura",
  "Sentença – Registro de Solução – Erro na Inclusão",
  "Sentença – Resultados – Alteração dos Dados",
  "SIF – Erro de Acesso / Execução",
  "SISCONDJ – Erro de Acesso / Execução",
  "Sistema – Correção / Inclusão de Dados",
  "Subcaixas – Problemas com Manutenção",
  "Tarefa – Análise de Dependência",
  "Tarefa – Apreciar Petição – Erro",
  "Tarefa – Arquivamento – Erro",
  "Tarefa – Comunicação de Ato – Erro na Assinatura",
  "Tarefa – Comunicação de Ato – Erro na Execução",
  "Tarefa – Conclusão ao Magistrado",
  "Tarefa – Conversão em Diligência – Erro na Movimentação",
  "Tarefa – Desarquivar – Erro",
  "Tarefa – Erro de fase",
  "Tarefa – Erro de Fluxo",
  "Tarefa – Erro de Movimentação",
  "Tarefa – Erro na Abertura",
  "Tarefa – Erro na Assinatura do Documento",
  "Tarefa – Erro na Execução – Impressão de Expedientes",
  "Tarefa – Erro na Execução – Registro de Depósito / Custas",
  "Tarefa – Erro no Envio de Publicação DEJT",
  "Tarefa – Oficial de Justiça – Erro na Execução",
  "Tarefa – Processo Preso em Publicar DJe",
  "Tarefa – Sem Opções de Tarefa",
  "Tarefa – Trânsito em Julgado",
  "Tarefas – Erro de fase",
  "Tarefas – Sub Caixas",
  "Timeline – Erro na Exibição de Documentos",
  "Unificação de cadastros de órgãos públicos – Erro",
  "Usuário – Acesso Bloqueado – Solicita Desbloqueio",
  "Usuário – Erro de Acesso ao Sistema",
  "Usuário – Recursos do Sistema – Erro de Acesso ou Falta de Autorização",
  "Variáveis – Erro",
  "Variáveis de Documentos – Erro",
  "Votação Antecipada – Erro no Registro",
  "Voto – Erro na Inclusão",
  "Voto – Sem Visibilidade na Pauta de Julgamento"
];

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
              <Select value={formData.titulo} onValueChange={(value) => setFormData(prev => ({ ...prev, titulo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o título do chamado" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {titulosPadronizados.map((titulo, index) => (
                    <SelectItem key={index} value={titulo}>
                      {titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {editingTicket ? 'Atualizar Chamado' : 'Criar Chamado'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ResponseTemplates />
    </div>
  );
};

export default CreateTicketForm;
