
-- Verificar se existem dados na tabela de assuntos e recriar se necessário
DO $$
BEGIN
  -- Verificar se a tabela tem dados
  IF NOT EXISTS (SELECT 1 FROM public.assuntos LIMIT 1) THEN
    -- Inserir assuntos de exemplo se a tabela estiver vazia
    INSERT INTO public.assuntos (nome, categoria) VALUES 
    ('Erro de Login no PJe', 'Autenticação'),
    ('Lentidão no Sistema', 'Performance'),
    ('Erro ao Protocolar Petição', 'Protocolização'),
    ('Problema com Certificado Digital', 'Autenticação'),
    ('Falha na Consulta de Processos', 'Consulta'),
    ('Erro na Juntada de Documentos', 'Protocolização'),
    ('Sistema Indisponível', 'Disponibilidade'),
    ('Erro ao Gerar Relatórios', 'Relatórios'),
    ('Problema com Intimações', 'Intimação'),
    ('Falha no Upload de Arquivos', 'Upload'),
    ('Tarefa – Erro na Execução', 'Tarefa'),
    ('Processo – Erro na Autuação', 'Processo'),
    ('Documento – Erro ao Abrir', 'Documentos'),
    ('Usuário – Erro de Acesso ao Sistema', 'Usuários'),
    ('Configuração do Sistema – Alteração', 'Configuração')
    ON CONFLICT (nome) DO NOTHING;
  END IF;
END $$;

-- Verificar se os dados foram inseridos
SELECT COUNT(*) as total_assuntos FROM public.assuntos;
