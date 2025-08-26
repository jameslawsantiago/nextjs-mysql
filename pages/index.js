import Link from "next/link";
import { useState } from "react";

function getBaseUrl(ctx) {
	const host = ctx.req?.headers?.host || "localhost:3000";
	const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
	return `${protocol}://${host}`;
}

export async function getServerSideProps(context) {
	const baseUrl = getBaseUrl(context);
	const res = await fetch(`${baseUrl}/api/notes`);
	const initialNotes = await res.json();
	return { props: { initialNotes } };
}

export default function Home({ initialNotes }) {
	const [notes, setNotes] = useState(initialNotes);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function addNote(e) {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const res = await fetch("/api/notes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, content }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err?.message || "Failed to create note");
			}
			const newNote = await res.json();
			setNotes([...notes, newNote]);
			setTitle("");
			setContent("");
		}
		catch (err) {
			setError(err.message);
		}
		finally {
			setLoading(false);
		}
	}

	async function deleteNote(id) {
		if (!confirm("Delete this note?")) return;
		const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
		if (res.ok) {
			setNotes(notes.filter((n) => n.id !== id));
		}else {
			alert("Failed to delete");
		}
	}

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1>Notes</h1>

      <form
        onSubmit={addNote}
        style={{ display: "grid", gap: 8, marginBottom: 20 }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Note"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {notes.map((note) => (
          <li
            key={note.id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link href={`/notes/${note.id}`}>
                <strong>{note.title}</strong>
              </Link>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href={`/notes/${note.id}/edit`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            </div>
            <p style={{ marginTop: 8 }}>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
