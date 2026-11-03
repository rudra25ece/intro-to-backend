import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
} from '../controllers/user.controller.js';

const router = express.Router();

// User Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User retrieval routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
