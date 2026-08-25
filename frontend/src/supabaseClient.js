import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlnkbsyhhctgbquqezsf.supabase.co';
const supabaseAnonKey = 'sb_publishable_0CnhmxmVHGWkVBFV2sKZhA_0MYmI0KP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);