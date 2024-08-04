import { Request, Response } from 'express';

export const loginPage = (req: Request, res: Response) => {
	res.render('pages/login');
};

export const loginUser = (req: Request, res: Response) => {
	let { username, password } = req.body;
	res.cookie('username', username, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
	});
	res.cookie('password', password, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
	});
	res.redirect('/');
};

export const registerPage = (req: Request, res: Response) => {
	res.render('pages/register');
};

export const registerUser = (req: Request, res: Response) => {
	let { username, password } = req.body;
	res.cookie('username', username, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
	});
	res.cookie('password', password, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
	});
	res.redirect('/');
};
