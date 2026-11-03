import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';

const router = express.Router();

/**
 * Routes for /api/posts
 *
 * Full CRUD operations:
 * - POST   /api/posts      -> Create a new post
 * - GET    /api/posts      -> Get all posts
 * - GET    /api/posts/:id  -> Get a specific post by ID
 * - PUT    /api/posts/:id  -> Update an existing post by ID
 * - DELETE /api/posts/:id  -> Delete a post by ID
 */
router.route('/').post(createPost).get(getAllPosts);
router.route('/:id').get(getPostById).put(updatePost).delete(deletePost);

export default router;
