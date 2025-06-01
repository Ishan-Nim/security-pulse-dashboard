
// API utilities for SOC Radar integration
export class SOCRadarAPI {
  private baseURL: string = 'https://api.socradar.io'; // Example URL
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Incident API V4
  async getIncidents(params?: { status?: string; severity?: string; limit?: number }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.makeRequest(`/v4/incidents?${queryParams}`);
  }

  // DRP Fraud Protection API
  async getLeakedEmails(params?: { domain?: string; limit?: number }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.makeRequest(`/drp/leaked-credentials?${queryParams}`);
  }

  // Dark Web Monitoring API V2
  async getDarkWebMentions(params?: { keywords?: string; severity?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.makeRequest(`/v2/darkweb/mentions?${queryParams}`);
  }

  // Brand Protection API
  async getCompromisedDomains(params?: { domain?: string; status?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.makeRequest(`/brand-protection/domains?${queryParams}`);
  }

  // ASM Digital Footprint API
  async getEmployeeExposure(params?: { email?: string; risk_level?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.makeRequest(`/asm/employee-exposure?${queryParams}`);
  }

  // Threat Feed IOC API
  async getThreatFeeds(params?: { type?: string; severity?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.makeRequest(`/threat-feed/iocs?${queryParams}`);
  }
}

// Mock data service for development
export class MockSOCRadarService {
  async getIncidents() {
    // Return mock incident data
    return {
      incidents: [
        {
          id: 'INC-2024-001',
          title: 'Suspicious Login Activity',
          severity: 'high',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z'
        }
      ],
      total: 23,
      delta: -2
    };
  }

  async getEmployeeData() {
    return {
      exposed_employees: 156,
      password_reuse_percentage: 34,
      high_risk_count: 12
    };
  }

  async getDarkWebData() {
    return {
      mentions: 8,
      weekly_delta: 3,
      trend: 'up'
    };
  }

  async getDomainData() {
    return {
      total_domains: 12,
      at_risk_domains: 4,
      compromised_domains: 2
    };
  }
}
