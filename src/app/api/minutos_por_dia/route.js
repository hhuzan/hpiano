// app/api/minutos_por_dia/route.js

import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
	try {
		const sql = neon(process.env.DATABASE_URL);

		const data = await sql`
      WITH dias AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '99 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS dia
      ),
      minutos_por_dia AS (
        SELECT
          DATE(start_time AT TIME ZONE 'America/Argentina/Buenos_Aires') AS dia,
          ROUND(
            SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 60)
          ) AS minutos
        FROM midi_blocks
        GROUP BY dia
      )
      SELECT
        dias.dia,
        COALESCE(minutos_por_dia.minutos, 0) AS minutos
      FROM dias
      LEFT JOIN minutos_por_dia
        ON dias.dia = minutos_por_dia.dia
      ORDER BY dias.dia ASC
    `;

		const formatted = data.map((row) => ({
			dia: row.dia.toISOString().slice(0, 10),
			minutos: Number(row.minutos),
		}));

		return NextResponse.json(formatted);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Error obteniendo minutos por día" }, { status: 500 });
	}
}
