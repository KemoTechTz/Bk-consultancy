import jwt from 'jsonwebtoken'

export default function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.adminId = decoded.id
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid token.' })
  }
}
