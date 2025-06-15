
-- Primeiro, vamos verificar se a tabela assuntos precisa ser populada
-- Vamos inserir alguns assuntos de exemplo para testar
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
('Falha no Upload de Arquivos', 'Upload')
ON CONFLICT (nome) DO NOTHING;
