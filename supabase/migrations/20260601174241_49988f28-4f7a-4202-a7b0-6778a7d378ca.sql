-- Garantir que a tabela profiles tenha permissões corretas para usuários autenticados
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Verificar se a política de inserção existe e está correta
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" 
        ON public.profiles 
        FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Garantir que a função de busca por código seja executável
GRANT EXECUTE ON FUNCTION public.find_profile_by_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_profile_by_code(text) TO anon;
