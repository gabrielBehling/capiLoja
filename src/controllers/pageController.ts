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

export const sellers = (req: Request, res: Response) => {
	res.render('pages/sellers');
};

export const seller = (req: Request, res: Response) => {
	var id = req.params['id'];
	res.render('pages/seller', { id });
};
