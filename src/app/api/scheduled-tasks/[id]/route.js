import sql from "../../utils/sql.js";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const fields = [];
    const values = [];
    let paramCount = 1;

    if (body.scheduled_date !== undefined) {
      fields.push(`scheduled_date = $${paramCount}`);
      values.push(body.scheduled_date);
      paramCount++;
    }

    if (body.start_time !== undefined) {
      fields.push(`start_time = $${paramCount}`);
      values.push(body.start_time);
      paramCount++;
    }

    if (body.duration !== undefined) {
      fields.push(`duration = $${paramCount}`);
      values.push(body.duration);
      paramCount++;
    }

    if (body.status !== undefined) {
      fields.push(`status = $${paramCount}`);
      values.push(body.status);
      paramCount++;
    }

    if (fields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const query = `
      UPDATE scheduled_tasks
      SET ${fields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json(
        { error: "Scheduled task not found" },
        { status: 404 },
      );
    }

    return Response.json({ scheduledTask: result[0] });
  } catch (error) {
    console.error("Error updating scheduled task:", error);
    return Response.json(
      { error: "Failed to update scheduled task" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const query = `DELETE FROM scheduled_tasks WHERE id = $1 RETURNING *`;
    const result = await sql(query, [id]);

    if (result.length === 0) {
      return Response.json(
        { error: "Scheduled task not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting scheduled task:", error);
    return Response.json(
      { error: "Failed to delete scheduled task" },
      { status: 500 },
    );
  }
}
