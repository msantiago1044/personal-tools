import { useEffect, useRef } from 'react';

interface UseModalBackHandlerOptions {
  isOpen: boolean;
  onClose: () => void;
  modalId?: string;
  enableHistoryBack?: boolean;
  enableEscape?: boolean;
  lockScroll?: boolean;
}

/**
 * Hook para optimizar el comportamiento de ventanas flotantes en dispositivos móviles y escritorio:
 * 1. Soporta el botón físico/gesto "Atrás" de Android y navegadores móviles (evita salir de la app).
 * 2. Cierra la ventana con la tecla Escape.
 * 3. Bloquea el scroll del fondo mientras la ventana está abierta.
 */
export function useModalBackHandler({
  isOpen,
  onClose,
  modalId = 'modal',
  enableHistoryBack = true,
  enableEscape = true,
  lockScroll = true,
}: UseModalBackHandlerOptions) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const uniqueIdRef = useRef(`${modalId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  const pushedStateRef = useRef(false);
  const closedByPopstateRef = useRef(false);

  // 1. Control de scroll en el elemento body
  useEffect(() => {
    if (!isOpen || !lockScroll || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, lockScroll]);

  // 2. Control de tecla Escape
  useEffect(() => {
    if (!isOpen || !enableEscape || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, enableEscape]);

  // 3. Manejo del botón "Atrás" de Android y gestos del navegador
  useEffect(() => {
    if (!isOpen || !enableHistoryBack || typeof window === 'undefined') {
      return;
    }

    const currentUniqueId = uniqueIdRef.current;
    pushedStateRef.current = true;
    closedByPopstateRef.current = false;

    // Agregar entrada temporal al historial
    try {
      const currentState = window.history.state || {};
      window.history.pushState(
        { ...currentState, pt_modal_id: currentUniqueId },
        '',
        window.location.href
      );
    } catch {
      // Ignorar si el navegador bloquea manipulación de historial
    }

    const handlePopState = (e: PopStateEvent) => {
      // Si el estado actual ya no tiene este modal, significa que el usuario presionó Atrás
      if (e.state?.pt_modal_id !== currentUniqueId) {
        closedByPopstateRef.current = true;
        onCloseRef.current();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // Si se cerró por botón de UI (no por botón Atrás físico), limpiar la entrada del historial
      if (pushedStateRef.current && !closedByPopstateRef.current) {
        pushedStateRef.current = false;
        try {
          if (window.history.state?.pt_modal_id === currentUniqueId) {
            window.history.back();
          }
        } catch {
          // Fallback silencioso
        }
      }
    };
  }, [isOpen, enableHistoryBack]);
}
