
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, AlertTriangle, FileText } from 'lucide-react';

const InfectionsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const infections = [
    {
      id: 'INF-001',
      endpoint: 'LAPTOP-DEV-001',
      malwareType: 'Trojan.Win32.Generic',
      severity: 'critical',
      detectedAt: '2024-01-15T11:30:00Z',
      status: 'quarantined',
      user: 'john.doe@company.com'
    },
    {
      id: 'INF-002',
      endpoint: 'SERVER-PROD-05',
      malwareType: 'Adware.Generic',
      severity: 'medium',
      detectedAt: '2024-01-14T16:45:00Z',
      status: 'cleaned',
      user: 'system'
    }
  ];

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const filteredInfections = infections.filter(infection => {
    const matchesSearch = infection.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         infection.malwareType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         infection.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || infection.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Malware Infections</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search infections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredInfections.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No infections found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInfections.map((infection) => (
              <div key={infection.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <div>
                      <h3 className="font-semibold text-white">{infection.endpoint}</h3>
                      <p className="text-sm text-gray-400">{infection.malwareType}</p>
                    </div>
                  </div>
                  <Badge className={getSeverityBadge(infection.severity)}>
                    {infection.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                  <span>User: {infection.user}</span>
                  <span>Status: {infection.status}</span>
                  <span>Detected: {new Date(infection.detectedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfectionsSection;
