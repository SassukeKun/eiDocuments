import express from 'express';
import { TipoDocumentoController } from '../controllers/TipoDocumentoController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const tipoDocumentoController = new TipoDocumentoController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/tipos-documento - Listar tipos de documento
router.get('/', tipoDocumentoController.getAll);

// GET /api/tipos-documento/:id - Buscar tipo por ID
router.get('/:id', tipoDocumentoController.getById);

// POST /api/tipos-documento - Criar novo tipo (apenas admin)
router.post('/', 
  requireRole('admin'), 
  tipoDocumentoController.create
);

// PUT /api/tipos-documento/:id - Atualizar tipo (apenas admin)
router.put('/:id', 
  requireRole('admin'), 
  tipoDocumentoController.update
);

// DELETE /api/tipos-documento/:id - Deletar tipo (apenas admin)
router.delete('/:id', 
  requireRole('admin'), 
  tipoDocumentoController.delete
);

export default router;
