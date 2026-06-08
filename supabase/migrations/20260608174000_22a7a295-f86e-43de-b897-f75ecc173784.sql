CREATE OR REPLACE FUNCTION public.link_partner(pairing_code TEXT)
RETURNS VOID AS $$
DECLARE
    target_partner_id UUID;
    current_user_id UUID := auth.uid();
BEGIN
    -- Busca o ID do parceiro pelo código de rastreio (tracking_code)
    SELECT id INTO target_partner_id 
    FROM public.profiles 
    WHERE tracking_code = pairing_code;

    IF target_partner_id IS NULL THEN
        RAISE EXCEPTION 'Código de parceiro inválido.';
    END IF;

    IF target_partner_id = current_user_id THEN
        RAISE EXCEPTION 'Você não pode se vincular a si mesmo.';
    END IF;

    -- Atualiza o parceiro do usuário atual
    UPDATE public.profiles 
    SET partner_id = target_partner_id 
    WHERE id = current_user_id;

    -- Atualiza o parceiro do parceiro (vínculo recíproco)
    UPDATE public.profiles 
    SET partner_id = current_user_id 
    WHERE id = target_partner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.link_partner TO authenticated;

CREATE OR REPLACE FUNCTION public.unlink_partner(partner_id_param UUID)
RETURNS VOID AS $$
DECLARE
    current_user_id UUID := auth.uid();
BEGIN
    -- Desvincula o usuário atual
    UPDATE public.profiles 
    SET partner_id = NULL 
    WHERE id = current_user_id;

    -- Desvincula o parceiro
    UPDATE public.profiles 
    SET partner_id = NULL 
    WHERE id = partner_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.unlink_partner TO authenticated;

CREATE OR REPLACE FUNCTION public.add_body_measurement(
    weight_kg_param NUMERIC,
    waist_cm_param NUMERIC DEFAULT NULL,
    thigh_cm_param NUMERIC DEFAULT NULL,
    hip_cm_param NUMERIC DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    current_user_id UUID := auth.uid();
BEGIN
    -- Insere a medida
    INSERT INTO public.body_measurements (user_id, weight_kg, waist_cm, thigh_cm, hip_cm, recorded_at)
    VALUES (current_user_id, weight_kg_param, waist_cm_param, thigh_cm_param, hip_cm_param, now());

    -- Atualiza a data da última medição no perfil
    UPDATE public.profiles 
    SET last_measurement_date = now() 
    WHERE id = current_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.add_body_measurement TO authenticated;