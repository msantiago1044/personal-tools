import React from 'react';
import { ToolModule } from '../../../packages/shared/src/types';

const AVAILABLE_TOOLS: ToolModule[] = [
  {
    id: 'finance',
    name: 'Finanzas & Gastos Diarios',
    description: 'Control de flujo de caja, cuentas bancarias, tarjetas, presupuestos y reportes analíticos.',
    icon: 'wallet',
    route: '/finance/home',
    status: 'active',
    badge: 'Herramienta Principal',
  },
  {
    id: 'investments',
    name: 'Cartera de Inversiones',
    description: 'Seguimiento de activos, acciones, cripto y rendimientos pasivos a largo plazo.',
    icon: 'trending-up',
    route: '/investments',
    status: 'coming_soon',
    badge: 'Próximamente',
  },
  {
    id: 'invoicing',
    name: 'Facturación & Clientes',
    description: 'Generación de facturas electrónicas, cuentas por cobrar y seguimiento de cotizaciones.',
    icon: 'file-text',
    route: '/invoicing',
    status: 'coming_soon',
  },
  {
    id: 'tasks',
    name: 'Metas & Productividad',
    description: 'Gestión de metas de ahorro, objetivos trimestrales y lista de verificación financiera.',
    icon: 'check-circle',
    route: '/goals',
    status: 'coming_soon',
  },
];

interface ToolHubProps {
  userEmail: string;
  userName?: string;
  avatarUrl?: string;
  onSelectTool: (route: string) => void;
  onLogout: () => void;
}

export const ToolHub: React.FC<ToolHubProps> = ({
  userEmail,
  userName,
  avatarUrl,
  onSelectTool,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      {/* Header del Hub */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Workspace Personal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Bienvenido, {userName || userEmail}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Selecciona la herramienta a la que deseas acceder hoy.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-700" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={onLogout}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-lg border border-slate-800 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Grid de Herramientas */}
      <main className="max-w-6xl mx-auto mt-10">
        <h2 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
          <span>🛠️</span> Herramientas Disponibles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_TOOLS.map((tool) => {
            const isActive = tool.status === 'active';

            return (
              <div
                key={tool.id}
                onClick={() => isActive && onSelectTool(tool.route)}
                className={`relative rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer group'
                    : 'bg-slate-900/50 border border-slate-800/60 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {tool.id === 'finance' ? '📊' : tool.id === 'investments' ? '📈' : tool.id === 'invoicing' ? '🧾' : '🎯'}
                    </div>

                    {tool.badge && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    {isActive ? 'Entrar al módulo' : 'En desarrollo'}
                  </span>
                  <span className={`text-sm ${isActive ? 'text-emerald-400 group-hover:translate-x-1 transition-transform' : 'text-slate-600'}`}>
                    ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
