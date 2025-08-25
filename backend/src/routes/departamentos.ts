import express from 'express';
import { DepartamentoController } from '../controllers/DepartamentoController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const departamentoController = new DepartamentoController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/departamentos - Listar departamentos
router.get('/', departamentoController.getAll);

// GET /api/departamentos/:id - Buscar departamento por ID
router.get('/:id', departamentoController.getById);

// POST /api/departamentos - Criar novo departamento (apenas admin)
router.post('/', 
  requireRole('admin'), 
  departamentoController.create
);

// PUT /api/departamentos/:id - Atualizar departamento (apenas admin)
router.put('/:id', 
  requireRole('admin'), 
  departamentoController.update
);

// DELETE /api/departamentos/:id - Deletar departamento (apenas admin)
router.delete('/:id', 
  requireRole('admin'), 
  departamentoController.delete
);

export default router;
