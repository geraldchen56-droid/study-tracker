import sql from "../../utils/sql.js";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const setClauses = [];
    const values = [];
    let paramCount = 1;

    if (body.study_date !== undefined) {
      setClauses.push(`study_date = $${paramCount}`);
      values.push(body.study_date);
      paramCount++;
    }
    if (body.time_done !== undefined) {
      setClauses.push(`time_done = $${paramCount}`);
      values.push(body.time_done);
      paramCount++;
    }
    if (body.purpose !== undefined) {
      setClauses.push(`purpose = $${paramCount}`);
      values.push(body.purpose);
      paramCount++;
    }
    if (body.subject !== undefined) {
      setClauses.push(`subject = $${paramCount}`);
      values.push(body.subject);
      paramCount++;
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const setClause = setClauses.join(", ");

    const result = await sql(
      `UPDATE study_sessions SET ${setClause} WHERE id = $${paramCount} RETURNING *`,
      values,
    );

    if (result.length === 0) {
      return Response.json(
        { error: "Study session not found" },
        { status: 404 },
      );
    }

    return Response.json({ session: result[0] });
  } catch (error) {
    console.error("Error updating study session:", error);
    return Response.json(
      { error: "Failed to update study session" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM study_sessions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Study session not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting study session:", error);
    return Response.json(
      { error: "Failed to delete study session" },
      { status: 500 },
    );
  }
}
