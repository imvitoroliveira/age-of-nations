-- Revogar execução pública de funções críticas
REVOKE EXECUTE ON FUNCTION public.link_partner(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.unlink_partner(uuid) FROM PUBLIC;

-- Garantir que apenas usuários autenticados possam executá-las
GRANT EXECUTE ON FUNCTION public.link_partner(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unlink_partner(uuid) TO authenticated;

-- Repetir para outras funções se existirem e forem SECURITY DEFINER
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
        GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
        GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;
    END IF;
END $$;