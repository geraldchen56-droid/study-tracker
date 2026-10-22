import sql from "../utils/sql.js";

// GET settings by key
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const settingsKey = searchParams.get("key");

    if (!settingsKey) {
      return Response.json(
        { error: "Settings key is required" },
        { status: 400 },
      );
    }

    const settings = await sql`
      SELECT * FROM user_settings 
      WHERE settings_key = ${settingsKey}
    `;

    if (settings.length === 0) {
      return Response.json({ error: "Settings not found" }, { status: 404 });
    }

    return Response.json(settings[0]);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// POST - Create new settings
export async function POST(request) {
  try {
    const body = await request.json();
    const { settingsKey, theme = "system", pageSettings = {} } = body;

    if (!settingsKey) {
      return Response.json(
        { error: "Settings key is required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO user_settings (settings_key, theme, page_settings)
      VALUES (${settingsKey}, ${theme}, ${JSON.stringify(pageSettings)})
      ON CONFLICT (settings_key) 
      DO UPDATE SET 
        theme = EXCLUDED.theme,
        page_settings = EXCLUDED.page_settings,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating settings:", error);
    return Response.json(
      { error: "Failed to create settings" },
      { status: 500 },
    );
  }
}

// PUT - Update settings
export async function PUT(request) {
  try {
    const body = await request.json();
    const { settingsKey, theme, pageSettings } = body;

    if (!settingsKey) {
      return Response.json(
        { error: "Settings key is required" },
        { status: 400 },
      );
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (theme !== undefined) {
      updates.push(`theme = $${paramCount}`);
      values.push(theme);
      paramCount++;
    }

    if (pageSettings !== undefined) {
      updates.push(`page_settings = $${paramCount}`);
      values.push(JSON.stringify(pageSettings));
      paramCount++;
    }

    if (updates.length === 0) {
      return Response.json({ error: "No updates provided" }, { status: 400 });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(settingsKey);

    const query = `
      UPDATE user_settings 
      SET ${updates.join(", ")}
      WHERE settings_key = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Settings not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating settings:", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
