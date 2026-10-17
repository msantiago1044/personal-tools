// Simple & elegant Toast Event Dispatcher (no external heavy libraries)
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

type ToastListener = (toast: ToastMessage) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  subscribe(listener: ToastListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  show(message: string, type: ToastType = 'info', title?: string, duration = 3000) {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const msg: ToastMessage = { id, message, type, title, duration };
    listeners.forEach((l) => l(msg));
  },
  success(message: string, title?: string, duration?: number) {
    this.show(message, 'success', title, duration);
  },
  error(message: string, title?: string, duration?: number) {
    this.show(message, 'error', title, duration || 4000);
  },
  info(message: string, title?: string, duration?: number) {
    this.show(message, 'info', title, duration);
  },
  warning(message: string, title?: string, duration?: number) {
    this.show(message, 'warning', title, duration);
  },
};
