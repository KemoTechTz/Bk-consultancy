import express from 'express'
import Project from '../models/Project.js'
import Blog from '../models/Blog.js'
import Testimonial from '../models/Testimonial.js'
import Service from '../models/Service.js'
import authenticateAdmin from '../middleware/authenticateAdmin.js'

const router = express.Router()

router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find()
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/projects', authenticateAdmin, async (req, res) => {
  const project = new Project(req.body)
  try {
    const newProject = await project.save()
    res.status(201).json(newProject)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find()
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/blogs', authenticateAdmin, async (req, res) => {
  const blog = new Blog(req.body)
  try {
    const newBlog = await blog.save()
    res.status(201).json(newBlog)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
    res.json(testimonials)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/testimonials', authenticateAdmin, async (req, res) => {
  const testimonial = new Testimonial(req.body)
  try {
    const newTestimonial = await testimonial.save()
    res.status(201).json(newTestimonial)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/services', async (req, res) => {
  try {
    const services = await Service.find()
    res.json(services)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/services', authenticateAdmin, async (req, res) => {
  const service = new Service(req.body)
  try {
    const newService = await service.save()
    res.status(201).json(newService)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
