
import { supabase } from '@/integrations/supabase/client';

export class SOCRadarService {
  
  private async callEdgeFunction(endpoint: string) {
    try {
      console.log(`Calling SOC Radar API for endpoint: ${endpoint}`);
      
      const { data, error } = await supabase.functions.invoke('soc-radar-data', {
        body: { endpoint }
      });

      if (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'API call failed');
      }

      return data.data;
    } catch (error) {
      console.error(`SOC Radar API error for ${endpoint}:`, error);
      throw error;
    }
  }

  async getIncidents() {
    const data = await this.callEdgeFunction('incidents');
    return {
      incidents: data?.incidents || [],
      total: data?.total || 0,
      delta: data?.delta || 0
    };
  }

  async getLeakedEmails() {
    const data = await this.callEdgeFunction('leaked-emails');
    return {
      emails: data?.leaked_credentials || [],
      total: data?.total || 0
    };
  }

  async getDarkWebMentions() {
    const data = await this.callEdgeFunction('darkweb-mentions');
    return {
      mentions: data?.mentions || [],
      total: data?.total || 0,
      weekly_delta: data?.weekly_delta || 0
    };
  }

  async getCompromisedDomains() {
    const data = await this.callEdgeFunction('compromised-domains');
    return {
      domains: data?.domains || [],
      total: data?.total || 0,
      at_risk: data?.at_risk || 0
    };
  }

  async getEmployeeExposure() {
    const data = await this.callEdgeFunction('employee-exposure');
    return {
      employees: data?.exposed_employees || [],
      total: data?.total || 0,
      password_reuse_percentage: data?.password_reuse_percentage || 0
    };
  }

  async getThreatFeeds() {
    const data = await this.callEdgeFunction('threat-feeds');
    return {
      feeds: data?.iocs || [],
      total: data?.total || 0
    };
  }
}

export const socRadarService = new SOCRadarService();
