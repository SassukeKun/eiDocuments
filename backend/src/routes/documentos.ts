import express from 'express';
import { DocumentoController } from '../controllers/DocumentoController.js';
import { authenticateToken, requireRole, requirePermission } from '../middleware/auth.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateDocumento, validateQueryParams } from '../middleware/validation.js';

const router = express.Router();
const documentoController = new DocumentoController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/documentos - Listar documentos com paginação e filtros
router.get('/', validateQueryParams, documentoController.getAll);

// GET /api/documentos/:id - Buscar documento por ID
router.get('/:id', documentoController.getById);

// GET /api/documentos/departamento/:departamentoId - Buscar por departamento
router.get('/departamento/:departamentoId', validateQueryParams, documentoController.getByDepartamento);

// GET /api/documentos/tipo/:tipoId - Buscar por tipo
router.get('/tipo/:tipoId', validateQueryParams, documentoController.getByTipo);

// POST /api/documentos - Criar novo documento (requer role admin ou editor)
router.post('/', 
  requireRole(['admin', 'editor']),
  validateDocumento,
  documentoController.create
);

// PUT /api/documentos/:id - Atualizar documento (requer role admin ou editor)
router.put('/:id', 
  requireRole(['admin', 'editor']),
  validateDocumento,
  documentoController.update
);

// POST /api/documentos/:id/upload - Upload de arquivo (requer permissão específica)
router.post('/:id/upload',
  requirePermission(['document:upload']),
  upload.single('file'),
  documentoController.uploadFile
);

// DELETE /api/documentos/:id - Deletar documento (apenas admin)
router.delete('/:id', 
  requireRole('admin'), 
  documentoController.delete
);

export default router;
