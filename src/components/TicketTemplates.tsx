
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
    // Templates originais
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
    },
    {
      id: 4,
      name: "Erro de Acesso/Execução",
      type: "access",
      description: "Template para problemas de acesso e execução de funcionalidades",
      jiraTemplate: "h2. Erro de Acesso\n{description}\n\nFuncionalidade afetada:\n{functionality}\n\nUsuário/Perfil:\n{user_profile}",
      sqlQuery: "SELECT user_id, role, permissions FROM user_access WHERE status = 'DENIED';",
      category: "Acesso"
    },
    {
      id: 5,
      name: "Erro na Assinatura de Documento",
      type: "document",
      description: "Template para problemas com assinatura digital de documentos",
      jiraTemplate: "h2. Erro na Assinatura\n{description}\n\nTipo de documento:\n{document_type}\n\nMensagem de erro:\n{error_message}",
      sqlQuery: "SELECT document_id, signature_status, error_log FROM digital_signatures WHERE status = 'FAILED';",
      category: "Documentos"
    },
    {
      id: 6,
      name: "Sessão de Julgamento - Erro",
      type: "session",
      description: "Template para erros durante sessões de julgamento",
      jiraTemplate: "h2. Erro na Sessão\n{description}\n\nTipo de sessão:\n{session_type}\n\nEtapa afetada:\n{affected_step}",
      sqlQuery: "SELECT session_id, session_type, error_details FROM court_sessions WHERE status = 'ERROR';",
      category: "Sessões"
    },
    {
      id: 7,
      name: "Erro de Movimentação",
      type: "movement",
      description: "Template para problemas de movimentação processual",
      jiraTemplate: "h2. Erro de Movimentação\n{description}\n\nTipo de movimentação:\n{movement_type}\n\nProcesso:\n{process_number}",
      sqlQuery: "SELECT process_id, movement_type, error_reason FROM process_movements WHERE status = 'FAILED';",
      category: "Movimentação"
    },
    {
      id: 8,
      name: "Tarefa - Erro de Fluxo",
      type: "workflow",
      description: "Template para erros em fluxos de tarefas",
      jiraTemplate: "h2. Erro no Fluxo\n{description}\n\nTarefa afetada:\n{task_name}\n\nEtapa do fluxo:\n{workflow_step}",
      sqlQuery: "SELECT task_id, workflow_step, error_details FROM task_workflows WHERE status = 'BLOCKED';",
      category: "Fluxo"
    },
    {
      id: 9,
      name: "Cadastro - Erro na Elaboração",
      type: "registration",
      description: "Template para erros em cadastros e elaboração de dados",
      jiraTemplate: "h2. Erro no Cadastro\n{description}\n\nTipo de cadastro:\n{registration_type}\n\nCampos afetados:\n{affected_fields}",
      sqlQuery: "SELECT registration_id, type, validation_errors FROM registrations WHERE status = 'INVALID';",
      category: "Cadastro"
    },
    {
      id: 10,
      name: "Usuário - Erro de Acesso ao Sistema",
      type: "user_access",
      description: "Template para problemas de acesso de usuários ao sistema",
      jiraTemplate: "h2. Erro de Acesso de Usuário\n{description}\n\nUsuário:\n{username}\n\nTipo de erro:\n{access_error_type}",
      sqlQuery: "SELECT user_id, username, last_login_attempt, error_message FROM user_login_logs WHERE success = FALSE;",
      category: "Usuários"
    },
    {
      id: 11,
      name: "Pauta de Julgamento - Erro",
      type: "schedule",
      description: "Template para problemas com pautas de julgamento",
      jiraTemplate: "h2. Erro na Pauta\n{description}\n\nData da pauta:\n{schedule_date}\n\nProcessos afetados:\n{affected_processes}",
      sqlQuery: "SELECT schedule_id, schedule_date, process_count, error_details FROM court_schedules WHERE status = 'ERROR';",
      category: "Pautas"
    },
    {
      id: 12,
      name: "Redistribuição - Erro",
      type: "redistribution",
      description: "Template para problemas de redistribuição de processos",
      jiraTemplate: "h2. Erro na Redistribuição\n{description}\n\nProcesso:\n{process_number}\n\nDestino:\n{target_court}",
      sqlQuery: "SELECT redistribution_id, process_id, source_court, target_court, error_reason FROM redistributions WHERE status = 'FAILED';",
      category: "Redistribuição"
    },
    {
      id: 13,
      name: "Peticionamento Avulso - Erro",
      type: "petition",
      description: "Template para erros em peticionamento avulso",
      jiraTemplate: "h2. Erro no Peticionamento\n{description}\n\nTipo de petição:\n{petition_type}\n\nDocumentos anexos:\n{attached_documents}",
      sqlQuery: "SELECT petition_id, petition_type, submission_date, error_details FROM petitions WHERE status = 'REJECTED';",
      category: "Peticionamento"
    },
    {
      id: 14,
      name: "Sistema - Correção/Inclusão de Dados",
      type: "data_correction",
      description: "Template para correção e inclusão de dados no sistema",
      jiraTemplate: "h2. Correção de Dados\n{description}\n\nTabela/Entidade:\n{entity_name}\n\nTipo de correção:\n{correction_type}",
      sqlQuery: "SELECT entity_id, table_name, old_value, new_value, correction_date FROM data_corrections;",
      category: "Dados"
    },
    {
      id: 15,
      name: "Audiência - Erro de Assinatura",
      type: "hearing",
      description: "Template para problemas em audiências e assinaturas",
      jiraTemplate: "h2. Erro na Audiência\n{description}\n\nTipo de audiência:\n{hearing_type}\n\nParticipantes:\n{participants}",
      sqlQuery: "SELECT hearing_id, hearing_type, scheduled_date, error_log FROM hearings WHERE status = 'FAILED';",
      category: "Audiências"
    },
    // Novos templates baseados nas queries fornecidas
    {
      id: 16,
      name: "Partes do Processo",
      type: "process_parts",
      description: "Template para consultar partes envolvidas em um processo",
      jiraTemplate: "h2. Consulta de Partes do Processo\n{description}\n\nNúmero do processo:\n{process_number}\n\nPartes encontradas:\n{parts_found}",
      sqlQuery: `SELECT  
  pp.id_processo_parte,  
  pp.id_pessoa,  
  pp.id_tipo_parte,  
  pp.in_participacao,  
  pp.in_parte_principal,  
  pp.in_situacao,  
  ul.ds_nome,  
  ul.ds_login  
FROM  
  tb_processo_parte AS pp  
INNER JOIN  
  tb_usuario_login AS ul  
  ON pp.id_pessoa = ul.id_usuario  
WHERE  
  pp.id_processo_trf = ( 
    SELECT id_processo  
    FROM tb_processo  
    WHERE nr_processo ILIKE '0010562-10.2017.5.15.0041'
  )  
ORDER BY  
  pp.in_participacao,  
  pp.in_situacao;`,
      category: "Processo"
    },
    {
      id: 17,
      name: "Tarefa Atual do Processo",
      type: "current_task",
      description: "Template para identificar a tarefa atual de um processo",
      jiraTemplate: "h2. Tarefa Atual do Processo\n{description}\n\nNúmero do processo:\n{process_number}\n\nTarefa identificada:\n{current_task}",
      sqlQuery: `SELECT 
  ti.name_ AS nome_tarefa, 
  ti.actorid_ AS login_usuario, 
  oj.ds_orgao_julgador, 
  ojc.ds_orgao_julgador_colegiado, 
  MAX(pr.nr_processo) AS nr_processo, 
  COUNT(*) 
FROM 
  jbpm_variableinstance vi 
  JOIN jbpm_taskinstance ti ON ti.procinst_ = vi.processinstance_ 
  JOIN tb_processo_instance procxins ON procxins.id_proc_inst = ti.procinst_ 
  JOIN tb_processo pr ON pr.id_processo = procxins.id_processo 
  JOIN tb_processo_trf ptrf ON ptrf.id_processo_trf = pr.id_processo 
  JOIN tb_orgao_julgador oj ON oj.id_orgao_julgador = ptrf.id_orgao_julgador 
  LEFT JOIN tb_orgao_julgador_colgiado ojc ON 
    ojc.id_orgao_julgador_colegiado = ptrf.id_orgao_julgador_colegiado 
WHERE 
  ti.end_ IS NULL 
  AND ti.isopen_ = 'true' 
  AND vi.name_ = 'processo' 
  AND pr.nr_processo ILIKE '0127500-72.2003.5.15.0011' 
GROUP BY 
  ti.name_, 
  ti.actorid_, 
  oj.ds_orgao_julgador, 
  ojc.ds_orgao_julgador_colegiado 
ORDER BY 
  COUNT(*);`,
      category: "Processo"
    },
    {
      id: 18,
      name: "Processo na Fase Errada",
      type: "wrong_phase",
      description: "Template para identificar processos em fase incorreta",
      jiraTemplate: "h2. Processo na Fase Errada\n{description}\n\nNúmero do processo:\n{process_number}\n\nFase atual:\n{current_phase}\n\nFase esperada:\n{expected_phase}",
      sqlQuery: `SELECT  
  p.nr_processo,  
  f.id_agrupamento_fase,  
  f.nm_agrupamento_fase  
FROM  
  tb_processo p,  
  tb_agrupamento_fase f  
WHERE  
  p.id_agrupamento_fase = f.id_agrupamento_fase  
  AND nr_processo ILIKE '0010450-69.2019.5.15.0106';`,
      category: "Processo"
    },
    {
      id: 19,
      name: "Documento sem Data de Juntada",
      type: "document_no_date",
      description: "Template para documentos sem data de juntada",
      jiraTemplate: "h2. Documento sem Data de Juntada\n{description}\n\nNúmero do processo:\n{process_number}\n\nDocumento:\n{document_id}\n\nAção necessária:\n{required_action}",
      sqlQuery: `SELECT  
  pdb.id_processo_documento_bin,  
  pd.dt_juntada,  
  pr.id_processo,  
  pd.id_processo_documento  
FROM  
  tb_processo pr,  
  tb_processo_documento pd,  
  tb_processo_documento_bin pdb,  
  tb_tipo_processo_documento tpd,  
  tb_proc_doc_bin_pess_assin pa  
WHERE  
  pr.id_processo = pd.id_processo  
  AND pd.id_processo_documento_bin = pdb.id_processo_documento_bin  
  AND tpd.id_tipo_processo_documento = pd.id_tipo_processo_documento  
  AND pa.id_processo_documento_bin = pdb.id_processo_documento_bin  
  AND pr.nr_processo ILIKE '1190700-54.2005.5.15.0144'  
  AND pd.dt_juntada IS NULL;`,
      category: "Documentos"
    },
    {
      id: 20,
      name: "Análise de Dependência - Erro Inesperado",
      type: "dependency_analysis",
      description: "Template para análise de dependências em processos com erro inesperado",
      jiraTemplate: "h2. Análise de Dependência\n{description}\n\nNúmero do processo:\n{process_number}\n\nTipo de dependência:\n{dependency_type}\n\nErro identificado:\n{error_details}",
      sqlQuery: `SELECT  
  proc.id_processo,  
  proc.nr_processo  
FROM  
  tb_processo proc,  
  tb_processo_trf proctrf  
WHERE  
  proc.id_processo = proctrf.id_processo_trf  
  AND proc.nr_processo ILIKE '%0011456-41.2017.5.15.0055%';`,
      category: "Processo"
    },
    {
      id: 21,
      name: "Partes do Processo sem ID_PAIS",
      type: "parts_no_country",
      description: "Template para partes de processo sem ID do país",
      jiraTemplate: "h2. Partes sem ID do País\n{description}\n\nNúmero do processo:\n{process_number}\n\nPartes afetadas:\n{affected_parts}\n\nCorreção aplicada:\n{correction_applied}",
      sqlQuery: `SELECT  
  p.id_endereco,  
  id_pais  
FROM  
  pje.tb_endereco p  
WHERE  
  id_endereco IN (  
    SELECT id_endereco  
    FROM pje.tb_processo_parte_endereco e  
    WHERE id_processo_parte IN (  
      SELECT id_processo_parte  
      FROM pje.tb_processo_parte_endereco  
      WHERE id_processo_parte IN (  
        SELECT id_processo_parte  
        FROM tb_processo_parte t  
        WHERE t.id_processo_trf = (  
          SELECT id_processo  
          FROM tb_processo  
          WHERE nr_processo ILIKE '0010562-10.2017.5.15.0041'  
        )  
      )  
    )  
  );`,
      category: "Cadastro"
    },
    {
      id: 22,
      name: "Colocando Processo no Fluxo",
      type: "process_workflow",
      description: "Template para colocar processo no fluxo correto",
      jiraTemplate: "h2. Processo no Fluxo\n{description}\n\nNúmero do processo:\n{process_number}\n\nFluxo atual:\n{current_workflow}\n\nAção realizada:\n{action_taken}",
      sqlQuery: `SELECT  
  tb_processo.nr_processo AS "Número do Processo",  
  jbpm_processdefinition.name_ AS "Fluxo",  
  jbpm_task.name_ AS "Tarefa",  
  taskinstance.actorid_,  
  taskinstance.id_ AS "Task Instance",  
  taskinstance.task_ AS "Id Task",  
  jbpm_task.tasknode_ AS "Task Node_",  
  token.id_ AS "Token_Id",  
  token.node_ AS "Token_node",  
  processinstance.id_ AS "Process Instance",  
  taskinstance.isopen_ AS "IsOpen",  
  taskinstance.issignalling_,  
  taskinstance.create_ AS "Data de Criação",  
  taskinstance.start_ AS "Data Abertura Start",  
  taskinstance.end_ AS "Data Saída End"  
FROM  
  jbpm_token token,  
  jbpm_processinstance processinstance,  
  jbpm_taskinstance taskinstance,  
  jbpm_task,  
  jbpm_processdefinition,  
  tb_processo,  
  tb_processo_instance  
WHERE  
  token.processinstance_ = processinstance.id_  
  AND processinstance.processdefinition_ = jbpm_processdefinition.id_  
  AND taskinstance.token_ = token.id_  
  AND jbpm_task.id_ = taskinstance.task_  
  AND tb_processo_instance.id_processo = tb_processo.id_processo  
  AND tb_processo_instance.id_proc_inst = processinstance.id_  
  AND tb_processo.nr_processo ILIKE '000110811.2012.5.15.0096'  
ORDER BY  
  taskinstance.id_ ASC;`,
      category: "Fluxo"
    },
    {
      id: 23,
      name: "Count + Fórum por Tipo de Documento (RO)",
      type: "document_count_forum",
      description: "Template para contagem de documentos por fórum",
      jiraTemplate: "h2. Contagem de Documentos por Fórum\n{description}\n\nTipo de documento:\n{document_type}\n\nFórum:\n{forum}\n\nQuantidade encontrada:\n{count_found}",
      sqlQuery: `SELECT  
  COUNT(1),  
  j.ds_orgao_julgador  
FROM  
  tb_processo p,  
  tb_processo_trf t,  
  tb_orgao_julgador j  
WHERE  
  t.id_processo_trf = p.id_processo  
  AND j.id_orgao_julgador = t.id_orgao_julgador  
  AND j.id_orgao_julgador = 58  
  AND EXISTS (  
    SELECT 1  
    FROM tb_processo_documento d  
    WHERE  
      d.id_processo = p.id_processo  
      AND d.id_tipo_processo_documento = 47  -- "RO"  
  )  
  AND NOT EXISTS (  
    SELECT 1  
    FROM tb_processo_evento e  
    WHERE  
      e.id_processo = p.id_processo  
      AND e.id_evento = 848  -- "trânsito em julgado"  
  )  
GROUP BY  
  j.ds_orgao_julgador;`,
      category: "Relatório"
    },
    {
      id: 24,
      name: "Inativar Documento de Decisão",
      type: "deactivate_document",
      description: "Template para inativar documentos de decisão",
      jiraTemplate: "h2. Inativação de Documento\n{description}\n\nDocumento ID:\n{document_id}\n\nMotivo:\n{reason}\n\nStatus:\n{status}",
      sqlQuery: `UPDATE tb_processo_documento  
SET  
  id_usuario_exclusao = 0,  
  dt_exclusao = NOW(),  
  ds_motivo_exclusao = 'Demanda PJEJT-47879 Jira/CSJT.',  
  in_ativo = 'N',  
  ds_nome_usuario_exclusao = 'Usuário do Sistema'  
WHERE  
  id_processo_documento = 52597365  
  AND in_ativo = 'S';`,
      category: "Documentos"
    },
    {
      id: 25,
      name: "Levantamento de Advogados e Peritos",
      type: "lawyers_experts",
      description: "Template para levantamento de advogados e peritos em processo",
      jiraTemplate: "h2. Levantamento de Advogados e Peritos\n{description}\n\nNúmero do processo:\n{process_number}\n\nAdvogados encontrados:\n{lawyers_found}\n\nPeritos encontrados:\n{experts_found}",
      sqlQuery: `SELECT  
  p.nr_processo,  
  u.id_usuario,  
  u.ds_login,  
  u.ds_nome,  
  a.nr_oab  
FROM  
  tb_processo_parte pp  
  INNER JOIN tb_processo p ON pp.id_processo_trf = p.id_processo  
  INNER JOIN tb_proc_parte_represntante ppr ON pp.id_processo_parte = ppr.id_parte_representante  
  INNER JOIN tb_pessoa_advogado a ON ppr.id_representante = a.id  
  INNER JOIN tb_usuario_login u ON a.id = u.id_usuario  
  INNER JOIN tb_pessoa_fisica pf ON pf.id_pessoa_fisica = u.id_usuario  
WHERE  
  a.in_validado = 'S'  
  AND (pf.in_especializacoes & 1 <> 0)  
  AND u.in_ativo = 'S'  
  AND p.nr_processo <> ''  
  AND p.nr_processo IS NOT NULL  
  AND u.id_usuario IN (490851)  
ORDER BY  
  p.nr_processo ASC;`,
      category: "Relatório"
    },
    {
      id: 26,
      name: "Inativar Documento Não Assinado",
      type: "deactivate_unsigned",
      description: "Template para inativar documentos não assinados",
      jiraTemplate: "h2. Inativação de Documento Não Assinado\n{description}\n\nDocumento ID:\n{document_id}\n\nMotivo:\n{reason}\n\nAção realizada:\n{action_taken}",
      sqlQuery: `UPDATE tb_processo_documento  
SET  
  in_ativo = 'N'  
WHERE  
  id_processo_documento IN (109669629, 109669366);`,
      category: "Documentos"
    },
    {
      id: 27,
      name: "Análise de Dependência - Processo Preso",
      type: "stuck_process",
      description: "Template para análise de processos presos por dependência",
      jiraTemplate: "h2. Processo Preso por Dependência\n{description}\n\nNúmero do processo:\n{process_number}\n\nTipo de dependência:\n{dependency_type}\n\nSolução aplicada:\n{solution_applied}",
      sqlQuery: `SELECT *  
FROM jbpm_variableinstance  
WHERE  
  (  
    name_ ILIKE ANY (ARRAY['prevencao:idDocumentoPrevencao'])  
    OR bytearrayvalue_ IS NOT NULL  
  )  
  AND processinstance_ IN (  
    SELECT id_proc_inst  
    FROM core.tb_processo_instance  
    WHERE id_processo IN (  
      SELECT id_processo  
      FROM core.tb_processo  
      WHERE nr_processo ILIKE '%0011674-42.2019.5.15.0106%'  
    )  
  );`,
      category: "Processo"
    },
    {
      id: 28,
      name: "Alteração de Nome no Cadastro de Advogado",
      type: "lawyer_name_change",
      description: "Template para alteração de nome de advogado (casado/solteiro)",
      jiraTemplate: "h2. Alteração de Nome de Advogado\n{description}\n\nCPF:\n{cpf}\n\nNome anterior:\n{old_name}\n\nNome atual:\n{new_name}",
      sqlQuery: `SELECT *  
FROM tb_usuario_login  
WHERE ds_login ILIKE '40826565883';  -- id_usuario = 1433496`,
      category: "Cadastro"
    },
    {
      id: 29,
      name: "Excluir Perfil de Jus Postulandi para Servidor",
      type: "remove_jus_postulandi",
      description: "Template para exclusão de perfil jus postulandi de servidor",
      jiraTemplate: "h2. Exclusão de Perfil Jus Postulandi\n{description}\n\nCPF do servidor:\n{cpf}\n\nPerfil removido:\n{profile_removed}\n\nStatus:\n{status}",
      sqlQuery: `DELETE FROM tb_usuario_localizacao  
WHERE  
  id_usuario = (  
    SELECT id_usuario  
    FROM tb_usuario_login  
    WHERE ds_login = '01063326192'  
  )  
  AND id_papel = 5788;`,
      category: "Usuários"
    },
    {
      id: 30,
      name: "Cadastro de Órgão Público",
      type: "public_entity_registration",
      description: "Template para cadastro de órgão público",
      jiraTemplate: "h2. Cadastro de Órgão Público\n{description}\n\nCNPJ:\n{cnpj}\n\nNome do órgão:\n{entity_name}\n\nStatus do cadastro:\n{registration_status}",
      sqlQuery: `SELECT *  
FROM tb_usuario_login  
WHERE ds_login ILIKE '45771474000175';`,
      category: "Cadastro"
    },
    {
      id: 31,
      name: "Processo Retornando Múltiplos Registros",
      type: "multiple_records",
      description: "Template para processos retornando múltiplos registros na TB_PROCESSO_TAREFA",
      jiraTemplate: "h2. Processo com Múltiplos Registros\n{description}\n\nNúmero do processo:\n{process_number}\n\nQuantidade de registros:\n{record_count}\n\nAção de correção:\n{correction_action}",
      sqlQuery: `SELECT  
  'delete from tb_processo_tarefa ' || CHR(13) ||  
    'where id_processo_tarefa != ' ||  
    (  
      SELECT id_processo_tarefa  
      FROM tb_processo_tarefa  
      WHERE id_processo_tarefa IN (  
        SELECT MIN(id_processo_tarefa)  
        FROM tb_processo_tarefa  
        WHERE id_processo_trf = proc.id_processo  
      )  
    ) || ' ' || CHR(13) ||  
    'and id_processo_trf = ' || id_processo || ';'  
FROM tb_processo proc  
WHERE nr_processo ILIKE '0012159-19.2022.5.15.0015';`,
      category: "Processo"
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

  const categories = ["Sistema", "Performance", "Integração", "Acesso", "Documentos", "Sessões", "Movimentação", "Fluxo", "Cadastro", "Usuários", "Pautas", "Redistribuição", "Peticionamento", "Dados", "Audiências"];
  const types = ["bug", "performance", "integration", "access", "document", "session", "movement", "workflow", "registration", "user_access", "schedule", "redistribution", "petition", "data_correction", "hearing"];

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
      document: "bg-purple-100 text-purple-800",
      session: "bg-orange-100 text-orange-800",
      movement: "bg-cyan-100 text-cyan-800",
      workflow: "bg-pink-100 text-pink-800",
      registration: "bg-indigo-100 text-indigo-800",
      user_access: "bg-emerald-100 text-emerald-800",
      schedule: "bg-amber-100 text-amber-800",
      redistribution: "bg-violet-100 text-violet-800",
      petition: "bg-rose-100 text-rose-800",
      data_correction: "bg-teal-100 text-teal-800",
      hearing: "bg-lime-100 text-lime-800"
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
