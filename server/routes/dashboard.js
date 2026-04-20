import express from 'express'
import Project from '../models/Project.js'
import Blog from '../models/Blog.js'
import Testimonial from '../models/Testimonial.js'
import Service from '../models/Service.js'

const router = express.Router()

const toDate = (value) => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const getProjectStatus = (projectDate) => {
  const date = toDate(projectDate)
  if (!date) return 'in_progress'

  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'completed'
  if (diffDays <= 14) return 'pending_review'
  return 'in_progress'
}

const buildComplianceStatus = (item) => {
  const isCompleted = Boolean(item.completed || item.completedAt || item.status === 'completed')
  if (isCompleted) return 'completed'

  if (item.daysLeft <= 0) return 'urgent'
  if (item.daysLeft <= 14) return 'pending'
  return 'ontrack'
}

router.get('/stats', async (_req, res) => {
  try {
    const [projectCount, blogCount, testimonialCount, serviceCount] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Testimonial.countDocuments(),
      Service.countDocuments(),
    ])

    res.json({
      projects: projectCount,
      blogs: blogCount,
      testimonials: testimonialCount,
      services: serviceCount,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/portal-data', async (_req, res) => {
  try {
    const [projectsRaw, blogs, testimonials, services] = await Promise.all([
      Project.find().lean(),
      Blog.find().sort({ date: -1 }).lean(),
      Testimonial.find().lean(),
      Service.find().lean(),
    ])

    const projects = projectsRaw.map((project) => {
      const status = getProjectStatus(project.date)
      const date = toDate(project.date)
      const daysLeft = date ? Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0
      const progress = status === 'completed' ? 100 : status === 'pending_review' ? 90 : 60

      return {
        id: project._id.toString(),
        title: project.title || 'Untitled project',
        name: project.title || 'Untitled project',
        type: project.category || 'General',
        category: project.category || 'General',
        location: project.location || 'N/A',
        date: project.date || null,
        status,
        progress,
        daysLeft,
        description: project.description || '',
        completed: Boolean(project.completed || project.completedAt || project.status === 'completed'),
        completedAt: project.completedAt || null,
        sourceStatus: project.status || null,
      }
    })

    const projectTypeMap = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    }, {})

    const projectTypeData = Object.entries(projectTypeMap).map(([name, value], index) => {
      const colors = ['#4ade80', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
      return { name, value, color: colors[index % colors.length] }
    })

    const complianceItems = projects.map((project) => ({
      id: project.id,
      title: `${project.type} Compliance - ${project.name}`,
      type: project.type,
      status: buildComplianceStatus(project),
      deadline: project.date || new Date().toISOString().split('T')[0],
      daysLeft: project.daysLeft,
      project: project.name,
      assignedTo: 'BK Environmental Team',
      description: project.description || 'Compliance task generated from active project.',
    }))

    const complianceStats = {
      total: complianceItems.length,
      completed: complianceItems.filter((item) => item.status === 'completed').length,
      pending: complianceItems.filter((item) => item.status === 'pending').length,
      urgent: complianceItems.filter((item) => item.status === 'urgent').length,
      complianceRate: complianceItems.length
        ? Math.round((complianceItems.filter((item) => item.status !== 'urgent').length / complianceItems.length) * 100)
        : 0,
    }

    const documents = blogs.slice(0, 10).map((blog, index) => ({
      id: blog._id.toString(),
      name: `${blog.title || `Report ${index + 1}`}.txt`,
      size: `${Math.max(1, Math.round((blog.content?.length || 500) / 1024))} KB`,
      date: (blog.date ? new Date(blog.date) : new Date()).toISOString().split('T')[0],
      type: 'Report',
    }))

    const messages = testimonials.slice(0, 10).map((item, index) => ({
      id: item._id.toString(),
      from: item.name || item.company || 'Client',
      message: item.content || 'No message body',
      time: `${index + 1} day${index === 0 ? '' : 's'} ago`,
      unread: index < 2,
    }))

    const recentUsers = testimonials.slice(0, 8).map((item, index) => ({
      id: item._id.toString(),
      name: item.name || `Client ${index + 1}`,
      email: `${(item.name || `client${index + 1}`).replace(/\s+/g, '').toLowerCase()}@example.com`,
      company: item.company || 'BK Client',
      role: 'Client',
      status: index % 3 === 0 ? 'pending' : 'active',
      joined: new Date(Date.now() - index * 86400000 * 20).toISOString().split('T')[0],
    }))

    const now = new Date()
    const revenueData = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const monthlyProjectCount = projects.filter((project) => {
        const projectDate = toDate(project.date)
        return projectDate && projectDate.getMonth() === date.getMonth() && projectDate.getFullYear() === date.getFullYear()
      }).length

      return {
        month: date.toLocaleString('en-US', { month: 'short' }),
        revenue: (monthlyProjectCount || 1) * 1200000,
      }
    })

    const baseStationNames = ['CBD Station', 'Industrial Station', 'Residential Station', 'Regional Station']
    const stationData = projects.slice(0, 4).map((project, index) => {
      const aqi = Math.max(35, Math.min(150, 45 + index * 12 + (project.progress || 0) / 10))
      return {
        id: project.id,
        name: `${project.location || 'City'} ${baseStationNames[index % baseStationNames.length]}`,
        location: project.location || 'Tanzania',
        status: 'online',
        aqi: Math.round(aqi),
        pm25: Math.round(aqi * 0.5),
        pm10: Math.round(aqi * 0.8),
        no2: Math.round(aqi * 0.4),
        o3: Math.round(aqi * 0.3),
        lastUpdate: `${index + 1} min ago`,
      }
    })

    const fallbackStations = stationData.length
      ? stationData
      : [
          {
            id: 'default-station',
            name: 'National Monitoring Station',
            location: 'Tanzania',
            status: 'online',
            aqi: 60,
            pm25: 25,
            pm10: 40,
            no2: 18,
            o3: 20,
            lastUpdate: 'just now',
          },
        ]

    const hourlyData = Array.from({ length: 7 }).map((_, index) => {
      const base = fallbackStations[0].aqi || 60
      return {
        time: `${String(index * 4).padStart(2, '0')}:00`,
        pm25: Math.max(5, Math.round(base * 0.4 + index * 2)),
        pm10: Math.max(10, Math.round(base * 0.7 + index * 2)),
        no2: Math.max(8, Math.round(base * 0.35 + index)),
        so2: Math.max(3, Math.round(base * 0.15 + index)),
      }
    })

    const weeklyData = Array.from({ length: 7 }).map((_, index) => {
      const dayDate = new Date(Date.now() - (6 - index) * 86400000)
      const stationAvg = Math.round(
        fallbackStations.reduce((acc, station) => acc + (station.aqi || 0), 0) / fallbackStations.length,
      )

      return {
        day: dayDate.toLocaleString('en-US', { weekday: 'short' }),
        aqi: Math.max(25, stationAvg + (index - 3) * 3),
      }
    })

    const activeProjects = projects.filter((project) => project.status !== 'completed').length
    const completedProjects = projects.filter((project) => project.status === 'completed').length

    const adminStats = {
      totalUsers: recentUsers.length,
      activeProjects,
      completedProjects,
      pendingConsultations: complianceItems.filter((item) => item.status === 'urgent').length,
      monthlyRevenue: revenueData[revenueData.length - 1]?.revenue || 0,
      revenueGrowth: 8,
    }

    res.json({
      stats: adminStats,
      projects,
      recentProjects: projects.slice(0, 6),
      recentUsers,
      projectTypeData,
      revenueData,
      documents,
      messages,
      complianceItems,
      complianceStats,
      upcomingDeadlines: complianceItems
        .slice(0, 5)
        .map((item) => ({ date: item.deadline, title: item.title, type: item.status })),
      hourlyData,
      weeklyData,
      stationData: fallbackStations,
      services,
      blogs,
      testimonials,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/ai-report', async (req, res) => {
  try {
    const { reportType, projectName, projectLocation, projectDescription } = req.body

    if (!reportType || !projectName) {
      return res.status(400).json({ message: 'reportType and projectName are required.' })
    }

    const [projectCount, serviceCount] = await Promise.all([Project.countDocuments(), Service.countDocuments()])

    const reportId = `${reportType.toUpperCase()}-${new Date().toISOString().slice(0, 10)}-${Math.floor(
      Math.random() * 1000,
    )}`

    const report = `# ${reportType.toUpperCase()} REPORT\n\n## Project Information\n- **Project Name:** ${projectName}\n- **Location:** ${projectLocation || 'Not specified'}\n- **Description:** ${projectDescription || 'Not provided'}\n\n## Operational Context\n- Active projects in platform: ${projectCount}\n- Available environmental services: ${serviceCount}\n\n## Key Recommendations\n1. Maintain a continuous environmental monitoring plan.\n2. Keep regulatory submissions aligned with project milestones.\n3. Archive compliance evidence in the client portal for audit readiness.\n\n---\nGenerated on ${new Date().toISOString()}\nReport ID: ${reportId}`

    return res.json({ report, reportId })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to generate report', error: error.message })
  }
})

export default router
