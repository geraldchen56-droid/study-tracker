import sql from "../utils/sql.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";

    let dateFilter;
    switch (period) {
      case "week":
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case "fortnight":
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '14 days'";
        break;
      case "month":
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      case "year":
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '365 days'";
        break;
      default:
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '7 days'";
    }

    const sessions = await sql(
      `SELECT * FROM study_sessions WHERE ${dateFilter} ORDER BY study_date DESC`,
      [],
    );

    return Response.json({ sessions });
  } catch (error) {
    console.error("Error fetching study sessions:", error);
    return Response.json(
      { error: "Failed to fetch study sessions" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { study_date, time_done, purpose, subject } = body;

    if (!study_date || !time_done || !purpose || !subject) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO study_sessions (study_date, time_done, purpose, subject)
      VALUES (${study_date}, ${time_done}, ${purpose}, ${subject})
      RETURNING *
    `;

    return Response.json({ session: result[0] });
  } catch (error) {
    console.error("Error creating study session:", error);
    return Response.json(
      { error: "Failed to create study session" },
      { status: 500 },
    );
  }
}
