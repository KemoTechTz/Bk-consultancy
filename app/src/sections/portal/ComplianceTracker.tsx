import { useEffect, useMemo, useState } from 'react'
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
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { API_BASE_URL } from '@/config'

interface ComplianceItem {
  id: string
  title: string
  type: string
  status: string
  deadline: string
  daysLeft: number
  project: string
  assignedTo: string
  description: string
}

export default function ComplianceTracker() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [, setSelectedItem] = useState<ComplianceItem | null>(null)
  const [items, setItems] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${API_BASE_URL}/dashboard/portal-data`, { signal: controller.signal })

        if (!response.ok) {
          throw new Error('Unable to fetch compliance data.')
        }

        const data = await response.json()
        setItems(data.complianceItems || [])
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Unable to load compliance items. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
    return () => controller.abort()
  }, [])

  const complianceStats = useMemo(() => {
    const total = items.length
    const completed = items.filter((item) => item.status === 'completed').length
    const pending = items.filter((item) => item.status === 'pending').length
    const urgent = items.filter((item) => item.status === 'urgent').length
    const complianceRate = total ? Math.round(((total - urgent) / total) * 100) : 0

    return {
      total,
      completed,
      pending,
      urgent,
      complianceRate,
      trend: 'up',
      trendValue: 4,
    }
  }, [items])

  const upcomingDeadlines = useMemo(
    () => items.filter((item) => item.deadline).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 3),
    [items],
  )

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-eco-500/20 text-eco-400 border-eco-500/30', icon: CheckCircle2, label: 'Completed' }
      case 'ontrack':
        return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Minus, label: 'On Track' }
      case 'pending':
        return { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock, label: 'Pending' }
      case 'urgent':
        return { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle, label: 'Urgent' }
      default:
        return { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: Clock, label: 'Unknown' }
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#0a1f12] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">Compliance Tracker</h1>
            <p className="text-gray-400">Monitor and manage your environmental compliance requirements</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => (window.location.hash = '')} className="text-gray-400 hover:text-eco-400 transition-colors">← Back to Home</Button>
            <Button variant="outline" className="btn-outline"><Bell className="w-4 h-4 mr-2" />Set Reminders</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-primary"><Plus className="w-4 h-4 mr-2" />Add Task</Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0f2e15] border-eco-500/30 text-white max-w-lg">
                <DialogHeader><DialogTitle className="text-xl">Task creation is managed by backend workflows</DialogTitle></DialogHeader>
                <p className="text-sm text-gray-400">Create or update project deadlines from the admin content portal to reflect live compliance tasks here.</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading && <div className="mb-6 flex items-center gap-2 text-gray-300"><Loader2 className="w-5 h-5 animate-spin" /> Loading compliance data...</div>}
        {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">{error}</div>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#0f2e15] border-eco-500/20"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Tasks</p><p className="text-2xl font-heading font-bold text-white">{complianceStats.total}</p></div><div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><FileText className="w-6 h-6 text-blue-400" /></div></div></CardContent></Card>
          <Card className="bg-[#0f2e15] border-eco-500/20"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Completed</p><p className="text-2xl font-heading font-bold text-eco-400">{complianceStats.completed}</p></div><div className="w-12 h-12 rounded-xl bg-eco-500/20 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-eco-400" /></div></div></CardContent></Card>
          <Card className="bg-[#0f2e15] border-eco-500/20"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Pending</p><p className="text-2xl font-heading font-bold text-amber-400">{complianceStats.pending}</p></div><div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center"><Clock className="w-6 h-6 text-amber-400" /></div></div></CardContent></Card>
          <Card className="bg-[#0f2e15] border-eco-500/20"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Urgent</p><p className="text-2xl font-heading font-bold text-red-400">{complianceStats.urgent}</p></div><div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-400" /></div></div></CardContent></Card>
        </div>

        <Card className="bg-[#0f2e15] border-eco-500/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Overall Compliance Rate</h3>
                  <div className="flex items-center gap-2">
                    {complianceStats.trend === 'up' ? <TrendingUp className="w-4 h-4 text-eco-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                    <span className={complianceStats.trend === 'up' ? 'text-eco-400' : 'text-red-400'}>{complianceStats.trend === 'up' ? '+' : '-'}{complianceStats.trendValue}%</span>
                  </div>
                </div>
                <Progress value={complianceStats.complianceRate} className="h-3" />
                <div className="flex justify-between mt-2"><span className="text-gray-400 text-sm">0%</span><span className="text-eco-400 font-bold">{complianceStats.complianceRate}%</span><span className="text-gray-400 text-sm">100%</span></div>
              </div>
              <div className="lg:w-64">
                <h4 className="text-white font-medium mb-3">Upcoming Deadlines</h4>
                <div className="space-y-2">
                  {upcomingDeadlines.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0a1f12] border border-eco-500/10">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300 truncate">{item.title}</span></div>
                      <span className={`text-xs ${item.status === 'urgent' ? 'text-red-400' : 'text-gray-400'}`}>{new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-white">Compliance Tasks</CardTitle>
              <div className="flex gap-3">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-48 bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500" /></div>
                <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-36 bg-[#0a1f12] border-eco-500/30 text-white"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Filter" /></SelectTrigger><SelectContent className="bg-[#0f2e15] border-eco-500/30"><SelectItem value="all">All Status</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="ontrack">On Track</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const statusConfig = getStatusConfig(item.status)
                const StatusIcon = statusConfig.icon
                return (
                  <div key={item.id} onClick={() => setSelectedItem(item)} className="group flex items-center gap-4 p-4 rounded-xl bg-[#0a1f12] border border-eco-500/10 hover:border-eco-500/30 transition-all cursor-pointer">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig.color}`}><StatusIcon className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><h4 className="font-medium text-white truncate">{item.title}</h4><Badge className={statusConfig.color}>{statusConfig.label}</Badge></div><div className="flex items-center gap-4 text-sm text-gray-400"><span>{item.project}</span><span>•</span><span>{item.type}</span><span>•</span><span>Assigned to {item.assignedTo}</span></div></div>
                    <div className="text-right hidden sm:block"><div className={`text-sm font-medium ${item.status === 'urgent' ? 'text-red-400' : 'text-gray-300'}`}>{new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div><div className={`text-xs ${item.daysLeft <= 7 ? 'text-red-400' : 'text-gray-500'}`}>{item.daysLeft === 0 ? 'Due today' : item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} days overdue` : `${item.daysLeft} days left`}</div></div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="ghost" size="sm"><FileText className="w-4 h-4 text-gray-400" /></Button><Button variant="ghost" size="sm"><Download className="w-4 h-4 text-gray-400" /></Button><ChevronRight className="w-5 h-5 text-gray-400" /></div>
                  </div>
                )
              })}
              {!filteredItems.length && !loading && <p className="text-sm text-gray-400">No tasks match your current filters.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
