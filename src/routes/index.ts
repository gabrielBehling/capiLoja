import { Router } from 'express';
import { getHome } from '../controllers/pageController';
import { getLogin, postLogin } from '../controllers/userController';
import { getRegister, postRegister } from '../controllers/userController';

var router = Router();

router.get('/', getHome);

router.get('/login', getLogin);
router.post('/login', postLogin);

router.get('/register', getRegister);
router.post('/register', postRegister);

export default router;
