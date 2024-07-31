import { Router } from 'express';
import { products, product } from '../controllers/pageController';

var router = Router();

router.get('/', products);
router.get('/:id', product);

export default router;
