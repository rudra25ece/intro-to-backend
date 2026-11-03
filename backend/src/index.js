import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Built-in Middleware for parsing JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root / Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Backend API is running successfully!',
    documentation: {
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id',
      },
      posts: {
        create: 'POST /api/posts',
        getAll: 'GET /api/posts',
        getById: 'GET /api/posts/:id',
        update: 'PUT /api/posts/:id',
        delete: 'DELETE /api/posts/:id',
      },
    },
  });
});

// Mount modular API routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

export default app;
