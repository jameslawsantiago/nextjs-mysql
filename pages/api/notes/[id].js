/* import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
	const id = parseInt(req.query.id, 10);
	if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
	try {
		if (req.method === "GET") {
			const note = await prisma.note.findUnique({ where: { id } });
			if (!note) return res.status(404).json({ message: "Not found" });
			return res.status(200).json(note);
		}
		if (req.method === "PUT") {
			const { title, content } = req.body || {};
			if (!title || !content) return res.status(400).json({ message: "Title and content are required" });
			const updated = await prisma.note.update({ where: { id }, data: { title, content } });
			return res.status(200).json(updated);
		}
		if (req.method === "DELETE") {
			await prisma.note.delete({ where: { id } });
			return res.status(204).end();
		}
		res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
		return res.status(405).json({ message: "Method Not Allowed" });
	} catch (e) {
		if (e.code === "P2025") {
			return res.status(404).json({ message: "Not found" });
		}
		console.error(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
}
 */

// pages/api/notes/[id].js
import mysql from "mysql2/promise";

export default async function handler(req, res) {
	let connection;
	try {
		/* connection = await mysql.createConnection({
			host: process.env.DB_HOST || "localhost",
			user: process.env.DB_USER || "root",
			password: process.env.DB_PASS || "",
			database: process.env.DB_NAME || "testdb",
		}); */

		const connection = await mysql.createConnection({
			host: "localhost",    // your MySQL host
			user: "root",         // your MySQL user
			password: "",         // your MySQL password
			database: "notesdb", // your database name
		});

		const { id } = req.query;

		// GET: fetch single note
		if (req.method === "GET") {
			const [rows] = await connection.execute("SELECT * FROM note WHERE id = ?", [id]);
			if (rows.length === 0) return res.status(404).json({ message: "Note not found" });
			return res.status(200).json(rows[0]);
		}

		// PUT: update note
		if (req.method === "PUT") {
			const { title, content } = req.body || {};
			if (!title || !content) return res.status(400).json({ message: "Title and content are required" });

			const [result] = await connection.execute(
				"UPDATE note SET title = ?, content = ? WHERE id = ?",
				[title, content, id]
			);

			if (result.affectedRows === 0) return res.status(404).json({ message: "Note not found" });

			return res.status(200).json({ id, title, content });
		}

		// DELETE: remove note
		if (req.method === "DELETE") {
			const [result] = await connection.execute("DELETE FROM note WHERE id = ?", [id]);
			if (result.affectedRows === 0) return res.status(404).json({ message: "Note not found" });
			return res.status(200).json({ message: "Note deleted" });
		}

		res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
		return res.status(405).json({ message: "Method Not Allowed" });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal Server Error" });
	} finally {
		if (connection) await connection.end();
	}
}
