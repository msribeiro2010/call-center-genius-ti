
-- Atualizar a estrutura para prioridade de 1 a 5
-- Primeiro, vamos adicionar uma coluna temporária para a nova prioridade
ALTER TABLE chamados ADD COLUMN prioridade_numerica INTEGER;

-- Converter as prioridades textuais existentes para números
UPDATE chamados SET prioridade_numerica = CASE 
  WHEN prioridade = 'baixa' THEN 1
  WHEN prioridade = 'media' THEN 3
  WHEN prioridade = 'alta' THEN 4
  WHEN prioridade = 'critica' THEN 5
  ELSE 3 -- default para média
END;

-- Remover a coluna antiga e renomear a nova
ALTER TABLE chamados DROP COLUMN prioridade;
ALTER TABLE chamados RENAME COLUMN prioridade_numerica TO prioridade;

-- Adicionar constraint para garantir valores entre 1 e 5
ALTER TABLE chamados ADD CONSTRAINT prioridade_range CHECK (prioridade >= 1 AND prioridade <= 5);

-- Inserir os novos conhecimentos na base de conhecimento
INSERT INTO base_conhecimento (titulo, problema_descricao, solucao, categoria, tags) VALUES
(
  'ACÓRDÃO SUMIDO NA TIMELINE',
  'Documento Acórdão não aparece no PJE na timeline do processo',
  'PROCEDIMENTO:
1. No perfil da própria usuária (ex: Diretor de OJC), ir no menu completo → pesquisar → processo → 2G
2. Pesquisar o processo e verificar se existe acórdão assinado que não está visível na timeline
3. Abrir chamado para a TIC com o seguinte texto: "O acórdão de [DATA] foi assinado mas não aparece na timeline do processo. Precisamos recuperar os dados faltantes da assinatura."
4. Deixar o chamado pendente de terceiros com o texto: "Aberto o chamado X, favor aguardar."',
  'Sistema',
  ARRAY['acórdão', 'timeline', 'pje', 'documento', 'assinatura']
),
(
  'ACUMULADORES - ABRIR CHAMADO',
  'Quando um desembargador muda de câmara, os novos OJs são criados na nova câmara e é necessário correção nos valores dos acumuladores',
  'PROCEDIMENTO:
1. Extrair a composição do PJe pesquisando a câmara de destino do desembargador
2. Listar todos os OJs da câmara existentes no PJe2G
3. Abrir chamado para TIC seguindo padrão dos chamados R101818 e R93861
4. Incluir sempre a data de execução sugerida para o script (fim de semana - sábado ou domingo antes do início da abertura da competência do novo OJ)
5. Inserir no chamado todos os OJs que compõem o colegiado, inclusive Juízes Convocados e Vagas de Aposentados
6. Excluir apenas o próprio OJ sendo inserido (o novo)',
  'Sistema',
  ARRAY['acumuladores', 'desembargador', 'câmara', 'oj', 'script', 'pje2g']
),
(
  'ALTERAÇÃO CADASTRAL DE ENDEREÇOS FÍSICOS',
  'Solicitação de alterações cadastrais nos endereços físicos de partes do processo',
  'RESPOSTA PADRÃO:
"Os endereços físicos dos reclamados são cadastrados pelos reclamantes, nos processos. A equipe técnica de suporte ao sistema PJe não possui autorização para alterar esses dados no sistema. Qualquer alteração pontual deve ser solicitada nos próprios processos, via peticionamento."

OBSERVAÇÃO: Os endereços físicos dos reclamados são fornecidos pelos reclamantes nos processos, por isso o Núcleo não altera esses dados cadastrais.',
  'Cadastral',
  ARRAY['endereço', 'cadastral', 'reclamado', 'peticionamento', 'dados']
),
(
  'ALTERAÇÃO CADASTRAL DE ESPÓLIO',
  'Solicitação para alterar nome de pessoa física para incluir "Espólio de" no cadastro',
  'PROCEDIMENTO:
Para solicitações do tipo: "O nome da autora está cadastrado como [Nome Completo]. Por tratar-se de Espólio, solicito que seja alterado para: Espólio de [Nome Completo]."

1. Verificar se realmente se trata de processo de espólio
2. Proceder com a alteração cadastral adicionando "Espólio de" antes do nome
3. Confirmar a alteração no sistema',
  'Cadastral',
  ARRAY['espólio', 'cadastral', 'nome', 'alteração', 'processo']
);
