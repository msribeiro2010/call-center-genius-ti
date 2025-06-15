
-- Criar tabela para gerenciar assuntos da base de conhecimento
CREATE TABLE IF NOT EXISTS public.assuntos_base_conhecimento (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome text NOT NULL UNIQUE,
    categoria text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.assuntos_base_conhecimento ENABLE ROW LEVEL SECURITY;

-- Políticas para administradores
CREATE POLICY "Admins can view all subjects" 
    ON public.assuntos_base_conhecimento 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can insert subjects" 
    ON public.assuntos_base_conhecimento 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can update subjects" 
    ON public.assuntos_base_conhecimento 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can delete subjects" 
    ON public.assuntos_base_conhecimento 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Inserir categorias padrão se não existirem
INSERT INTO public.assuntos_base_conhecimento (nome, categoria) VALUES
('Erro de Sistema', 'Sistema'),
('Problema de Performance', 'Performance'),
('Falha de Autenticação', 'Autenticação'),
('Erro de Documento', 'Documentos'),
('Problema de Rede', 'Rede'),
('Configuração Incorreta', 'Configuração')
ON CONFLICT (nome) DO NOTHING;

-- Adicionar trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assuntos_base_conhecimento_updated_at 
    BEFORE UPDATE ON public.assuntos_base_conhecimento 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
