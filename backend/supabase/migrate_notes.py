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

    print("\nApplying user_notes schema...")
    
    # 1. Crear tabla user_notes si no existe
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS public.user_notes (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT DEFAULT '',
        content TEXT DEFAULT '',
        is_checklist BOOLEAN DEFAULT FALSE,
        checklist_items JSONB DEFAULT '[]'::jsonb,
        color VARCHAR(30) DEFAULT 'default',
        is_pinned BOOLEAN DEFAULT FALSE,
        is_archived BOOLEAN DEFAULT FALSE,
        is_trashed BOOLEAN DEFAULT FALSE,
        tags TEXT[] DEFAULT '{}',
        reminder TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );
    """
    conn.run(create_table_sql)
    print("[OK] Tabla public.user_notes verificada/creada.")

    # 2. Índices
    conn.run("CREATE INDEX IF NOT EXISTS idx_user_notes_user ON public.user_notes(user_id);")
    conn.run("CREATE INDEX IF NOT EXISTS idx_user_notes_status ON public.user_notes(user_id, is_trashed, is_archived, is_pinned);")
    conn.run("CREATE INDEX IF NOT EXISTS idx_user_notes_updated ON public.user_notes(user_id, updated_at DESC);")
    print("[OK] Indices verificados/creados.")

    # 3. Habilitar RLS
    conn.run("ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;")
    print("[OK] RLS habilitado en user_notes.")

    # 4. Políticas RLS
    policies = [
        ("Users can view their own notes", "SELECT", "USING (auth.uid() = user_id)"),
        ("Users can insert their own notes", "INSERT", "WITH CHECK (auth.uid() = user_id)"),
        ("Users can update their own notes", "UPDATE", "USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)"),
        ("Users can delete their own notes", "DELETE", "USING (auth.uid() = user_id)")
    ]

    for name, cmd, clause in policies:
        try:
            drop_sql = f'DROP POLICY IF EXISTS "{name}" ON public.user_notes;'
            conn.run(drop_sql)
            create_policy_sql = f'CREATE POLICY "{name}" ON public.user_notes FOR {cmd} {clause};'
            conn.run(create_policy_sql)
            print(f"[OK] Politica '{name}' aplicada.")
        except Exception as e:
            print(f"Advertencia en politica {name}: {e}")

    # Verificar estructura final
    cols = conn.run("""
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'user_notes'
    ORDER BY ordinal_position;
    """)
    print("\nColumnas de public.user_notes:")
    for col in cols:
        print(f"  - {col[0]} ({col[1]}, nullable={col[2]})")

    conn.close()
    print("\n[SUCCESS] Migracion en Supabase de user_notes completada exitosamente!")

if __name__ == '__main__':
    main()
