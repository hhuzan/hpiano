// app/api/ultima_vez/route.js

import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
	try {
		const result = await sql`
      SELECT 
        COALESCE(obras.nombre, 'Sin obra') AS nombre,
        NOW() - MAX(midi_blocks.start_time) AS ultima
      FROM midi_blocks
      LEFT JOIN bloques_obras 
        ON midi_blocks.id = bloques_obras.bloque_id
      LEFT JOIN obras 
        ON bloques_obras.obra_id = obras.id
      WHERE 
        (midi_blocks.start_time AT TIME ZONE 'America/Argentina/Buenos_Aires')
        >= (CURRENT_DATE - INTERVAL '13 days')
      GROUP BY nombre
      ORDER BY ultima ASC;
    `;

		return NextResponse.json(result);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Error obteniendo última vez por obra" }, { status: 500 });
	}
}
