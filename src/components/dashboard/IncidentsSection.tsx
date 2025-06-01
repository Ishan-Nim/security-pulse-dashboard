
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const IncidentsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Mock data - replace with actual API data
  const incidents = [
    {
      id: 'INC-2024-001',
      title: 'Suspicious Login Activity',
      severity: 'high',
      status: 'active',
      assignee: 'John Doe',
      created: '2024-01-15T10:30:00Z',
      description: 'Multiple failed login attempts from unusual IP addresses'
    },
    {
      id: 'INC-2024-002',
      title: 'Malware Detection',
      severity: 'critical',
      status: 'investigating',
      assignee: 'Jane Smith',
      created: '2024-01-15T09:15:00Z',
      description: 'Trojan detected on endpoint device'
    },
    {
      id: 'INC-2024-003',
      title: 'Data Exfiltration Attempt',
      severity: 'high',
      status: 'resolved',
      assignee: 'Mike Johnson',
      created: '2024-01-14T16:45:00Z',
      description: 'Unusual data transfer patterns detected'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'investigating': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Security Incidents</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
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
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No incidents found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <div key={incident.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(incident.status)}
                    <div>
                      <h3 className="font-semibold text-white">{incident.title}</h3>
                      <p className="text-sm text-gray-400">{incident.id}</p>
                    </div>
                  </div>
                  <Badge className={getSeverityBadge(incident.severity)}>
                    {incident.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-300 mb-3">{incident.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Assigned to: {incident.assignee}</span>
                  <span>{new Date(incident.created).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncidentsSection;
