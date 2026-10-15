# Finanzas & Suite Modular (Web PWA + Supabase)

Plataforma integral y modular de gestión financiera y herramientas personales desarrollada como Progressive Web App (PWA):
- **`/web`**: Aplicación Web PWA desarrollada en **React 19 + Vite + TailwindCSS**, instalable en escritorio, iOS y Android con soporte offline y diseño ultra responsivo.
- **`/backend`**: Configuración de base de datos **Supabase (PostgreSQL)** con **Row Level Security (RLS)** y autenticación mediante **Google OAuth**.
- **`/packages/shared`**: Tipos e interfaces TypeScript del dominio compartido.

---

## 🌟 Características Principales

1. **Launcher / Tool Hub Multi-Herramienta:**
   - Acceso seguro con **Google Accounts** mediante Supabase Auth.
   - Panel de bienvenida con selector dinámico de ordenación por uso (`Más usados`, `Recientes`, `Predeterminado`) y soporte para fijar favoritos (Pin).
   - Experiencia nativa instalable (**PWA**) en dispositivos móviles y de escritorio.
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
   - Web: `http://localhost:5173/hub` (o tu dominio de producción en Vercel/Cloudflare).

---

## 💻 Variables de Entorno

### `/web/.env`
```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
```

