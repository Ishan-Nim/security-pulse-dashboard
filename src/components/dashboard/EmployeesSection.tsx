
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, AlertTriangle, Shield } from 'lucide-react';

const EmployeesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  // Mock employee data
  const employees = [
    {
      id: 'EMP-001',
      email: 'john.doe@company.com',
      name: 'John Doe',
      department: 'Engineering',
      riskLevel: 'high',
      exposures: ['Password reuse', 'Dark web mention'],
      lastActivity: '2024-01-15T14:30:00Z'
    },
    {
      id: 'EMP-002',
      email: 'jane.smith@company.com',
      name: 'Jane Smith',
      department: 'Marketing',
      riskLevel: 'medium',
      exposures: ['Weak password'],
      lastActivity: '2024-01-15T12:15:00Z'
    },
    {
      id: 'EMP-003',
      email: 'mike.johnson@company.com',
      name: 'Mike Johnson',
      department: 'Finance',
      riskLevel: 'low',
      exposures: [],
      lastActivity: '2024-01-15T11:45:00Z'
    }
  ];

  const getRiskBadge = (risk: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[risk as keyof typeof colors] || colors.medium;
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'low': return <Shield className="h-4 w-4 text-green-400" />;
      default: return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || employee.riskLevel === riskFilter;
    
    return matchesSearch && matchesRisk;
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Employee Risk Assessment</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No employees found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getRiskIcon(employee.riskLevel)}
                    <div>
                      <h3 className="font-semibold text-white">{employee.name}</h3>
                      <p className="text-sm text-gray-400">{employee.email}</p>
                    </div>
                  </div>
                  <Badge className={getRiskBadge(employee.riskLevel)}>
                    {employee.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <div className="mb-3">
                  <p className="text-gray-300">Department: {employee.department}</p>
                  {employee.exposures.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400 mb-1">Exposures:</p>
                      <div className="flex flex-wrap gap-1">
                        {employee.exposures.map((exposure, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-red-400 border-red-500/30">
                            {exposure}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  Last activity: {new Date(employee.lastActivity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeesSection;
