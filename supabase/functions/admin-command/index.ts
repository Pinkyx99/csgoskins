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
    const parts = command.trim().split(' ');
    const action = parts[0];

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
      .select('is_admin, username')
      .eq('id', user.id)
      .single();
      
    if (adminError || !adminProfile?.is_admin) {
      return new Response(JSON.stringify({ error: 'Permission denied. Not an admin.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    let responseMessage = '';
    
    // --- COMMAND LOGIC ---
    switch (action) {
      case '/ban':
      case '/mute': {
        const [_, targetUsername, durationStr, ...reasonParts] = parts;
        if (!targetUsername || !durationStr) throw new Error(`Usage: ${action} [user] [duration] [reason]`);
        const reason = reasonParts.join(' ');

        const { data: targetProfile, error: targetError } = await serviceSupabaseClient.from('profiles').select('id').eq('username', targetUsername).single();
        if (targetError || !targetProfile) throw new Error(`User '${targetUsername}' not found.`);

        const expiresAt = parseDuration(durationStr);
        const updatePayload = action === '/ban'
          ? { is_banned: true, ban_expires_at: expiresAt, ban_reason: reason || 'No reason provided.' }
          : { is_muted: true, mute_expires_at: expiresAt, mute_reason: reason || 'No reason provided.' };
        
        await serviceSupabaseClient.from('profiles').update(updatePayload).eq('id', targetProfile.id);
        const actionPastTense = action === '/ban' ? 'Banned' : 'Muted';
        responseMessage = `${actionPastTense} ${targetUsername} ${expiresAt ? `until ${new Date(expiresAt).toLocaleString()}` : 'permanently'}.`;
        break;
      }
      case '/unban':
      case '/unmute': {
        const [_, targetUsername] = parts;
        if (!targetUsername) throw new Error(`Usage: ${action} [user]`);

        const { data: targetProfile, error: targetError } = await serviceSupabaseClient.from('profiles').select('id').eq('username', targetUsername).single();
        if (targetError || !targetProfile) throw new Error(`User '${targetUsername}' not found.`);
        
        const updatePayload = action === '/unban'
          ? { is_banned: false, ban_expires_at: null, ban_reason: null }
          : { is_muted: false, mute_expires_at: null, mute_reason: null };

        await serviceSupabaseClient.from('profiles').update(updatePayload).eq('id', targetProfile.id);
        const actionPastTense = action === '/unban' ? 'Unbanned' : 'Unmuted';
        responseMessage = `${actionPastTense} ${targetUsername}.`;
        break;
      }
      case '/set_balance': {
        const [_, targetUsername, amountStr] = parts;
        if (!targetUsername || !amountStr) throw new Error('Usage: /set_balance [user] [amount]');
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount < 0) throw new Error('Invalid balance amount.');

        const { data: targetProfile, error: targetError } = await serviceSupabaseClient.from('profiles').select('id').eq('username', targetUsername).single();
        if (targetError || !targetProfile) throw new Error(`User '${targetUsername}' not found.`);

        await serviceSupabaseClient.from('profiles').update({ balance: amount }).eq('id', targetProfile.id);
        responseMessage = `Set ${targetUsername}'s balance to ${amount.toFixed(2)}€.`;
        break;
      }
      case '/rain': {
        const [_, amountStr, claimsStr, minsStr] = parts;
        if (!amountStr || !claimsStr || !minsStr) throw new Error('Usage: /rain [amount_per_user] [max_claims] [duration_minutes]');
        const amount = parseFloat(amountStr);
        const claims = parseInt(claimsStr);
        const durationMins = parseInt(minsStr);
        if (isNaN(amount) || isNaN(claims) || isNaN(durationMins)) throw new Error('Invalid arguments for /rain');

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + durationMins);

        await serviceSupabaseClient.from('site_events').insert({
          event_type: 'RAIN',
          created_by_user_id: user.id,
          created_by_username: adminProfile.username,
          data: { amount_per_user: amount, max_claims: claims },
          expires_at: expiresAt.toISOString(),
        });
        responseMessage = `Rain started: ${amount.toFixed(2)}€ for ${claims} users, lasting ${durationMins} minutes.`;
        break;
      }
      case '/announce': {
        const message = parts.slice(1).join(' ');
        if (!message) throw new Error('Usage: /announce [message]');

        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 15); // Announcement lasts for 15 seconds

        await serviceSupabaseClient.from('site_events').insert({
          event_type: 'ANNOUNCEMENT',
          created_by_user_id: user.id,
          created_by_username: adminProfile.username,
          data: { message },
          expires_at: expiresAt.toISOString(),
        });
        responseMessage = `Announcement sent: "${message}"`;
        break;
      }
      case '/clear_chat': {
         await serviceSupabaseClient.from('site_events').insert({
            event_type: 'CHAT_CLEARED',
            created_by_user_id: user.id,
            created_by_username: adminProfile.username,
        });
        await serviceSupabaseClient.from('chat_messages').delete().gt('id', 0);
        responseMessage = 'Global chat has been cleared.';
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