import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useModalBackHandler } from '../../lib/useModalBackHandler';

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  modalId?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  mobilePresentation?: 'full-screen' | 'bottom-sheet';
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

const MAX_WIDTH_MAP = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  modalId = 'responsive_modal',
  maxWidth = 'lg',
  showCloseButton = true,
  closeOnBackdropClick = true,
  mobilePresentation = 'bottom-sheet',
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
}) => {
  // Manejo de botón físico Atrás en celulares, tecla Escape y bloqueo de scroll
  useModalBackHandler({
    isOpen,
    onClose,
    modalId,
    enableHistoryBack: true,
    enableEscape: true,
    lockScroll: true,
  });

  if (!isOpen) return null;

  const maxWidthClass = MAX_WIDTH_MAP[maxWidth] || 'sm:max-w-lg';

  const isBottomSheet = mobilePresentation === 'bottom-sheet';

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in ${
        isBottomSheet ? 'items-end sm:items-center p-0 sm:p-4' : 'items-center p-0 sm:p-4'
      }`}
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${maxWidthClass} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col overflow-hidden relative transition-all duration-200 animate-in ${
          isBottomSheet
            ? 'rounded-t-3xl sm:rounded-3xl max-h-[92dvh] sm:max-h-[88vh] h-auto slide-in-from-bottom sm:slide-in-from-bottom-4 sm:zoom-in-95'
            : 'rounded-none sm:rounded-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[88vh] zoom-in-95'
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Indicador táctil superior para celulares (Drag Handle para bottom sheet) */}
        {isBottomSheet && (
          <div className="w-full flex justify-center pt-2.5 pb-1 sm:hidden bg-slate-50 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
        )}

        {/* ========================================================================= */}
        {/* CABECERA FIJA (Sticky Header) - Nunca se pierde con el scroll             */}
        {/* ========================================================================= */}
        {(title || showCloseButton) && (
          <div
            className={`sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 shrink-0 ${headerClassName}`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              {/* Botón de volver tipo app móvil en celulares si es pantalla completa */}
              {!isBottomSheet && (
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden -ml-1 p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 transition"
                  aria-label="Volver atrás"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              {icon && (
                <div className="shrink-0 flex items-center justify-center">
                  {icon}
                </div>
              )}

              <div className="min-w-0 flex-1">
                {title && (
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate leading-snug">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Botón cerrar X con área táctil óptima de 44x44px */}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-w-[44px] min-h-[44px] flex items-center justify-center transition shrink-0 active:scale-90"
                title="Cerrar (Esc)"
                aria-label="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* CUERPO CON SCROLL INDEPENDIENTE (Scrollable Body)                         */}
        {/* ========================================================================= */}
        <div
          className={`flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 text-slate-900 dark:text-slate-100 scroll-smooth -webkit-overflow-scrolling-touch ${bodyClassName}`}
        >
          {children}
        </div>

        {/* ========================================================================= */}
        {/* PIE FIJO (Sticky Footer con soporte de Safe Area en iPhone/Android)       */}
        {/* ========================================================================= */}
        {footer && (
          <div
            className={`sticky bottom-0 z-20 px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 shrink-0 safe-bottom ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
