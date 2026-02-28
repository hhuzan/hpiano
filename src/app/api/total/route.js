// app/api/bloques/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`
		WITH primer_dia AS (
			SELECT MIN(
				date_trunc(
					'day',
					start_time AT TIME ZONE 'America/Argentina/Buenos_Aires'
				)::date
			) AS dia_inicio
			FROM midi_blocks
		),
		dias AS (
			SELECT generate_series(
				(SELECT dia_inicio FROM primer_dia),
				CURRENT_DATE,
				INTERVAL '1 day'
			)::date AS dia
		)
		SELECT
			(SELECT COUNT(*) FROM dias) AS dias,
			SUM(end_time - start_time) AS tiempo,
			SUM(note_on_count) AS notas
		FROM midi_blocks;`;
	return NextResponse.json(result);
}
