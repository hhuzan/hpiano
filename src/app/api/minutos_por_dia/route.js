// app/api/bloques/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`
		SELECT
			DATE(start_time) AS dia,
			SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 60) AS minutos
		FROM midi_blocks
		GROUP BY DATE(start_time)
		ORDER BY dia;
  `;
	return NextResponse.json(result);
}
