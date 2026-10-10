import pg8000.native

def main():
    print("Connecting to Supabase...")
    conn = pg8000.native.Connection(
        user='postgres.phczdxbtquxwfqnrakcz',
        password='Mabs1044@10',
        host='aws-0-us-west-2.pooler.supabase.com',
        port=6543,
        database='postgres',
        ssl_context=True
    )

    print("Checking current tables...")
    tables = conn.run("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;")
    print("Current tables in public schema:")
    for t in tables:
        print(f"  - {t[0]}")

    print("\nApplying user_emotions schema...")
    
    # 1. Crear tabla user_emotions si no existe
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS public.user_emotions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        emotion VARCHAR(50) NOT NULL,
        score INT NOT NULL DEFAULT 3 CHECK (score >= 1 AND score <= 5),
        note TEXT,
        tags TEXT[],
        created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );
    """
    conn.run(create_table_sql)
    print("[OK] Tabla public.user_emotions verificada/creada.")

    # 2. Índices
    conn.run("CREATE INDEX IF NOT EXISTS idx_user_emotions_user ON public.user_emotions(user_id);")
    conn.run("CREATE INDEX IF NOT EXISTS idx_user_emotions_created ON public.user_emotions(user_id, created_at DESC);")
    print("[OK] Indices verificados/creados.")

    # 3. Habilitar RLS
    conn.run("ALTER TABLE public.user_emotions ENABLE ROW LEVEL SECURITY;")
    print("[OK] RLS habilitado en user_emotions.")

    # 4. Políticas RLS
    policies = [
        ("Users can view their own emotions", "SELECT", "USING (auth.uid() = user_id)"),
        ("Users can insert their own emotions", "INSERT", "WITH CHECK (auth.uid() = user_id)"),
        ("Users can update their own emotions", "UPDATE", "USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)"),
        ("Users can delete their own emotions", "DELETE", "USING (auth.uid() = user_id)")
    ]

    for name, cmd, clause in policies:
        try:
            drop_sql = f'DROP POLICY IF EXISTS "{name}" ON public.user_emotions;'
            conn.run(drop_sql)
            create_policy_sql = f'CREATE POLICY "{name}" ON public.user_emotions FOR {cmd} {clause};'
            conn.run(create_policy_sql)
            print(f"[OK] Politica '{name}' aplicada.")
        except Exception as e:
            print(f"Advertencia en politica {name}: {e}")

    # Verificar estructura final
    cols = conn.run("""
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'user_emotions'
    ORDER BY ordinal_position;
    """)
    print("\nColumnas de public.user_emotions:")
    for col in cols:
        print(f"  - {col[0]} ({col[1]}, nullable={col[2]})")

    conn.close()
    print("\n[SUCCESS] Migracion en Supabase completada exitosamente!")

if __name__ == '__main__':
    main()
