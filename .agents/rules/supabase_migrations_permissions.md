# Regla Crítica: Permisos Explícitos y RLS en Migraciones de Supabase

A partir de las actualizaciones de seguridad en Supabase y PostgreSQL, las tablas creadas en el esquema `public` ya no tienen permisos automáticos expuestos a la Data API (PostgREST / GraphQL). 

PostgreSQL evalúa primero los privilegios a nivel de tabla (**GRANT**) antes de evaluar las políticas de fila (**RLS**). Sin el `GRANT`, las consultas fallarán con error de permisos aunque las políticas RLS sean correctas.

---

## Regla Mandatoria para Toda Nueva Tabla

Cada vez que se genere o modifique una migración SQL que cree una tabla nueva (`CREATE TABLE public.<nombre_tabla>`), se deben incluir **obligatoriamente** en el mismo archivo los siguientes tres bloques:

### 1. Habilitación de RLS
```sql
ALTER TABLE public.<nombre_tabla> ENABLE ROW LEVEL SECURITY;
```

### 2. Permisos Explícitos (GRANTS)
Adaptar los permisos al nivel de exposición requerido por la tabla:

```sql
-- Acceso para backend y scripts administrativos (acceso total con bypass de RLS)
GRANT ALL ON TABLE public.<nombre_tabla> TO service_role;

-- Acceso para usuarios autenticados (ajustar según el caso de uso)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.<nombre_tabla> TO authenticated;

-- Acceso para clientes anónimos (SOLO si la tabla tiene lectura/escritura pública; omitir o limitar a SELECT si es privada)
-- GRANT SELECT ON TABLE public.<nombre_tabla> TO anon;
```

> **Nota para secuencias:** Si la tabla utiliza secuencias (`SERIAL` o `BIGSERIAL`), conceder también permisos sobre las secuencias:
> ```sql
> GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
> ```

### 3. Políticas de RLS (CREATE POLICY)
Definir siempre las políticas correspondientes para controlar el acceso fila por fila de los roles `anon` y `authenticated`:

```sql
-- Ejemplo típico de aislamiento por usuario:
CREATE POLICY "Users can manage their own data"
    ON public.<nombre_tabla>
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

---

## Resumen
**Nunca crear una tabla en `public` sin:**
1. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
2. Sentencias explícitas de `GRANT` a `authenticated` y `service_role` (y `anon` solo si aplica).
3. Políticas `CREATE POLICY` detalladas.
