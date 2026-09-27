import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { AppState } from 'react-native';

declare const process: any;

WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://phczdxbtquxwfqnrakcz.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ThVP291edlMvGoeLw2182w_sb7hmslN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auto-refresco continuo del token cuando la app pasa al primer plano o inicia
supabase.auth.startAutoRefresh();
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

/**
 * Autenticación nativa con Google en Expo usando WebBrowser y AuthSession con soporte para Hash y Code
 */
export async function signInWithGoogleMobile() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'personaltools',
    path: 'auth/callback',
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  if (data?.url) {
    const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
    if (res.type === 'success' && res.url) {
      const urlString = res.url;
      const queryString = urlString.includes('?') ? urlString.split('?')[1].split('#')[0] : '';
      const hashString = urlString.includes('#') ? urlString.split('#')[1] : '';

      const searchParams = new URLSearchParams(queryString);
      const hashParams = new URLSearchParams(hashString);

      // Verificar si hay errores reportados por OAuth
      const errorDesc = searchParams.get('error_description') || hashParams.get('error_description');
      if (errorDesc) {
        throw new Error(decodeURIComponent(errorDesc));
      }

      const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
      const code = searchParams.get('code') || hashParams.get('code');

      if (code) {
        const { data: codeData, error: codeErr } = await supabase.auth.exchangeCodeForSession(code);
        if (codeErr) throw codeErr;
        if (codeData?.session) {
          await AsyncStorage.setItem('personal_tools_session', JSON.stringify(codeData.session));
          return codeData.session;
        }
      } else if (accessToken && refreshToken) {
        const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionErr) throw sessionErr;
        if (sessionData?.session) {
          await AsyncStorage.setItem('personal_tools_session', JSON.stringify(sessionData.session));
          return sessionData.session;
        }
      }
    }
  }
  return null;
}
