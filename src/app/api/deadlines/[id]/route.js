import sql from "../../utils/sql.js";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const setClauses = [];
    const values = [];
    let paramCount = 1;

    if (body.title !== undefined) {
      setClauses.push(`title = $${paramCount}`);
      values.push(body.title);
      paramCount++;
    }
    if (body.due_date !== undefined) {
      setClauses.push(`due_date = $${paramCount}`);
      values.push(body.due_date);
      paramCount++;
    }
    if (body.deadline_type !== undefined) {
      setClauses.push(`deadline_type = $${paramCount}`);
      values.push(body.deadline_type);
      paramCount++;
    }
    if (body.subject !== undefined) {
      setClauses.push(`subject = $${paramCount}`);
      values.push(body.subject);
      paramCount++;
    }
    if (body.what_to_do !== undefined) {
      setClauses.push(`what_to_do = $${paramCount}`);
      values.push(body.what_to_do);
      paramCount++;
    }
    if (body.what_to_study !== undefined) {
      setClauses.push(`what_to_study = $${paramCount}`);
      values.push(body.what_to_study);
      paramCount++;
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const setClause = setClauses.join(", ");

    const result = await sql(
      `UPDATE deadlines SET ${setClause} WHERE id = $${paramCount} RETURNING *`,
      values,
    );

    if (result.length === 0) {
      return Response.json({ error: "Deadline not found" }, { status: 404 });
    }

    return Response.json({ deadline: result[0] });
  } catch (error) {
    console.error("Error updating deadline:", error);
    return Response.json(
      { error: "Failed to update deadline" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM deadlines WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Deadline not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting deadline:", error);
    return Response.json(
      { error: "Failed to delete deadline" },
      { status: 500 },
    );
  }
}
