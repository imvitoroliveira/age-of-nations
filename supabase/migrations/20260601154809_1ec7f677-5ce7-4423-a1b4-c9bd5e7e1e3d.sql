DO $$
DECLARE
    vitor_id UUID := gen_random_uuid();
    camila_id UUID := gen_random_uuid();
BEGIN
    -- Create Vitor if not exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ovitoroliveira60@gmail.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            aud,
            role
        ) VALUES (
            vitor_id,
            '00000000-0000-0000-0000-000000000000',
            'ovitoroliveira60@gmail.com',
            crypt('$1864481', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"name":"Vitor Oliveira"}',
            now(),
            now(),
            'authenticated',
            'authenticated'
        );

        -- Insert identity
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id)
        VALUES (gen_random_uuid(), vitor_id, format('{"sub":"%s","email":"%s"}', vitor_id, 'ovitoroliveira60@gmail.com')::jsonb, 'email', now(), now(), now(), vitor_id::text);

        -- Insert profile
        INSERT INTO public.profiles (id, username, display_name)
        VALUES (vitor_id, 'Vitor Oliveira', 'Vitor Oliveira')
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Create Camila if not exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'camilaferreiraaraujovieira@gmail.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            aud,
            role
        ) VALUES (
            camila_id,
            '00000000-0000-0000-0000-000000000000',
            'camilaferreiraaraujovieira@gmail.com',
            crypt('$16140712', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"name":"Camila Ferreira"}',
            now(),
            now(),
            'authenticated',
            'authenticated'
        );

        -- Insert identity
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id)
        VALUES (gen_random_uuid(), camila_id, format('{"sub":"%s","email":"%s"}', camila_id, 'camilaferreiraaraujovieira@gmail.com')::jsonb, 'email', now(), now(), now(), camila_id::text);

        -- Insert profile
        INSERT INTO public.profiles (id, username, display_name)
        VALUES (camila_id, 'Camila Ferreira', 'Camila Ferreira')
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;
