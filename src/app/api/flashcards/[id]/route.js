import sql from "../../utils/sql.js";

// PUT update flashcard
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { question, answer, mastered } = body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (question !== undefined) {
      updates.push(`question = $${paramCount}`);
      values.push(question);
      paramCount++;
    }

    if (answer !== undefined) {
      updates.push(`answer = $${paramCount}`);
      values.push(answer);
      paramCount++;
    }

    if (mastered !== undefined) {
      updates.push(`mastered = $${paramCount}`);
      values.push(mastered);
      paramCount++;

      if (mastered) {
        updates.push(`last_reviewed = CURRENT_TIMESTAMP`);
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: "No updates provided" }, { status: 400 });
    }

    values.push(id);
    const query = `
      UPDATE flashcards 
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Flashcard not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating flashcard:", error);
    return Response.json(
      { error: "Failed to update flashcard" },
      { status: 500 },
    );
  }
}

// DELETE flashcard
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM flashcards WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Flashcard not found" }, { status: 404 });
    }

    return Response.json({ message: "Flashcard deleted" });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return Response.json(
      { error: "Failed to delete flashcard" },
      { status: 500 },
    );
  }
}
