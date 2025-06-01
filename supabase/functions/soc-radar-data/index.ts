
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

    // SOC Radar API base URL
    const baseUrl = 'https://platform.socradar.com/api';
    
    let apiEndpoint = '';
    
    // Map internal endpoints to SOC Radar API endpoints
    switch (endpoint) {
      case 'incidents':
        apiEndpoint = '/incidents';
        break;
      case 'leaked-emails':
        apiEndpoint = '/leaked-credentials';
        break;
      case 'darkweb-mentions':
        apiEndpoint = '/dark-web-mentions';
        break;
      case 'compromised-domains':
        apiEndpoint = '/compromised-domains';
        break;
      case 'employee-exposure':
        apiEndpoint = '/employee-exposure';
        break;
      case 'threat-feeds':
        apiEndpoint = '/threat-feeds';
        break;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }

    console.log(`Making API call to: ${baseUrl}${apiEndpoint}`);

    // Make the actual API call to SOC Radar
    const response = await fetch(`${baseUrl}${apiEndpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`SOC Radar API error: ${response.status} ${response.statusText}`);
      
      // If API fails, return fallback data to prevent dashboard breaking
      let fallbackData;
      switch (endpoint) {
        case 'incidents':
          fallbackData = {
            incidents: [
              {
                id: 'INC-FALLBACK-001',
                title: 'API Connection Issue',
                severity: 'medium',
                status: 'investigating',
                created_at: new Date().toISOString(),
                description: 'Unable to fetch real-time data from SOC Radar API'
              }
            ],
            total: 1,
            delta: 0
          };
          break;
        case 'leaked-emails':
          fallbackData = { leaked_credentials: [], total: 0 };
          break;
        case 'darkweb-mentions':
          fallbackData = { mentions: [], total: 0, weekly_delta: 0 };
          break;
        case 'compromised-domains':
          fallbackData = { domains: [], total: 0, at_risk: 0 };
          break;
        case 'employee-exposure':
          fallbackData = { exposed_employees: [], total: 0, password_reuse_percentage: 0 };
          break;
        case 'threat-feeds':
          fallbackData = { iocs: [], total: 0 };
          break;
        default:
          fallbackData = {};
      }

      return new Response(
        JSON.stringify({ success: true, data: fallbackData }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched real data from SOC Radar for ${endpoint}:`, data);

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
    console.error('Error in SOC Radar function:', error);
    
    // Return empty data structure to prevent dashboard errors
    const emptyData = {
      incidents: [],
      leaked_credentials: [],
      mentions: [],
      domains: [],
      exposed_employees: [],
      iocs: [],
      total: 0,
      delta: 0,
      weekly_delta: 0,
      at_risk: 0,
      password_reuse_percentage: 0
    };

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        data: emptyData
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
