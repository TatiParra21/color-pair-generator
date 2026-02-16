
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or anon key is missing!");
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This setting ensures the PKCE flow is used correctly in the browser
    flowType: 'pkce',
    // It's generally best practice to keep tokens out of LocalStorage in pure browser apps
    // This forces tokens to be managed securely internally by the client library
    storageKey: 'supabase-auth-tokens', // or a custom key
    storage: localStorage, // You might need to manage this differently for SSR
  }
},)


