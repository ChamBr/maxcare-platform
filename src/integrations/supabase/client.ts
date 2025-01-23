import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyxiezzdlkmqrvaoorjk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eGllenp';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  global: {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      return fetch(input, init).catch(err => {
        console.error('Supabase fetch error:', err);
        throw err;
      });
    }
  }
});

// Add global error handler for unhandled promises
window.addEventListener('unhandledrejection', event => {
  // Prevent logging of known errors
  if (event.reason?.message?.includes('ambient-light-sensor') || 
      event.reason?.message?.includes('battery')) {
    event.preventDefault();
    return;
  }
  
  console.error('Unhandled promise rejection:', event.reason);
});

// Add global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
  // Ignore specific browser API errors
  if (msg.toString().includes('ambient-light-sensor') || 
      msg.toString().includes('battery')) {
    return false;
  }
  
  console.error('Global error:', {
    message: msg,
    url: url,
    lineNo: lineNo,
    columnNo: columnNo,
    error: error
  });
  return false;
};