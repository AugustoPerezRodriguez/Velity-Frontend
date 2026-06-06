import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// URL polyfill is only needed on native (iOS/Android). Web and Node.js both
// provide URL natively, so importing it there is wasteful and can cause issues
// during static rendering.
if (Platform.OS !== 'web') {
  require('react-native-url-polyfill/auto');
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

/**
 * Returns a storage adapter appropriate for the current platform.
 *
 * Web (SSR-safe): wraps window.localStorage with a typeof-window guard so the
 * module can be imported during static rendering without throwing
 * "window is not defined". The session is simply absent on the server; the
 * client restores it from localStorage on first mount.
 *
 * Native: dynamically requires AsyncStorage so Metro's dead-code elimination
 * can remove the native module from the web bundle entirely, preventing any
 * window/document access at bundle evaluation time.
 */
function createStorageAdapter() {
  if (Platform.OS === 'web') {
    return {
      getItem(key) {
        if (typeof window === 'undefined') return null;
        try {
          return window.localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem(key, value) {
        if (typeof window === 'undefined') return;
        try {
          window.localStorage.setItem(key, value);
        } catch {}
      },
      removeItem(key) {
        if (typeof window === 'undefined') return;
        try {
          window.localStorage.removeItem(key);
        } catch {}
      },
    };
  }

  // Dynamic require keeps @react-native-async-storage/async-storage out of the
  // web bundle. Metro evaluates Platform.OS at bundle time and removes this
  // branch entirely when bundling for web.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@react-native-async-storage/async-storage').default;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    // On web, Supabase needs to read the session token from the URL hash after
    // an OAuth redirect. On native, deep links are handled separately.
    detectSessionInUrl: Platform.OS === 'web',
  },
});
