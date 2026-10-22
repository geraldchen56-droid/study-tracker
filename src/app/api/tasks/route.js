import sql from "../utils/sql.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");

    let tasks;
    if (subject) {
      tasks = await sql`
        SELECT * FROM tasks 
        WHERE subject = ${subject}
        ORDER BY created_at DESC
      `;
    } else {
      tasks = await sql`
        SELECT * FROM tasks 
        ORDER BY created_at DESC
      `;
    }

    return Response.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { subject, title, description, status = "todo" } = body;

    if (!subject || !title) {
      return Response.json(
        { error: "Subject and title are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO tasks (subject, title, description, status)
      VALUES (${subject}, ${title}, ${description || ""}, ${status})
      RETURNING *
    `;

    return Response.json({ task: result[0] });
  } catch (error) {
    console.error("Error creating task:", error);
    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
