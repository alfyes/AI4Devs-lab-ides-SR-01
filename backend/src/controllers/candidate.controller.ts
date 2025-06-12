import { Request, Response } from 'express';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';
import prisma from '../lib/prisma';

// Esquema de validación con Zod
const candidateSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  address: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
});

export const createCandidate = async (req: Request, res: Response) => {
  try {
    // Validar datos del formulario
    const validatedData = candidateSchema.parse(req.body);

    // Manejar la carga del archivo CV
    let cvUrl = null;
    if (req.file) {
      const uploadDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      
      fs.writeFileSync(filePath, req.file.buffer);
      cvUrl = `/uploads/${fileName}`;
    }

    // Crear el candidato en la base de datos
    const candidate = await prisma.candidate.create({
      data: {
        ...validatedData,
        cvUrl,
      },
    });

    logger.info(`Candidato creado exitosamente: ${candidate.id}`);
    
    return res.status(201).json({
      success: true,
      id: candidate.id,
    });
  } catch (error) {
    logger.error('Error al crear candidato:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Datos de validación inválidos',
        details: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
}; 