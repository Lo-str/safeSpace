import { Router, type Response } from 'express';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res: Response) => {
  const profile = (req as any).auth?.payload ?? {};
  return res.json({
    message: 'Authenticated profile access',
    profile,
  });
});

router.post('/', (req, res: Response) => {
  const profileData = (req as any).body;
  return res.status(201).json({
    message: 'Profile saved successfully',
    profile: profileData,
  });
});

export default router;
