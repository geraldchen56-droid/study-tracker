import sql from "../utils/sql.js";

export async function GET(request) {
  try {
    const deadlines = await sql`
      SELECT * FROM deadlines 
      ORDER BY due_date ASC
    `;

    return Response.json({ deadlines });
  } catch (error) {
    console.error("Error fetching deadlines:", error);
    return Response.json(
      { error: "Failed to fetch deadlines" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      due_date,
      deadline_type,
      subject,
      what_to_do,
      what_to_study,
    } = body;

    if (!title || !due_date || !deadline_type || !subject) {
      return Response.json(
        { error: "Title, due date, type, and subject are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO deadlines (title, due_date, deadline_type, subject, what_to_do, what_to_study)
      VALUES (${title}, ${due_date}, ${deadline_type}, ${subject}, ${what_to_do || ""}, ${what_to_study || ""})
      RETURNING *
    `;

    return Response.json({ deadline: result[0] });
  } catch (error) {
    console.error("Error creating deadline:", error);
    return Response.json(
      { error: "Failed to create deadline" },
      { status: 500 },
    );
  }
}
