import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { getDatabase } from "../database/database";

export const loginPage = (req: Request, res: Response) => {
	res.render("pages/login");
};

export const loginUser = async (req: Request, res: Response) => {
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

export const registerPage = (req: Request, res: Response) => {
	res.render("pages/register");
};

export const registerUser = (req: Request, res: Response) => {
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

async function checkUser(username, password): Promise<boolean> {
	let db = await getDatabase();
	let res =
		await db.query`select ClientName, passwordHash from Client where UserName=${username}`;
	if (!res.recordset.length) {
		return false;
	}

	let hash = res.recordset[0].passwordHash;
	return await bcrypt.compare(password, hash);
}
