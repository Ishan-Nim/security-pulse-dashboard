
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
    const apiKey = Deno.env.get('SOCRADAR_API_KEY');
    if (!apiKey) {
      throw new Error('SOC Radar API key not configured');
    }

    const { endpoint } = await req.json();
    console.log(`Fetching data from SOC Radar endpoint: ${endpoint}`);

    const baseURL = 'https://api.socradar.io';
    
    let apiResponse;
    
    switch (endpoint) {
      case 'incidents':
        apiResponse = await fetch(`${baseURL}/v4/incidents?limit=50`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        break;
        
      case 'leaked-emails':
        apiResponse = await fetch(`${baseURL}/drp/leaked-credentials?limit=50`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        break;
        
      case 'darkweb-mentions':
        apiResponse = await fetch(`${baseURL}/v2/darkweb/mentions?limit=50`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        break;
        
      case 'compromised-domains':
        apiResponse = await fetch(`${baseURL}/brand-protection/domains?limit=50`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        break;
        
      case 'employee-exposure':
        apiResponse = await fetch(`${baseURL}/asm/employee-exposure?limit=50`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        break;
        
      case 'threat-feeds':
        apiResponse = await fetch(`${baseURL}/threat-feed/iocs?limit=50`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        break;
        
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }

    if (!apiResponse.ok) {
      console.error(`SOC Radar API error: ${apiResponse.status} ${apiResponse.statusText}`);
      throw new Error(`SOC Radar API error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    console.log(`Successfully fetched ${endpoint} data:`, data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error fetching SOC Radar data:', error);
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
