// app/api/bloques/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`
		WITH dias AS (
			SELECT generate_series(
				CURRENT_DATE - INTERVAL '97 days',
				CURRENT_DATE,
				INTERVAL '1 day'
			)::date AS dia
		),
		minutos_por_dia AS (
			SELECT
				date_trunc(
					'day',
					start_time AT TIME ZONE 'America/Argentina/Buenos_Aires'
				)::date AS dia,
				ROUND(
					SUM(EXTRACT(EPOCH FROM (end_time - start_time))) / 60
				) AS minutos
			FROM midi_blocks
			WHERE start_time >= (CURRENT_DATE - INTERVAL '97 days')
			GROUP BY dia
		)
		SELECT
			d.dia,
			COALESCE(m.minutos, 0) AS minutos
		FROM dias d
		LEFT JOIN minutos_por_dia m ON d.dia = m.dia
		ORDER BY d.dia;
  `;
	return NextResponse.json(result);
}
