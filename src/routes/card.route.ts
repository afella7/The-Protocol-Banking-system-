import { Router } from 'express';
import { createVirtualCard, getVirtualCardById } from '../controllers/card.controller';

const router = Router();

router.post('/virtual-cards', createVirtualCard);

router.get('/virtual-cards/:id', getVirtualCardById);

export default router;
