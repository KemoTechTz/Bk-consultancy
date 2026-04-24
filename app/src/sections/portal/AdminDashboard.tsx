import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  LogOut,
  Search,
  Bell,
  TrendingUp,
  CheckCircle2,
  Plus,
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
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  Badge,
} from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_BASE_URL } from '@/config';
import { getAdminAuthHeaders, getAdminToken } from '@/lib/admin-auth';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardProject {
  id?: string
  _id?: string
  name?: string
  title?: string
  type?: string
  category?: string
  status?: string
  progress?: number
  location?: string
}

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Users, label: 'Users', id: 'users' },
  { icon: FolderKanban, label: 'Projects', id: 'projects' },
  { icon: FileText, label: 'Content', id: 'content' },
  { icon: BarChart3, label: 'Analytics', id: 'analytics' },
  { icon: MessageSquare, label: 'Messages', id: 'messages' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen] = useState(true);

  // Content management state
  const [projectForm, setProjectForm] = useState({ title: '', description: '', image: '', link: '', location: '', date: '', category: '', outcomes: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', author: '' });
  const [testimonialForm, setTestimonialForm] = useState({ name: '', content: '', company: '' });
  const [serviceForm, setServiceForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, activeProjects: 0, completedProjects: 0, pendingConsultations: 0, monthlyRevenue: 0, revenueGrowth: 0 });
  const [revenueData, setRevenueData] = useState<Array<{ month: string; revenue: number }>>([]);
  const [projectTypeData, setProjectTypeData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [recentUsers, setRecentUsers] = useState<Array<{ id: string; name: string; email: string; company: string; role: string; status: string; joined: string }>>([]);
  const [recentProjects, setRecentProjects] = useState<Array<{ id: string; name: string; type: string; status: string; progress: number; client?: string }>>([]);

  const refreshDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/dashboard/portal-data`);
      if (!response.ok) throw new Error('Failed to load dashboard data');
      const data = await response.json();
      setStats(data.stats || { totalUsers: 0, activeProjects: 0, completedProjects: 0, pendingConsultations: 0, monthlyRevenue: 0, revenueGrowth: 0 });
      setRevenueData(data.revenueData || []);
      setProjectTypeData(data.projectTypeData || []);
      setRecentUsers(data.recentUsers || []);
      setRecentProjects((data.recentProjects || []).map((project: DashboardProject) => ({
        id: project.id || project._id,
        name: project.name || project.title,
        type: project.type || project.category || 'General',
        status: project.status || 'in_progress',
        progress: project.progress || 0,
        client: project.location || 'Client',
      })));
    } catch (error) {
      console.error(error);
      setMessage('Unable to load live admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'bg-eco-500/20 text-eco-400';
      case 'pending':
      case 'pending_review':
        return 'bg-amber-500/20 text-amber-400';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMutationHeaders = (): Record<string, string> | null => {
    const token = getAdminToken();
    if (!token) {
      setMessage('Admin session missing. Please log in again.');
      return null;
    }
    return getAdminAuthHeaders(token);
  };

  // Content management handlers
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = getMutationHeaders();
      if (!headers) return;
      const response = await fetch(`${API_BASE_URL}/content/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...projectForm, outcomes: projectForm.outcomes.split('\n').filter(o => o.trim()) }),
      });
      if (response.ok) {
        setMessage('Project added successfully!');
        setProjectForm({ title: '', description: '', image: '', link: '', location: '', date: '', category: '', outcomes: '' });
        refreshDashboard();
      } else if (response.status === 401) {
        setMessage('Admin session expired. Please log in again.');
      } else {
        setMessage('Failed to add project.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error adding project.');
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = getMutationHeaders();
      if (!headers) return;
      const response = await fetch(`${API_BASE_URL}/content/blogs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...blogForm, date: new Date() }),
      });
      if (response.ok) {
        setMessage('Blog added successfully!');
        setBlogForm({ title: '', content: '', author: '' });
        refreshDashboard();
      } else if (response.status === 401) {
        setMessage('Admin session expired. Please log in again.');
      } else {
        setMessage('Failed to add blog.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error adding blog.');
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = getMutationHeaders();
      if (!headers) return;
      const response = await fetch(`${API_BASE_URL}/content/testimonials`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testimonialForm),
      });
      if (response.ok) {
        setMessage('Testimonial added successfully!');
        setTestimonialForm({ name: '', content: '', company: '' });
        refreshDashboard();
      } else if (response.status === 401) {
        setMessage('Admin session expired. Please log in again.');
      } else {
        setMessage('Failed to add testimonial.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error adding testimonial.');
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = getMutationHeaders();
      if (!headers) return;
      const response = await fetch(`${API_BASE_URL}/content/services`, {
        method: 'POST',
        headers,
        body: JSON.stringify(serviceForm),
      });
      if (response.ok) {
        setMessage('Service added successfully!');
        setServiceForm({ name: '', description: '' });
        refreshDashboard();
      } else if (response.status === 401) {
        setMessage('Admin session expired. Please log in again.');
      } else {
        setMessage('Failed to add service.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error adding service.');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {loading && <div className="text-sm text-gray-300">Loading live dashboard data...</div>}
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-heading font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Projects</p>
                <p className="text-2xl font-heading font-bold text-white">{stats.activeProjects}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-heading font-bold text-eco-400">{stats.completedProjects}</p>
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
                <p className="text-gray-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-heading font-bold text-white">
                  {formatCurrency(stats.monthlyRevenue).replace('TZS', 'TSh')}
                </p>
                <p className="text-sm text-eco-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{stats.revenueGrowth}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a4d24" />
                  <XAxis dataKey="month" stroke="#6b7b6e" />
                  <YAxis stroke="#6b7b6e" tickFormatter={(value) => `TSh ${value / 1000000}M`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f2e15',
                      border: '1px solid #1a4d24',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardHeader>
            <CardTitle className="text-white">Projects by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f2e15',
                      border: '1px solid #1a4d24',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {projectTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Users</CardTitle>
            <Button variant="ghost" size="sm" className="text-eco-400">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-eco-500/20">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Role</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.slice(0, 5).map((user) => (
                  <TableRow key={user.id} className="border-eco-500/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-eco-500/20 text-eco-400 text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white text-sm">{user.name}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Projects</CardTitle>
            <Button variant="ghost" size="sm" className="text-eco-400">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0a1f12] border border-eco-500/10"
                >
                  <div>
                    <p className="text-white text-sm">{project.name}</p>
                    <p className="text-gray-500 text-xs">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Progress value={project.progress} className="w-24 h-1 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a1f12]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0f2e15]/95 backdrop-blur-xl border-b border-eco-500/20">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-eco-400 to-eco-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-heading font-bold text-white hidden sm:block">
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.location.hash = ''}
              className="text-gray-400 hover:text-eco-400 transition-colors"
            >
              ← Back to Home
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Avatar className="w-9 h-9 cursor-pointer">
              <AvatarFallback className="bg-eco-500/20 text-eco-400">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] bg-[#0f2e15] border-r border-eco-500/20 transition-all duration-300 ${
            sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
          }`}
        >
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30'
                    : 'text-gray-400 hover:bg-[#0a1f12] hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'} whitespace-nowrap`}>
                  {item.label}
                </span>
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-eco-500/20">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'} whitespace-nowrap`}>
                  Logout
                </span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <h2 className="text-2xl font-heading font-bold text-white mb-2">User Management</h2>
              {recentUsers.map((user) => (
                <div key={user.id} className="p-4 rounded-xl bg-[#0f2e15] border border-eco-500/20">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email} • {user.company}</p>
                </div>
              ))}
              {!recentUsers.length && <p className="text-gray-400">No users found.</p>}
            </div>
          )}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Project Management</h2>
              {recentProjects.map((project) => (
                <div key={project.id} className="p-4 rounded-xl bg-[#0f2e15] border border-eco-500/20">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-white font-medium">{project.name}</p>
                      <p className="text-sm text-gray-400">{project.type} • {project.client}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>{project.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
              ))}
              {!recentProjects.length && <p className="text-gray-400">No projects found.</p>}
            </div>
          )}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-white">Content Management</h2>
                {message && (
                  <div className="text-eco-400 bg-eco-500/20 px-4 py-2 rounded-lg">
                    {message}
                  </div>
                )}
              </div>
              <Tabs defaultValue="projects" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-[#0f2e15] border border-eco-500/20">
                  <TabsTrigger value="projects" className="data-[state=active]:bg-eco-500/20 data-[state=active]:text-eco-400">Projects</TabsTrigger>
                  <TabsTrigger value="blogs" className="data-[state=active]:bg-eco-500/20 data-[state=active]:text-eco-400">Blogs</TabsTrigger>
                  <TabsTrigger value="testimonials" className="data-[state=active]:bg-eco-500/20 data-[state=active]:text-eco-400">Testimonials</TabsTrigger>
                  <TabsTrigger value="services" className="data-[state=active]:bg-eco-500/20 data-[state=active]:text-eco-400">Services</TabsTrigger>
                </TabsList>
                <TabsContent value="projects" className="space-y-4">
                  <Card className="bg-[#0f2e15] border-eco-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Project
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProjectSubmit} className="space-y-4">
                        <Input
                          placeholder="Project Title"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          required
                        />
                        <Textarea
                          placeholder="Project Description"
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          required
                        />
                        <Input
                          placeholder="Image URL"
                          value={projectForm.image}
                          onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                        />
                        <Input
                          placeholder="Project Link"
                          value={projectForm.link}
                          onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                        />
                        <Input
                          placeholder="Location"
                          value={projectForm.location}
                          onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                        />
                        <Input
                          placeholder="Date (e.g., 2024)"
                          value={projectForm.date}
                          onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                        />
                        <Input
                          placeholder="Category"
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                        />
                        <Textarea
                          placeholder="Outcomes (one per line)"
                          value={projectForm.outcomes}
                          onChange={(e) => setProjectForm({ ...projectForm, outcomes: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                        />
                        <Button type="submit" className="btn-primary">Add Project</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="blogs" className="space-y-4">
                  <Card className="bg-[#0f2e15] border-eco-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Blog Post
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleBlogSubmit} className="space-y-4">
                        <Input
                          placeholder="Blog Title"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          required
                        />
                        <Textarea
                          placeholder="Blog Content"
                          value={blogForm.content}
                          onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          rows={6}
                          required
                        />
                        <Input
                          placeholder="Author"
                          value={blogForm.author}
                          onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          required
                        />
                        <Button type="submit" className="btn-primary">Add Blog Post</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="testimonials" className="space-y-4">
                  <Card className="bg-[#0f2e15] border-eco-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Testimonial
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                        <Input
                          placeholder="Client Name"
                          value={testimonialForm.name}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          required
                        />
                        <Textarea
                          placeholder="Testimonial Content"
                          value={testimonialForm.content}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          required
                        />
                        <Input
                          placeholder="Company"
                          value={testimonialForm.company}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          required
                        />
                        <Button type="submit" className="btn-primary">Add Testimonial</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="services" className="space-y-4">
                  <Card className="bg-[#0f2e15] border-eco-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Service
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleServiceSubmit} className="space-y-4">
                        <Input
                          placeholder="Service Name"
                          value={serviceForm.name}
                          onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          required
                        />
                        <Textarea
                          placeholder="Service Description"
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                          className="bg-[#0a1f12] border-eco-500/30 text-white"
                          required
                        />
                        <Button type="submit" className="btn-primary">Add Service</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          {activeTab === 'analytics' && renderDashboard()}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Messages</h2>
              {recentUsers.slice(0, 4).map((user) => (
                <div key={user.id} className="p-4 rounded-xl bg-[#0f2e15] border border-eco-500/20 text-gray-300">
                  Follow up with {user.name} regarding active portal updates.
                </div>
              ))}
              {!recentUsers.length && <p className="text-gray-400">No messages available.</p>}
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-4 rounded-xl bg-[#0f2e15] border border-eco-500/20 text-gray-300">
              Settings are managed through environment configuration and role permissions.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
