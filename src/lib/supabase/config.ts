export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
/** Sin claves, el sitio público funciona y las áreas privadas muestran que la base no está configurada. */
export const supabaseConfigurado = () => Boolean(supabaseUrl && supabaseAnonKey);
