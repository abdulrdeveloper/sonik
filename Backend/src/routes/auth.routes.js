import express from 'express';
import { registerUser, loginUser, logoutUser, checkUsername, getCurrentUser } from '../controllers/auth.controller.js';
import authCheck from '../middlewares/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);
authRoutes.post('/logout', logoutUser);
authRoutes.get('/check-username', checkUsername);
authRoutes.get('/me', authCheck, getCurrentUser);

export default authRoutes;
