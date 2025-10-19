import { Router } from 'express';
import magicLinkController from '../controllers/magicLink.controller';

const router = Router();

router.post('/send', magicLinkController.sendMagicLink);
router.post('/verify', magicLinkController.verifyMagicLink);
router.post('/verify-otp', magicLinkController.verifyOTP);

export default router;