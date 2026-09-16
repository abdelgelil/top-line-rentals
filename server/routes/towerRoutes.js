import express from 'express';
import { getTowers, getTowerById } from '../controllers/towerController.js';

const router = express.Router();

router.get('/', getTowers);
router.get('/:id', getTowerById);

export default router;