
// Webhook handler for SOC Radar events
export interface WebhookEvent {
  event_type: string;
  timestamp: string;
  data: {
    incident_id?: string;
    severity?: string;
    title?: string;
    description?: string;
    affected_assets?: string[];
  };
  source: string;
}

export class WebhookHandler {
  private listeners: Map<string, Function[]> = new Map();

  // Register event listeners
  on(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }

  // Process incoming webhook
  async processWebhook(payload: WebhookEvent) {
    console.log('Processing webhook event:', payload);

    const { event_type, data } = payload;
    
    // Validate webhook signature (in production)
    if (!this.validateSignature(payload)) {
      throw new Error('Invalid webhook signature');
    }

    // Trigger registered listeners
    const listeners = this.listeners.get(event_type) || [];
    for (const listener of listeners) {
      try {
        await listener(data);
      } catch (error) {
        console.error(`Error processing webhook listener for ${event_type}:`, error);
      }
    }

    // Handle specific event types
    switch (event_type) {
      case 'incident.created':
        await this.handleIncidentCreated(data);
        break;
      case 'threat.detected':
        await this.handleThreatDetected(data);
        break;
      case 'employee.exposed':
        await this.handleEmployeeExposed(data);
        break;
      default:
        console.log(`Unhandled webhook event type: ${event_type}`);
    }
  }

  private validateSignature(payload: WebhookEvent): boolean {
    // In production, validate webhook signature using secret key
    // For now, always return true
    return true;
  }

  private async handleIncidentCreated(data: any) {
    console.log('New incident created:', data);
    // Update dashboard state
    // Send notifications
    // Log to audit trail
  }

  private async handleThreatDetected(data: any) {
    console.log('New threat detected:', data);
    // Update threat intelligence feeds
    // Trigger automated response
  }

  private async handleEmployeeExposed(data: any) {
    console.log('Employee exposure detected:', data);
    // Update employee risk scores
    // Send security alerts
  }
}

// Example usage for setting up webhook endpoint
export const setupWebhookEndpoint = () => {
  const handler = new WebhookHandler();

  // Register event handlers
  handler.on('incident.created', (data: any) => {
    console.log('Incident webhook received:', data);
    // Update UI state or trigger notifications
  });

  handler.on('threat.detected', (data: any) => {
    console.log('Threat webhook received:', data);
    // Update threat indicators
  });

  return handler;
};
