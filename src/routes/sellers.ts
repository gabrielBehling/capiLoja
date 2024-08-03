import { Router } from 'express';
import { sellers, seller } from '../controllers/pageController';

var router = Router();

router.get('/', sellers);
router.get('/:id', seller);

export default router;
