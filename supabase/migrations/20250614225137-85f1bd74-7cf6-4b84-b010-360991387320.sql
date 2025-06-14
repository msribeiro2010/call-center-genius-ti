
-- Criar tabela para mensagens do chat administrativo
CREATE TABLE public.admin_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES auth.users(id) NOT NULL,
  to_user_id UUID REFERENCES auth.users(id) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam mensagens onde eles são remetente ou destinatário
CREATE POLICY "Usuários podem ver suas próprias mensagens" 
  ON public.admin_messages 
  FOR SELECT 
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Política para permitir que usuários enviem mensagens
CREATE POLICY "Usuários podem enviar mensagens" 
  ON public.admin_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = from_user_id);

-- Política para marcar mensagens como lidas
CREATE POLICY "Usuários podem marcar suas mensagens como lidas" 
  ON public.admin_messages 
  FOR UPDATE 
  USING (auth.uid() = to_user_id);

-- Adicionar coluna is_admin na tabela profiles para identificar administradores
ALTER TABLE public.profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Definir Marcelo como administrador (usando o email do log de autenticação)
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE email = 'msribeiro@trt15.jus.br';

-- Criar tabela para rastrear sessões ativas dos usuários
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_online BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id)
);

-- Habilitar RLS na tabela de sessões
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Política para permitir que administradores vejam todas as sessões
CREATE POLICY "Admins podem ver todas as sessões" 
  ON public.user_sessions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Política para permitir que usuários atualizem sua própria sessão
CREATE POLICY "Usuários podem atualizar sua própria sessão" 
  ON public.user_sessions 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
