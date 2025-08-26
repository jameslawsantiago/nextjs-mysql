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

export default function NotePage({ note }) {
  const router = useRouter();
  return (
		<div style={{ padding: 20, fontFamily: "Arial", maxWidth: 800, margin: "0 auto" }}>
			<h1>{note.title}</h1>
			<p>{note.content}</p>
			<div style={{ display: "flex", gap: 8 }}>
				<button onClick={() => router.push(`/notes/${note.id}/edit`)}>Edit</button>
				<button onClick={() => router.back()}>Back</button>
			</div>
		</div>
		);
}
