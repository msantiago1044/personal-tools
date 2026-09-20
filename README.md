# Finanzas & Suite Modular (Web + Mobile + Supabase)

Plataforma integral y modular de gestión financiera y herramientas personales desarrollada con arquitectura híbrida:
- **`/web`**: Panel de control administrativo y financiero desarrollado en **React + Vite + TailwindCSS**.
- **`/mobile`**: Aplicación móvil multiplataforma desarrollada con **React Native & Expo**.
- **`/backend`**: Configuración de base de datos **Supabase (PostgreSQL)** con **Row Level Security (RLS)** y autenticación mediante **Google OAuth**.
- **`/packages/shared`**: Tipos e interfaces TypeScript compartidas entre clientes.

---

## 🌟 Características Principales

1. **Launcher / Tool Hub Multi-Herramienta:**
   - Acceso con **Google Accounts** mediante Supabase Auth.
   - Panel de bienvenida con selector de módulos activos y futuros (Finanzas, Inversiones, Facturación, Metas).
2. **Módulo de Finanzas & Gastos Diarios:**
   - **Home Dinámico:** Selector múltiple de cuentas (Efectivo, Tarjetas, Ahorro), widgets personalizables y filtro temporal rápido (Día, Semana, Mes, Año, Todo).
   - **Registro Rápido de Movimientos:**
     - *Ingreso / Salida:* Monto, cuenta, categoría, descripción y fecha editable.
     - *Transferencia:* Cuenta origen, cuenta destino, monto y fecha (sin categoría).
   - **Presupuestos y Ahorro:** Comparativa automática con el año anterior ($Año - 1$) e indicadores lineales del porcentaje de gasto mensual.
   - **Seguridad y Privacidad:** Aislamiento total de datos por usuario (`auth.uid() = user_id`) con PostgreSQL RLS.

---

## 🚀 Despliegue y Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Dirígete a **SQL Editor** y ejecuta el archivo [`backend/supabase/schema.sql`](./backend/supabase/schema.sql).
3. En **Authentication > Providers**, habilita el proveedor **Google** ingresando el *Client ID* y *Client Secret* de Google Cloud Console.
4. Agrega los redirects autorizados:
   - Web: `http://localhost:5173/hub` (o tu dominio de producción).
   - Mobile: `gestiongastos://auth/callback`.

---

## 💻 Variables de Entorno

### `/web/.env`
```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
```

### `/mobile/.env`
```env
EXPO_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```
