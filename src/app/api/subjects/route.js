import sql from "../utils/sql.js";

export async function GET(request) {
  try {
    // Get unique subjects from study_sessions
    const subjects = await sql`
      SELECT DISTINCT subject FROM study_sessions
      ORDER BY subject ASC
    `;

    return Response.json({ subjects: subjects.map((s) => s.subject) });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return Response.json(
      { error: "Failed to fetch subjects" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { subject } = body;

    if (!subject) {
      return Response.json({ error: "Subject is required" }, { status: 400 });
    }

    // Delete all tasks, study sessions, and deadlines for this subject
    await sql.transaction([
      sql`DELETE FROM tasks WHERE subject = ${subject}`,
      sql`DELETE FROM study_sessions WHERE subject = ${subject}`,
      sql`DELETE FROM deadlines WHERE subject = ${subject}`,
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return Response.json(
      { error: "Failed to delete subject" },
      { status: 500 },
    );
  }
}
