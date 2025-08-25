import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './src/config/database';
import { errorHandler } from './src/middleware/errorHandler.js';

// Importar rotas
import documentosRoutes from './src/routes/documentos.js';
import departamentosRoutes from './src/routes/departamentos.js';
import tiposDocumentoRoutes from './src/routes/tiposDocumento.js';
import categoriasDocumentoRoutes from './src/routes/categoriasDocumento.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Sistema de Documentos eiDocuments',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/documentos', documentosRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/tipos-documento', tiposDocumentoRoutes);
app.use('/api/categorias-documento', categoriasDocumentoRoutes);

// Middleware de tratamento de erros (deve vir por último)
app.use(errorHandler);

// Inicializar servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await connectDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📄 Documentação: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();