import express from 'express';
import multer from 'multer';
import path from 'path';
import candidateRoutes from './routes/candidate.routes';
import { logger } from './utils/logger';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/candidates', candidateRoutes);

// Manejador de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

export { app }; 