// Configuración del enlace dinámico a la última versión del APK
export const LATEST_RELEASE_CONFIG = {
  appName: 'Personal Tools',
  version: '1.0.0',
  // GitHub Releases redirige de forma automática y oficial a la última versión publicada
  githubLatestUrl: 'https://github.com/msantiago1044/personal-tools/releases/latest/download/PersonalTools.apk',
  // URL alternativa directa en Supabase Storage (en caso de usar bucket público)
  supabaseBucketUrl: 'https://phczdxbtquxwfqnrakcz.supabase.co/storage/v1/object/public/app-releases/PersonalTools-latest.apk',
};

export async function fetchLatestApkDownloadUrl(): Promise<string> {
  try {
    // 1. Intentamos consultar la API pública de GitHub para obtener el release más reciente con su asset
    const res = await fetch('https://api.github.com/repos/msantiago1044/personal-tools/releases/latest', {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (res.ok) {
      const data = await res.json();
      const apkAsset = data.assets?.find((a: any) => a.name.endsWith('.apk'));
      if (apkAsset?.browser_download_url) {
        return apkAsset.browser_download_url;
      }
    }
  } catch (err) {
    console.warn('No se pudo consultar API de GitHub Releases, usando fallback estático:', err);
  }

  // Fallback estándar al enlace directo de releases latest de GitHub
  return LATEST_RELEASE_CONFIG.githubLatestUrl;
}
