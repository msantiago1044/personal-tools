import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Error capturado:', error, errorInfo);
  }

  private isChunkLoadError(): boolean {
    const msg = this.state.error?.message || '';
    return (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('error loading dynamically imported module')
    );
  }

  private handleReset = () => {
    const isChunk = this.isChunkLoadError();
    this.setState({ hasError: false, error: null });
    if (isChunk) {
      window.location.reload();
      return;
    }
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.hash = '';
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isChunk = this.isChunkLoadError();

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
              isChunk
                ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-500/20 text-amber-500'
                : 'bg-rose-50 dark:bg-rose-500/10 border border-rose-500/20 text-rose-500'
            }`}>
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isChunk ? 'Nueva versión disponible' : (this.props.fallbackTitle || 'Ocurrió un error inesperado')}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
              {isChunk
                ? 'La aplicación se actualizó en el servidor con nuevas funciones. Recarga la página para cargar la versión más reciente.'
                : 'El módulo experimentó un problema imprevisto. Tus datos en la base de datos están seguros.'}
            </p>

            {this.state.error?.message && !isChunk && (
              <div className="mb-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Detalle del error</span>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-mono break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isChunk ? 'Actualizar aplicación' : 'Reintentar'}</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Ir al Inicio</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
