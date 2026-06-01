DO $$
DECLARE
    u RECORD;
    creds RECORD;
BEGIN
    FOR creds IN
        SELECT * FROM (VALUES
            ('ovitoroliveira60@gmail.com', '$1864481', 'Vitor Oliveira'),
            ('camilaferreiraaraujovieira@gmail.com', '$16140712', 'Camila Ferreira')
        ) AS t(email, pwd, name)
    LOOP
        SELECT id INTO u FROM auth.users WHERE email = creds.email;

        IF u.id IS NULL THEN
            -- Create the user
            INSERT INTO auth.users (
                id, instance_id, email, encrypted_password, email_confirmed_at,
                raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role
            ) VALUES (
                gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
                creds.email, crypt(creds.pwd, gen_salt('bf')), now(),
                '{"provider":"email","providers":["email"]}',
                jsonb_build_object('name', creds.name),
                now(), now(), 'authenticated', 'authenticated'
            ) RETURNING id INTO u.id;
        ELSE
            -- Reset password and confirm email
            UPDATE auth.users
            SET encrypted_password = crypt(creds.pwd, gen_salt('bf')),
                email_confirmed_at = COALESCE(email_confirmed_at, now()),
                updated_at = now()
            WHERE id = u.id;
        END IF;

        -- Ensure identity exists
        IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = u.id AND provider = 'email') THEN
            INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
            VALUES (gen_random_uuid(), u.id, jsonb_build_object('sub', u.id::text, 'email', creds.email, 'email_verified', true), 'email', u.id::text, now(), now(), now());
        END IF;

        -- Ensure profile exists
        INSERT INTO public.profiles (id, username, display_name)
        VALUES (u.id, creds.name, creds.name)
        ON CONFLICT (id) DO NOTHING;
    END LOOP;
END $$;
