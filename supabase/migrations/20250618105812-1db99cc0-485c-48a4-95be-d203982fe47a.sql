
-- Criar tabela para armazenar números de processos únicos
CREATE TABLE public.processos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_processo TEXT NOT NULL UNIQUE,
  grau TEXT,
  orgao_julgador TEXT,
  oj_detectada TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_processos_updated_at
  BEFORE UPDATE ON public.processos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS na tabela processos
ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT para todos os usuários autenticados
CREATE POLICY "Usuários autenticados podem visualizar processos" 
ON public.processos 
FOR SELECT 
TO authenticated 
USING (true);

-- Política para permitir INSERT para todos os usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir processos" 
ON public.processos 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política para permitir UPDATE para todos os usuários autenticados
CREATE POLICY "Usuários autenticados podem atualizar processos" 
ON public.processos 
FOR UPDATE 
TO authenticated 
USING (true);

-- Atualizar o bucket de storage para aceitar mais tipos de arquivo
UPDATE storage.buckets 
SET file_size_limit = 10485760, -- 10MB
    allowed_mime_types = ARRAY[
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain',
      'text/rtf',
      'application/rtf',
      'text/csv',
      'application/csv'
    ]
WHERE id = 'knowledge-base-files';

-- Criar política mais permissiva para o storage
CREATE POLICY "Permitir todas as operações em arquivos da base de conhecimento" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'knowledge-base-files')
WITH CHECK (bucket_id = 'knowledge-base-files');
