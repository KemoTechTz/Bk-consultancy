import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Filter,
  Plus,
  Search,
  Bell,
  ChevronRight,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Badge,
} from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock compliance data
const complianceItems = [
  {
    id: 1,
    title: 'NEMC EIA Certificate Renewal',
    type: 'Permit',
    status: 'urgent',
    deadline: '2024-03-25',
    daysLeft: 5,
    project: 'Dodoma Industrial Park',
    assignedTo: 'Dr. Sarah Kimaro',
    description: 'Annual renewal of Environmental Impact Assessment certificate',
  },
  {
    id: 2,
    title: 'Quarterly Air Quality Report',
    type: 'Report',
    status: 'pending',
    deadline: '2024-03-31',
    daysLeft: 11,
    project: 'City Monitoring Network',
    assignedTo: 'James Mwinyi',
    description: 'Submit Q1 2024 air quality monitoring data to NEMC',
  },
  {
    id: 3,
    title: 'Wastewater Discharge Permit',
    type: 'Permit',
    status: 'ontrack',
    deadline: '2024-04-15',
    daysLeft: 26,
    project: 'Manufacturing Plant',
    assignedTo: 'Grace Mushi',
    description: 'Apply for industrial wastewater discharge permit',
  },
  {
    id: 4,
    title: 'Environmental Audit Submission',
    type: 'Audit',
    status: 'completed',
    deadline: '2024-03-01',
    daysLeft: 0,
    project: 'Lake Victoria Facility',
    assignedTo: 'John Bwire',
    description: 'Annual environmental compliance audit report',
  },
  {
    id: 5,
    title: 'Hazardous Waste Registration',
    type: 'Registration',
    status: 'urgent',
    deadline: '2024-03-20',
    daysLeft: 0,
    project: 'Chemical Processing Unit',
    assignedTo: 'Dr. Sarah Kimaro',
    description: 'Register as hazardous waste generator with NEMC',
  },
  {
    id: 6,
    title: 'Noise Level Assessment',
    type: 'Assessment',
    status: 'ontrack',
    deadline: '2024-04-30',
    daysLeft: 41,
    project: 'Construction Site',
    assignedTo: 'James Mwinyi',
    description: 'Conduct noise level monitoring and submit assessment',
  },
];

const complianceStats = {
  total: 24,
  completed: 18,
  pending: 4,
  urgent: 2,
  complianceRate: 85,
  trend: 'up',
  trendValue: 5,
};

const upcomingDeadlines = [
  { date: '2024-03-20', title: 'Hazardous Waste Registration', type: 'urgent' },
  { date: '2024-03-25', title: 'NEMC EIA Certificate Renewal', type: 'urgent' },
  { date: '2024-03-31', title: 'Quarterly Air Quality Report', type: 'pending' },
  { date: '2024-04-15', title: 'Wastewater Discharge Permit', type: 'ontrack' },
];

export default function ComplianceTracker() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setSelectedItem] = useState<typeof complianceItems[0] | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-eco-500/20 text-eco-400 border-eco-500/30',
          icon: CheckCircle2,
          label: 'Completed',
        };
      case 'ontrack':
        return {
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: Minus,
          label: 'On Track',
        };
      case 'pending':
        return {
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: Clock,
          label: 'Pending',
        };
      case 'urgent':
        return {
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: AlertTriangle,
          label: 'Urgent',
        };
      default:
        return {
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          icon: Clock,
          label: 'Unknown',
        };
    }
  };

  const filteredItems = complianceItems.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a1f12] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">
              Compliance Tracker
            </h1>
            <p className="text-gray-400">
              Monitor and manage your environmental compliance requirements
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => window.location.hash = ''}
              className="text-gray-400 hover:text-eco-400 transition-colors"
            >
              ← Back to Home
            </Button>
            <Button variant="outline" className="btn-outline">
              <Bell className="w-4 h-4 mr-2" />
              Set Reminders
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0f2e15] border-eco-500/30 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add Compliance Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Task Title</label>
                    <Input
                      placeholder="Enter task title"
                      className="bg-[#0a1f12] border-eco-500/30 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Type</label>
                    <Select>
                      <SelectTrigger className="bg-[#0a1f12] border-eco-500/30 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f2e15] border-eco-500/30">
                        <SelectItem value="permit">Permit</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="audit">Audit</SelectItem>
                        <SelectItem value="registration">Registration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Deadline</label>
                    <Input
                      type="date"
                      className="bg-[#0a1f12] border-eco-500/30 text-white"
                    />
                  </div>
                  <Button className="w-full btn-primary">Add Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Tasks</p>
                  <p className="text-2xl font-heading font-bold text-white">
                    {complianceStats.total}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-heading font-bold text-eco-400">
                    {complianceStats.completed}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-eco-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-eco-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-heading font-bold text-amber-400">
                    {complianceStats.pending}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Urgent</p>
                  <p className="text-2xl font-heading font-bold text-red-400">
                    {complianceStats.urgent}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Rate */}
        <Card className="bg-[#0f2e15] border-eco-500/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Overall Compliance Rate</h3>
                  <div className="flex items-center gap-2">
                    {complianceStats.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-eco-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={complianceStats.trend === 'up' ? 'text-eco-400' : 'text-red-400'}>
                      {complianceStats.trend === 'up' ? '+' : '-'}{complianceStats.trendValue}%
                    </span>
                  </div>
                </div>
                <Progress value={complianceStats.complianceRate} className="h-3" />
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400 text-sm">0%</span>
                  <span className="text-eco-400 font-bold">{complianceStats.complianceRate}%</span>
                  <span className="text-gray-400 text-sm">100%</span>
                </div>
              </div>
              <div className="lg:w-64">
                <h4 className="text-white font-medium mb-3">Upcoming Deadlines</h4>
                <div className="space-y-2">
                  {upcomingDeadlines.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#0a1f12] border border-eco-500/10"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300 truncate">{item.title}</span>
                      </div>
                      <span className={`text-xs ${
                        item.type === 'urgent' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance List */}
        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-white">Compliance Tasks</CardTitle>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48 bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-36 bg-[#0a1f12] border-eco-500/30 text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f2e15] border-eco-500/30">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="ontrack">On Track</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-[#0a1f12] border border-eco-500/10 hover:border-eco-500/30 transition-all cursor-pointer"
                  >
                    {/* Status Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig.color}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white truncate">{item.title}</h4>
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{item.project}</span>
                        <span>•</span>
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>Assigned to {item.assignedTo}</span>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="text-right hidden sm:block">
                      <div className={`text-sm font-medium ${
                        item.status === 'urgent' ? 'text-red-400' : 'text-gray-300'
                      }`}>
                        {new Date(item.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className={`text-xs ${
                        item.daysLeft <= 7 ? 'text-red-400' : 'text-gray-500'
                      }`}>
                        {item.daysLeft === 0
                          ? 'Due today'
                          : item.daysLeft < 0
                          ? `${Math.abs(item.daysLeft)} days overdue`
                          : `${item.daysLeft} days left`}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 text-gray-400" />
                      </Button>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
