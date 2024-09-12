import bcrypt from "bcrypt";
import { getDatabase } from "../database/database";

export async function checkUser(username, password): Promise<boolean> {
	let db = await getDatabase();
	let res =
		await db.query`select ClientName, passwordHash from Client where UserName=${username}`;
	if (!res.recordset.length) {
		return false;
	}

	let hash = res.recordset[0].passwordHash;
	return await bcrypt.compare(password, hash);
}
