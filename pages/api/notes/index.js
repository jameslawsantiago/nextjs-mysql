/* import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
	try {
		if (req.method === "GET") {
			const notes = await prisma.note.findMany({ orderBy: { id: "asc" } });
			return res.status(200).json(notes);
		}
		if (req.method === "POST") {
			const { title, content } = req.body || {};
			if (!title || !content) return res.status(400).json({ message: "Title and content are required" });
			const created = await prisma.note.create({ data: { title, content } });
			return res.status(201).json(created);
		}
		res.setHeader("Allow", ["GET", "POST"]);
		return res.status(405).json({ message: "Method Not Allowed" });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
} */


import mysql from "mysql2/promise";

export default async function handler(req, res) {
	try {
		const connection = await mysql.createConnection({
			host: "localhost",    // your MySQL host
			user: "root",         // your MySQL user
			password: "",         // your MySQL password
			database: "notesdb", // your database name
		});

		if (req.method === "GET") {
			const [rows] = await connection.query("SELECT * FROM note ORDER BY ID ASC");
			await connection.end();
			return res.status(200).json(rows);
		}

		if (req.method === "POST") {
			const { title, content } = req.body || {};
			if (!title || !content) {
				await connection.end();
				return res.status(400).json({ message: "Title and content are required" });
			}

			const [result] = await connection.query(
				"INSERT INTO note (title, content) VALUES (?, ?)",
				[title, content]
			);

			const [created] = await connection.query("SELECT * FROM note WHERE ID = ?", [result.insertId]);
			await connection.end();

			return res.status(201).json(created[0]);
		}

		res.setHeader("Allow", ["GET", "POST"]);
		await connection.end();
		return res.status(405).json({ message: "Method Not Allowed" });
	}
	catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
}
