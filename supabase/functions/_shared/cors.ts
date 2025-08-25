// This file is used by Supabase Edge Functions to handle Cross-Origin Resource Sharing (CORS).
// It allows your web app (running on a different domain) to securely call the function.
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
