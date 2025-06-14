
-- Criar tabela para armazenar usuários
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpf TEXT NOT NULL UNIQUE,
  nome_completo TEXT NOT NULL,
  perfil TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso público aos dados (temporário para desenvolvimento)
CREATE POLICY "Permitir acesso total aos usuários" ON public.usuarios FOR ALL USING (true);

-- Criar índice para busca rápida por CPF
CREATE INDEX idx_usuarios_cpf ON public.usuarios(cpf);
