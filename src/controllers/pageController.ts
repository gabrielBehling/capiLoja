import { Request, Response } from 'express';

export const home = (req: Request, res: Response) => {
	res.render('pages/home');
};

export const products = (req: Request, res: Response) => {
	res.render('pages/products');
};

export const product = (req: Request, res: Response) => {
	var id = req.params['id'];
	res.render('pages/product', { id });
};
