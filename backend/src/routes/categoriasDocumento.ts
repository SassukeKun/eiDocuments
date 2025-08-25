import express from 'express';
import { CategoriaDocumentoController } from '../controllers/CategoriaDocumentoController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const categoriaController = new CategoriaDocumentoController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/categorias-documento - Listar categorias
router.get('/', categoriaController.getAll);

// GET /api/categorias-documento/:id - Buscar categoria por ID
router.get('/:id', categoriaController.getById);

// POST /api/categorias-documento - Criar nova categoria (apenas admin)
router.post('/', 
  requireRole('admin'), 
  categoriaController.create
);

// PUT /api/categorias-documento/:id - Atualizar categoria (apenas admin)
router.put('/:id', 
  requireRole('admin'), 
  categoriaController.update
);

// DELETE /api/categorias-documento/:id - Deletar categoria (apenas admin)
router.delete('/:id', 
  requireRole('admin'), 
  categoriaController.delete
);

export default router;
