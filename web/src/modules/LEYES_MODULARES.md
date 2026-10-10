# 📜 Leyes de Construcción Modular: Personal Tools Suite

Este documento establece los estándares obligatorios de arquitectura y gobernanza para el diseño, desarrollo e integración de cualquier módulo nuevo o refactorizado en la suite.

---

### Ley 1: Contrato Estándar y Registro Desacoplado (Principio Abierto/Cerrado)
- Todo módulo debe registrarse exclusivamente en [`web/src/modules/moduleRegistry.ts`](./moduleRegistry.ts).
- **Prohibido:** Modificar directamente [`App.tsx`](../App.tsx) o [`ToolHub.tsx`](../components/ToolHub.tsx) para añadir `if/else`, tipos de vista fijos o imports estáticos.
- El módulo debe satisfacer la interfaz `ModuleManifest`:
  ```ts
  interface ModuleManifest {
    id: string;
    name: string;
    description: string;
    icon: string;
    route: string;
    hashAliases: string[];
    status: 'active' | 'beta' | 'coming_soon';
    badge?: string;
    component: React.LazyExoticComponent<React.ComponentType<ModuleProps>>;
  }
  ```

---

### Ley 2: Lazy Loading y Code-Splitting Mandatorio
- **Ningún módulo puede ser importado de forma estática en la raíz.**
- La carga del componente raíz del módulo **debe** realizarse mediante `React.lazy()`:
  ```ts
  const MiNuevoModulo = React.lazy(() =>
    import('../pages/nuevo/MiNuevoModulo').then((m) => ({ default: m.MiNuevoModulo }))
  );
  ```
- El tamaño del chunk inicial del Launcher debe mantenerse por debajo de 100 kB.

---

### Ley 3: Estructura Interna Canónica
Cada módulo nuevo debe estructurarse internamente respetando la separación de capas:
```text
/src/pages/<modulo>/
├── components/     # Componentes visuales atómicos y modales
├── hooks/          # Lógica de estado y llamadas a datos (useModuloData.ts)
├── services/       # Integraciones con Supabase / APIs externas
├── types/          # Interfaces y tipos específicos del módulo
└── ModuloRoot.tsx  # Vista principal del módulo (máximo 300 líneas)
```
- **Prohibido crear monolitos:** Ningún archivo individual puede superar las 500 líneas. Si supera 500 líneas, debe ser descompuesto en sub-componentes y hooks.

---

### Ley 4: Aislamiento y Bajo Acoplamiento
- Un módulo **nunca** debe importar código interno de otro módulo (ej. `Finance` no puede importar nada desde `pages/pantry/components`).
- Toda entidad, interfaz o utilidad reutilizable entre más de un módulo debe residir en `packages/shared`.

---

### Ley 5: Resiliencia y Contención de Errores (Error Boundary)
- Cada módulo debe ejecutarse envuelto en un `<ErrorBoundary>` para evitar que un fallo interno tumbe la suite completa.
- Las mutaciones de datos deben proporcionar estados visibles de carga (`loading`), éxito (`toast`/`feedback`) y manejo de errores amigable al usuario.

---

### Ley 6: Persistencia Segura y Secretos
- Prohibido almacenar claves API privadas o tokens en `localStorage` sin encriptación.
- Los llamados a modelos de IA o servicios de terceros deben canalizarse a través de Supabase Edge Functions con autenticación de sesión activa (`auth.uid() = user_id`).

---

### Ley 7: Precisión Numérica Financiera e i18n
- En módulos que operen con dinero o cantidades contables, los balances no deben acumularse en punto flotante puro de JavaScript. Usar centavos enteros o librerías de precisión decimal.
- Las fechas deben formatearse en formato ISO `YYYY-MM-DD` con normalización local explícita para evitar saltos de zona horaria.
