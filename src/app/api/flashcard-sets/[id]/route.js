import sql from "../../utils/sql.js";

// GET single flashcard set with all cards
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const set = await sql`
      SELECT * FROM flashcard_sets WHERE id = ${id}
    `;

    if (set.length === 0) {
      return Response.json(
        { error: "Flashcard set not found" },
        { status: 404 },
      );
    }

    const cards = await sql`
      SELECT * FROM flashcards 
      WHERE set_id = ${id}
      ORDER BY created_at ASC
    `;

    return Response.json({
      ...set[0],
      cards,
    });
  } catch (error) {
    console.error("Error fetching flashcard set:", error);
    return Response.json(
      { error: "Failed to fetch flashcard set" },
      { status: 500 },
    );
  }
}

// PUT update flashcard set
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, subject, description } = body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (subject !== undefined) {
      updates.push(`subject = $${paramCount}`);
      values.push(subject);
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (updates.length === 0) {
      return Response.json({ error: "No updates provided" }, { status: 400 });
    }

    values.push(id);
    const query = `
      UPDATE flashcard_sets 
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json(
        { error: "Flashcard set not found" },
        { status: 404 },
      );
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating flashcard set:", error);
    return Response.json(
      { error: "Failed to update flashcard set" },
      { status: 500 },
    );
  }
}

// DELETE flashcard set
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM flashcard_sets WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Flashcard set not found" },
        { status: 404 },
      );
    }

    return Response.json({ message: "Flashcard set deleted" });
  } catch (error) {
    console.error("Error deleting flashcard set:", error);
    return Response.json(
      { error: "Failed to delete flashcard set" },
      { status: 500 },
    );
  }
}
