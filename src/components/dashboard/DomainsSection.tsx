
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Globe, Shield, AlertTriangle } from 'lucide-react';

const DomainsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const domains = [
    {
      id: 'DOM-001',
      domain: 'company-secure.com',
      status: 'compromised',
      riskLevel: 'high',
      lastScan: '2024-01-15T10:00:00Z',
      issues: ['Malware detected', 'SSL certificate expired']
    },
    {
      id: 'DOM-002',
      domain: 'company-portal.net',
      status: 'at-risk',
      riskLevel: 'medium',
      lastScan: '2024-01-15T09:30:00Z',
      issues: ['Weak security headers']
    },
    {
      id: 'DOM-003',
      domain: 'company-main.com',
      status: 'secure',
      riskLevel: 'low',
      lastScan: '2024-01-15T09:00:00Z',
      issues: []
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      compromised: 'bg-red-500/20 text-red-400 border-red-500/30',
      'at-risk': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      secure: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[status as keyof typeof colors] || colors.secure;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compromised': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'secure': return <Shield className="h-4 w-4 text-green-400" />;
      default: return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || domain.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Domain Security</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search domains..."
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
              <SelectItem value="secure">Secure</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
              <SelectItem value="compromised">Compromised</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredDomains.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No domains found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDomains.map((domain) => (
              <div key={domain.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(domain.status)}
                    <div>
                      <h3 className="font-semibold text-white">{domain.domain}</h3>
                      <p className="text-sm text-gray-400">Last scan: {new Date(domain.lastScan).toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(domain.status)}>
                    {domain.status.toUpperCase()}
                  </Badge>
                </div>
                {domain.issues.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-1">Issues:</p>
                    <div className="flex flex-wrap gap-1">
                      {domain.issues.map((issue, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-red-400 border-red-500/30">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DomainsSection;
