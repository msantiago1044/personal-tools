import { describe, it, expect, beforeEach, vi } from 'vitest';

let store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value.toString();
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    store = {};
  },
  key: (i: number) => Object.keys(store)[i] || null,
  get length() {
    return Object.keys(store).length;
  },
};

vi.stubGlobal('localStorage', localStorageMock);
vi.stubGlobal('window', {
  localStorage: localStorageMock,
  dispatchEvent: () => true,
  CustomEvent: class CustomEvent {
    type: string;
    constructor(type: string) {
      this.type = type;
    }
  },
});

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      upsert: () => Promise.resolve({ error: null }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  },
}));

import { saveNote, fetchNotes } from '../services/notesService';

describe('Notes dreams and audio support', () => {
  const userId = 'test-dream-user-123';

  beforeEach(() => {
    store = {};
    vi.restoreAllMocks();
  });

  it('correctly marks a note as dream when is_dream is true', async () => {
    const saved = await saveNote(userId, {
      title: 'Sueño · Domingo, 8 de noviembre de 2026',
      content: 'Soñé que volaba por un bosque verde.',
      is_dream: true,
      audio_url: 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQ8USA==',
      tags: ['sueño'],
    });

    expect(saved.is_dream).toBe(true);
    expect(saved.audio_url).toBe('data:audio/webm;base64,GkXfo59ChoEBQveBAULygQ8USA==');
    expect(saved.title).toContain('Sueño · Domingo');

    const notes = await fetchNotes(userId);
    const found = notes.find((n) => n.id === saved.id);
    expect(found).toBeDefined();
    expect(found?.is_dream).toBe(true);
    expect(found?.audio_url).toBe(saved.audio_url);
  });

  it('auto-detects dream if tags contain sueño even if is_dream is not passed', async () => {
    const saved = await saveNote(userId, {
      title: 'Anotación matutina',
      content: 'Recuerdo de un sueño',
      tags: ['sueños', 'reflexión'],
    });

    expect(saved.is_dream).toBe(true);
  });
});
