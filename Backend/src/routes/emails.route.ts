import { Router } from 'express';
import { sendRegisterOpeningEmail, sendClosingEmail } from '../controllers/emails.controller';

const router = Router();

router.post('/send-opening-email', sendRegisterOpeningEmail);
router.post('/send-closing-email', sendClosingEmail);

export default router;