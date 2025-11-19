// app/api/bloques/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`
		SELECT
			date_trunc('day', start_time AT TIME ZONE 'America/Argentina/Buenos_Aires')
				AT TIME ZONE 'America/Argentina/Buenos_Aires' AS dia,
			ROUND(SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 60)) AS minutos
		FROM midi_blocks
		WHERE start_time AT TIME ZONE 'America/Argentina/Buenos_Aires' >= (CURRENT_DATE - INTERVAL '97 days')
		GROUP BY dia
		ORDER BY dia;
  `;
	return NextResponse.json(result);
}
