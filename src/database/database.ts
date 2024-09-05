var sql = require("mssql");

sql.on("error", (err) => {
	console.log(err);
});

const config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER,
	database: process.env.DB_DATABASE,
	options: {
		encrypt: true, // for azure
		trustServerCertificate: true, // change to true for local dev / self-signed certs
	},
};

export async function getDatabase() {
	if (pool) {
		return await pool.connect();
	}
	var pool = new sql.ConnectionPool(config);
	return await pool.connect();
}
