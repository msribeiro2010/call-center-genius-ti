
-- Criar tabela para armazenar os chamados
CREATE TABLE public.chamados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chamado_origem TEXT,
  numero_processo TEXT,
  grau TEXT,
  orgao_julgador TEXT,
  oj_detectada TEXT,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  prioridade TEXT,
  tipo TEXT,
  status TEXT DEFAULT 'Aberto',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para base de conhecimento
CREATE TABLE public.base_conhecimento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  problema_descricao TEXT NOT NULL,
  solucao TEXT NOT NULL,
  categoria TEXT,
  tags TEXT[],
  visualizacoes INTEGER DEFAULT 0,
  util_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.chamados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.base_conhecimento ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público aos dados (temporário para desenvolvimento)
CREATE POLICY "Permitir acesso total aos chamados" ON public.chamados FOR ALL USING (true);
CREATE POLICY "Permitir acesso total à base de conhecimento" ON public.base_conhecimento FOR ALL USING (true);

-- Inserir alguns dados de exemplo na base de conhecimento
INSERT INTO public.base_conhecimento (titulo, problema_descricao, solucao, categoria, tags) VALUES
('Erro de Login no Sistema', 'Usuários não conseguem fazer login no sistema PJE', 'Verificar se o certificado digital está válido e instalado corretamente. Limpar cache do navegador e tentar novamente.', 'Acesso', ARRAY['login', 'certificado', 'pje']),
('Lentidão no Sistema', 'Sistema apresenta lentidão durante horários de pico', 'Verificar recursos do servidor. Considerar otimização de consultas no banco de dados e aumento de recursos computacionais.', 'Performance', ARRAY['lentidao', 'performance', 'servidor']),
('Erro na Assinatura de Documentos', 'Documentos não são assinados corretamente', 'Verificar se o Java está atualizado e se o componente de assinatura está funcionando. Reinstalar o assinador se necessário.', 'Assinatura', ARRAY['assinatura', 'java', 'documento']),
('Processo não Encontrado', 'Sistema não localiza processo específico', 'Verificar se o número do processo está correto. Consultar base de dados para confirmar existência do processo.', 'Consulta', ARRAY['processo', 'busca', 'consulta']);
