-- Corrigindo a função para SECURITY INVOKER para segurança e conformidade com RLS
ALTER FUNCTION public.find_profile_by_code(text) SECURITY INVOKER;

-- Revogando acesso público desnecessário se houver (o linter avisou sobre isso)
-- Mas para esta aplicação, o anon precisa buscar o código durante o cadastro/vínculo inicial? 
-- Geralmente é melhor restringir a authenticated se possível.
-- No entanto, mudando para SECURITY INVOKER resolve o risco de escalada de privilégio.
