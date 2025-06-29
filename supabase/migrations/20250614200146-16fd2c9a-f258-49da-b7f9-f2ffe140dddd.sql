
-- Criar tabela de assuntos
CREATE TABLE IF NOT EXISTS public.assuntos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome text NOT NULL UNIQUE,
    categoria text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Inserir todos os assuntos fornecidos
INSERT INTO public.assuntos (nome, categoria) VALUES
('Acesso ao Sistema – Erro ao Carregar Painel', 'Sistema'),
('Acórdão – Erro', 'Documentos'),
('Acumulador – Consulta de Posição', 'Consultas'),
('Acumulador – Regularização', 'Regularização'),
('Advogado – Painel do Advogado / Procurador – Erro', 'Usuários'),
('Agrupadores – Erro', 'Sistema'),
('Área de Zoneamento – Erro em Configuração do Oficial de Justiça', 'Configuração'),
('Assinador não Carrega – Não ativa o botão "Entrar"', 'Sistema'),
('Assinatura de Acórdão – Erro', 'Assinatura'),
('Assinatura de Ata – Erro', 'Assinatura'),
('Assuntos da Ação – Competência', 'Competência'),
('Assuntos da Ação – Inexistência', 'Competência'),
('Ata de Audiência – Erro de Assinatura', 'Audiência'),
('Ata de Audiência – Erro na Confirmação', 'Audiência'),
('Ata de Audiência – Erro na Exportação', 'Audiência'),
('Atualização de Tela', 'Sistema'),
('Audiência – Pauta – Erro de Designação', 'Audiência'),
('Audiências – Erro ao Abrir Pauta', 'Audiência'),
('Audiências – Erro Configuração de Sala', 'Audiência'),
('Audiências – Pauta Bloqueada – Marcação de Horário', 'Audiência'),
('Autenticação: Erro ao Consultar Dados', 'Autenticação'),
('Autenticação: Não foi Possível Realizar', 'Autenticação'),
('Atuação – Correção de Parte', 'Processo'),
('Atuação – Erro ao Alterar a Classe', 'Processo'),
('Baixa ao 1º Grau – Erro', 'Movimentação'),
('Baixa de Documentos – Erro Webservice', 'Documentos'),
('Baixa para diligência – Erro', 'Movimentação'),
('BNDT – Erro na Inclusão ou Exclusão', 'Sistema'),
('Cadastro de Advogado – Erro', 'Cadastro'),
('Cadastro de Autoridade', 'Cadastro'),
('Cadastro de Magistrado – Alteração', 'Cadastro'),
('Cadastro de Órgãos Públicos', 'Cadastro'),
('Cadastro de Perito – Erro', 'Cadastro'),
('Cadastro de Pessoa Física – Atualização de Nome', 'Cadastro'),
('Cadastro de Pessoa Física – Erro', 'Cadastro'),
('Cadastro de Pessoa Jurídica – Erro', 'Cadastro'),
('Cadastro de Processo CLE – Erro na Elaboração', 'Processo'),
('Cadastro de Procurador – Erro', 'Cadastro'),
('Cadastro de Usuário – Correção de Perfil', 'Usuários'),
('Cadastro de Usuário – Exclusão de Perfil', 'Usuários'),
('Calendário', 'Sistema'),
('Caixas das Árvores de Tarefa – Erro na listagem', 'Tarefa'),
('CEP – Registro Ausente', 'Dados'),
('CEP Inexistente na Base dos Correios – Não Encontrado', 'Dados'),
('Certidão de Distribuição de Ações Trabalhistas', 'Documentos'),
('Competência – Classe × Assunto', 'Competência'),
('Competência – Órgão Julgador × Competência', 'Competência'),
('Configuração de Órgão Julgador', 'Configuração'),
('Configuração do Sistema – Alteração, Inclusão ou Exclusão', 'Configuração'),
('Consulta – Alertas em Processos – Erro', 'Consultas'),
('Consulta Características / Recursos do Sistema', 'Consultas'),
('Consulta de Processos', 'Consultas'),
('Controle de prazos – Erro', 'Prazos'),
('Decisão / Despacho – Erro na Assinatura', 'Assinatura'),
('Defeito em Homologação', 'Sistema'),
('Defeito em Produção', 'Sistema'),
('Descrição de Tipo de Parte – Erro – Classe Judicial', 'Processo'),
('Distribuição de Processos – Erro', 'Distribuição'),
('Documento – Sem Conteúdo', 'Documentos'),
('Documento do Processo – Erro ao Abrir', 'Documentos'),
('Documento do Processo – Erro ao Salvar', 'Documentos'),
('Documento do Processo – Erro em Assinatura', 'Documentos'),
('Documento do Processo – Erro no Escaninho', 'Documentos'),
('Documento do Processo – Sem Assinatura', 'Documentos'),
('Documento do Processo – Sem Data de Juntada', 'Documentos'),
('Documentos – Aba Anexar Documentos – Tipos', 'Documentos'),
('Documentos – Anexos – Sem Vinculação com o Principal', 'Documentos'),
('Documentos – Exclusão', 'Documentos'),
('Documentos do Processo – Erro ao Baixar', 'Documentos'),
('Documentos do Processo – Erro na Atualização', 'Documentos'),
('Documentos do Processo – Erro no Tipo – Despacho', 'Documentos'),
('E-Rec – Configuração – Erro', 'Sistema'),
('EXE-Pje – Erro de Execução', 'Sistema'),
('GIGS – Erro', 'Sistema'),
('Habilitação Advogado – Erro', 'Usuários'),
('Inclusão de CEP', 'Dados'),
('JIRA 1º grau – Consulta de Mensagens', 'JIRA'),
('JIRA 1º grau – Postar Mensagem', 'JIRA'),
('JIRA 2º grau – Consulta de Mensagens', 'JIRA'),
('JIRA 2º grau – Postar Mensagem', 'JIRA'),
('Logs do Sistema – Solicitação', 'Sistema'),
('MNI – Erro na Assinatura de Documentos', 'Assinatura'),
('Modelos de Documentos – Erro na Exibição / Seleção', 'Documentos'),
('Movimento – Erro no Registro', 'Movimentação'),
('Nó de Desvio – Erro na Inclusão de Processo', 'Processo'),
('Nó de Desvio – Inexistência de Fluxo', 'Processo'),
('Painel KZ – Filtros', 'Sistema'),
('Pauta de Julgamento – Fechamento – Erro', 'Julgamento'),
('Pauta de Julgamento – Inclusão de Processos – Erro', 'Julgamento'),
('Pje – Cadastro de usuários (Alteração ou Cadastramento de Localização, Visibilidade e Papel)', 'Usuários'),
('Pje-Calc – Erro na Execução', 'Sistema'),
('Pje-JT – BugFix 1º grau – Atualização', 'Manutenção'),
('Pje-JT – BugFix 2º grau – Atualização', 'Manutenção'),
('Pje-JT – Homologação 1º grau – Atualização de Versão', 'Manutenção'),
('Pje-JT – Homologação 2º grau – Atualização de Versão', 'Manutenção'),
('Pje-JT – Incidentes – Atualização de dados/versão', 'Manutenção'),
('Pje-JT – Produção 1º grau – Atualização de Versão', 'Manutenção'),
('Pje-JT – Produção 2º grau – Atualização de Versão', 'Manutenção'),
('Pje-JT – Treinamento 1º grau – Copiar dados/versão da produção', 'Manutenção'),
('Pje-JT – Treinamento 1º grau – Guardar cópia (fazer backup)', 'Manutenção'),
('Pje-JT – Treinamento 1º grau – Restaurar cópia (voltar backup)', 'Manutenção'),
('Pje-JT – Treinamento 2º grau – Copiar dados/versão da produção', 'Manutenção'),
('Pje-JT – Treinamento 2º grau – Guardar cópia (fazer backup)', 'Manutenção'),
('Pje-JT – Treinamento 2º grau – Restaurar cópia (voltar backup)', 'Manutenção'),
('PJE – Erro de acesso', 'Sistema'),
('PJE 2º Grau – Produção – Alteração do Cadastro de Parte', 'Processo'),
('PJE 2º Grau – Produção – Alteração Órgãos Julgadores', 'Configuração'),
('Peticionamento Avulso – Erro', 'Peticionamento'),
('Pesquisa de Log – 2º Grau', 'Consultas'),
('Pesquisas – Erro', 'Consultas'),
('Perito – Erro ao Anexar Laudo', 'Perícia'),
('Perito – Perícia Designada – Processo não Localizado no Painel', 'Perícia'),
('Plantonista – Exclusão de Magistrados do OJ', 'Usuários'),
('Plantonista – Usuário Sem Visibilidade', 'Usuários'),
('Prazo em Aberto – Erro', 'Prazos'),
('Prazo em Aberto – Erro ao Encerrar Expediente', 'Prazos'),
('Processo – Bloqueado', 'Processo'),
('Processo – CHIPS – Erro de Registro', 'Processo'),
('Processo – Consulta a Dados do Processo', 'Processo'),
('Processo – Consulta – Erro ao Abrir', 'Processo'),
('Processo – Erro na Autuação', 'Processo'),
('Processo – Erro na Distribuição – Ausência de Petição Inicial', 'Distribuição'),
('Processo – Erro na Distribuição – Processo sem Número', 'Distribuição'),
('Processo – Localização – Não Encontrado', 'Processo'),
('Processo – Movimentos – Regularização ou Inclusão', 'Movimentação'),
('Processo – Registro de Valores – Correção de Erro', 'Processo'),
('PUSH – Erro', 'Sistema'),
('Revisor – Erro ao Encaminhar', 'Julgamento'),
('Registros – Erro', 'Sistema'),
('Redistribuição – Documento Não Assinado', 'Distribuição'),
('Redistribuição – Erro', 'Distribuição'),
('Remessa ao 2º Grau – Erro', 'Movimentação'),
('Remessa ao TST – Erro', 'Movimentação'),
('Remessa ao TST – Erro na Elaboração da Certidão de Remessa', 'Movimentação'),
('Retificação de Autuação – Erro', 'Processo'),
('SAO – Erro na Emissão de Relatório', 'Relatórios'),
('Sentença – Erro em Assinatura', 'Assinatura'),
('Sentença – Registro de Solução – Erro na Inclusão', 'Sentença'),
('Sentença – Resultados – Alteração dos Dados', 'Sentença'),
('SIF – Erro de Acesso / Execução', 'Sistema'),
('SISCONDJ – Erro de Acesso / Execução', 'Sistema'),
('Sistema – Correção / Inclusão de Dados', 'Sistema'),
('Subcaixas – Problemas com Manutenção', 'Tarefa'),
('Tarefa – Análise de Dependência', 'Tarefa'),
('Tarefa – Apreciar Petição – Erro', 'Tarefa'),
('Tarefa – Arquivamento – Erro', 'Tarefa'),
('Tarefa – Comunicação de Ato – Erro na Assinatura', 'Tarefa'),
('Tarefa – Comunicação de Ato – Erro na Execução', 'Tarefa'),
('Tarefa – Conclusão ao Magistrado', 'Tarefa'),
('Tarefa – Conversão em Diligência – Erro na Movimentação', 'Tarefa'),
('Tarefa – Desarquivar – Erro', 'Tarefa'),
('Tarefa – Erro de fase', 'Tarefa'),
('Tarefa – Erro de Fluxo', 'Tarefa'),
('Tarefa – Erro de Movimentação', 'Tarefa'),
('Tarefa – Erro na Abertura', 'Tarefa'),
('Tarefa – Erro na Assinatura do Documento', 'Tarefa'),
('Tarefa – Erro na Execução – Impressão de Expedientes', 'Tarefa'),
('Tarefa – Erro na Execução – Registro de Depósito / Custas', 'Tarefa'),
('Tarefa – Erro no Envio de Publicação DEJT', 'Tarefa'),
('Tarefa – Oficial de Justiça – Erro na Execução', 'Tarefa'),
('Tarefa – Processo Preso em Publicar DJe', 'Tarefa'),
('Tarefa – Sem Opções de Tarefa', 'Tarefa'),
('Tarefa – Trânsito em Julgado', 'Tarefa'),
('Tarefas – Erro de fase', 'Tarefa'),
('Tarefas – Sub Caixas', 'Tarefa'),
('Timeline – Erro na Exibição de Documentos', 'Sistema'),
('Unificação de cadastros de órgãos públicos – Erro', 'Cadastro'),
('Usuário – Acesso Bloqueado – Solicita Desbloqueio', 'Usuários'),
('Usuário – Erro de Acesso ao Sistema', 'Usuários'),
('Usuário – Recursos do Sistema – Erro de Acesso ou Falta de Autorização', 'Usuários'),
('Variáveis – Erro', 'Sistema'),
('Variáveis de Documentos – Erro', 'Documentos'),
('Votação Antecipada – Erro no Registro', 'Julgamento'),
('Voto – Erro na Inclusão', 'Julgamento'),
('Voto – Sem Visibilidade na Pauta de Julgamento', 'Julgamento');

-- Adicionar coluna de assunto na tabela chamados
ALTER TABLE public.chamados ADD COLUMN IF NOT EXISTS assunto_id uuid REFERENCES public.assuntos(id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_assuntos_categoria ON public.assuntos(categoria);
CREATE INDEX IF NOT EXISTS idx_chamados_assunto_id ON public.chamados(assunto_id);
