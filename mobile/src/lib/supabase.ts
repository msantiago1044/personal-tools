import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://cbvqwdrbwogsmcglsvzg.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidnF3ZHJid29nc21jZ2xzdnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzUxNDUsImV4cCI6MjA5ODMxMTE0NX0.QE6mClBS9UTQTlIgmhVB2mZAv0CihdMne0o5vfk-_CU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Autenticación nativa con Google en Expo usando WebBrowser y AuthSession
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
      const params = new URL(res.url).searchParams;
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    }
  }
}
