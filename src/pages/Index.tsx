
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { RefreshCcw, Search, Filter, Bell, AlertTriangle, Shield, Globe, Users, Mail, Database } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import IncidentsSection from '@/components/dashboard/IncidentsSection';
import EmployeesSection from '@/components/dashboard/EmployeesSection';
import DarkWebSection from '@/components/dashboard/DarkWebSection';
import DomainsSection from '@/components/dashboard/DomainsSection';
import EmailsSection from '@/components/dashboard/EmailsSection';
import InfectionsSection from '@/components/dashboard/InfectionsSection';

const Index = () => {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // KPI State
  const [kpiData, setKpiData] = useState({
    activeIncidents: { count: 23, delta: -2, trend: 'down' },
    exposedEmployees: { count: 156, passwordReuse: 34 },
    darkWebMentions: { count: 8, weeklyDelta: 3, trend: 'up' },
    compromisedDomains: { total: 12, atRisk: 4 }
  });

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls to backend proxy
      console.log('Refreshing SOC Radar data...');
      
      // In production, these would be actual API calls
      setTimeout(() => {
        setLastUpdated(new Date());
        setIsLoading(false);
        toast({
          title: "Data Refreshed",
          description: "SOC Radar data has been updated successfully.",
        });
      }, 1500);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(refreshData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold">SOC Radar Dashboard</h1>
              <Badge variant="outline" className="text-green-400 border-green-400">
                ACTIVE
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Live Updates</span>
                <Switch checked={isLiveMode} onCheckedChange={setIsLiveMode} />
              </div>
              <Button
                onClick={refreshData}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="border-gray-700 hover:bg-gray-800"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="text-sm text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Active Incidents"
            value={kpiData.activeIncidents.count}
            delta={kpiData.activeIncidents.delta}
            trend={kpiData.activeIncidents.trend}
            icon={AlertTriangle}
            severity="high"
          />
          <KPICard
            title="Exposed Employees"
            value={kpiData.exposedEmployees.count}
            subtitle={`${kpiData.exposedEmployees.passwordReuse}% password reuse`}
            icon={Users}
            severity="medium"
          />
          <KPICard
            title="Dark Web Mentions"
            value={kpiData.darkWebMentions.count}
            delta={kpiData.darkWebMentions.weeklyDelta}
            trend={kpiData.darkWebMentions.trend}
            subtitle="Weekly"
            icon={Globe}
            severity="high"
          />
          <KPICard
            title="Compromised Domains"
            value={kpiData.compromisedDomains.total}
            subtitle={`${kpiData.compromisedDomains.atRisk} at risk`}
            icon={Database}
            severity="medium"
          />
        </div>

        {/* Tabbed Sections */}
        <Tabs defaultValue="incidents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-gray-700">
            <TabsTrigger value="incidents" className="data-[state=active]:bg-gray-700">
              Incidents
            </TabsTrigger>
            <TabsTrigger value="emails" className="data-[state=active]:bg-gray-700">
              Leaked Emails
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-gray-700">
              Employees
            </TabsTrigger>
            <TabsTrigger value="darkweb" className="data-[state=active]:bg-gray-700">
              Dark Web
            </TabsTrigger>
            <TabsTrigger value="infections" className="data-[state=active]:bg-gray-700">
              Infections
            </TabsTrigger>
            <TabsTrigger value="domains" className="data-[state=active]:bg-gray-700">
              Domains
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incidents">
            <IncidentsSection />
          </TabsContent>

          <TabsContent value="emails">
            <EmailsSection />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeesSection />
          </TabsContent>

          <TabsContent value="darkweb">
            <DarkWebSection />
          </TabsContent>

          <TabsContent value="infections">
            <InfectionsSection />
          </TabsContent>

          <TabsContent value="domains">
            <DomainsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
