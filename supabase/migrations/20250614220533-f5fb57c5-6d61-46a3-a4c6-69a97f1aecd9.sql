
-- Criar bucket para armazenar os arquivos de print de tela
INSERT INTO storage.buckets (id, name, public) 
VALUES ('knowledge-base-files', 'knowledge-base-files', true);

-- Criar política para permitir upload de arquivos
CREATE POLICY "Permitir upload de arquivos da base de conhecimento" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'knowledge-base-files');

-- Criar política para permitir visualização de arquivos
CREATE POLICY "Permitir visualização de arquivos da base de conhecimento" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'knowledge-base-files');

-- Criar política para permitir exclusão de arquivos
CREATE POLICY "Permitir exclusão de arquivos da base de conhecimento" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'knowledge-base-files');

-- Adicionar coluna para armazenar o caminho do arquivo na tabela base_conhecimento
ALTER TABLE public.base_conhecimento 
ADD COLUMN arquivo_print TEXT;
