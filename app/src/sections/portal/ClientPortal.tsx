import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  CheckSquare,
  MessageSquare,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Download,
  Upload,
  Clock,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { API_BASE_URL } from '@/config'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: FolderKanban, label: 'Projects', id: 'projects' },
  { icon: FileText, label: 'Documents', id: 'documents' },
  { icon: CheckSquare, label: 'Compliance', id: 'compliance' },
  { icon: MessageSquare, label: 'Messages', id: 'messages' },
  { icon: Settings, label: 'Settings', id: 'settings' },
]

interface PortalPayload {
  projects: Array<{ id: string; name: string; type: string; status: string; progress: number; daysLeft: number; date?: string | null }>
  documents: Array<{ id: string; name: string; size: string; date: string; type: string }>
  complianceItems: Array<{ id: string; title: string; deadline: string; status: string }>
  messages: Array<{ id: string; from: string; message: string; time: string; unread: boolean }>
}

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payload, setPayload] = useState<PortalPayload>({
    projects: [],
    documents: [],
    complianceItems: [],
    messages: [],
  })

  useEffect(() => {
    const controller = new AbortController()

    const loadPortalData = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${API_BASE_URL}/dashboard/portal-data`, { signal: controller.signal })

        if (!response.ok) {
          throw new Error('Failed to load portal data.')
        }

        const data = await response.json()
        setPayload({
          projects: data.projects || [],
          documents: data.documents || [],
          complianceItems: data.complianceItems || [],
          messages: data.messages || [],
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Unable to load live portal data. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadPortalData()
    return () => controller.abort()
  }, [])

  const stats = useMemo(() => {
    const activeProjects = payload.projects.filter((project) => project.status !== 'completed').length
    const completedProjects = payload.projects.filter((project) => project.status === 'completed').length
    const pendingTasks = payload.complianceItems.filter((item) => item.status === 'urgent' || item.status === 'pending').length

    return {
      activeProjects,
      completedProjects,
      documents: payload.documents.length,
      pendingTasks,
    }
  }, [payload])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-eco-500/20 text-eco-400 border-eco-500/30'
      case 'in progress':
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'pending review':
      case 'pending_review':
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'text-red-400 bg-red-500/10'
      case 'pending':
        return 'text-amber-400 bg-amber-500/10'
      case 'ontrack':
      case 'completed':
        return 'text-eco-400 bg-eco-500/10'
      default:
        return 'text-gray-400 bg-gray-500/10'
    }
  }

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="py-24 flex items-center justify-center text-gray-300 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading portal data...
        </div>
      )
    }

    if (error) {
      return <div className="text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-4">{error}</div>
    }

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-eco-600/20 to-eco-800/20 rounded-2xl p-6 border border-eco-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Welcome back!</h2>
              <p className="text-gray-400">You have {stats.activeProjects} active projects and {stats.pendingTasks} pending compliance items.</p>
            </div>
            <Button className="btn-primary" onClick={() => setActiveTab('projects')}>New Project</Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Projects', value: String(stats.activeProjects), icon: FolderKanban, color: 'text-blue-400' },
            { label: 'Completed', value: String(stats.completedProjects), icon: CheckCircle2, color: 'text-eco-400' },
            { label: 'Documents', value: String(stats.documents), icon: FileText, color: 'text-amber-400' },
            { label: 'Pending Tasks', value: String(stats.pendingTasks), icon: Clock, color: 'text-red-400' },
          ].map((stat, index) => (
            <Card key={index} className="bg-[#0f2e15] border-eco-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg">Recent Projects</CardTitle>
              <Button variant="ghost" size="sm" className="text-eco-400 hover:text-eco-300" onClick={() => setActiveTab('projects')}>
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payload.projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="p-4 rounded-xl bg-[#0a1f12] border border-eco-500/10 hover:border-eco-500/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white">{project.name}</h4>
                        <p className="text-sm text-gray-400">{project.type}</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>{project.status.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={project.progress} className="flex-1 h-2" />
                      <span className="text-sm text-gray-400">{project.progress}%</span>
                    </div>
                  </div>
                ))}
                {!payload.projects.length && <p className="text-sm text-gray-400">No live projects available yet.</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg">Compliance Tracker</CardTitle>
              <Button variant="ghost" size="sm" className="text-eco-400 hover:text-eco-300" onClick={() => setActiveTab('compliance')}>
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payload.complianceItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0a1f12] border border-eco-500/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getComplianceColor(item.status)}`}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400">Due: {new Date(item.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className={getComplianceColor(item.status)}>{item.status}</Badge>
                  </div>
                ))}
                {!payload.complianceItems.length && <p className="text-sm text-gray-400">No compliance items found.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg">Recent Documents</CardTitle>
              <Button variant="ghost" size="sm" className="text-eco-400 hover:text-eco-300">
                <Upload className="w-4 h-4 mr-1" /> Upload
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {payload.documents.slice(0, 4).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a1f12] border border-eco-500/10 hover:border-eco-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-eco-400" />
                      <div>
                        <p className="text-sm text-white">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 text-gray-400 hover:text-eco-400" />
                    </Button>
                  </div>
                ))}
                {!payload.documents.length && <p className="text-sm text-gray-400">No documents available.</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payload.messages.slice(0, 4).map((msg) => (
                  <div key={msg.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${msg.unread ? 'bg-eco-500/5 border-eco-500/20' : 'bg-[#0a1f12] border-eco-500/10'}`}>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/images/client-avatar.jpg" />
                      <AvatarFallback className="bg-eco-500/20 text-eco-400">{msg.from.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white text-sm">{msg.from}</p>
                        <p className="text-xs text-gray-500">{msg.time}</p>
                      </div>
                      <p className={`text-sm truncate ${msg.unread ? 'text-gray-300' : 'text-gray-400'}`}>{msg.message}</p>
                    </div>
                    {msg.unread && <div className="w-2 h-2 rounded-full bg-eco-400 flex-shrink-0 mt-2" />}
                  </div>
                ))}
                {!payload.messages.length && <p className="text-sm text-gray-400">No messages available.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1f12]">
      <header className="sticky top-0 z-40 bg-[#0f2e15]/95 backdrop-blur-xl border-b border-eco-500/20">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-eco-400 to-eco-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">BK</span>
              </div>
              <span className="font-heading font-bold text-white hidden sm:block">Client Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => (window.location.hash = '')} className="text-gray-400 hover:text-eco-400 transition-colors">← Back to Home</Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search..." className="pl-10 w-64 bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500" />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Avatar className="w-9 h-9 cursor-pointer">
              <AvatarImage src="/images/client-avatar.jpg" />
              <AvatarFallback className="bg-eco-500/20 text-eco-400">BM</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] bg-[#0f2e15] border-r border-eco-500/20 transition-all duration-300 ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}`}>
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30' : 'text-gray-400 hover:bg-[#0a1f12] hover:text-white'}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'} whitespace-nowrap`}>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              {payload.projects.map((project) => (
                <div key={project.id} className="p-4 rounded-xl bg-[#0f2e15] border border-eco-500/20">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-400">{project.type}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>{project.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
              ))}
              {!payload.projects.length && <p className="text-gray-400">No projects found.</p>}
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              {payload.documents.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl bg-[#0f2e15] border border-eco-500/20 text-white">{doc.name} <span className="text-gray-400 text-sm">({doc.date})</span></div>
              ))}
              {!payload.documents.length && <p className="text-gray-400">No documents found.</p>}
            </div>
          )}
          {activeTab === 'compliance' && (
            <div className="space-y-3">
              {payload.complianceItems.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-[#0f2e15] border border-eco-500/20 text-white">{item.title}</div>
              ))}
              {!payload.complianceItems.length && <p className="text-gray-400">No compliance tasks found.</p>}
            </div>
          )}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              {payload.messages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-xl bg-[#0f2e15] border border-eco-500/20 text-white"><p className="font-medium">{msg.from}</p><p className="text-sm text-gray-400">{msg.message}</p></div>
              ))}
              {!payload.messages.length && <p className="text-gray-400">No messages found.</p>}
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-4 rounded-xl bg-[#0f2e15] border border-eco-500/20 text-gray-300">Portal settings are managed centrally. Contact an administrator for role and account updates.</div>
          )}
        </main>
      </div>
    </div>
  )
}
