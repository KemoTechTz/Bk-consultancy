import express from 'express';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Testimonial from '../models/Testimonial.js';
import Service from '../models/Service.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const [projectCount, blogCount, testimonialCount, serviceCount] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Testimonial.countDocuments(),
      Service.countDocuments()
    ]);

    res.json({
      projects: projectCount,
      blogs: blogCount,
      testimonials: testimonialCount,
      services: serviceCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
