import { useState } from "react";
import { useRouter } from "next/router";

function getBaseUrl(ctx) {
	const host = ctx.req?.headers?.host || "localhost:3000";
	const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
	return `${protocol}://${host}`;
}

export async function getServerSideProps(context) {
	const baseUrl = getBaseUrl(context);
	const { id } = context.params;
	const res = await fetch(`${baseUrl}/api/notes/${id}`);
	if (res.status === 404) return { notFound: true };
	const note = await res.json();
	return { props: { note } };
}

export default function EditNote({ note }) {
	const router = useRouter();
	const [title, setTitle] = useState(note.title);
	const [content, setContent] = useState(note.content);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	async function onSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setError("");
		try {
			const res = await fetch(`/api/notes/${note.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, content }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err?.message || "Failed to update note");
			}
			await router.push(`/notes/${note.id}`);
		} catch (err) {
			setError(err.message);
		} finally {
			setSaving(false);
		}
	}

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 800, margin: "0 auto" }}>
      <h1>Edit Note</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} required />
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}
