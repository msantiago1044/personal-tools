export type ThemeMode = 'light' | 'dark' | 'system';

export function getStoredTheme(): ThemeMode {
  const stored = localStorage.getItem('app_theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'light'; // Por defecto: Tema Claro
}

export function applyTheme(mode: ThemeMode) {
  localStorage.setItem('app_theme', mode);
  const root = document.documentElement;

  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
