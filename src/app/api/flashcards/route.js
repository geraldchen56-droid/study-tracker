import sql from "../utils/sql.js";

// POST create new flashcard
export async function POST(request) {
  try {
    const body = await request.json();
    const { setId, question, answer } = body;

    if (!setId || !question || !answer) {
      return Response.json(
        { error: "Set ID, question, and answer are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO flashcards (set_id, question, answer)
      VALUES (${setId}, ${question}, ${answer})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return Response.json(
      { error: "Failed to create flashcard" },
      { status: 500 },
    );
  }
}
