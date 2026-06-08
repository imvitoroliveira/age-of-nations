-- Define search_path para evitar mutabilidade (prática recomendada de segurança)
-- Revoga privilégios padrão de execução de public (anon) para funções SECURITY DEFINER

ALTER FUNCTION public.link_partner(TEXT) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.link_partner(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.link_partner(TEXT) TO authenticated;

ALTER FUNCTION public.unlink_partner(UUID) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.unlink_partner(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unlink_partner(UUID) TO authenticated;

ALTER FUNCTION public.add_body_measurement(NUMERIC, NUMERIC, NUMERIC, NUMERIC) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.add_body_measurement(NUMERIC, NUMERIC, NUMERIC, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_body_measurement(NUMERIC, NUMERIC, NUMERIC, NUMERIC) TO authenticated;