
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Received SOC Radar webhook:', JSON.stringify(payload, null, 2));

    // Process the webhook payload
    const { event_type, data, timestamp } = payload;
    
    console.log(`Processing webhook event: ${event_type} at ${timestamp}`);
    
    // Here you can add logic to:
    // 1. Store alerts in database
    // 2. Send notifications
    // 3. Trigger automated responses
    // 4. Update dashboard data
    
    // For now, we'll just log and acknowledge
    const response = {
      success: true,
      message: 'Webhook received successfully',
      event_type,
      processed_at: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
