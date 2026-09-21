// Supabase Edge Function: presence-logger
// Deno / TypeScript runtime for server-side presence audit logs

export interface PresenceLogPayload {
  user_id: string;
  user_name: string;
  status: 'ONLINE' | 'TRAINING' | 'OFFLINE';
  workout_session_id?: string;
  timestamp?: string;
}

export function formatPresenceLog(payload: PresenceLogPayload): string {
  const time = payload.timestamp || new Date().toISOString();
  return `[PRESENCE EVENT] ${payload.user_name} (${payload.user_id}) -> STATUS: ${payload.status} at ${time}`;
}

export async function handlePresenceRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const payload: PresenceLogPayload = await req.json();
    if (!payload.user_id || !payload.status) {
      return new Response(JSON.stringify({ error: 'Invalid payload: user_id and status required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const logMessage = formatPresenceLog(payload);
    console.log(logMessage);

    return new Response(
      JSON.stringify({
        success: true,
        logged: logMessage,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Serve standard HTTP requests in Deno environment
const globalDeno = (globalThis as any).Deno;
if (typeof globalDeno !== 'undefined' && globalDeno?.serve) {
  globalDeno.serve(handlePresenceRequest);
}
