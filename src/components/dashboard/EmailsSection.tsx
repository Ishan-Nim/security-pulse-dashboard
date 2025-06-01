
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Mail, AlertTriangle } from 'lucide-react';

const EmailsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const leakedEmails = [
    {
      id: 'EMAIL-001',
      email: 'admin@company.com',
      source: 'Data Breach XYZ',
      severity: 'critical',
      leakDate: '2024-01-10T14:20:00Z',
      status: 'confirmed',
      associatedData: ['Password', 'Phone number']
    },
    {
      id: 'EMAIL-002',
      email: 'support@company.com',
      source: 'Forum Leak',
      severity: 'high',
      leakDate: '2024-01-08T09:15:00Z',
      status: 'investigating',
      associatedData: ['Password']
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

  const filteredEmails = leakedEmails.filter(email => {
    const matchesSearch = email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Leaked Email Credentials</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leaked emails..."
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
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEmails.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No leaked emails found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEmails.map((email) => (
              <div key={email.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <div>
                      <h3 className="font-semibold text-white">{email.email}</h3>
                      <p className="text-sm text-gray-400">Source: {email.source}</p>
                    </div>
                  </div>
                  <Badge className={getSeverityBadge(email.severity)}>
                    {email.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-1">Associated data:</p>
                  <div className="flex flex-wrap gap-1">
                    {email.associatedData.map((data, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-orange-400 border-orange-500/30">
                        {data}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                  <span>Status: {email.status}</span>
                  <span>Leaked: {new Date(email.leakDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailsSection;
