import sql from "../utils/sql.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";

    let dateFilter;
    let groupBy;

    switch (period) {
      case "week":
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '7 days'";
        groupBy = "study_date";
        break;
      case "fortnight":
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '14 days'";
        groupBy = "study_date";
        break;
      case "month":
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '30 days'";
        groupBy = "study_date";
        break;
      case "year":
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '365 days'";
        groupBy = "DATE_TRUNC('week', study_date)";
        break;
      default:
        dateFilter = "study_date >= CURRENT_DATE - INTERVAL '7 days'";
        groupBy = "study_date";
    }

    // Total time by date
    const timeByDate = await sql(`
      SELECT ${groupBy} as date, SUM(time_done) as total_time
      FROM study_sessions
      WHERE ${dateFilter}
      GROUP BY ${groupBy}
      ORDER BY date ASC
    `);

    // Time by subject
    const timeBySubject = await sql(`
      SELECT subject, SUM(time_done) as total_time
      FROM study_sessions
      WHERE ${dateFilter}
      GROUP BY subject
      ORDER BY total_time DESC
    `);

    return Response.json({
      timeByDate: (timeByDate.rows ?? timeByDate),
      timeBySubject: (timeBySubject.rows ?? timeBySubject),
    });
  } catch (error) {
    console.error("Error fetching study stats:", error);
    return Response.json(
      { error: "Failed to fetch study stats" },
      { status: 500 },
    );
  }
}
