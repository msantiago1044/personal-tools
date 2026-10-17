import os
import pg8000.native

def main():
    print("Connecting to Supabase...")
    db_password = os.environ.get('SUPABASE_DB_PASSWORD')
    if not db_password:
        raise ValueError("SUPABASE_DB_PASSWORD environment variable is not set. Please export SUPABASE_DB_PASSWORD before running this script.")

    conn = pg8000.native.Connection(
        user='postgres.phczdxbtquxwfqnrakcz',
        password=db_password,
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

    print("\nApplying user_sleep_records schema...")
    
    # 1. Crear tabla user_sleep_records si no existe
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS public.user_sleep_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        sleep_date DATE NOT NULL,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        duration_minutes INT NOT NULL,
        quality_score INT NOT NULL DEFAULT 3 CHECK (quality_score >= 1 AND quality_score <= 5),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        CONSTRAINT uq_user_sleep_date UNIQUE (user_id, sleep_date)
    );
    """
    conn.run(create_table_sql)
    print("[OK] Tabla public.user_sleep_records verificada/creada.")

    # 2. Índices
    conn.run("CREATE INDEX IF NOT EXISTS idx_user_sleep_records_user ON public.user_sleep_records(user_id);")
    conn.run("CREATE INDEX IF NOT EXISTS idx_user_sleep_records_date ON public.user_sleep_records(user_id, sleep_date DESC);")
    print("[OK] Indices verificados/creados.")

    # 3. Habilitar RLS
    conn.run("ALTER TABLE public.user_sleep_records ENABLE ROW LEVEL SECURITY;")
    print("[OK] RLS habilitado en user_sleep_records.")

    # 4. Políticas RLS
    policies = [
        ("Users can view their own sleep records", "SELECT", "USING (auth.uid() = user_id)"),
        ("Users can insert their own sleep records", "INSERT", "WITH CHECK (auth.uid() = user_id)"),
        ("Users can update their own sleep records", "UPDATE", "USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)"),
        ("Users can delete their own sleep records", "DELETE", "USING (auth.uid() = user_id)")
    ]

    for name, cmd, clause in policies:
        try:
            drop_sql = f'DROP POLICY IF EXISTS "{name}" ON public.user_sleep_records;'
            conn.run(drop_sql)
            create_policy_sql = f'CREATE POLICY "{name}" ON public.user_sleep_records FOR {cmd} {clause};'
            conn.run(create_policy_sql)
            print(f"[OK] Politica '{name}' aplicada.")
        except Exception as e:
            print(f"Advertencia en politica {name}: {e}")

    # Verificar estructura final
    cols = conn.run("""
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'user_sleep_records'
    ORDER BY ordinal_position;
    """)
    print("\nColumnas de public.user_sleep_records:")
    for col in cols:
        print(f"  - {col[0]} ({col[1]}, nullable={col[2]})")

    conn.close()
    print("\n[SUCCESS] Migracion de sueno en Supabase completada exitosamente!")

if __name__ == '__main__':
    main()
