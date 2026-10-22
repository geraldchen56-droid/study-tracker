import sql from "../utils/sql.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let query;
    if (date) {
      query = `
        SELECT st.*, t.title, t.subject, t.description, t.completed
        FROM scheduled_tasks st
        JOIN tasks t ON st.task_id = t.id
        WHERE st.scheduled_date = $1
        ORDER BY st.start_time ASC
      `;
      const scheduledTasks = await sql(query, [date]);
      return Response.json({ scheduledTasks });
    } else {
      // Get all upcoming scheduled tasks
      query = `
        SELECT st.*, t.title, t.subject, t.description, t.completed
        FROM scheduled_tasks st
        JOIN tasks t ON st.task_id = t.id
        WHERE st.scheduled_date >= CURRENT_DATE
        AND st.status != 'completed'
        ORDER BY st.scheduled_date ASC, st.start_time ASC
        LIMIT 50
      `;
      const scheduledTasks = await sql(query, []);
      return Response.json({ scheduledTasks });
    }
  } catch (error) {
    console.error("Error fetching scheduled tasks:", error);
    return Response.json(
      { error: "Failed to fetch scheduled tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { task_id, scheduled_date, start_time, duration } = body;

    if (!task_id || !scheduled_date || !start_time || !duration) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const query = `
      INSERT INTO scheduled_tasks (task_id, scheduled_date, start_time, duration, status)
      VALUES ($1, $2, $3, $4, 'scheduled')
      RETURNING *
    `;

    const result = await sql(query, [
      task_id,
      scheduled_date,
      start_time,
      duration,
    ]);

    return Response.json({ scheduledTask: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating scheduled task:", error);
    return Response.json(
      { error: "Failed to create scheduled task" },
      { status: 500 },
    );
  }
}
