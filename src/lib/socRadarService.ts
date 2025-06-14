
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

      if (!data) {
        throw new Error('No data received from SOC Radar API');
      }

      // Log if we're getting fallback data due to API issues
      if (!data.success) {
        console.warn(`SOC Radar API returned error for ${endpoint}:`, data.error);
      }

      return data.data;
    } catch (error) {
      console.error(`SOC Radar API error for ${endpoint}:`, error);
      throw error;
    }
  }

  async getIncidents() {
    try {
      const data = await this.callEdgeFunction('incidents');
      return {
        incidents: data?.incidents || [],
        total: data?.total || 0,
        delta: data?.delta || 0
      };
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
      // Return default values on error
      return {
        incidents: [],
        total: 0,
        delta: 0
      };
    }
  }

  async getLeakedEmails() {
    try {
      const data = await this.callEdgeFunction('leaked-emails');
      return {
        emails: data?.leaked_credentials || [],
        total: data?.total || 0
      };
    } catch (error) {
      console.error('Failed to fetch leaked emails:', error);
      return {
        emails: [],
        total: 0
      };
    }
  }

  async getDarkWebMentions() {
    try {
      const data = await this.callEdgeFunction('darkweb-mentions');
      return {
        mentions: data?.mentions || [],
        total: data?.total || 0,
        weekly_delta: data?.weekly_delta || 0
      };
    } catch (error) {
      console.error('Failed to fetch dark web mentions:', error);
      return {
        mentions: [],
        total: 0,
        weekly_delta: 0
      };
    }
  }

  async getCompromisedDomains() {
    try {
      const data = await this.callEdgeFunction('compromised-domains');
      return {
        domains: data?.domains || [],
        total: data?.total || 0,
        at_risk: data?.at_risk || 0
      };
    } catch (error) {
      console.error('Failed to fetch compromised domains:', error);
      return {
        domains: [],
        total: 0,
        at_risk: 0
      };
    }
  }

  async getEmployeeExposure() {
    try {
      const data = await this.callEdgeFunction('employee-exposure');
      return {
        employees: data?.exposed_employees || [],
        total: data?.total || 0,
        password_reuse_percentage: data?.password_reuse_percentage || 0
      };
    } catch (error) {
      console.error('Failed to fetch employee exposure:', error);
      return {
        employees: [],
        total: 0,
        password_reuse_percentage: 0
      };
    }
  }

  async getThreatFeeds() {
    try {
      const data = await this.callEdgeFunction('threat-feeds');
      return {
        feeds: data?.iocs || [],
        total: data?.total || 0
      };
    } catch (error) {
      console.error('Failed to fetch threat feeds:', error);
      return {
        feeds: [],
        total: 0
      };
    }
  }
}

export const socRadarService = new SOCRadarService();
