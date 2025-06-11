
-- Adicionar campos do usuário afetado na tabela chamados
ALTER TABLE public.chamados 
ADD COLUMN nome_usuario_afetado TEXT,
ADD COLUMN cpf_usuario_afetado TEXT,
ADD COLUMN perfil_usuario_afetado TEXT;
