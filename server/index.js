import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import adminRoutes from './routes/admin.js';
import contentRoutes from './routes/content.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);

const PORT = process.env.PORT || 5000;

// For demo purposes, skip MongoDB connection
console.log('Starting server without MongoDB (demo mode)');

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
