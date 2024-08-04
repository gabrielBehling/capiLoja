import { Router } from 'express';
import { home } from '../controllers/pageController';
import { loginPage, loginUser } from '../controllers/userController';
import { registerPage, registerUser } from '../controllers/userController';

var router = Router();

router.get('/', home);

router.get('/login', loginPage);
router.post('/login', loginUser);

router.get('/register', registerPage);
router.post('/register', registerUser);

export default router;
