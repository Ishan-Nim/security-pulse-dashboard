
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Globe, AlertTriangle, Eye } from 'lucide-react';

const DarkWebSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Mock dark web data
  const darkWebMentions = [
    {
      id: 'DW-001',
      source: 'Underground Forum',
      mention: 'Company credentials for sale',
      severity: 'critical',
      date: '2024-01-15T08:30:00Z',
      category: 'Credential Leak',
      status: 'monitoring'
    },
    {
      id: 'DW-002',
      source: 'Marketplace',
      mention: 'Employee database discussion',
      severity: 'high',
      date: '2024-01-14T16:20:00Z',
      category: 'Data Breach',
      status: 'investigating'
    },
    {
      id: 'DW-003',
      source: 'Chat Room',
      mention: 'Company mentioned in exploit discussion',
      severity: 'medium',
      date: '2024-01-13T12:45:00Z',
      category: 'Threat Discussion',
      status: 'reviewed'
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Credential Leak': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'Data Breach': return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'Threat Discussion': return <Eye className="h-4 w-4 text-yellow-400" />;
      default: return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredMentions = darkWebMentions.filter(mention => {
    const matchesSearch = mention.mention.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mention.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mention.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || mention.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Dark Web Monitoring</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search dark web mentions..."
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
        {filteredMentions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No dark web mentions found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMentions.map((mention) => (
              <div key={mention.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(mention.category)}
                    <div>
                      <h3 className="font-semibold text-white">{mention.mention}</h3>
                      <p className="text-sm text-gray-400">Source: {mention.source}</p>
                    </div>
                  </div>
                  <Badge className={getSeverityBadge(mention.severity)}>
                    {mention.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                    {mention.category}
                  </Badge>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Status: {mention.status}</span>
                    <span>{new Date(mention.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DarkWebSection;
