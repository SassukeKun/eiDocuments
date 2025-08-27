import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Rotas públicas
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Rotas protegidas (precisam de autenticação)
router.get('/me', authenticate, AuthController.me);
router.post('/logout', authenticate, AuthController.logout);
router.put('/change-password', authenticate, AuthController.changePassword);

export default router;
