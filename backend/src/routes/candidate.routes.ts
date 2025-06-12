import { Router } from 'express';
import multer from 'multer';
import { createCandidate } from '../controllers/candidate.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('cv'), createCandidate);

export default router; 