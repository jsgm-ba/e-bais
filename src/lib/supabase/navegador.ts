'use client';
import { createBrowserClient } from '@supabase/ssr';
import { supabaseAnonKey, supabaseConfigurado, supabaseUrl } from './config';

export const clienteNavegador = () => (supabaseConfigurado() ? createBrowserClient(supabaseUrl, supabaseAnonKey) : null);
