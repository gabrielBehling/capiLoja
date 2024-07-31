import { Router } from 'express';

var router = Router();

router.get('/', (req, res) => {
	res.send('Running');
});

export default router;
