CREATE OR REPLACE FUNCTION public.link_partner(pairing_code text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    target_partner_id UUID;
    current_user_id UUID := auth.uid();
BEGIN
    -- Busca o ID do parceiro pelo código de rastreio (tracking_code)
    -- Importante: removemos espaços e garantimos que o código seja comparado corretamente
    SELECT id INTO target_partner_id 
    FROM public.profiles 
    WHERE tracking_code = trim(pairing_code);

    IF target_partner_id IS NULL THEN
        RAISE EXCEPTION 'Código de parceiro inválido.';
    END IF;

    IF target_partner_id = current_user_id THEN
        RAISE EXCEPTION 'Você não pode se vincular a si mesmo.';
    END IF;

    -- Limpa vínculos antigos para garantir atomicidade e evitar duplicação de parceiros
    -- Se o usuário já tinha um parceiro, desvincula esse parceiro do usuário
    UPDATE public.profiles 
    SET partner_id = NULL 
    WHERE partner_id = current_user_id;

    -- Se o parceiro alvo já tinha um parceiro, desvincula esse outro parceiro
    UPDATE public.profiles 
    SET partner_id = NULL 
    WHERE partner_id = target_partner_id;

    -- Agora cria o novo vínculo recíproco
    -- Atualiza o parceiro do usuário atual
    UPDATE public.profiles 
    SET partner_id = target_partner_id 
    WHERE id = current_user_id;

    -- Atualiza o parceiro do parceiro (vínculo recíproco)
    UPDATE public.profiles 
    SET partner_id = current_user_id 
    WHERE id = target_partner_id;
END;
$function$;