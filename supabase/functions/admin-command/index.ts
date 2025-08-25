import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Helper function to parse duration strings like "1m", "2h", "3d", "4M", "5y"
// Returns an ISO string for the expiration date or null for permanent.
const parseDuration = (durationStr: string): string | null => {
  if (!durationStr || ['perm', 'permanent'].includes(durationStr.toLowerCase())) {
    return null; 
  }
  const match = durationStr.match(/^(\d+)([mhdMy])$/);
  if (!match) throw new Error('Invalid duration format. Use: 1m, 2h, 3d, 4M, 5y or "perm"');
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  const date = new Date();
  switch (unit) {
    case 'm': date.setMinutes(date.getMinutes() + value); break;
    case 'h': date.setHours(date.getHours() + value); break;
    case 'd': date.setDate(date.getDate() + value); break;
    case 'M': date.setMonth(date.getMonth() + value); break;
    case 'y': date.setFullYear(date.getFullYear() + value); break;
    default: throw new Error('Invalid duration unit.');
  }
  return date.toISOString();
};

serve(async (req) => {
  // This is needed for CORS preflight requests.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { command } = await req.json();
    const [action, targetUsername, param1, ...reasonParts] = command.split(' ');
    const reason = reasonParts.join(' ');

    // Create a Supabase client with the user's authorization to verify their identity
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');
    
    const userSupabaseClient = createClient(
      (globalThis as any).Deno.env.get('SUPABASE_URL') ?? '',
      (globalThis as any).Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the user who is sending the command
    const { data: { user }, error: userError } = await userSupabaseClient.auth.getUser();
    if (userError || !user) throw new Error('Authentication failed');

    // Create a service role client to perform privileged admin actions
    const serviceSupabaseClient = createClient(
      (globalThis as any).Deno.env.get('SUPABASE_URL') ?? '',
      (globalThis as any).Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // VERIFY that the user sending the command is an admin
    const { data: adminProfile, error: adminError } = await serviceSupabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
      
    if (adminError || !adminProfile?.is_admin) {
      return new Response(JSON.stringify({ error: 'Permission denied. Not an admin.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find the target user's profile
    const { data: targetProfile, error: targetError } = await serviceSupabaseClient
      .from('profiles')
      .select('id')
      .eq('username', targetUsername)
      .single();

    if (targetError || !targetProfile) {
      throw new Error(`User '${targetUsername}' not found.`);
    }

    let responseMessage = '';

    // --- COMMAND LOGIC ---
    switch (action) {
      case '/ban': {
        const expiresAt = parseDuration(param1);
        await serviceSupabaseClient.from('profiles').update({ 
          is_banned: true, 
          ban_expires_at: expiresAt,
          ban_reason: reason || 'No reason provided.'
        }).eq('id', targetProfile.id);
        responseMessage = `Banned ${targetUsername} ${expiresAt ? `until ${new Date(expiresAt).toLocaleString()}` : 'permanently'}.`;
        break;
      }
      case '/unban': {
        await serviceSupabaseClient.from('profiles').update({ 
          is_banned: false, 
          ban_expires_at: null,
          ban_reason: null
        }).eq('id', targetProfile.id);
        responseMessage = `Unbanned ${targetUsername}.`;
        break;
      }
      case '/mute': {
        const expiresAt = parseDuration(param1);
        await serviceSupabaseClient.from('profiles').update({ 
          is_muted: true, 
          mute_expires_at: expiresAt,
          mute_reason: reason || 'No reason provided.'
        }).eq('id', targetProfile.id);
        responseMessage = `Muted ${targetUsername} ${expiresAt ? `until ${new Date(expiresAt).toLocaleString()}` : 'permanently'}.`;
        break;
      }
      case '/unmute': {
        await serviceSupabaseClient.from('profiles').update({ 
          is_muted: false, 
          mute_expires_at: null,
          mute_reason: null
        }).eq('id', targetProfile.id);
        responseMessage = `Unmuted ${targetUsername}.`;
        break;
      }
      case '/set_balance': {
        const amount = parseFloat(param1);
        if (isNaN(amount) || amount < 0) throw new Error('Invalid balance amount.');
        await serviceSupabaseClient.from('profiles').update({ balance: amount }).eq('id', targetProfile.id);
        responseMessage = `Set ${targetUsername}'s balance to ${amount.toFixed(2)}€.`;
        break;
      }
      default:
        throw new Error(`Unknown command: ${action}`);
    }

    return new Response(JSON.stringify({ message: responseMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});