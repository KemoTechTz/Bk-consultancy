import express from 'express';

const router = express.Router();

// In-memory data for demo
let projects = [
  {
    _id: '1',
    title: 'Dodoma Industrial Park EIA',
    description: 'Comprehensive EIA study for a new industrial park development, ensuring full NEMC compliance and sustainable design recommendations.',
    image: '/images/project-industrial.jpg',
    link: '#',
    location: 'Dodoma, Tanzania',
    date: '2024',
    category: 'Environmental Impact Assessment',
    outcomes: ['EIA Certificate obtained within 90 days', '15 mitigation measures implemented', 'Zero environmental incidents during construction']
  }
];

let blogs = [
  {
    _id: '1',
    title: 'Understanding NEMC Certification Requirements in Tanzania',
    content: 'A comprehensive guide to obtaining NEMC certification for your environmental projects, including step-by-step procedures and documentation requirements.',
    date: new Date(),
    author: 'BK Environmental Team'
  }
];

let testimonials = [
  {
    _id: '1',
    name: 'Baraka Maleka',
    content: 'BK Environmental transformed our compliance process. Their team of NEMC-certified experts guided us through every step of the EIA process, and we obtained our certificate ahead of schedule. Highly recommended!',
    company: 'Maleka Industries'
  }
];

let services = [
  {
    _id: '1',
    name: 'Environmental Impact Assessment',
    description: 'Comprehensive EIA studies for NEMC compliance. We evaluate potential environmental impacts of your projects and provide mitigation strategies.'
  }
];

// Projects CRUD
router.get('/projects', (req, res) => res.json(projects));
router.post('/projects', (req, res) => {
  const newProject = { ...req.body, _id: Date.now().toString() };
  projects.push(newProject);
  res.json(newProject);
});

// Blogs CRUD
router.get('/blogs', (req, res) => res.json(blogs));
router.post('/blogs', (req, res) => {
  const newBlog = { ...req.body, _id: Date.now().toString() };
  blogs.push(newBlog);
  res.json(newBlog);
});

// Testimonials CRUD
router.get('/testimonials', (req, res) => res.json(testimonials));
router.post('/testimonials', (req, res) => {
  const newTestimonial = { ...req.body, _id: Date.now().toString() };
  testimonials.push(newTestimonial);
  res.json(newTestimonial);
});

// Services CRUD
router.get('/services', (req, res) => res.json(services));
router.post('/services', (req, res) => {
  const newService = { ...req.body, _id: Date.now().toString() };
  services.push(newService);
  res.json(newService);
});

export default router;
