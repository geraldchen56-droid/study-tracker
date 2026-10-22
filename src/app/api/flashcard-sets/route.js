import sql from "../utils/sql.js";

// GET all flashcard sets
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");

    let sets;
    if (subject) {
      sets = await sql`
        SELECT fs.*, 
          COUNT(f.id) as card_count,
          COUNT(CASE WHEN f.mastered = true THEN 1 END) as mastered_count
        FROM flashcard_sets fs
        LEFT JOIN flashcards f ON fs.id = f.set_id
        WHERE fs.subject = ${subject}
        GROUP BY fs.id
        ORDER BY fs.created_at DESC
      `;
    } else {
      sets = await sql`
        SELECT fs.*, 
          COUNT(f.id) as card_count,
          COUNT(CASE WHEN f.mastered = true THEN 1 END) as mastered_count
        FROM flashcard_sets fs
        LEFT JOIN flashcards f ON fs.id = f.set_id
        GROUP BY fs.id
        ORDER BY fs.created_at DESC
      `;
    }

    return Response.json(sets);
  } catch (error) {
    console.error("Error fetching flashcard sets:", error);
    return Response.json(
      { error: "Failed to fetch flashcard sets" },
      { status: 500 },
    );
  }
}

// POST create new flashcard set
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subject, description } = body;

    if (!title || !subject) {
      return Response.json(
        { error: "Title and subject are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO flashcard_sets (title, subject, description)
      VALUES (${title}, ${subject}, ${description || null})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating flashcard set:", error);
    return Response.json(
      { error: "Failed to create flashcard set" },
      { status: 500 },
    );
  }
}
