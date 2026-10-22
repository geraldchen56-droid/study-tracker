import sql from "../../utils/sql.js";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const setClauses = [];
    const values = [];
    let paramCount = 1;

    if (body.subject !== undefined) {
      setClauses.push(`subject = $${paramCount}`);
      values.push(body.subject);
      paramCount++;
    }
    if (body.title !== undefined) {
      setClauses.push(`title = $${paramCount}`);
      values.push(body.title);
      paramCount++;
    }
    if (body.description !== undefined) {
      setClauses.push(`description = $${paramCount}`);
      values.push(body.description);
      paramCount++;
    }
    if (body.status !== undefined) {
      setClauses.push(`status = $${paramCount}`);
      values.push(body.status);
      paramCount++;
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const setClause = setClauses.join(", ");

    const result = await sql(
      `UPDATE tasks SET ${setClause} WHERE id = $${paramCount} RETURNING *`,
      values,
    );

    if (result.length === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json({ task: result[0] });
  } catch (error) {
    console.error("Error updating task:", error);
    return Response.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM tasks WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
