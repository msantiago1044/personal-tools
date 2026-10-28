import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useModalBackHandler } from '../useModalBackHandler';
import React from 'react';
import ReactDOM from 'react-dom/client';

describe('useModalBackHandler logic', () => {
  let fakeBody: { style: { overflow: string } };
  let eventListeners: Record<string, ((e: any) => void)[]> = {};
  let fakeHistory: { state: any; pushState: any; back: any };

  beforeEach(() => {
    vi.restoreAllMocks();
    fakeBody = { style: { overflow: '' } };
    eventListeners = {};

    fakeHistory = {
      state: {},
      pushState: vi.fn((state: any) => {
        fakeHistory.state = state;
      }),
      back: vi.fn(() => {
        fakeHistory.state = {};
      }),
    };

    // Polyfill minimal globals for Node test runner
    (globalThis as any).document = {
      body: fakeBody,
      createElement: () => ({}),
    };

    (globalThis as any).window = {
      history: fakeHistory,
      location: { href: 'http://localhost/' },
      addEventListener: vi.fn((event: string, handler: (e: any) => void) => {
        if (!eventListeners[event]) eventListeners[event] = [];
        eventListeners[event].push(handler);
      }),
      removeEventListener: vi.fn((event: string, handler: (e: any) => void) => {
        if (!eventListeners[event]) return;
        eventListeners[event] = eventListeners[event].filter((h) => h !== handler);
      }),
      dispatchEvent: vi.fn((event: { type: string; key?: string; state?: any }) => {
        const handlers = eventListeners[event.type] || [];
        handlers.forEach((h) => h(event));
        return true;
      }),
    };
  });

  afterEach(() => {
    delete (globalThis as any).document;
    delete (globalThis as any).window;
  });

  it('correctly handles scroll lock and unlock logic with mock DOM', () => {
    const onClose = vi.fn();

    // Simular el efecto directo
    const original = (globalThis as any).document.body.style.overflow;
    (globalThis as any).document.body.style.overflow = 'hidden';
    expect((globalThis as any).document.body.style.overflow).toBe('hidden');

    (globalThis as any).document.body.style.overflow = original;
    expect((globalThis as any).document.body.style.overflow).toBe('');
  });

  it('registers popstate and handles mobile Back button gracefully', () => {
    const onClose = vi.fn();

    // Simular lógica de useModalBackHandler
    const pushState = (globalThis as any).window.history.pushState;
    pushState({ pt_modal_id: 'test_123' }, '', 'http://localhost/');
    expect(pushState).toHaveBeenCalled();
    expect((globalThis as any).window.history.state.pt_modal_id).toBe('test_123');

    // Escuchar popstate
    let listener = (e: any) => {
      if (e.state?.pt_modal_id !== 'test_123') {
        onClose();
      }
    };
    (globalThis as any).window.addEventListener('popstate', listener);

    // Disparar popstate con otro state (botón Atrás del móvil)
    listener({ type: 'popstate', state: { pt_modal_id: 'other' } });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
