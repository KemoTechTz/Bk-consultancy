import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import authenticateAdmin from '../middleware/authenticateAdmin.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' })
    }

    const admin = await Admin.findOne({ username })
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return res.json({ token })
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message })
  }
})

router.post(
  '/register',
  async (req, res, next) => {
    try {
      const adminCount = await Admin.countDocuments()

      if (adminCount === 0) {
        return next()
      }

      return authenticateAdmin(req, res, next)
    } catch (error) {
      return res.status(500).json({ message: 'Unable to validate admin bootstrap state.', error: error.message })
    }
  },
  async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' })
      }

      const existingAdmin = await Admin.findOne({ username })
      if (existingAdmin) {
        return res.status(409).json({ message: 'Username is already taken.' })
      }

      const hash = await bcrypt.hash(password, 10)
      const admin = new Admin({ username, password: hash })
      await admin.save()

      return res.status(201).json({ message: 'Admin created' })
    } catch (error) {
      return res.status(500).json({ message: 'Admin creation failed.', error: error.message })
    }
  },
)

export default router
