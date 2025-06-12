import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { app } from './app';
import { logger } from './utils/logger';

dotenv.config();
const prisma = new PrismaClient();

export default prisma;

const PORT = process.env.PORT || 3010;

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});
