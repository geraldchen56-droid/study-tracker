import sql from "../../utils/sql.js";

export async function PUT(request, { params }) {
  try {
    const { title, document_type, url, subject, linked_task_id } = await request.json();
    const result = await sql`
      UPDATE documents SET
        title = COALESCE(${title ?? null}, title),
        document_type = COALESCE(${document_type ?? null}, document_type),
        url = ${url || null},
        subject = ${subject || null},
        linked_task_id = ${linked_task_id || null}
      WHERE id = ${params.id}
      RETURNING *
    `;
    if (result.length === 0) return Response.json({ error: "Document not found" }, { status: 404 });
    return Response.json({ document: result[0] });
  } catch (error) {
    console.error("Error updating document:", error);
    return Response.json({ error: "Failed to update document" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const result = await sql`DELETE FROM documents WHERE id = ${params.id} RETURNING *`;
    if (result.length === 0) return Response.json({ error: "Document not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return Response.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
