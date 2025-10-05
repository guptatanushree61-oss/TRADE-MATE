const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

console.log("🔍 Supabase URL:", supabaseUrl)
console.log("🔍 Supabase Key loaded:", !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
