
-- Adicionar coluna para rastrear o usuário que criou o chamado
ALTER TABLE public.chamados 
ADD COLUMN created_by UUID REFERENCES auth.users(id);

-- Atualizar chamados existentes para ter um usuário padrão (opcional)
-- Este comando pode ser removido se preferir deixar os registros antigos sem usuário
UPDATE public.chamados 
SET created_by = (SELECT id FROM auth.users LIMIT 1)
WHERE created_by IS NULL;
