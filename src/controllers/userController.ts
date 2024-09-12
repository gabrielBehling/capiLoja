import { Request, Response } from "express";
import { checkUser } from "../models/User"

export const getLogin = (req: Request, res: Response) => {
	res.render("pages/login");
};

export const postLogin = async (req: Request, res: Response) => {
	let { username, password } = req.body;

	let validatedUser = await checkUser(username, password);
	if (!validatedUser) {
		console.log("n passou");
		return;
	}

	res.cookie("username", username, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
	});
	res.cookie("password", password, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
	});

	res.redirect("/");
};

export const getRegister = (req: Request, res: Response) => {
	res.render("pages/register");
};

export const postRegister = (req: Request, res: Response) => {
	let { username, password } = req.body;
	res.cookie("username", username, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
	});
	res.cookie("password", password, {
		maxAge: 1000 * 60 * 60 * 24 * 30,
		httpOnly: true,
	});
	res.redirect("/");
};