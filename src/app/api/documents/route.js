import sql from "../utils/sql.js";

export async function GET() {
  try {
    const documents = await sql`
      SELECT d.*, t.title AS task_title
      FROM documents d
      LEFT JOIN tasks t ON d.linked_task_id = t.id
      ORDER BY d.created_at DESC
    `;
    return Response.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return Response.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, document_type = "link", url, subject, linked_task_id } = await request.json();
    if (!title) return Response.json({ error: "Title is required" }, { status: 400 });
    const result = await sql`
      INSERT INTO documents (title, document_type, url, subject, linked_task_id)
      VALUES (${title}, ${document_type}, ${url || null}, ${subject || null}, ${linked_task_id || null})
      RETURNING *
    `;
    return Response.json({ document: result[0] });
  } catch (error) {
    console.error("Error creating document:", error);
    return Response.json({ error: "Failed to create document" }, { status: 500 });
  }
}
