import mysql from "mysql2/promise";

export async function getConnection() {
	const connection = await mysql.createConnection({
		host: "localhost",    // your MySQL host
		user: "root",         // your MySQL user
		password: "",         // your MySQL password
		database: "notesdb", // your database name
	});
	return connection;
}
