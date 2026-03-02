// app/api/bloques/route.js

import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
	try {
		const result = await sql`
      WITH primer_dia AS (
        SELECT MIN(
          DATE(start_time AT TIME ZONE 'America/Argentina/Buenos_Aires')
        ) AS dia_inicio
        FROM midi_blocks
      )
      SELECT
        (
          CURRENT_DATE -
          (SELECT dia_inicio FROM primer_dia)
        ) + 1 AS dias,
        ROUND(
          SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 60)
        ) AS minutos_totales,
        SUM(note_on_count) AS notas_totales
      FROM midi_blocks;
    `;

		return NextResponse.json(result[0]);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Error obteniendo resumen de bloques" }, { status: 500 });
	}
}
