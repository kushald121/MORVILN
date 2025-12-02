import { Router } from 'express';
import HeroController from '../controllers/hero.controller';

const router = Router();

// Public routes - Get hero images
router.get('/', HeroController.getHeroImages);
router.get('/:id', HeroController.getHeroImage);

export default router;
