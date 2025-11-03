// app/api/ultima_vez/route.js
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
	const result = await sql`
   		SELECT 
			obras.nombre,
  			NOW() - MAX(midi_blocks.start_time) AS ultima
		FROM midi_blocks
		LEFT JOIN bloques_obras 
  		ON midi_blocks.id = bloques_obras.bloque_id
		LEFT JOIN obras 
  		ON bloques_obras.obra_id = obras.id
		WHERE start_time AT TIME ZONE 'America/Argentina/Buenos_Aires' >= (CURRENT_DATE - INTERVAL '13 days')
		GROUP BY obras.id
		ORDER BY ultima;`;
	return NextResponse.json(result);
}
